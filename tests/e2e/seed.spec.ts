import { test, expect } from '@playwright/test';

test.describe('Expense submission', () => {
  test('R1: a submitted expense appears as Pending', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Amount').fill('250');
    await page.getByLabel('Category').selectOption('Meals');
    await page.getByRole('button', { name: 'Submit expense' }).click();

    const newestExpense = page.getByTestId('rows').locator('tr').first();
    await expect(newestExpense).toContainText('250');
    await expect(newestExpense).toContainText('Meals');
    await expect(newestExpense).toContainText('Pending');
  });
});
