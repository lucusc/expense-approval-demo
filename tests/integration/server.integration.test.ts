import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { createDb, type Db } from '../../src/api/db';
import { createApp } from '../../src/api/server';
import { submitInput } from '../builders/expense';

describe('expense API requirements', () => {
  let directory: string;
  let db: Db;
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
    directory = mkdtempSync(path.join(tmpdir(), 'expense-api-'));
    db = createDb(path.join(directory, 'expenses.sqlite'));
    server = createApp(db).listen(0);
    await new Promise<void>((resolve) => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
    db.raw.close();
    rmSync(directory, { recursive: true, force: true });
  });

  async function createExpense() {
    return fetch(`${baseUrl}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitInput()),
    });
  }

  test('R1 creation returns and stores a Pending expense that is listed', async () => {
    const response = await createExpense();
    expect(response.status).toBe(201);
    const created = await response.json();
    expect(created).toMatchObject({ id: 1, status: 'Pending', ...submitInput() });

    const listed = await (await fetch(`${baseUrl}/expenses`)).json();
    expect(listed).toEqual([created]);
    expect(db.get(1)).toMatchObject({ status: 'Pending', submitterId: 'submitter-001' });
  });

  test('R7 an Approved expense cannot be rejected or have its decision overwritten', async () => {
    await createExpense();
    const approval = await fetch(`${baseUrl}/expenses/1/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approverId: 'approver-001', approverRole: 'Employee' }),
    });
    expect(approval.status).toBe(200);

    const rejection = await fetch(`${baseUrl}/expenses/1/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approverId: 'manager-001',
        approverRole: 'Manager',
        reason: 'Late receipt',
      }),
    });
    expect(rejection.status).toBe(409);
    expect(db.get(1)).toMatchObject({
      status: 'Approved',
      approverId: 'approver-001',
      reason: null,
    });
  });
});
