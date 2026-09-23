import type { Expense, SubmitInput } from '../../src/domain/expense';
import type { User } from '../../src/domain/approval';

export function expense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: 101,
    amount: 75,
    category: 'Travel',
    submitterId: 'submitter-001',
    status: 'Pending',
    reason: null,
    approverId: null,
    ...overrides,
  };
}

export function submitInput(overrides: Partial<SubmitInput> = {}): SubmitInput {
  return {
    amount: 75,
    category: 'Travel',
    submitterId: 'submitter-001',
    ...overrides,
  };
}

export function user(overrides: Partial<User> = {}): User {
  return {
    id: 'approver-001',
    role: 'Employee',
    ...overrides,
  };
}
