interface FormatMatch {
  matches: {
    consecutive: number;
    current: number,
    exact: number;
    isConsecutive: boolean;
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
      .sort(Formatter.sortByBestMatch);

    return Formatter.stripUnmatchedTemplateChars(matches[0]);
  }

  public static matchFormat(template: string, chars: Array<string>): FormatMatch {
    return chars.reduce(Formatter.calculateMatch, {
      matches: {
        consecutive: 0,
        current: 0,
        exact: 0,
        isConsecutive: true,
        template: 0,
      },
      template,
    });
  }

  public static calculateMatch(match: FormatMatch, char: string, index: number): FormatMatch {
    const charIndex: number = match.template.indexOf(char);
    const templateIndex: number = match.template.indexOf(Formatter.replaceChar);

    if (charIndex === index) {
      match.matches.exact++;
    } else {
      match.template = match.template.replace(Formatter.replaceChar, char);
      match.matches.current = templateIndex;
      match.matches.template++;
    }

    if (match.matches.isConsecutive && (charIndex === index || templateIndex === index)) {
      match.matches.consecutive++;
    } else {
      match.matches.isConsecutive = false;
    }

    return match;
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
        return match.template.substr(0, match.template.indexOf(Formatter.replaceChar));
      }
    }

    return match.template;
  }

  public static sortByBestMatch(a: FormatMatch, b: FormatMatch): number {
    if (b.matches.consecutive === a.matches.consecutive) {
      if (b.matches.exact === a.matches.exact) {
        return b.matches.template - a.matches.template;
      } else {
        return b.matches.exact - a.matches.exact;
      }
    }

    return b.matches.consecutive - a.matches.consecutive;
  }
}
