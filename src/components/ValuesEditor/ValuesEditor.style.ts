import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    field: css`
      margin: ${theme.spacing(0, 0, 0.5, 0)};
    `,
    controls: css`
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
    `,
    buttons: css`
      padding: ${theme.spacing(0.5, 0.5)};
      background: ${theme.colors.background.secondary};
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
    `,
    button: css`
      margin: ${theme.spacing(0, 0.5, 0, 0)};
    `,
  };
};
