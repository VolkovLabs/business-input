import { test, expect } from '@grafana/plugin-e2e';

test.describe('Static Data Source', () => {
  test('Check grafana version', async ({ grafanaVersion }) => {
    console.log('Grafana version: ', grafanaVersion);
    expect(grafanaVersion).toEqual(grafanaVersion);
  });

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
     * Check content
     */
    await expect(dashboardPage.getPanelByTitle('Logs').locator.locator('tr').nth(0)).toContainText('user logged in');

    await expect(dashboardPage.getPanelByTitle('Logs').locator.locator('tr').nth(1)).toContainText('user login failed');

    await expect(dashboardPage.getPanelByTitle('Logs').locator.locator('tr').nth(2)).toContainText('user registered');
  });
});
