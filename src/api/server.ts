import express, { type Response } from 'express';
import path from 'path';
import { createDb, type Db, type ExpenseRow } from './db';
import * as domain from '../domain/expense';

function rowToExpense(row: ExpenseRow): domain.Expense {
  return {
    id: row.id,
    amount: row.amount,
    category: row.category as domain.Expense['category'],
    submitterId: row.submitterId,
    status: row.status as domain.Status,
    reason: row.reason,
    approverId: row.approverId,
  };
}

function handleError(err: unknown, res: Response): void {
  if (err instanceof domain.ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof domain.WorkflowError) {
    res.status(409).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: 'Internal error' });
}

export function createApp(db: Db = createDb()) {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../web')));

  app.post('/expenses', (req, res) => {
    try {
      const expense = domain.submit({
        amount: req.body.amount,
        category: req.body.category,
        submitterId: req.body.submitterId,
      });
      const id = db.insert(expense);
      res.status(201).json({ id, ...expense });
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get('/expenses', (_req, res) => {
    res.json(db.all());
  });


  app.post('/expenses/:id/approve', (req, res) => {
    const row = db.get(Number(req.params.id));
    if (!row) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    try {
      const updated = domain.approve(rowToExpense(row), {
        id: req.body.approverId,
        role: req.body.approverRole ?? 'Employee',
      });
      db.update(row.id, updated);
      res.json({ id: row.id, ...updated });
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post('/expenses/:id/reject', (req, res) => {
    const row = db.get(Number(req.params.id));
    if (!row) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    try {
      const updated = domain.reject(
        rowToExpense(row),
        { id: req.body.approverId, role: req.body.approverRole ?? 'Employee' },
        req.body.reason,
      );
      db.update(row.id, updated);
      res.json({ id: row.id, ...updated });
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post('/expenses/:id/cancel', (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    const row = db.get(id);
    if (!row) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    try {
      const updated = domain.cancel(rowToExpense(row), {
        id: req.body.userId,
      });
      db.update(row.id, updated);
      res.json({ id: row.id, ...updated });
    } catch (err) {
      handleError(err, res);
    }
  });

  return app;
}
