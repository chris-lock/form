import {
  action,
} from '@storybook/addon-actions';
import {
  storiesOf,
} from '@storybook/react';
import React, {
  ReactElement,
} from 'react';
import Input from '../Field/Input';
import Form, {
  FormNode,
  FormProps,
  OnFormSubmitResponse,
} from '../Form';
import Submit from '../Submit/Submit';

async function onSubmit(values: FormNode): Promise<OnFormSubmitResponse> {
  action('onSubmit')(values);

  return {
    success: true,
  };
}
storiesOf('Components', module)
  .add(
    'Form',
    (): ReactElement<FormProps> => (
      <Form onSubmit={onSubmit}>
        <Input name="wat" />
        <Submit/>
      </Form>
  )
);
