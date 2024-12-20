import { Locator, Page } from '@playwright/test';
import { E2ESelectorGroups, expect, PanelEditPage, VariableEditPage } from '@grafana/plugin-e2e';
import { getLocatorSelectors, LocatorSelectors } from './selectors';
import { TEST_IDS } from '../../src/constants/tests';

/**
 * Selectors
 */
const getFieldsSelector = getLocatorSelectors(TEST_IDS.fieldsEditor);
const getValuesSelector = getLocatorSelectors(TEST_IDS.valuesEditor);

/**
 * Field Helper
 */
export class FieldHelper {
  private readonly locator: Locator;

  constructor(public readonly parentLocator: Locator) {
    this.locator = parentLocator;
  }

  private getMsg(msg: string): string {
    return `Field Helper: ${msg}`;
  }

  public get() {
    return this.locator;
  }

  public async setName(name: string) {
    const fieldName = this.get().getByTestId(TEST_IDS.fieldsEditor.fieldName);
    await fieldName.fill(name);
    await fieldName.blur();
  }

  public async checkName(name: string) {
    const fieldName = this.get().getByTestId(TEST_IDS.fieldsEditor.fieldName);
    return expect(fieldName, this.getMsg(`Check name ${name}`)).toHaveValue(name);
  }
}

/**
 * Value Helper
 */
export class ValueHelper {
  private readonly locator: Locator;

  constructor(public readonly parentLocator: Locator) {
    this.locator = parentLocator;
  }

  private getMsg(msg: string): string {
    return `Value Helper: ${msg}`;
  }

  public get() {
    return this.locator;
  }

  public async setValue(fieldName: string, value: string) {
    const field = this.get().getByTestId(TEST_IDS.valueInput.fieldString(fieldName));
    await field.fill(value);
    await field.blur();
  }

  public async checkValue(fieldName: string, value: string) {
    const field = this.get().getByTestId(TEST_IDS.valueInput.fieldString(fieldName));
    return expect(field, this.getMsg(`Check value of field ${fieldName}`)).toHaveValue(value);
  }

  public async checkName(name: string) {
    const fieldName = this.get().getByTestId(TEST_IDS.fieldsEditor.fieldName);
    return expect(fieldName, this.getMsg(`Check name ${name}`)).toHaveValue(name);
  }
}

/**
 * Fields Editor Helper
 */
export class FieldsEditorHelper {
  private readonly selectors: LocatorSelectors<typeof TEST_IDS.fieldsEditor>;

  constructor(public readonly locator: Locator) {
    this.selectors = this.getSelectors(locator);
  }

  private getMsg(msg: string): string {
    return `Fields Editor: ${msg}`;
  }

  private getSelectors(locator: Locator) {
    return getFieldsSelector(locator);
  }

  public get() {
    return this.selectors;
  }

  public async checkAddButtonPresence() {
    return expect(this.get().buttonAdd(), this.getMsg('Check Add button presence')).toBeVisible();
  }

  public async addField() {
    await this.get().buttonAdd().click();
  }

  public async checkFieldsCount(count: number) {
    return expect(await this.get().item().all()).toHaveLength(count);
  }

  public getFieldRow(fieldNumber: number) {
    const field = this.get().item().nth(fieldNumber);
    return new FieldHelper(field);
  }
}

/**
 * Values Editor Helper
 */
export class ValuesEditorHelper {
  private readonly selectors: LocatorSelectors<typeof TEST_IDS.valuesEditor>;

  constructor(public readonly locator: Locator) {
    this.selectors = this.getSelectors(locator);
  }

  private getMsg(msg: string): string {
    return `Values Editor: ${msg}`;
  }

  private getSelectors(locator: Locator) {
    return getValuesSelector(locator);
  }

  public get() {
    return this.selectors;
  }

  public async checkAddButtonPresence() {
    return expect(this.get().buttonAdd(), this.getMsg('Check Add button presence')).toBeVisible();
  }

  public async addValue() {
    const values = await this.get().row().all();

    if (values.length) {
      await this.get().buttonAddTop().click();
    } else {
      await this.get().buttonAdd().click();
    }
  }

  public async checkValuesCount(count: number) {
    return expect(await this.get().row().all()).toHaveLength(count);
  }

  public getValueRow(fieldNumber: number) {
    const field = this.get().row().nth(fieldNumber);
    return new ValueHelper(field);
  }
}

/**
 * Code Editor Helper
 */
export class CodeEditorHelper {
  private readonly locator: Locator;
  private readonly page: Page;

  constructor(
    public readonly editor: Locator,
    page: Page
  ) {
    this.locator = editor;
    this.page = page;
  }

  private getMsg(msg: string): string {
    return `Code Editor: ${msg}`;
  }

  public get() {
    return this.locator;
  }

  public async checkPresence() {
    return expect(this.get(), this.getMsg('Check Code editor presence')).toBeVisible();
  }

  public async setValue(value: string) {
    await this.get().click();
    await this.get().fill(value);
    await this.get().blur();
  }

  public async clearCodeEditor() {
    await this.get().click();
    await this.get().fill('');
    await this.get().blur();
  }

  public async checkValue(value: string) {
    return expect(this.get()).toHaveValue(value);
  }
}

/**
 * Query Editor Helper
 */
export class QueryEditorHelper {
  private readonly locator: Locator;
  private readonly grafanaPage: PanelEditPage | VariableEditPage;
  private readonly selectors: LocatorSelectors<typeof TEST_IDS.queryEditor>;
  private readonly grafanaSelectors: E2ESelectorGroups;

  constructor(page: Page, grafanaPage: PanelEditPage | VariableEditPage, grafanaSelectors: E2ESelectorGroups) {
    this.locator = page.locator('body');
    this.grafanaPage = grafanaPage;
    this.grafanaSelectors = grafanaSelectors;
    this.selectors = getLocatorSelectors(TEST_IDS.queryEditor)(this.locator);
  }

  private getMsg(msg: string): string {
    return `Query Editor: ${msg}`;
  }

  public get() {
    return this.locator;
  }

  public getSelectors() {
    return this.selectors;
  }

  public async checkPresence() {
    return expect(this.selectors.root(), this.getMsg('Check presence')).toBeVisible();
  }

  public async checkQueryNameFieldPresence() {
    return expect(this.selectors.fieldName(), this.getMsg('Check Name presence')).toBeVisible();
  }

  public async setName(name: string) {
    await this.selectors.fieldName().fill(name);
    await this.selectors.fieldName().blur();
  }

  public async checkName(name: string) {
    return expect(this.selectors.fieldName(), this.getMsg('Check Name presence')).toHaveValue(name);
  }

  public async changeValuesEditorType(key: string) {
    await this.selectors.root().getByRole('combobox').click();
    await this.grafanaPage
      .getByGrafanaSelector(this.grafanaPage.ctx.selectors.components.Select.option)
      .getByText(key)
      .click();
  }

  public getCodeEditor(page: Page) {
    const codeEditor = this.selectors
      .root()
      .getByTestId(this.grafanaSelectors.components.CodeEditor.container)
      .getByRole('textbox');

    return new CodeEditorHelper(codeEditor, page);
  }

  public getFieldsEditor() {
    return new FieldsEditorHelper(this.get());
  }

  public getValuesEditor() {
    return new ValuesEditorHelper(this.get());
  }
}
