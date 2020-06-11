import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  status = 401;
  constructor() {
    super();
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeErrors() {
    return [{ msg: 'Not Authorized' }];
  }
}
