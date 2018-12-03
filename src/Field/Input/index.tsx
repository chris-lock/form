import Field, {
  FieldElement,
  FieldProps
} from '../../Field';

export interface InputElement
extends FieldElement {
}

export interface InputProps<Element extends InputElement>
extends FieldProps<Element> {
  placeholder?: string;
  value?: string | null;
}

export default abstract class Input<
  Element extends InputElement,
  Props extends InputProps<Element>
>
extends Field<Element, Props> {
}
