import React from 'react';
import {
  FormValue,
} from '../Form';

export interface FieldProps {
  name: string;
  onUpdate(name: string, value: FormValue): void;
}

export interface FieldState {
  error: string;
  valid: boolean;
  value: string;
}

export default abstract class Field extends React.Component<FieldProps, FieldState> {
  public state: Readonly<FieldState> = {
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
