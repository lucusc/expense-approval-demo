import { describe, expect, test } from 'vitest';
import { approve, reject, requiresManager, WorkflowError } from '../../src/domain/approval';
import { submit, ValidationError } from '../../src/domain/expense';
import { expense, submitInput, user } from '../builders/expense';

describe('expense requirements', () => {
  test('R1 valid submissions start Pending with no decision', () => {
    expect(submit(submitInput())).toEqual({
      amount: 75,
      category: 'Travel',
      submitterId: 'submitter-001',
      status: 'Pending',
      reason: null,
      approverId: null,
    });
  });

  test.each([0, -1, 10_000.01])('R2 amount %s is rejected', (amount) => {
    expect(() => submit(submitInput({ amount }))).toThrow(ValidationError);
  });

  test.each([0.01, 10_000])('R2 boundary amount %s is accepted', (amount) => {
    expect(submit(submitInput({ amount })).amount).toBe(amount);
  });

  test('R6 exactly 1,000 does not require a Manager', () => {
    expect(requiresManager(1_000)).toBe(false);
    expect(approve(expense({ amount: 1_000 }), user()).status).toBe('Approved');
  });

  test('R6 over 1,000 requires a Manager', () => {
    expect(() => approve(expense({ amount: 1_000.01 }), user())).toThrow(
      'Manager approval is required for this amount',
    );
    expect(approve(expense({ amount: 1_000.01 }), user({ role: 'Manager' })).status).toBe('Approved');
  });

  test('R5 a submitter cannot approve their own expense', () => {
    expect(() => approve(expense(), user({ id: 'submitter-001' }))).toThrow(WorkflowError);
  });

  test.each(['Approved', 'Rejected'] as const)(
    'R7 a %s expense cannot be approved again',
    (status) => {
      expect(() => approve(expense({ status }), user())).toThrow(WorkflowError);
    },
  );

  test.each(['Approved', 'Rejected'] as const)(
    'R7 a %s expense cannot be rejected again',
    (status) => {
      expect(() => reject(expense({ status }), user(), 'Late receipt')).toThrow(WorkflowError);
    },
  );

  test.each(['', '   '])('R7 rejection reason %j is rejected', (reason) => {
    expect(() => reject(expense(), user(), reason)).toThrow(ValidationError);
  });

  test('R7 rejection stores the approver and reason', () => {
    expect(reject(expense(), user(), 'Late receipt')).toMatchObject({
      status: 'Rejected',
      approverId: 'approver-001',
      reason: 'Late receipt',
    });
  });
});
