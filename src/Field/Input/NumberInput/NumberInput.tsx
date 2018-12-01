import Input, {
  TextInputProps
} from '../TextInput/TextInput';

export interface NumberInputProps
extends TextInputProps {
  minValue?: number;
  maxValue?: number;
}

export default class NumberInput<Props extends NumberInputProps>
extends Input<Props> {
}
