import {
  NodeValue,
} from '../Node';

type OnUpdate = (name: string, value: NodeValue) => void;
type ValidationStrategy = (validations: Array<boolean>) => boolean;

interface Managed {
  reset(): void;
  validate(): Promise<boolean>;
}

export default class Manager {
  public static allValid(managerOnUpdate: OnUpdate): Manager {
    return new Manager(
      managerOnUpdate,
      (responses: Array<boolean>): boolean => responses.every(Boolean)
    );
  }

  public static anyValid(managerOnUpdate: OnUpdate): Manager {
    return new Manager(
      managerOnUpdate,
      (responses: Array<boolean>): boolean => responses.some(Boolean)
    );
  }

  private readonly items: Array<Managed> = [];
  private readonly managerOnUpdate: OnUpdate;
  private readonly validationStrategy: ValidationStrategy;

  private constructor(managerOnUpdate: OnUpdate, strategy: ValidationStrategy) {
    this.managerOnUpdate = managerOnUpdate;
    this.validationStrategy = strategy;
  }

  public add(item: Managed): this {
    this.items.push(item);

    return this;
  }

  public remove(item: Managed): this {
    const index: number = this.items.indexOf(item);

    if (index >= -1) {
      this.items.splice(index, 1);
    }

    return this;
  }

  public reset = (): void => {
    this.items.forEach((item: Managed): void => item.reset());
  };

  public onUpdate = (name: string, value: NodeValue): void => {
    this.managerOnUpdate(name, value);
  };

  public validate = async (): Promise<boolean> => {
    return this.validationStrategy(
      await Promise.all(
        this.items.map((item: Managed) => item.validate())
      )
    );
  };
}
