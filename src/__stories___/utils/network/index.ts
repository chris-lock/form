import NetworkResponse from './NetworkResponse';

class Network {
  public get(url: string, params?: {}): NetworkResponse {
    return new NetworkResponse();
  }

  public post(url: string, data?: {}): NetworkResponse {
    return new NetworkResponse();
  }

  public put(url: string, data?: {}): NetworkResponse {
    return new NetworkResponse();
  }

  public delete(url: string, params?: {}): NetworkResponse {
    return new NetworkResponse();
  }
}

export default new Network();
