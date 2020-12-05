import React, { useState } from 'react';
import { Icon, useTheme } from '@grafana/ui';
import { css } from 'emotion';

export interface InlineFieldGroup {
  label: string;
  children: React.ReactNode;
}

export const InlineFieldGroup: React.FC<Partial<InlineFieldGroup>> = ({ label, children }) => {
  const [show, setShow] = useState(true);
  const theme = useTheme();

  const styles = {
    header: css`
      padding: ${theme.spacing.xs} ${theme.spacing.sm};
      border-radius: ${theme.border.radius.sm};
      background: ${theme.colors.bg2};
      min-height: ${theme.spacing.formInputHeight}px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: ${theme.spacing.xs};
      user-select: none;
    `,
    collapseIcon: css`
      color: ${theme.colors.textWeak};
      &:hover {
        color: ${theme.colors.text};
      }
    `,
    titleWrapper: css`
      display: flex;
      align-items: center;
      flex-grow: 1;
      cursor: pointer;
      overflow: hidden;
      margin-right: ${theme.spacing.sm};
    `,
    title: css`
      font-weight: ${theme.typography.weight.semibold};
      color: ${theme.colors.textBlue};
      margin-left: ${theme.spacing.sm};
      overflow: hidden;
    `,
    content: css`
      margin-top: ${theme.spacing.inlineFormMargin};
      margin-left: ${theme.spacing.lg};
    `,
  };
  return (
    <>
      <div className={styles.header}>
        <div
          className={styles.titleWrapper}
          onClick={() => {
            const newval = !show;
            setShow(newval);
          }}
          aria-label="Query operation row title"
        >
          <Icon name={show ? 'angle-down' : 'angle-right'} className={styles.collapseIcon} />
          <div className={styles.title}>{label}</div>
        </div>
      </div>
      <div className={styles.content}>{show ? children : null}</div>
    </>
  );
};
