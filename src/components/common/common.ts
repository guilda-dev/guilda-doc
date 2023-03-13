export class ResponseError extends Error {

  readonly response: Response;

  constructor(response: Response) {
    super(`HTTP ERROR ${response.status}`);
    this.response = response;
  }
}