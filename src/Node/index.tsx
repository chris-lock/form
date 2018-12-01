import React, {
  Context,
} from 'react';
import Validator from '../utils/Validator';

export interface NodeProps {
}

export interface NodeState {
}

export type NodeValue = string | {
  [key: string]: string | NodeValue;
};

export interface NodeContext {
  disabled: boolean;
  namespace: string;
  validating: boolean;
  validator: Validator;
  onUpdate(name: string, value: NodeValue): void;
}

export default abstract class Node<Props extends NodeProps, State extends NodeState>
extends React.Component<Props, State> {
  public static Context: Context<NodeContext> = React.createContext({
    disabled: false,
    namespace: '',
    onUpdate(name: string, value: NodeValue): void {
      return;
    },
    validating: false,
    validator: Validator.every(),
  });

  protected abstract readonly validator: Validator;

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
      namespace: this.namespace(),
      onUpdate: this.onUpdate,
      validating: this.validating(),
      validator: this.validator,
    };
  }

  protected abstract disabled(): boolean;

  protected abstract namespace(): string;

  protected abstract onUpdate(name: string, value: NodeValue): void;

  protected abstract validating(): boolean;
}
