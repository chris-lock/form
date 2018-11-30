import React from 'react';
import Input, {
  InputProps
} from '../index';

export interface TextInputProps
extends InputProps {
  autoCapitalize?: 'off' | 'on' | 'words' | 'characters';
  autoComplete?: 'off' | 'on';
  autoCorrect?: 'off' | 'on';
  maxLength?: number;
  minLength?: number;
}

// Why no work?
// export default class TextInput<Props extends TextInputProps = TextInputProps>
// extends Input<Props> {
export default class TextInput<Props extends TextInputProps = TextInputProps>
extends Input<TextInputProps> {
  public render(): React.ReactElement<Props> {
    return (
      <input
        className={this.props.className}
        disabled={this.props.disabled}
        name={this.props.name}
        onChange={this.onChange}
        value={this.state.value}
      />
    );
  }
}

// <input
//   autoCapitalize={this.autoCapitalize()}
//   autoComplete={this.autoComplete()}
//   autoCorrect={this.autoCorrect()}
//   className={className}
//   disabled={isDisabled}
//   id={id}
//   key={key}
//   maxLength={this.props.maxLength}
//   name={this.props.name}
//   onBlur={this.onBlur}
//   onChange={this.onChange}
//   onFocus={this.onFocus}
//   placeholder={this.placeholder()}
//   ref={this.setInputElement}
//   tabIndex={this.props.tabIndex}
//   type={this.inputType}
//   value={this.state.value}
// />
