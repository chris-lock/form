import React from 'react';
import {
  FormContext,
  FormValue,
} from '../Form';
import Formatter from '../utils/Formatter';

export interface FieldProps
extends FormContext {
  name: string;
  className?: string;
  component?: keyof JSX.IntrinsicElements;
  label?: React.ReactNode;
  onBlur?: (value: FormValue) => void;
  onChange?: (value: FormValue) => void;
  onFocus?: (value: FormValue) => void;
  required?: boolean;
  tabIndex?: number;
}

export interface FieldState {
  error: string;
  valid: boolean;
  value: string;
}

export default abstract class Field<Props extends FieldProps>
extends React.Component<Props, FieldState> {
  protected displayFormatter?: Formatter;
  protected formFormatter?: Formatter;

  public readonly state: Readonly<FieldState> = {
    error: '',
    valid: false,
    value: '',
  };

  public componentDidMount(): void {
    this.props.validator.add(this.validate);
  }

  public componentWillUnmount(): void {
    this.props.validator.add(this.validate);
  }

  protected abstract async validate(): Promise<boolean>;

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

  protected onBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    if (this.props.onBlur) {
      this.props.onBlur(this.getEventValue(event));
    }
  };

  protected getEventValue(
    event: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>
  ): string {
    return event.target.value;
  }

  protected onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = this.getEventValue(event);

    this.updateValue(value);

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  public updateValue(value: string): void {
    this.setState({
      value: this.formatDisplayValue(value),
    });
    this.props.onUpdate(
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

  protected onFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    if (this.props.onFocus) {
      this.props.onFocus(this.getEventValue(event));
    }
  };
}
