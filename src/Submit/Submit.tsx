import React from 'react';

export default class Submit extends React.Component {
  public render(): React.ReactElement<{}> {
    return (
      <button>
        {this.props.children}
      </button>
    );
  }
}
