import {
  FormValue,
  FormValues,
} from '../Form';

export default class FormValueHelpers {
  public static deepMerge(original: FormValues, diff: FormValues): FormValues {
    const result: FormValues = {
      ...original,
    };

    Object.keys(diff).forEach((key: string): void => {
      const originalValue: FormValue = original[key];
      const diffValue: FormValue = diff[key];

      result[key] = (typeof originalValue === 'object' && typeof diffValue === 'object')
        ? FormValueHelpers.deepMerge(originalValue, diffValue)
        : diffValue;
    });

    return result;
  }

  private constructor() {}
}
