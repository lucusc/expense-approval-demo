import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createDb, type Db } from './db';
import { createApp } from './server';

/**
 * SEED integration test - proves the harness only (real Express app and a
 * disk-backed temporary SQLite database).
 */
describe('API Tests', () => {
  let db: Db;
  let tempDirectory: string;

  beforeEach(() => {
    tempDirectory = mkdtempSync(join(tmpdir(), 'expense-approval-'));
    db = createDb(join(tempDirectory, 'expenses.sqlite'));
  });

  afterEach(() => {
    db.raw.close();
    rmSync(tempDirectory, { recursive: true, force: true });
  });

  it('R1: persists a submitted expense and lists it as Pending', async () => {
    const app = createApp(db);

    const created = await request(app)
      .post('/expenses')
      .send({ amount: 250, category: 'Travel', submitterId: 'alice' })
      .expect(201);

    expect(created.body).toMatchObject({
      id: expect.any(Number),
      amount: 250,
      category: 'Travel',
      submitterId: 'alice',
      status: 'Pending',
      reason: null,
      approverId: null,
    });

    expect(db.get(created.body.id)).toMatchObject({
      amount: 250,
      category: 'Travel',
      submitterId: 'alice',
      status: 'Pending',
    });

    const list = await request(app).get('/expenses').expect(200);
    expect(list.body).toEqual([created.body]);
  });
});
