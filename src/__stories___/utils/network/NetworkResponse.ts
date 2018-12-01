type Resolver = (message: string) => void;
type ResponseMethod = (resolve: Resolver, reject: Resolver) => void;

export default class NetworkResponse {
  public success(message: string, timeout: number = 0): Promise<string> {
    return this.promise(
      (resolve: Resolver, reject: Resolver): void => resolve(message),
      timeout
    );
  }

  private promise(responseMethod: ResponseMethod, timeout: number): Promise<string> {
    return new Promise<string>((resolve: Resolver, reject: Resolver): void => {
      setTimeout(
        (): void => responseMethod(resolve, reject),
        timeout
      );
    });
  }

  public failure(message: string, timeout: number = 0): Promise<string> {
    return this.promise(
      (resolve: Resolver, reject: Resolver): void => reject(message),
      timeout
    );
  }
}
