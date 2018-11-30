import {
  action,
} from '@storybook/addon-actions';
import {
  storiesOf,
} from '@storybook/react';
import React, {
  ReactElement,
} from 'react';
import TextInput from '../Field/Input/TextInput';
import Form, {
  FormNode,
  FormProps,
  OnFormSubmitResponse,
} from '../Form';
import Submit from '../Submit';
import network from './util/network/index';

async function onSubmit(values: FormNode): Promise<OnFormSubmitResponse> {
  action('onSubmit')(values);

  return network
    .post('', values)
    .success('worked', 3000)
    .then()
    .then((message: string) => {
      action('onSubmitResponse')(message);

      return {
        message,
        success: true,
      };
    });
}
storiesOf('Components', module)
  .add(
    'Form',
    (): ReactElement<FormProps> => (
      <Form onSubmit={onSubmit}>
        <TextInput name="wat" required={true} />
        <TextInput name="nah" />

        <Submit>Submit</Submit>
      </Form>
  )
);
