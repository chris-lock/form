import React from 'react';
import Node, {
  NodeContext,
  NodeProps,
  NodeState,
  NodeValue,
} from '../Node';
import Validator from '../utils/Validator';

export type FormValue = NodeValue;

export interface OnFormSubmitResponse {
  success: boolean;
  message?: string;
}

export interface FormProps
extends NodeProps {
  namespace: string;
  onSubmit?: () => Promise<void>;
  onSuccess?: (values: FormValue) => Promise<OnFormSubmitResponse>;
  onFailure?: () => Promise<void>;
}

export interface FormState
extends NodeState {
  disabled: boolean;
  validating: boolean;
  values: {
    [key: string]: NodeValue,
  };
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

  protected readonly validator: Validator = Validator.every();

  public readonly state: FormState = {
    disabled: false,
    validating: false,
    values: {},
  };

  public render(): React.ReactElement<{}> {
    return (
      <form onSubmit={this.onSubmit}>
        {super.render()}
      </form>
    );
  }

  private onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    this.setState({
      disabled: true,
      validating: true,
    });

    if (this.props.onSubmit) {
      await this.props.onSubmit();
    }

    const valid: boolean = await this.validator.validate();

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

  protected onUpdate = (name: string, value: NodeValue): void => {
    this.setState((prevState: FormState): Pick<FormState, 'values'> => ({
      values: {
        ...prevState.values,
        [name]: value,
      },
    }));
  };

  protected validating(): boolean {
    return this.state.validating;
  }
}
