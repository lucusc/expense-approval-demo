import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import type { Express } from 'express';
import { createDb } from '../src/api/db';
import { createApp } from '../src/api/server';

function start(app: Express): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', () => resolve(server));
    server.once('error', reject);
  });
}

function close(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function smoke(): Promise<void> {
  const db = createDb();
  let server: Server | undefined;
  let failure: unknown;

  try {
    server = await start(createApp(db));
    const { port } = server.address() as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${port}/`);
    const body = await response.text();
    if (!response.ok || !response.headers.get('content-type')?.includes('text/html') || !body.includes('<html')) {
      throw new Error('Root page did not return successful HTML');
    }
  } catch (error) {
    failure = error;
  }

  const cleanupSteps = [
    () => (server ? close(server) : Promise.resolve()),
    () => db.raw.close(),
  ];
  for (const cleanup of cleanupSteps) {
    try {
      await cleanup();
    } catch (error) {
      failure = failure ? new AggregateError([failure, error], 'Smoke test and cleanup failed') : error;
    }
  }

  if (failure) throw failure;
}

smoke().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
