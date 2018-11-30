import React from 'react';
import {
  FormContext,
} from '../Form';

export interface FieldProps
extends FormContext {
  name: string;
  className?: string;
  required?: boolean;
}

export interface FieldState {
  error: string;
  valid: boolean;
  value: string;
}

export default abstract class Field<Props extends FieldProps>
extends React.Component<Props, FieldState> {
  public readonly state: Readonly<FieldState> = {
    error: '',
    valid: false,
    value: '',
  };

  public updateValue(value: string): void {
    this.setState({
      value,
    });
    this.props.onUpdate(this.props.name, value);
  }
}
