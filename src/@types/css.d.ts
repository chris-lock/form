declare module '*.css.ts' {
  interface Stringifyable {
    /**
     * Stringifies the imported stylesheet for use with inline style tags
     */
    toString(): string;
  }

  interface SelectorNode {
    /**
     * Returns the specific selector from imported stylesheet as string
     */
    [key: string]: string;
  }

  const styles: SelectorNode & Stringifyable;
  export default styles;
}
