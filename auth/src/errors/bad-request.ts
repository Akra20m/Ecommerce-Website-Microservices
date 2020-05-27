import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  status = 400;
  constructor(public message: string) {
    super();
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeErrors() {
    return [{ msg: this.message }];
  }
}
