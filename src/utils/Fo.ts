export default class Formatter {
  public static replacementChar: string = '#';

  public static template(
    str: string,
    defaultTemplate: string,
    ...templates: Array<string>
  ): string {
    const chars: Array<string> = str.split('');
    let bestTemplate: string = defaultTemplate;
    let mostSequentialCharsMatched: number = -1;
    let isTie: boolean = false;
    console.group(chars.join(''));
    [defaultTemplate, ...templates].forEach((template: string): void => {
      const sequentialCharsMatched: number = Formatter.findSequentialCharsMatched(
        chars,
        template
      );

      if (sequentialCharsMatched > mostSequentialCharsMatched) {
        mostSequentialCharsMatched = sequentialCharsMatched;
        bestTemplate = template;
        isTie = false;
      } else if (sequentialCharsMatched === mostSequentialCharsMatched) {
        isTie = true;
      }
      console.table({
        isTie,
        sequentialCharsMatched,
        template,
      });
    });
    console.info(bestTemplate);
    console.groupEnd();
    return Formatter.replaceTemplateChars(
      bestTemplate,
      chars,
      isTie
    );
  }

  public static findSequentialCharsMatched(chars: Array<string>, template: string): number {
    let sequentialCharsMatched: number = -1;

    chars.every((char: string, index: number): boolean => {
      const templateChar: string = template[index];

      if (templateChar === Formatter.replacementChar || templateChar === char) {
        sequentialCharsMatched = index;

        return true;
      }

      return false;
    });

    return sequentialCharsMatched;
  }

  public static replaceTemplateChars(
    template: string,
    chars: Array<string>,
    isTie: boolean
  ): string {
    let currentReplacement: number = 0;

    chars.forEach((char: string): void => {
      const nextIdenticalChar: number = template.indexOf(char);
      currentReplacement = template.indexOf(Formatter.replacementChar);

      if (nextIdenticalChar === -1 || nextIdenticalChar > currentReplacement) {
        template = template.replace(Formatter.replacementChar, char);
      } else if (nextIdenticalChar > -1) {
        currentReplacement = nextIdenticalChar;
      }
    });

    return Formatter.replaceRemainingTemplateChars(
      template,
      currentReplacement,
      isTie
    );
  }

  public static replaceRemainingTemplateChars(
    template: string,
    currentReplacement: number,
    isTie: boolean,
    deletion: boolean = false,
    includeTrailingFormatCharacters: boolean = true
  ): string {
    const nextReplacement: number = template.indexOf(Formatter.replacementChar);
    console.info(template, nextReplacement);
    if (isTie || (currentReplacement > -1 && nextReplacement > -1)) {
      if (deletion || !includeTrailingFormatCharacters) {
        return template.substr(0, currentReplacement);
      } else if (isTie) {
        return template.substr(0, currentReplacement + 1);
      } else {
        return template.substr(
          0,
          Math.max(currentReplacement, nextReplacement)
        );
      }
    }

    return template;
  }
}
