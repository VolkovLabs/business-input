/**
 * Preferred Visualization Type
 */
export enum VisualizationType {
  GRAPH = 'graph',
  LOGS = 'logs',
  NODEGRAPH = 'nodeGraph',
  TABLE = 'table',
  TRACE = 'trace',
}

/**
 * Preferred Visualization Types
 */
export const PreferredVisualizationTypes: VisualizationType[] = [
  VisualizationType.GRAPH,
  VisualizationType.LOGS,
  VisualizationType.NODEGRAPH,
  VisualizationType.TABLE,
  VisualizationType.TRACE,
];
