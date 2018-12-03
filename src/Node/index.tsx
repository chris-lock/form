import React, {
  Context,
} from 'react';
import Manager from './Manager';

export interface NodeProps {
}

export interface NodeState {
}

export interface NodeValues {
  [key: string]: string | NodeValues;
}

export type NodeValue = string | NodeValues;

export interface NodeContext {
  disabled: boolean;
  manager: Manager;
  namespace: string;
  validating: boolean;
}

export default abstract class Node<Props extends NodeProps, State extends NodeState>
extends React.Component<Props, State> {
  public static readonly Context: Context<NodeContext> = React.createContext({
    disabled: false,
    manager: Manager.allValid((name: string, value: NodeValue): void => {
      return;
    }),
    namespace: '',
    validating: false,
  });

  protected abstract readonly manager: Manager;

  public render(): React.ReactElement<{}> {
    return (
      <Node.Context.Provider value={this.nodeContext()}>
        {this.props.children}
      </Node.Context.Provider>
    );
  }

  private nodeContext(): NodeContext {
    return {
      disabled: this.disabled(),
      manager: this.manager,
      namespace: this.namespace(),
      validating: this.validating(),
    };
  }

  protected abstract disabled(): boolean;

  protected abstract namespace(): string;

  protected abstract validating(): boolean;
}
