import {
  action,
} from '@storybook/addon-actions';
import {
  storiesOf,
} from '@storybook/react';
import React from 'react';
import Clear from '../Button/Clear';
import Submit from '../Button/Submit';
import NumberInput from '../Field/Input/NumberInput';
import TelephoneInput from '../Field/Input/TelephoneInput';
import TextInput from '../Field/Input/TextInput';
import Form, {
  FormValues,
  OnFormSubmitResponse,
} from '../Form';
import Group from '../Group';
import network from './utils/network';

function onComplete(name: string): () => Promise<void> {
  return async (): Promise<void> => {
    action(name)(Date.now());
  };
}

async function onSuccess(values: FormValues): Promise<OnFormSubmitResponse> {
  action('onSuccess')(Date.now(), values);

  return network
    .post('', values)
    .success('worked', 3000)
    .then((message: string) => {
      action('onSuccessResponse')(Date.now(), message);

      return {
        message,
        success: true,
      };
    });
}

storiesOf('Components', module)
  .add(
    'Form',
    (): React.ReactElement<{}> => (
      <Form
        namespace="form"
        onSubmit={onComplete('onSubmit')}
        onSuccess={onSuccess}
        onFailure={onComplete('onFailure')}
      >
        <TextInput
          label="Wat"
          name="wat"
          required={true}
        />

        <TextInput
          label="Nah"
          name="nah"
        />

        <Group name="yah">
          <NumberInput
            label="Dis"
            name="dis"
            minValue={1}
          />

          <TelephoneInput
            label="Tel"
            name="tel"
          />

          <Clear>Clear Group</Clear>
        </Group>

        <Clear>Clear</Clear>

        <Submit>Submit</Submit>
      </Form>
  )
);
