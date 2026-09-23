import { expect, test } from '@playwright/test';
import { submitInput, user } from '../builders/expense';

test('R4 an allowed approver persists approval through a reload', async ({ page }) => {
  const pending = submitInput();
  const approver = user();
  await page.goto('/');
  await page.getByLabel('Current user').selectOption(pending.submitterId);
  await page.getByLabel('Amount').fill(String(pending.amount));
  await page.getByLabel('Category').selectOption(pending.category);
  await page.getByRole('button', { name: 'Submit expense' }).click();

  const expenseRow = page.getByRole('row').filter({ hasText: String(pending.amount) });
  await expect(expenseRow.getByText('Pending')).toBeVisible();

  await page.getByLabel('Current user').selectOption(approver.id);
  await expenseRow.getByRole('button', { name: 'Approve' }).click();
  await page.reload();

  await expect(
    page.getByRole('row').filter({ hasText: String(pending.amount) }).getByText('Approved'),
  ).toBeVisible();
});
