import { test as base } from '@playwright/test';

type WizardFixtures = {
  gotoWizard: () => Promise<void>;
};

export const test = base.extend<WizardFixtures>({
  gotoWizard: async ({ page }, use) => {
    await use(async () => {
      await page.goto('/');
      await page.getByRole('link', { name: /open listing wizard/i }).click();
      await page.waitForURL('**/listing/create');
    });
  }
});

export const expect = test.expect;
