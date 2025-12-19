import { expect, test } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

test.describe('Portal listings landing page', () => {
  test('renders default online tab with listing cards', async ({ page }) => {
    await page.goto(`${BASE_URL}/portal/listings`);

    await expect(
      page.getByRole('heading', { name: /listings/i }),
    ).toBeVisible();

    const searchField = page.getByPlaceholder(
      /search by township, postcode/i,
    );
    await expect(searchField).toBeVisible();

    const onlineTab = page.getByRole('tab', { name: /online/i });
    await expect(onlineTab).toHaveAttribute('aria-selected', 'true');

    // Listing cards render with dataset values
    await expect(page.getByRole('link', { name: /glenmarie gardens/i }).first()).toBeVisible();
    await expect(page.getByText(/rm 6,000,000/i).first()).toBeVisible();
  });

  test('applies search filter and clears results', async ({ page }) => {
    await page.goto(`${BASE_URL}/portal/listings`);

    const searchField = page.getByPlaceholder(
      /search by township, postcode/i,
    );
    await searchField.fill('USJ 5');

    await expect(page.getByRole('link', { name: /USJ 5/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /glenmarie gardens/i })).toHaveCount(0);

    await page.getByRole('button', { name: /Clear filters/i }).click();
    await expect(page.getByRole('link', { name: /glenmarie gardens/i }).first()).toBeVisible();
  });

  test('navigates to listing wizard via create listing CTA', async ({ page }) => {
    await page.goto(`${BASE_URL}/portal/listings`);

    await page.getByTestId('create-listing').click();

    await expect(page).toHaveURL(/\/listing\/create/);
    await expect(page.getByRole('heading', { name: /listing type/i })).toBeVisible();
  });
});
