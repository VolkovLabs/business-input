import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => ({
  icon: css`
    display: flex;
    align-items: center;
  `,
  suffixElement: css`
    &:hover {
      cursor: pointer;
      color: ${theme.colors.text};
    }
  `,
});
