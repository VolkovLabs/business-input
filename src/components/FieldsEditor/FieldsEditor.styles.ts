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
      width: 100%;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    `,
    buttons: css`
      background: ${theme.colors.background.secondary};
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      gap: ${theme.spacing(0.5)};
    `,
    dragIcon: css`
      color: ${theme.colors.text.disabled};
    `,
  };
};
