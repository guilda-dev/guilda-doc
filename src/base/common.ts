export class ResponseError extends Error {

  readonly response?: Response;

  constructor(response?: Response) {
    super(`HTTP ERROR ${response?.status ?? 404}`);
    this.response = response;
  }
}

export const deepFreeze = <T extends object = object>(obj: T) => {
  const propNames = Object.getOwnPropertyNames(obj) as Array<keyof T>;
  propNames.forEach((name) => {
    const prop = obj[name];
    if (typeof prop == 'object' && prop !== null)
      deepFreeze(prop);
  });
  return Object.freeze(obj);
};