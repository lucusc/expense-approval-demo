import { expect, test } from '@playwright/test';

test('R4 an allowed approver persists approval through a reload', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Current user').selectOption('submitter-001');
  await page.getByLabel('Amount').fill('75');
  await page.getByLabel('Category').selectOption('Travel');
  await page.getByRole('button', { name: 'Submit expense' }).click();

  const expenseRow = page.getByRole('row').filter({ hasText: '75' });
  await expect(expenseRow.getByText('Pending')).toBeVisible();

  await page.getByLabel('Current user').selectOption('approver-001');
  await expenseRow.getByRole('button', { name: 'Approve' }).click();
  await page.reload();

  await expect(page.getByRole('row').filter({ hasText: '75' }).getByText('Approved')).toBeVisible();
});
