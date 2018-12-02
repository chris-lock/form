// Diff / Omit taken from https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766
type Diff<T extends string, U extends string> = (
  { [P in T]: P }
  & { [P in U]: never }
  & { [x: string]: never }
  )[T];

type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

interface Render<C> {
  component: C;
}

interface Class<T> {
  new(...args: Array<any>): T;
}
