import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    content: css`
      padding: ${theme.spacing(0, 0.5, 0, 0)};
    `,
  };
};
