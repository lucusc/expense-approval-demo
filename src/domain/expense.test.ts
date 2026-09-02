import { describe, it, expect } from 'vitest';
import { submit, approve, reject, WorkflowError } from './expense';


describe('expense tests', () => {
  it('submit returns something', () => {
    expect(submit({ amount: 500, category: 'Travel', submitterId: 'alice' })).toBeDefined();
  });

  it('submit sets a truthy status', () => {
    const e = submit({ amount: 500, category: 'Meals', submitterId: 'alice' });
    expect(e.status).toBeTruthy();
  });

  it('reject succeeds on a Pending expense', () => {
    const e = submit({ amount: 500, category: 'Meals', submitterId: 'alice' });
    const rejected = reject(e, { id: 'bob', role: 'Manager' }, 'Not a valid expense');
    expect(rejected.status).toBe('Rejected');
    expect(rejected.approverId).toBe('bob');
    expect(rejected.reason).toBe('Not a valid expense');
  });

  it('reject throws on an Approved expense', () => {
    const e = submit({ amount: 500, category: 'Meals', submitterId: 'alice' });
    const approved = approve(e, { id: 'bob', role: 'Manager' });
    expect(() => reject(approved, { id: 'bob', role: 'Manager' }, 'reason')).toThrow(WorkflowError);
  });

  it('reject throws on an already-Rejected expense', () => {
    const e = submit({ amount: 500, category: 'Meals', submitterId: 'alice' });
    const rejected = reject(e, { id: 'bob', role: 'Manager' }, 'Not a valid expense');
    expect(() => reject(rejected, { id: 'bob', role: 'Manager' }, 'reason')).toThrow(WorkflowError);
  });
});
