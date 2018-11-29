import React, {
  Context,
} from 'react';

// Diff / Omit taken from https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766
type Diff<T extends string, U extends string> = (
  { [P in T]: P }
  & { [P in U]: never }
  & { [x: string]: never }
)[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

export interface OnFormSubmitResponse {
  success: boolean;
  message?: string;
}

export interface FormProps {
  onSubmit?: (values: FormNode) => Promise<OnFormSubmitResponse>;
}

export interface FormNode {
  [key: string]: string | FormNode;
}

export type FormValue = string | FormNode;

export interface FormState {
  values: FormNode;
  response?: OnFormSubmitResponse;
}

export interface FormContext {
  onUpdate(name: string, value: FormValue): void;
}

interface Render<Props extends {}> {
  component: React.ComponentType<Props>;
}

export default class Form extends React.Component<FormProps, FormState> {
  public static Context: Context<FormContext> = React.createContext({
    onUpdate(name: string, value: FormValue): void {
      return;
    },
  });

  public static withContext<
    ChildProps extends FormContext,
    ExposedProps = Omit<ChildProps, keyof FormContext>
  >(
    child: React.ComponentType<ChildProps>
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

  private readonly formContext: FormContext;
  public readonly state: FormState = {
    values: {},
  };

  constructor(props: FormProps) {
    super(props);

    this.formContext = {
      onUpdate: this.onUpdate,
    };
  }

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
        <Form.Context.Provider value={this.formContext}>
          {this.props.children}
        </Form.Context.Provider>
      </form>
    );
  }

  private onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>): Promise<boolean> => {
    event.preventDefault();

    if (this.props.onSubmit) {
      const response: OnFormSubmitResponse = await this.props.onSubmit(this.state.values);

      this.setState({
        response,
      });

      return response.success;
    }

    return true;
  };
}
