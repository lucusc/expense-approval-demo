import type { Expense } from '../domain/expense';

// node:sqlite is a native Node builtin (real SQLite, no native build). Load it via
// require at runtime so test bundlers (Vitest/Vite) don't try to transform it.
const { DatabaseSync } = require('node:sqlite') as typeof import('node:sqlite');

export interface ExpenseRow {
  id: number;
  amount: number;
  category: string;
  submitterId: string;
  status: string;
  reason: string | null;
  approverId: string | null;
}

export function createDb(file = ':memory:') {
  const db = new DatabaseSync(file);
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      amount      REAL NOT NULL,
      category    TEXT NOT NULL,
      submitterId TEXT NOT NULL,
      status      TEXT NOT NULL,
      reason      TEXT,
      approverId  TEXT
    )
  `);

  return {
    insert(e: Expense): number {
      const info = db
        .prepare(
          'INSERT INTO expenses (amount, category, submitterId, status, reason, approverId) VALUES (?, ?, ?, ?, ?, ?)',
        )
        .run(e.amount, e.category, e.submitterId, e.status, e.reason ?? null, e.approverId ?? null);
      return Number(info.lastInsertRowid);
    },
    get(id: number): ExpenseRow | undefined {
      return db.prepare('SELECT * FROM expenses WHERE id = ?').get(id) as ExpenseRow | undefined;
    },
    all(): ExpenseRow[] {
      return db.prepare('SELECT * FROM expenses ORDER BY id DESC').all() as unknown as ExpenseRow[];
    },
    search(filter: {
      submitterId?: string;
      status?: string;
      minAmount?: number;
      limit: number;
      page: number;
    }): ExpenseRow[] {
      const where: string[] = [];
      const params: unknown[] = [];

      if (filter.submitterId) {
        where.push('submitterId = ?');
        params.push(filter.submitterId);
      }
      if (filter.status) {
        where.push('status = ?');
        params.push(filter.status);
      }
      if (filter.minAmount !== undefined) {
        where.push('amount >= ?');
        params.push(filter.minAmount);
      }

      const offset = (filter.page - 1) * filter.limit; // page is 1-based
      const sql =
        'SELECT * FROM expenses' +
        (where.length ? ' WHERE ' + where.join(' AND ') : '') +
        ' ORDER BY id DESC LIMIT ? OFFSET ?';

      params.push(filter.limit, offset);
      return db.prepare(sql).all(...params) as unknown as ExpenseRow[];
    },
    update(id: number, e: Expense): void {
      db.prepare('UPDATE expenses SET status = ?, reason = ?, approverId = ? WHERE id = ?').run(
        e.status,
        e.reason ?? null,
        e.approverId ?? null,
        id,
      );
    },
    raw: db,
  };
}

export type Db = ReturnType<typeof createDb>;
