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
  namespace: string;
  onSubmit?: () => Promise<void>;
  onSuccess?: (values: FormValues) => Promise<OnFormSubmitResponse>;
  onFailure?: () => Promise<void>;
}

export interface FormState
extends NodeState {
  disabled: boolean;
  validating: boolean;
  values: FormValues;
  response?: OnFormSubmitResponse;
}

export interface FormContext
extends NodeContext {}

export default class Form
extends Node<FormProps, FormState> {
  public static withContext<
    Props extends FormContext,
    ExposedProps = Omit<Props, keyof FormContext>
  >(
    component: React.ComponentClass<Props>
  ): React.FunctionComponent<ExposedProps> {
    const render: Render<React.ComponentType<Props>> = {
      component,
    };
    const wrapper: React.FunctionComponent<ExposedProps> = (
      props: ExposedProps
    ): React.ReactElement<{}> => (
      <Form.Context.Consumer>
        {(context: FormContext): React.ReactElement<{}> => (
          <render.component {...props} {...context} />
        )}
      </Form.Context.Consumer>
    );
    wrapper.displayName = component.displayName;

    return wrapper;
  }

  protected readonly manager: Manager = Manager.allValid(
    (name: string, value: NodeValue): void => this.onUpdate(name, value)
  );

  public readonly state: FormState = {
    disabled: false,
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

    const valid: boolean = await this.manager.validate();

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

  protected disabled(): boolean {
    return this.state.disabled;
  }

  protected namespace(): string {
    return this.props.namespace;
  }

  protected validating(): boolean {
    return this.state.validating;
  }
}
