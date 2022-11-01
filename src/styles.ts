import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => ({
  rootInput: css`
    width: 144px;
    margin-right: 4px;
  `,
  suffixElement: css`
    &:hover {
      cursor: pointer;
      color: ${theme.colors.text};
    }
  `,
  field: css`
    margin: 0;
  `,
  rowMarginBottom: css`
    margin-bottom: 4px;
  `,
});
