import React from 'react';
import Node, {
  NodeContext,
  NodeProps,
  NodeState,
  NodeValue,
  NodeValues,
} from '../Node';
import Manager from '../Node/Manager';
import FormValueHelpers from '../utils/FormValueHelpers';

export type FormValue = NodeValue;

export type FormValues = NodeValues;

export interface OnFormSubmitResponse {
  success: boolean;
  message?: string;
}

export interface FormProps
extends NodeProps {
  name: string;
  onSubmit?: () => Promise<void>;
  onSuccess?: (values: FormValues) => Promise<OnFormSubmitResponse>;
  onFailure?: () => Promise<void>;
}

export interface FormState
extends NodeState {
  values: FormValues;
  response?: OnFormSubmitResponse;
}

export interface FormContext
extends NodeContext {}

export default class Form
extends Node<FormProps, FormState> {
  public static getDerivedStateFromProps(
    nextProps: Readonly<FormProps>,
    prevState: FormState
  ): Partial<FormState> | null {
    if (prevState.namespace !== nextProps.name) {
      return {
        namespace: nextProps.name,
      };
    }

    return null;
  }

  public static withContext<
    Props extends FormContext,
    ExposedProps = Omit<Props, keyof FormContext>
  >(
    Component: React.ComponentType<Props>
  ): React.FunctionComponent<ExposedProps> {
    const wrapper: React.FunctionComponent<ExposedProps> = (
      props: ExposedProps
    ): React.ReactElement<{}> => (
      <Form.Context.Consumer>
        {(context: FormContext): React.ReactElement<{}> => (
          <Component {...props} {...context} />
        )}
      </Form.Context.Consumer>
    );
    wrapper.displayName = Component.displayName;

    return wrapper;
  }

  public state: Readonly<FormState> = {
    disabled: false,
    manager: Manager.allValid((name: string, value: NodeValue): void =>
      this.onUpdate(name, value)
    ),
    namespace: this.props.name,
    validating: false,
    values: {},
  };

  protected readonly onUpdate = (name: string, value: NodeValue): void => {
    this.setState((prevState: FormState): Pick<FormState, 'values'> => ({
      values: FormValueHelpers.deepMerge(
        prevState.values,
        {
          [name]: value,
        }
      ),
    }));
  };

  public render(): React.ReactElement<{}> {
    return (
      <form onSubmit={this.onSubmit}>
        {super.render()}
      </form>
    );
  }

  private readonly onSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    this.setState({
      disabled: true,
      validating: true,
    });

    if (this.props.onSubmit) {
      await this.props.onSubmit();
    }

    const valid: boolean = await this.state.manager.validate();

    this.setState({
      validating: false,
    });

    if (valid) {
      await this.onSuccess();
    } else {
      await this.onFailure();
    }

    this.setState({
      disabled: false,
    });
  };

  private async onSuccess(): Promise<void> {
    if (this.props.onSuccess) {
      const response: OnFormSubmitResponse = await this.props.onSuccess(this.state.values);

      this.setState({
        response,
      });
    }
  }

  private async onFailure(): Promise<void> {
    if (this.props.onFailure) {
      await this.props.onFailure();
    }
  }
}
