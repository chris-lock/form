import Formatter from '../../../utils/Formatter';
import TextInput, {
  TextInputProps,
} from '../TextInput/TextInput';

export interface NumberInputProps
extends TextInputProps {
  minValue?: number;
  maxValue?: number;
  type?: 'number';
}

export default class NumberInput
extends TextInput<NumberInputProps> {
  protected displayFormatter?: Formatter = Formatter.numeric();

  protected getType(): string {
    return this.props.type || this.type;
  }
}
