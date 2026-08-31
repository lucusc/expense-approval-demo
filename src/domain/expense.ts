import {
  CATEGORIES,
  MAX_AMOUNT,
  MANAGER_THRESHOLD,
  isValidCategory,
  type Category,
} from './policy';

export type Status = 'Pending' | 'Approved' | 'Rejected';
export type Role = 'Employee' | 'Manager';

export interface User {
  id: string;
  role: Role;
}

export interface Expense {
  id?: number;
  amount: number;
  category: Category;
  submitterId: string;
  status: Status;
  reason?: string | null;
  approverId?: string | null;
}

export interface SubmitInput {
  amount: number;
  category: string;
  submitterId: string;
}

export class ValidationError extends Error {}
export class WorkflowError extends Error {}

/** R2 + R3: amount bounds and category membership. */
export function validate(input: SubmitInput): void {
  if (typeof input.amount !== 'number' || Number.isNaN(input.amount)) {
    throw new ValidationError('Amount must be a number');
  }
  if (input.amount <= 0) {
    throw new ValidationError('Amount must be greater than 0');
  }
  if (input.amount > MAX_AMOUNT) {
    throw new ValidationError(`Amount must not exceed ${MAX_AMOUNT}`);
  }
  if (!isValidCategory(input.category)) {
    throw new ValidationError(`Category must be one of: ${CATEGORIES.join(', ')}`);
  }
}

/** R1: a submitted expense starts Pending. */
export function submit(input: SubmitInput): Expense {
  validate(input);
  return {
    amount: input.amount,
    category: input.category as Category,
    submitterId: input.submitterId,
    status: 'Pending',
    reason: null,
    approverId: null,
  };
}

/**
 * R6: expenses OVER 1,000 require a Manager.
 * NOTE (planted defect #1): the policy text says "over 1,000", but the exact
 * boundary (amount === 1000) is easy to get wrong and is not exercised by the
 * starter tests. Left intentionally for the coverage/requirement-gap demo.
 */
export function requiresManager(amount: number): boolean {
  return amount > MANAGER_THRESHOLD;
}

/** R4 + R5 + R6: approve a Pending expense. */
export function approve(expense: Expense, approver: User): Expense {
  if (expense.status !== 'Pending') {
    throw new WorkflowError('Only a Pending expense can be approved');
  }
  if (approver.id === expense.submitterId) {
    throw new WorkflowError('You cannot approve your own expense');
  }
  if (requiresManager(expense.amount) && approver.role !== 'Manager') {
    throw new WorkflowError('Expenses over 1,000 require a Manager to approve');
  }
  return { ...expense, status: 'Approved', approverId: approver.id };
}

/**
 * R7: reject a Pending expense with a required reason.
 * NOTE (planted defect #2): this is MISSING the guard that blocks rejecting a
 * non-Pending (e.g. already Approved) expense. The integration demo surfaces
 * this because the persisted DB state can be changed after a decision.
 */
export function reject(expense: Expense, approver: User, reason: string): Expense {
  if (!reason || reason.trim() === '') {
    throw new ValidationError('A reason is required to reject');
  }
  return { ...expense, status: 'Rejected', approverId: approver.id, reason };
}
