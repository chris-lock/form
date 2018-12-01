import sleep from '../Sleep';

export default class NetworkResponse {
  public async success(message: string, timeout: number = 0): Promise<string> {
    await sleep(timeout);

    return Promise.resolve(message);
  }

  public async failure(message: string, timeout: number = 0): Promise<string> {
    await sleep(timeout);

    return Promise.reject(message);
  }
}
