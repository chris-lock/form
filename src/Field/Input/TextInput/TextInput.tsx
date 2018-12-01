import React from 'react';
import Input, {
  InputProps
} from '../../Input';

export interface TextInputProps
extends InputProps {
  autoCapitalize?: 'off' | 'on' | 'words' | 'characters';
  autoComplete?: 'off' | 'on';
  autoCorrect?: 'off' | 'on';
  maxLength?: number;
  minLength?: number;
}

export default class TextInput<Props extends TextInputProps>
extends Input<Props> {
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
        onBlur={this.onBlur}
        onChange={this.onChange}
        onFocus={this.onFocus}
        placeholder={this.props.placeholder}
        tabIndex={this.props.tabIndex}
        value={this.state.value}
      />
    );
  }

  protected validate = async (): Promise<boolean> => {
    return true;
  };
}

// <input
//   autoCapitalize={this.autoCapitalize()}
//   autoComplete={this.autoComplete()}
//   autoCorrect={this.autoCorrect()}
//   className={className}
//   disabled={isDisabled}
//   id={id}
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
