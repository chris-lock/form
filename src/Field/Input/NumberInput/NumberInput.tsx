import TextInput, {
  TextInputProps,
} from '../TextInput/TextInput';

export interface NumberInputProps
extends TextInputProps {
  minValue?: number;
  maxValue?: number;
}

export default class NumberInput<Props extends NumberInputProps>
extends TextInput<Props> {
}
