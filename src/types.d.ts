// Diff / Omit taken from https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766
import React from 'react';

type Diff<T extends string, U extends string> = (
  { [P in T]: P }
  & { [P in U]: never }
  & { [x: string]: never }
  )[T];

type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

interface Render<Props extends {}> {
  component: React.ComponentType<Props>;
}

interface Class<T> {
  new(...args: Array<any>): T;
}
