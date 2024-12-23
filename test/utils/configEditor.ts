import { Locator, Page } from '@playwright/test';
import { expect } from '@grafana/plugin-e2e';
import { getLocatorSelectors, LocatorSelectors } from './selectors';
import { TEST_IDS } from '../../src/constants/tests';

/**
 * Config Editor Helper
 */
export class ConfigEditorHelper {
  private readonly locator: Locator;
  private readonly selectors: LocatorSelectors<typeof TEST_IDS.configEditor>;

  constructor(page: Page) {
    this.locator = page.locator('body');
    this.selectors = getLocatorSelectors(TEST_IDS.configEditor)(this.locator);
  }

  private getMsg(msg: string): string {
    return `Config Editor: ${msg}`;
  }

  public get() {
    return this.locator;
  }

  public async checkPresenceEditor() {
    return expect(this.selectors.root(), this.getMsg(`Check editor`)).toBeVisible();
  }

  public async checkPresenceValuesEditor() {
    return expect(this.selectors.codeEditorEnabledContainer(), this.getMsg(`Check Values editor`)).toBeVisible();
  }
}
