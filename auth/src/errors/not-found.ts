import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  status = 404;
  constructor() {
    super();
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeErrors() {
    return [{ msg: 'Not Found' }];
  }
}
