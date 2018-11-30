import React from 'react';
import {
  FormContext,
} from '../Form';

export interface SubmitProps
extends FormContext {
  className?: string;
}

export default class Submit
extends React.Component<SubmitProps> {
  public render(): React.ReactElement<{}> {
    return (
      <button
        className={this.props.className}
        disabled={this.props.disabled}
      >
        {this.props.children}
      </button>
    );
  }
}
