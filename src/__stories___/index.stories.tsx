import {
  action,
} from '@storybook/addon-actions';
import {
  storiesOf,
} from '@storybook/react';
import React from 'react';
import Reset from '../Button/Reset';
import Submit from '../Button/Submit';
import NumberInput from '../Field/Input/NumberInput';
import TelephoneInput from '../Field/Input/TelephoneInput';
import TextInput from '../Field/Input/TextInput';
import Form, {
  FormValues,
  OnFormSubmitResponse,
} from '../Form';
import Group from '../Group';
import Formatter from '../utils/Fo';
import network from './utils/network';

function formatterTest(): Array<React.ReactNode> {
  return [
    ['a', 'a'],
    ['ab', 'ab'],
    ['ac', 'ac'],
    ['c', 'c-'],
    ['abc', 'abc'],
    ['abb', 'ab__b'],
  ]
    .map((str: Array<string>, index: number): React.ReactNode => (
      <li key={index}>
        <b>
          {Formatter.template(str[0], '#-#-#', 'a.#.#', 'ab__#', 'a#c', 'a#d')}
        </b> ({str[0]} = {str[1]})
      </li>
    ));
}

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
        <ul>
          {formatterTest()}
        </ul>

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

          <Reset>Reset Group</Reset>
        </Group>

        <Reset>Reset</Reset>

        <Submit>Submit</Submit>
      </Form>
  )
);
