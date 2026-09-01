import { describe, it, expect } from 'vitest';
import { WorkflowError, cancel, submit } from './expense';


describe('expense tests', () => {
  it('submit returns something', () => {
    expect(submit({ amount: 500, category: 'Travel', submitterId: 'alice' })).toBeDefined();
  });

  it('submit sets a truthy status', () => {
    const e = submit({ amount: 500, category: 'Meals', submitterId: 'alice' });
    expect(e.status).toBeTruthy();
  });

  it('cancel withdraws a submitter-owned Pending expense', () => {
    const e = submit({ amount: 500, category: 'Meals', submitterId: 'alice' });

    expect(cancel(e, { id: 'alice', role: 'Employee' })).toMatchObject({
      status: 'Cancelled',
      submitterId: 'alice',
      approverId: null,
      reason: null,
    });
  });

  it('cancel rejects a non-Pending expense', () => {
    const e = {
      ...submit({ amount: 500, category: 'Meals', submitterId: 'alice' }),
      status: 'Approved' as const,
    };

    expect(() => cancel(e, { id: 'alice', role: 'Employee' })).toThrow(WorkflowError);
    expect(() => cancel(e, { id: 'alice', role: 'Employee' })).toThrow(
      'Only a Pending expense can be cancelled',
    );
  });

  it('cancel rejects a non-submitter user', () => {
    const e = submit({ amount: 500, category: 'Meals', submitterId: 'alice' });

    expect(() => cancel(e, { id: 'bob', role: 'Employee' })).toThrow(WorkflowError);
    expect(() => cancel(e, { id: 'bob', role: 'Employee' })).toThrow(
      'Only the submitter can cancel their own expense',
    );
  });
});
