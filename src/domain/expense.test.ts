import { describe, it, expect } from 'vitest';
import { cancel, submit, WorkflowError, type Expense } from './expense';


describe('expense tests', () => {
  it('submit returns something', () => {
    expect(submit({ amount: 500, category: 'Travel', submitterId: 'alice' })).toBeDefined();
  });

  it('submit sets a truthy status', () => {
    const e = submit({ amount: 500, category: 'Meals', submitterId: 'alice' });
    expect(e.status).toBeTruthy();
  });
});

describe('cancel', () => {
  const pending: Expense = submit({ amount: 500, category: 'Travel', submitterId: 'alice' });

  it('withdraws a Pending expense for its submitter', () => {
    const result = cancel(pending, { id: 'alice', role: 'Employee' });

    expect(result.status).toBe('Cancelled');
    expect(pending.status).toBe('Pending');
  });

  it('rejects withdrawal of an expense that is not Pending', () => {
    const approved: Expense = { ...pending, status: 'Approved', approverId: 'bob' };

    expect(() => cancel(approved, { id: 'alice', role: 'Employee' })).toThrow(WorkflowError);
  });

  it('rejects withdrawal by a user who is not the submitter', () => {
    expect(() => cancel(pending, { id: 'bob', role: 'Manager' })).toThrow(WorkflowError);
  });
});
