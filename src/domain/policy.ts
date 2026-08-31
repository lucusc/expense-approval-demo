export const CATEGORIES = ['Travel', 'Meals', 'Equipment', 'Other'] as const;
export type Category = (typeof CATEGORIES)[number];

/** Maximum single-expense amount (R2). */
export const MAX_AMOUNT = 10_000;

/** Expenses OVER this amount require a Manager to approve (R6). */
export const MANAGER_THRESHOLD = 1_000;

export function isValidCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}
