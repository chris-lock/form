type Validation = () => Promise<boolean>;
type Strategy = (validations: Array<boolean>) => boolean;

export default class Validator {
  public static every(): Validator {
    return new this((responses: Array<boolean>): boolean => responses.every(Boolean));
  }

  public static some(): Validator {
    return new this((responses: Array<boolean>): boolean => responses.some(Boolean));
  }

  private readonly strategy: Strategy;
  private validations: Array<Validation> = [];

  private constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  public add(validation: Validation): this {
    this.validations.push(validation);

    return this;
  }

  public remove(validation: Validation): this {
    const index: number = this.validations.indexOf(validation);

    if (index >= -1) {
      this.validations.splice(index, 1);
    }

    return this;
  }

  public async validate(): Promise<boolean> {
    return this.strategy(
      await Promise.all(
        this.validations.map((validation: Validation) => validation())
      )
    );
  }
}
