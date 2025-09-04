import { test, expect } from '@grafana/plugin-e2e';
import { ConfigEditorHelper, QueryEditorHelper, PanelHelper } from './utils';

test.describe('Static Data Source', () => {
  test('Check grafana version', async ({ grafanaVersion }) => {
    console.log('Grafana version: ', grafanaVersion);
    expect(grafanaVersion).toEqual(grafanaVersion);
  });

  test.describe('Datasource config editor', () => {
    test('Should render config editor', async ({ createDataSourceConfigPage, readProvisionedDataSource, page }) => {
      const datasource = await readProvisionedDataSource({ fileName: 'datasources.yaml' });
      await createDataSourceConfigPage({ type: datasource.type });
      const configEditor = new ConfigEditorHelper(page);

      await configEditor.checkPresenceEditor();
      await configEditor.checkPresenceValuesEditor();
    });
  });

  test.describe('Query editor', () => {
    test('Table query should return 2 columns via manual query editor', async ({
      page,
      selectors,
      panelEditPage,
      readProvisionedDataSource,
    }) => {
      const ds = await readProvisionedDataSource({ fileName: 'datasources.yaml' });
      await panelEditPage.datasource.set(ds.name);
      await panelEditPage.setVisualization('Table');

      const queryEditor = new QueryEditorHelper(page, panelEditPage, selectors);
      await queryEditor.checkQueryNameFieldPresence();
      await queryEditor.setName('Test');
      await queryEditor.checkName('Test');

      const fieldsEditor = queryEditor.getFieldsEditor();
      const valuesEditor = queryEditor.getValuesEditor();

      await fieldsEditor.checkAddButtonPresence();
      await valuesEditor.checkAddButtonPresence();

      await fieldsEditor.addField();
      await fieldsEditor.addField();
      await fieldsEditor.checkFieldsCount(2);

      const fieldValue = fieldsEditor.getFieldRow(0);
      const fieldName = fieldsEditor.getFieldRow(1);

      await fieldValue.setName('value');
      await fieldName.setName('name');
      await fieldValue.checkName('value');
      await fieldName.checkName('name');

      await valuesEditor.addValue();
      await valuesEditor.addValue();
      await valuesEditor.checkValuesCount(2);

      const firstRow = valuesEditor.getValueRow(0);
      const secondRow = valuesEditor.getValueRow(1);
      await firstRow.setValue('name', 'name 1');
      await firstRow.setValue('value', 'value 1');
      await secondRow.setValue('name', 'name 2');
      await secondRow.setValue('value', 'value 2');

      const panelContent = panelEditPage.panel.getByGrafanaSelector(selectors.components.Panels.Panel.content);
      await expect(panelContent).toContainText(['valuenamevalue 1name 1value 2name 2']);
    });

    test('Table query should return columns via code query editor', async ({
      page,
      selectors,
      panelEditPage,
      readProvisionedDataSource,
    }) => {
      const ds = await readProvisionedDataSource({ fileName: 'datasources.yaml' });
      await panelEditPage.datasource.set(ds.name);
      await panelEditPage.setVisualization('Table');

      const queryEditor = new QueryEditorHelper(page, panelEditPage, selectors);
      await queryEditor.checkQueryNameFieldPresence();
      await queryEditor.setName('Test');
      await queryEditor.checkName('Test');

      await queryEditor.changeValuesEditorType('JavaScript');
      const fieldsEditor = queryEditor.getFieldsEditor();

      await fieldsEditor.checkAddButtonPresence();

      await fieldsEditor.addField();
      await fieldsEditor.addField();

      const fieldValue = fieldsEditor.getFieldRow(0);
      const fieldName = fieldsEditor.getFieldRow(1);
      await fieldValue.setName('value');
      await fieldName.setName('name');

      const codeEditor = queryEditor.getCodeEditor();
      await codeEditor.checkPresence();

      /**
       * Check default code
       */
      await codeEditor.checkValue(
        `const result = {\n  ...frame,\n  fields: frame.fields.map((field) => ({\n    ...field,\n    values: []\n  }))\n}\n\nreturn Promise.resolve(result);`
      );

      await codeEditor.clearCodeEditor();
      await fieldName.checkName('name');
      await codeEditor.setValue(
        `const currentFields = frame.fields.map((field) =>({...field, values:['test1','test2']}));\nconst result = {...frame, fields:currentFields};\nreturn Promise.resolve(result);`
      );
      await fieldValue.checkName('value');
      await fieldName.checkName('name');

      await expect(panelEditPage.panel.fieldNames).toContainText(['value', 'name']);
      const panelContent = panelEditPage.panel.getByGrafanaSelector(selectors.components.Panels.Panel.content);
      await expect(panelContent).toContainText(['valuenametest1test1test2test2']);
    });
  });

  test.describe('Variables editor', () => {
    test('Should render variable editor', async ({ variableEditPage, page, readProvisionedDataSource, selectors }) => {
      const ds = await readProvisionedDataSource({ fileName: 'datasources.yaml' });
      await variableEditPage.datasource.set(ds.name);
      const queryEditor = new QueryEditorHelper(page, variableEditPage, selectors);
      await queryEditor.checkPresence();
    });

    test('Should return values', async ({ variableEditPage, page, readProvisionedDataSource, selectors }) => {
      const ds = await readProvisionedDataSource({ fileName: 'datasources.yaml' });
      await variableEditPage.setVariableType('Query');
      await variableEditPage.datasource.set(ds.name);
      const queryEditor = new QueryEditorHelper(page, variableEditPage, selectors);
      await queryEditor.checkPresence();

      const fieldsEditor = queryEditor.getFieldsEditor();
      const valuesEditor = queryEditor.getValuesEditor();

      await fieldsEditor.addField();
      const fieldValue = fieldsEditor.getFieldRow(0);
      await fieldValue.setName('value');

      await valuesEditor.addValue();
      await valuesEditor.addValue();
      await valuesEditor.checkValuesCount(2);

      const firstRow = valuesEditor.getValueRow(0);
      const secondRow = valuesEditor.getValueRow(1);
      await firstRow.setValue('value', 'value 1');
      await secondRow.setValue('value', 'value 2');

      await variableEditPage.runQuery();
      await expect(variableEditPage).toDisplayPreviews(['value 1', 'value 2']);
    });
  });

  test.describe('Provisioning', () => {
    test('Should return configured values', async ({ gotoDashboardPage, readProvisionedDashboard, selectors }) => {
      /**
       * Go To Panels dashboard panels.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'panels.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      const panel = new PanelHelper(dashboardPage, 'Logs', selectors);
      await panel.checkIfNoErrors();

      const table = panel.getTable();
      await table.checkTablePresence();
      await table.checkRowsCount(3);
      await table.checkRowContent(0, 'user logged in');
      await table.checkRowContent(1, 'user login failed');
      await table.checkRowContent(2, 'user registered');
    });

    test('Should return configured data', async ({
      gotoDashboardPage,
      readProvisionedDashboard,
      selectors,
      grafanaVersion,
    }) => {
      /**
       * Go To Panels dashboard panels.json
       * return dashboardPage
       */
      const dashboard = await readProvisionedDashboard({ fileName: 'panels.json' });
      const dashboardPage = await gotoDashboardPage({ uid: dashboard.uid });

      const panel = new PanelHelper(dashboardPage, 'Data', selectors);
      await panel.checkIfNoErrors();

      await panel.checkContent(
        `{
  "data": [
    {
      "time": 1667276845648,
      "message": "enable: 198",
      "level": "info",
      "enable": true
    },
    {
      "time": 1667276845648,
      "message": "enable: asb",
      "level": "info",
      "enable": false
    }
  ]
}`,
        grafanaVersion
      );
    });
  });
});
