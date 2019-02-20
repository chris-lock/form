import Node, {
  NodeContext,
  NodeProps,
  NodeState,
  NodeValue,
} from '../Node';
import Manager from '../Node/Manager';

interface GroupProps
extends NodeProps, NodeContext {
  name: string;
}

interface GroupState extends NodeState {
}

export default class Group
extends Node<GroupProps, GroupState> {
  public static getDerivedStateFromProps(
    nextProps: Readonly<GroupProps>,
    prevState: GroupState
  ): Partial<GroupState> | null {
    const nextState: Partial<GroupState> = {};

    if (prevState.disabled !== nextProps.disabled) {
      nextState.disabled = nextProps.disabled;
    }

    if (prevState.namespace !== nextProps.name) {
      nextState.namespace = nextProps.name;
    }

    if (prevState.validating !== nextProps.validating) {
      nextState.validating = nextProps.validating;
    }

    return (Object.keys(nextState).length)
      ? nextState
      : null;
  }

  public state: Readonly<GroupState> = {
    disabled: this.props.disabled,
    manager: this.manager(),
    namespace: this.props.name,
    validating: this.props.validating,
  };

  protected manager(): Manager {
    return Manager.allValid((name: string, value: NodeValue): void =>
      this.onUpdate(name, value)
    );
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
    this.state.manager.reset();
  };

  public readonly validate = async (): Promise<boolean> => {
    return this.state.manager.validate();
  };
}
