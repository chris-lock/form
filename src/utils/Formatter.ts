type Format = (
  previous: string,
  current: string,
  changeInLength: number
) => string;

export default class Formatter {
  private static replaceChar: string = '#';

  public static ccExpiration(): Formatter {
    return new Formatter().ccExpiration();
  }

  public static numeric(): Formatter {
    return new Formatter().numeric();
  }

  public static stripWhitespace(): Formatter {
    return new Formatter().stripWhitespace();
  }

  public static withTemplate(
    template: string,
    includeTrailingFormatCharacters: boolean = true
  ): Formatter {
    return new Formatter().withTemplate(template, includeTrailingFormatCharacters);
  }

  public static telephone(): Formatter {
    return new Formatter().telephone();
  }

  public static zipCode(): Formatter {
    return new Formatter().zipCode();
  }

  private static replaceTemplate(
    template: string,
    includeTrailingFormatCharacters: boolean,
    current: string,
    changeInLength: number
  ): string {
    let currentReplacement: number = 0;
    const lastReplacement: number = template.lastIndexOf(Formatter.replaceChar);

    current.split('').forEach((char: string): void => {
      currentReplacement = template.indexOf(Formatter.replaceChar);
      template = template.replace(Formatter.replaceChar, char);
    });

    return Formatter.stripFormatCharacters(
      template,
      currentReplacement,
      lastReplacement,
      template.indexOf(Formatter.replaceChar),
      includeTrailingFormatCharacters,
      changeInLength < 0
    );
  }

  private static stripFormatCharacters(
    str: string,
    currentReplacement: number,
    lastReplacement: number,
    lastUnReplaced: number,
    includeTrailingFormatCharacters: boolean,
    deletion: boolean = false
  ): string {
    if (currentReplacement > -1 && currentReplacement < lastReplacement) {
      if (!deletion && includeTrailingFormatCharacters) {
        return str.substr(0, lastUnReplaced);
      } else {
        return str.substr(0, currentReplacement + 1);
      }
    }

    return str;
  }

  private static replaceTelephoneTemplateWithAreaCode(
    current: string,
    changeInLength: number
  ): string {
    return Formatter.replaceTemplate(
      '# (###) ###-####',
      true,
      current,
      changeInLength
    );
  }

  private static replaceTelephoneTemplateWithoutAreaCode(
    current: string,
    changeInLength: number
  ): string {
    return Formatter.replaceTemplate(
      '(###) ###-####',
      true,
      current,
      changeInLength
    );
  }

  private formatsToApply: Array<Format> = [];
  private previousFormats: Array<string> = [];

  public format(str: string | number | null): string {
    if (str === undefined || str === null || !str.toString()) {
      return '';
    }

    let formatted: string = str.toString();
    const resultingFormats: Array<string> = [
      formatted,
    ];
    const changeInLength: number = formatted.length - this.previousFormat().length;

    this.formatsToApply.forEach((applyFormat: Format, index: number): void => {
      formatted = applyFormat(
        this.previousFormats[index] || '',
        formatted,
        changeInLength
      );
      resultingFormats.push(formatted);
    });

    this.previousFormats = resultingFormats;

    return formatted;
  }

  private previousFormat(): string {
    return this.previousFormats[this.previousFormats.length - 1] || '';
  }

  public ccExpiration(): Formatter {
    return this
      .numeric()
      .add((previous: string, current: string, changeInLength: number): string => {
        const validMonth: string = current
          .replace(/^([2-9])(.*)/, '0$1$2')
          .replace(/^(0)0.*/, '$1')
          .replace(/^(1)[3-9].*/, '$1');

        return Formatter.replaceTemplate(
          '##/##',
          true,
          validMonth,
          changeInLength
        );
      });
  }

  public numeric(): Formatter {
    return this.add((previous: string, current: string, changeInLength: number): string =>
      current.replace(/[^0-9]/g, '')
    );
  }

  public stripWhitespace(): Formatter {
    return this.add((previous: string, current: string, changeInLength: number): string =>
      current.replace(/\s/g, '')
    );
  }

  public withTemplate(
    template: string,
    includeTrailingFormatCharacters: boolean = true
  ): Formatter {
    return this.add(
      Formatter.replaceTemplate.bind(this, template, includeTrailingFormatCharacters)
    );
  }

  public telephone(): Formatter {
    return this
      .numeric()
      .add((previous: string, current: string, changeInLength: number): string =>
        (current[0] === '1')
          ? Formatter.replaceTelephoneTemplateWithAreaCode(current, changeInLength)
          : Formatter.replaceTelephoneTemplateWithoutAreaCode(current, changeInLength)
      );
  }

  public zipCode(): Formatter {
    return this
      .numeric()
      .withTemplate('#####-####', false);
  }

  private add(format: Format): Formatter {
    this.previousFormats = [];
    this.formatsToApply.push(format);

    return this;
  }
}
