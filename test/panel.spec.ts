import { test, expect } from '@grafana/plugin-e2e';

test.describe('Static Data Source', () => {
  test('Viewing a panel with a Logs from Static Data', async ({ gotoDashboardPage, dashboardPage, page }) => {
    /**
     * Go To panels dashboard panels.json
     * return dashboardPage
     */
    await gotoDashboardPage({ uid: 'O4tc_E6Gz' });

    /**
     * Await content load
     */
    await page.waitForTimeout(1000);

    /**
     * Find panel by title with data
     * Should be visible
     */
    await expect(dashboardPage.getPanelByTitle('Logs').locator).toBeVisible();

    /**
     * Check and compare image
     */
    await expect(dashboardPage.getPanelByTitle('Logs').locator).toHaveScreenshot('actual-screenshot.png', {
      maxDiffPixelRatio: 0.1,
    });
  });
});
