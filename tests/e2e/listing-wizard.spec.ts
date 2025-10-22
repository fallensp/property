import { expect } from '@playwright/test';
import { test } from './fixtures/wizard';

test.describe('Listing wizard happy path', () => {
  test('completes listing flow with valid data', async ({ gotoWizard, page }) => {
    await gotoWizard();

    const strictToggle = page.getByRole('switch', { name: /strict validation/i });
    if ((await strictToggle.getAttribute('aria-checked')) !== 'true') {
      await strictToggle.click();
    }

    const nextButton = page.getByTestId('wizard-next');

    // Step 1 - listing type
    await expect(nextButton).toBeDisabled();
    await page.getByRole('button', { name: /residential/i }).click();
    await page.getByRole('button', { name: /sale/i }).click();
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Step 2 - location
    await expect(nextButton).toBeDisabled();
    await page.getByLabel(/search development/i).fill('Skyline');
    await page
      .getByTestId('location-option-Skyline Residences')
      .click();

    await page.getByTestId('property-type-select').click();
    await page.getByRole('option', { name: /apartment/i }).click();
    await page.getByTestId('property-sub-type-select').click();
    await page.getByRole('option', { name: /service residence/i }).click();
    await page.getByTestId('property-unit-type-select').click();
    await page.getByRole('option', { name: /corner lot/i }).click();
    await page.getByLabel(/lease year remaining/i).fill('20');
    await page.getByTestId('title-type-strata').click();
    await page.getByTestId('bumi-lot-select').click();
    await page.getByRole('option', { name: /no/i }).click();
    await page.getByTestId('direction-select').click();
    await page.getByRole('option', { name: /^north$/i }).click();
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Step 3 - unit details
    await expect(nextButton).toBeDisabled();
    await page.fill('#bedrooms', '3');
    await page.fill('#bathrooms', '2');
    await page.fill('#maid-rooms', '1');
    await page.fill('#built-up', '1250');
    await page.fill('#built-up-width', '25');
    await page.fill('#built-up-length', '50');
    await page.fill('#parking', '2');
    await page.getByRole('button', { name: /fully furnished/i }).click();
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Step 4 - pricing
    await expect(nextButton).toBeDisabled();
    await page.fill('#selling-price', '1500000');
    await page.fill('#maintenance-fee', '450');
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Step 5 - gallery
    await expect(nextButton).toBeDisabled();
    await page.getByTestId('add-sample-photos').click();
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Step 6 - preview
    await expect(nextButton).toBeDisabled();
    await expect(page.getByText(/listing overview/i)).toBeVisible();
    await expect(page.getByText(/residential/i)).toBeVisible();
    await expect(page.getByText(/sale/i)).toBeVisible();
    await expect(page.getByText(/1250 sqft/)).toBeVisible();
    await expect(page.getByText(/rm\s?1,500,000/i)).toBeVisible();
    await expect(page.getByText(/headline not provided/i)).toBeVisible();
    await expect(
      page.getByText(/add a compelling description to help buyers fall in love with this property/i)
    ).toBeVisible();
  });

  test('shows validation feedback and preserves state on back navigation', async ({ gotoWizard, page }) => {
    await gotoWizard();

    const strictToggle = page.getByRole('switch', { name: /strict validation/i });
    if ((await strictToggle.getAttribute('aria-checked')) !== 'true') {
      await strictToggle.click();
    }

    const nextButton = page.getByTestId('wizard-next');

    // Attempt to advance without completing step
    await nextButton.click();
    await expect(page.getByTestId('validation-banner')).toContainText(
      /select a property category/i
    );

    // Fill minimal data to proceed
    await page.getByRole('button', { name: /residential/i }).click();
    await page.getByRole('button', { name: /sale/i }).click();
    await nextButton.click();

    // Step 2 validation
    await nextButton.click();
    await expect(page.getByTestId('validation-banner')).toContainText(
      /choose a development/i
    );
    await page
      .getByTestId('location-option-Skyline Residences')
      .click();
    await page.getByTestId('property-type-select').click();
    await page.getByRole('option', { name: /apartment/i }).click();
    await page.getByTestId('property-sub-type-select').click();
    await page.getByRole('option', { name: /service residence/i }).click();
    await page.getByTestId('property-unit-type-select').click();
    await page.getByRole('option', { name: /intermediate/i }).click();
    await nextButton.click();

    // Step 3 fill
    await page.fill('#bedrooms', '2');
    await page.fill('#bathrooms', '2');
    await page.fill('#built-up', '980');
    await page.getByRole('button', { name: /fully furnished/i }).click();
    await nextButton.click();

    // Step 4 missing selling price triggers validation
    await nextButton.click();
    await expect(page.getByTestId('validation-banner')).toContainText(
      /provide the selling price/i
    );
    await page.fill('#selling-price', '1200000');
    await nextButton.click();

    // Step 5 - gallery validation occurs
    await nextButton.click();
    await expect(page.getByTestId('validation-banner')).toContainText(
      /add at least 5 photos/i
    );
    await page.getByTestId('add-sample-photos').click();
    await expect(page.getByTestId('wizard-next')).toBeEnabled();
    await nextButton.click();

    // Navigate back to price step and verify values persisted
    await page.getByTestId('wizard-back').click(); // back to gallery
    await page.getByTestId('wizard-back').click(); // back to price
    await expect(page.locator('#selling-price')).toHaveValue('1200000');

    // Progress forward again
    await nextButton.click(); // price -> gallery
    await nextButton.click(); // gallery -> preview

    await expect(page.getByText(/headline not provided/i)).toBeVisible();
  });
});
