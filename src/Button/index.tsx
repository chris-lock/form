import React from 'react';
import {
  FormContext,
} from '../Form/';

export interface ButtonProps
extends FormContext {
  className?: string;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  tabIndex?: number;
}

export type ButtonType = 'button' | 'submit';

export default abstract class Index
extends React.Component<ButtonProps> {
  protected abstract type: ButtonType;

  public render(): React.ReactElement<{}> {
    return (
      <button
        className={this.props.className}
        disabled={this.props.disabled}
        onBlur={this.props.onBlur}
        onClick={this.onClick}
        onFocus={this.props.onFocus}
        tabIndex={this.props.tabIndex}
        type={this.type}
      >
        {this.props.children}
      </button>
    );
  }

  protected readonly onClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  };
}
