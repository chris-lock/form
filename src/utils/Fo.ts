interface FormatMatch {
  matches: {
    current: number,
    exact: number;
    template: number;
  };
  template: string;
}

export default class Formatter {
  public static replaceChar: string = '#';

  public static template(
    str: string,
    defaultTemplate: string,
    ...templates: Array<string>
  ): string {
    const chars: Array<string> = str.split('');

    const matches: Array<FormatMatch> = [defaultTemplate, ...templates]
      .map((template: string): FormatMatch => Formatter.matchFormat(template, chars))
      .sort((a: FormatMatch, b: FormatMatch): number =>
        (b.matches.exact === a.matches.exact)
          ? b.matches.template = a.matches.template
          : b.matches.exact - a.matches.exact
      );

    return Formatter.stripUnmatchedTemplateChars(matches[0]);
  }

  public static matchFormat(template: string, chars: Array<string>): FormatMatch {
    let currentMatch: number = 0;
    let exactMatch: number = 0;
    let templateMatch: number = 0;

    chars.forEach((char: string, index: number): void => {
      if (template.indexOf(char) === currentMatch + index) {
        exactMatch++;
      } else {
        currentMatch = template.indexOf(Formatter.replaceChar);
        template = template.replace(Formatter.replaceChar, char);
        templateMatch++;
      }
    });

    return {
      matches: {
        current: currentMatch,
        exact: exactMatch,
        template: templateMatch,
      },
      template,
    };
  }

  public static stripUnmatchedTemplateChars(
    match: FormatMatch,
    stripTrailingTemplateChars: boolean = false
  ): string {
    const lastTemplateChar: number = match.template.lastIndexOf(Formatter.replaceChar);

    if (match.matches.current > -1 && match.matches.current < lastTemplateChar) {
      if (stripTrailingTemplateChars) {
        return match.template.substr(0, match.matches.current + 1);
      } else {
        return match.template.substr(0, lastTemplateChar);
      }
    }

    return match.template;
  }
}
