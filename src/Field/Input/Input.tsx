import React from 'react';
import Field, {
  FieldProps
} from '../index';

export default class Input extends Field {
  public onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.updateValue(event.target.value);
  };

  public render(): React.ReactElement<FieldProps> {
    return (
      <input
        name={this.props.name}
        onChange={this.onChange}
        value={this.state.value}
      />
    );
  }
}
