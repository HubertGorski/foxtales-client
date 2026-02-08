import { test, expect } from '@playwright/test';
// npx playwright codegen http://localhost:5173

test('health endpoint works', async ({ request }) => {
  const response = await request.get('/health');
  expect(response.ok()).toBeTruthy();
});

test('create tmp account | create question | delete question', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  const tryButton = page.getByText(/Try without an account/i);
  await expect(tryButton).toBeVisible();
  await tryButton.click();

  await page.getByLabel('').click();
  await page.getByLabel('').fill('Hubert');
  await page.locator('#checkbox-2').check();
  await page.getByText('Wypróbuj bez konta').click();
  await page.getByText('Hubert!').click();
  await page
    .locator('div')
    .filter({ hasText: /^Zarządzaj biblioteką$/ })
    .nth(2)
    .click();
  await page.getByPlaceholder('Gdyby **** przez jeden dzień').click();
  await page
    .getByPlaceholder('Gdyby **** przez jeden dzień')
    .fill('Co by było gdyby **** zdobył mlion?');
  await page
    .locator('div')
    .filter({ hasText: /^Dodaj$/ })
    .nth(2)
    .click();
  await page.getByText('Co by było gdyby **** zdobył').click();
  await page
    .locator('div')
    .filter({ hasText: /^Dodaj pytanie$/ })
    .click();
  await page.locator('.items').click();
  await page.getByText('Co by było gdyby **** zdobył').click();
  await page.getByText('Co by było gdyby **** zdobył').click();
  await page.getByText('Usuń').click();
  await page.getByText('Zatwierdź').nth(2).click();
  await page.getByRole('img', { name: 'Lisek' }).nth(5).click();
});
