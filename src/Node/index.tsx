import React, {
  Context,
} from 'react';
import Manager from './Manager';

export interface NodeValues {
  [key: string]: string | NodeValues;
}

export type NodeValue = string | NodeValues;

export interface NodeProps {
}

export interface NodeState {
  disabled: boolean;
  manager: Manager;
  namespace: string;
  validating: boolean;
}

export interface NodeContext extends NodeState {
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

  public abstract state: Readonly<State>;

  public render(): React.ReactElement<{}> {
    return (
      <Node.Context.Provider value={this.state}>
        {this.props.children}
      </Node.Context.Provider>
    );
  }
}
