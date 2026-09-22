import { MANAGER_THRESHOLD } from './policy';
import { ValidationError, type Expense } from './expense';

export type Role = 'Employee' | 'Manager';

export interface User {
  id: string;
  role: Role;
}

export class WorkflowError extends Error {}

export function requiresManager(amount: number): boolean {
  return amount > MANAGER_THRESHOLD;
}

export function approve(expense: Expense, approver: User): Expense {
  if (expense.status !== 'Pending') {
    throw new WorkflowError('Only a Pending expense can be approved');
  }
  if (approver.id === expense.submitterId) {
    throw new WorkflowError('You cannot approve your own expense');
  }
  if (requiresManager(expense.amount) && approver.role !== 'Manager') {
    throw new WorkflowError('Manager approval is required for this amount');
  }
  return { ...expense, status: 'Approved', approverId: approver.id };
}

export function reject(expense: Expense, approver: User, reason: string): Expense {
  if (!reason || reason.trim() === '') {
    throw new ValidationError('A reason is required to reject');
  }
  return { ...expense, status: 'Rejected', approverId: approver.id, reason };
}
