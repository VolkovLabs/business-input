import * as semver from 'semver';
import { Locator } from '@playwright/test';
import { DashboardPage, E2ESelectorGroups, expect, Panel } from '@grafana/plugin-e2e';

/**
 * Table Helper
 */
export class TableHelper {
  private readonly locator: Locator;

  constructor(tableLocator: Locator) {
    this.locator = tableLocator;
  }

  public get() {
    return this.locator;
  }

  private getMsg(msg: string): string {
    return `Table: ${msg}`;
  }

  public async checkTablePresence() {
    return expect(this.get(), this.getMsg('Check Presence')).toBeVisible();
  }

  public async checkRowsCount(count: number) {
    return expect(await this.get().locator('tr').all(), this.getMsg('Check Presence')).toHaveLength(count);
  }

  public async checkRowContent(rowNumber: number, text: string) {
    return expect(this.get().locator('tr').nth(rowNumber), this.getMsg('Check Presence')).toContainText(text);
  }
}

/**
 * Panel Helper
 */
export class PanelHelper {
  private readonly locator: Locator;
  private readonly panel: Panel;
  private readonly selectors: E2ESelectorGroups;

  constructor(dashboardPage: DashboardPage, panelTitle: string, selectors: E2ESelectorGroups) {
    this.panel = dashboardPage.getPanelByTitle(panelTitle);
    this.locator = this.panel.locator;
    this.selectors = selectors;
  }

  public get() {
    return this.locator;
  }

  public getContainer() {
    return this.get().getByTestId(this.selectors.components.Panels.Panel.content);
  }

  private getMsg(msg: string): string {
    return `Panel: ${msg}`;
  }

  public getTable() {
    const table = this.panel.locator.getByRole('table');
    return new TableHelper(table);
  }

  public async checkContent(text: string, grafanaVersion: string) {
    if (semver.gte(grafanaVersion, '11.3.0')) {
      return expect(this.getContainer(), this.getMsg('Check If No Errors')).toContainText(text);
    }
    return expect(this.get().getByTestId('data-testid text content')).toContainText(text);
  }

  public async checkIfNoErrors() {
    return expect(this.panel.getErrorIcon(), this.getMsg('Check If No Errors')).not.toBeVisible();
  }
}
