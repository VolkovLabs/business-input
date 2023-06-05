import { e2e } from '@grafana/e2e';

/**
 * Dashboard
 */
const json = require('../../provisioning/dashboards/panels.json');
const testedPanel = json.panels[0];

/**
 * Panel
 */
describe('Viewing a panel with a Logs from Static Data', () => {
  beforeEach(() => {
    e2e.flows.openDashboard({
      uid: json.uid,
    });
  });

  it('Should display a Logs Panel with Static Data', () => {
    const currentPanel = e2e.components.Panels.Panel.title(testedPanel.title);
    currentPanel.should('be.visible');
  });
});
