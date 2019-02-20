import React from 'react';
import {
  FormContext,
} from '../Form';
import Formatter from '../utils/Formatter';

export interface FieldElement {
  value: string;
}

export interface FieldProps<Element extends FieldElement>
extends FormContext {
  name: string;
  className?: string;
  component?: keyof JSX.IntrinsicElements;
  label?: React.ReactNode;
  onBlur?: React.FocusEventHandler<Element>;
  onChange?: React.ChangeEventHandler<Element>;
  onFocus?: React.FocusEventHandler<Element>;
  required?: boolean;
  tabIndex?: number;
}

export interface FieldState {
  error: string;
  valid: boolean;
  value: string;
}

export default abstract class Field<
  Element extends FieldElement,
  Props extends FieldProps<Element>
>
extends React.Component<Props, FieldState> {
  protected displayFormatter?: Formatter;
  protected formFormatter?: Formatter;

  public readonly state: Readonly<FieldState> = {
    error: '',
    valid: false,
    value: '',
  };

  public componentDidMount(): void {
    this.props.manager.add(this);
  }

  public componentWillUnmount(): void {
    this.props.manager.remove(this);
  }

  public reset(): void {
    this.updateValue('');
  }

  public abstract async validate(): Promise<boolean>;

  public render(): React.ReactElement<{}> {
    const render: Render<keyof JSX.IntrinsicElements> = {
      component: (this.props.component as keyof JSX.IntrinsicElements) || 'div',
    };

    return (
      <render.component className={this.props.className}>
        {this.renderLabel()}
        {this.renderField()}
      </render.component>
    );
  }

  protected renderLabel(): React.ReactElement<{}> | undefined {
    if (this.props.label) {
      return (
        <label
          className={this.labelClassName()}
          htmlFor={this.id()}
        >
          {this.props.label}
        </label>
      );
    }
  }

  protected labelClassName(): string {
    return 'a';
  }

  protected abstract renderField(): React.ReactElement<{}>;

  protected fieldClassName(): string {
    return 'a';
  }

  protected id(): string {
    return 'a';
  }

  protected onChange = (event: React.ChangeEvent<Element>): void => {
    this.updateValue(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };

  public updateValue(value: string): void {
    this.setState({
      value: this.formatDisplayValue(value),
    });
    this.props.manager.onUpdate(
      this.props.name,
      this.formatFormValue(value)
    );
  }

  protected formatDisplayValue(value: string): string {
    if (this.displayFormatter) {
      return this.displayFormatter.format(value);
    }

    return value;
  }

  protected formatFormValue(value: string): string {
    if (this.formFormatter) {
      return this.formFormatter.format(value);
    }

    return value;
  }
}
