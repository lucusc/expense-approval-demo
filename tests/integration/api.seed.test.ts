import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/api/server';
import { createDb } from '../../src/api/db';

/**
 * SEED integration test — proves the harness only (app boots on a real temp
 * SQLite DB via supertest). During the session, Copilot GENERATES the
 * meaningful integration tests from openapi.yaml + db.ts, including the ones
 * that surface planted defect #2 (rejecting an already-Approved expense).
 */
describe('API (seed harness)', () => {
  it('submits an expense and lists it back from the DB', async () => {
    const app = createApp(createDb(':memory:'));

    const created = await request(app)
      .post('/expenses')
      .send({ amount: 250, category: 'Travel', submitterId: 'alice' })
      .expect(201);

    expect(created.body.id).toBeGreaterThan(0);
    expect(created.body.status).toBe('Pending');

    const list = await request(app).get('/expenses').expect(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].amount).toBe(250);
  });
});
