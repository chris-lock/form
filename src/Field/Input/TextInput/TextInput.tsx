import React from 'react';
import Input, {
  InputProps
} from '../../Input';

export interface TextInputProps
extends InputProps<HTMLInputElement> {
  autoCapitalize?: 'off' | 'on' | 'words' | 'characters';
  autoComplete?: 'off' | 'on';
  autoCorrect?: 'off' | 'on';
  maxLength?: number;
  minLength?: number;
}

export default class TextInput<Props extends TextInputProps>
extends Input<HTMLInputElement, Props> {
  protected type: string = 'text';

  constructor(props: Props) {
    super(props);
  }

  protected renderField(): React.ReactElement<{}> {
    return (
      <input
        autoCapitalize={this.props.autoCapitalize}
        autoComplete={this.props.autoComplete}
        autoCorrect={this.props.autoCorrect}
        className={this.fieldClassName()}
        disabled={this.props.disabled}
        id={this.id()}
        maxLength={this.props.maxLength}
        name={this.props.name}
        onBlur={this.props.onBlur}
        onChange={this.onChange}
        onFocus={this.props.onFocus}
        placeholder={this.props.placeholder}
        tabIndex={this.props.tabIndex}
        type={this.typeOverride()}
        value={this.state.value}
      />
    );
  }

  protected typeOverride(): string {
    return this.type;
  }

  public readonly validate = async (): Promise<boolean> => {
    return true;
  };
}
