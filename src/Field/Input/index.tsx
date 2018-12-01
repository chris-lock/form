import Field, {
  FieldProps
} from '../../Field';

export interface InputProps
extends FieldProps {
  placeholder?: string;
  value?: string | null;
}

export default abstract class Input<Props extends InputProps>
extends Field<Props> {
}
