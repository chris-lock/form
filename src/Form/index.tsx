import React, {
  Context,
} from 'react';

export interface FormNode {
  [key: string]: string | FormNode;
}

export type FormValue = string | FormNode;

export interface OnFormSubmitResponse {
  success: boolean;
  message?: string;
}

export interface FormProps {
  namespace: string;
  onSubmit?: (values: FormNode) => Promise<OnFormSubmitResponse>;
}

type Validation = React.Component;

export interface FormState {
  disabled: boolean;
  validating: boolean;
  validations: Array<Validation>;
  validationsWaiting: Array<Validation>;
  values: FormNode;
  response?: OnFormSubmitResponse;
}

export interface FormContext {
  disabled: boolean;
  namespace: string;
  validating: boolean;
  onUpdate(name: string, value: FormValue): void;
  validationCompleted(validation: Validation): void;
  validationRegister(validation: Validation): void;
}

interface Render<Props extends {}> {
  component: React.ComponentType<Props>;
}

export default class Form
extends React.Component<FormProps, FormState> {
  public static Context: Context<FormContext> = React.createContext({
    disabled: false,
    namespace: '',
    onUpdate(name: string, value: FormValue): void {
      return;
    },
    validating: false,
    validationCompleted(validation: Validation): void {
      return;
    },
    validationRegister(validation: Validation): void {
      return;
    },
  });

  public static withContext<
    ChildProps extends FormContext,
    ExposedProps = Omit<ChildProps, keyof FormContext>
  >(
    child: React.ComponentClass<ChildProps>
  ): React.FunctionComponent<ExposedProps> {
    const render: Render<ChildProps> = {
      component: child,
    };
    const wrapper: React.FunctionComponent<ExposedProps> = (
      props: ExposedProps
    ): React.ReactElement<ExposedProps> => (
      <Form.Context.Consumer>
        {(context: FormContext): React.ReactElement<ExposedProps> => (<render.component {...props} {...context} />)}
      </Form.Context.Consumer>
    );
    wrapper.displayName = child.displayName;

    return wrapper;
  }

  public readonly state: FormState = {
    disabled: false,
    validating: false,
    validations: [],
    validationsWaiting: [],
    values: {},
  };

  private onUpdate = (name: string, value: FormValue): void => {
    this.setState((prevState: FormState): Pick<FormState, 'values'> => ({
      values: {
        ...prevState.values,
        [name]: value,
      },
    }));
  };

  public render(): React.ReactElement<{}> {
    return (
      <form onSubmit={this.onSubmit}>
        <Form.Context.Provider value={this.formContext()}>
          {this.props.children}
        </Form.Context.Provider>
      </form>
    );
  }

  private onSubmit = (event: React.SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    this.setState({
      disabled: true,
      validating: true,
    });
  };

  private formContext(): FormContext {
    return {
      disabled: this.state.disabled,
      namespace: this.props.namespace,
      onUpdate: this.onUpdate,
      validating: this.state.validating,
      validationCompleted: this.validationCompleted,
      validationRegister: this.validationRegister,
    };
  }

  private validationRegister = (validation: Validation): void => {
    this.setState(
      (
        prevState: FormState
      ): Pick<FormState, 'validations' | 'validationsWaiting'> => {
        const validations: Array<Validation> = prevState.validations.concat(validation);

        return {
          validations,
          validationsWaiting: validations,
        };
      }
    );
  };

  private validationCompleted = (validation: Validation): void => {
    this.setState(
      (
        prevState: FormState
      ): Pick<FormState, 'validating' |  'validationsWaiting'> => {
        const index: number = prevState.validationsWaiting.indexOf(validation);
        let validationsWaiting: Array<Validation> = prevState.validationsWaiting.slice(0);

        if (index > -1) {
          validationsWaiting.splice(index, 1);
        }

        const validating: boolean = validationsWaiting.length > 0;

        if (!validating) {
          validationsWaiting = prevState.validations;
          this.onValidationComplete();
        }

        return {
          validating,
          validationsWaiting,
        };
      }
    );
  };

  private async onValidationComplete(): Promise<void> {
    if (this.props.onSubmit) {
      const response: OnFormSubmitResponse = await this.props.onSubmit(this.state.values);

      this.setState({
        response,
      });
    }

    this.setState({
      disabled: false,
    });
  }
}
