import Formatter from '../../../utils/Formatter';
import TextInput, {
  TextInputProps,
} from '../TextInput/TextInput';

export interface TelephoneInputProps
extends TextInputProps {
}

export default class TelephoneInput
extends TextInput<TelephoneInputProps> {
  protected displayFormatter?: Formatter = Formatter.telephone();
  protected type: string = 'tel';
}
