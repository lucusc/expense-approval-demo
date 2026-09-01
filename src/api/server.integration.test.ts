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

  it('persists a submitted expense and lists it as Pending', async () => {
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

  it('cancels a submitted expense', async () => {
    const app = createApp(db);

    const created = await request(app)
      .post('/expenses')
      .send({ amount: 250, category: 'Travel', submitterId: 'alice' })
      .expect(201);

    const cancelled = await request(app)
      .post(`/expenses/${created.body.id}/cancel`)
      .send({ userId: 'alice' })
      .expect(200);

    expect(cancelled.body).toMatchObject({
      id: created.body.id,
      amount: 250,
      category: 'Travel',
      submitterId: 'alice',
      status: 'Cancelled',
      reason: null,
      approverId: null,
    });

    expect(db.get(created.body.id)).toMatchObject({
      status: 'Cancelled',
      reason: null,
      approverId: null,
    });
  });

  it('returns 404 when cancelling an unknown expense', async () => {
    const app = createApp(db);

    await request(app).post('/expenses/999/cancel').send({ userId: 'alice' }).expect(404);
    await request(app).post('/expenses/not-a-number/cancel').send({ userId: 'alice' }).expect(404);
  });

  it('returns 409 when cancelling a non-Pending expense', async () => {
    const app = createApp(db);

    const created = await request(app)
      .post('/expenses')
      .send({ amount: 250, category: 'Travel', submitterId: 'alice' })
      .expect(201);

    await request(app)
      .post(`/expenses/${created.body.id}/approve`)
      .send({ approverId: 'bob', approverRole: 'Manager' })
      .expect(200);

    await request(app)
      .post(`/expenses/${created.body.id}/cancel`)
      .send({ userId: 'alice' })
      .expect(409);
  });

  it('returns 409 when cancelling another submitter expense', async () => {
    const app = createApp(db);

    const created = await request(app)
      .post('/expenses')
      .send({ amount: 250, category: 'Travel', submitterId: 'alice' })
      .expect(201);

    await request(app)
      .post(`/expenses/${created.body.id}/cancel`)
      .send({ userId: 'bob' })
      .expect(409);
  });
});
