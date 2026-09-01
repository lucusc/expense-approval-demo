export const CATEGORIES = ['Travel', 'Meals', 'Equipment', 'Other'] as const;
export type Category = (typeof CATEGORIES)[number];

export const MAX_AMOUNT = 10_000;

export const MANAGER_THRESHOLD = 1_000;

export function isValidCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}
