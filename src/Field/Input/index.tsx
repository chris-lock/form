import React from 'react';
import Field, {
  FieldProps
} from '../index';

export interface InputProps
extends FieldProps {
  placeholder?: string;
  value?: string | null;
}

export default abstract class Input<Props extends InputProps>
extends Field<Props> {
  public onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    this.updateValue(event.target.value);
  };
}
