import {
  action,
} from '@storybook/addon-actions';
import {
  storiesOf,
} from '@storybook/react';
import React, {
  ReactElement,
} from 'react';
import NumberInput from '../Field/Input/NumberInput';
import TextInput from '../Field/Input/TextInput';
import Form, {
  FormNode,
  FormProps,
  OnFormSubmitResponse,
} from '../Form';
import Submit from '../Submit';
import network from './utils/network/index';

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
      <Form namespace="form" onSubmit={onSubmit}>
        <TextInput name="wat" required={true} />
        <TextInput name="nah" />
        <NumberInput name="nah" minValue={1} />

        <Submit>Submit</Submit>
      </Form>
  )
);
