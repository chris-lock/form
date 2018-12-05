import {
  FormContext,
} from '../Form';
import Node, {
  NodeProps,
  NodeState,
  NodeValue,
} from '../Node';
import Manager from '../Node/Manager';

interface GroupProps
extends NodeProps, FormContext {
  name: string;
}

interface GroupState
  extends NodeState {
}

export default class Group<Props extends GroupProps, State extends GroupState>
extends Node<Props, State> {
  protected readonly manager: Manager = Manager.allValid(
    (name: string, value: NodeValue): void => this.onUpdate(name, value)
  );

  constructor(props: Props) {
    super(props);
  }

  private readonly onUpdate = (name: string, value: NodeValue): void => {
    return this.props.manager.onUpdate(this.props.name, {
      [name]: value,
    });
  };

  public componentDidMount(): void {
    this.props.manager.add(this);
  }

  public componentWillUnmount(): void {
    this.props.manager.add(this);
  }

  public readonly reset = (): void => {
    this.manager.reset();
  };

  public readonly validate = async (): Promise<boolean> => {
    return this.manager.validate();
  };

  protected disabled(): boolean {
    return this.props.disabled;
  }

  protected namespace(): string {
    return this.props.namespace;
  }

  protected validating(): boolean {
    return this.props.validating;
  }
}
