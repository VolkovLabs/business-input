import React, { useState, InputHTMLAttributes } from 'react';
import { InlineFormLabel, Icon, IconName } from '@grafana/ui';
import { cx } from 'emotion';

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tooltip?: string;
  children?: React.ReactNode;
}

export const FormField: React.FC<Partial<FormFieldProps>> = ({ label, tooltip, children }) => (
  <div className="gf-form">
    <FormLabel text={label} keyword />
    {children}
  </div>
);

export interface FormGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
}

export const FormGroup: React.FC<Partial<FormGroupProps>> = ({ children }) => (
  <div className="gf-form-inline">{children}</div>
);

export interface FormProps {
  children?: React.ReactNode;
}

export const Form: React.FC<Partial<FormProps>> = ({ children }) => <div>{children}</div>;

export interface FormSpacerProps {}

export const FormSpacer: React.FC<Partial<FormSpacerProps>> = () => (
  <div className="gf-form gf-form--grow">
    <div className="gf-form-label gf-form-label--grow" />
  </div>
);

export interface FormLabelProps {
  text: string;
  keyword: boolean;
}

export const FormLabel: React.FC<Partial<FormLabelProps>> = ({ text, keyword = false }) => (
  <span className={cx({ 'width-8': true, 'gf-form-label': true, 'query-keyword': keyword })}>{text}</span>
);

export interface FormButtonProps {
  icon?: IconName;
  text?: string;
  onClick: () => void;
  expand: boolean;
}

export const FormButton: React.FC<Partial<FormButtonProps>> = ({ icon, text, onClick, expand = false }) => (
  <div className={cx({ 'gf-form': true, 'gf-form--grow': expand })}>
    <a
      className={cx({ 'gf-form-label': true, 'gf-form-label--grow': expand })}
      onClick={onClick}
      style={{ justifyContent: 'flex-start' }}
    >
      {icon ? <Icon name={icon} /> : null}
      {icon && text ? <span>&nbsp;</span> : null}
      {text}
    </a>
  </div>
);

export interface FormIndentProps {
  level: number;
}

export const FormIndent: React.FC<Partial<FormIndentProps>> = ({ level }) => (
  <div className="gf-form">
    <span className={`width-${level}`}></span>
  </div>
);

export interface FormInputProps {
  onChange: () => void;
  value: any;
}

export const FormInput: React.FC<Partial<FormInputProps>> = ({ onChange, value }) => (
  <div className="gf-form">
    <input className="gf-form-input" onChange={onChange} value={value} />
  </div>
);

export interface FormSectionProps {
  label: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<Partial<FormSectionProps>> = ({ label, children }) => {
  const [show, setShow] = useState(true);
  return (
    <>
      <FormGroup>
        <FormButton
          onClick={() => {
            const newval = !show;
            setShow(newval);
          }}
          icon={show ? 'angle-down' : 'angle-right'}
          text={label}
          expand
        />
      </FormGroup>

      {show ? children : null}
    </>
  );
};
