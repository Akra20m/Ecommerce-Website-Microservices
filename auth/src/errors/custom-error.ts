export abstract class CustomError extends Error {
  abstract status: number;
  constructor() {
    super();
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  abstract serializeErrors(): { msg: string; param?: string }[];
}
