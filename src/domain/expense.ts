import {
  CATEGORIES,
  MAX_AMOUNT,
  isValidCategory,
  type Category,
} from './policy';

export type Status = 'Pending' | 'Approved' | 'Rejected';

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
