import React from 'react';
import Button, {
  ButtonType,
} from '../../Button';

export default class Clear
extends Button {
  protected readonly type: ButtonType = 'button';

  protected readonly superOnClick: React.MouseEventHandler<HTMLButtonElement> = this.onClick;

  protected readonly onClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    this.superOnClick(event);

    this.props.manager.clear();
  };
}
