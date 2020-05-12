export class BaseError extends Error {
  constructor(name, message, status) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

export class NotFound extends BaseError {
  constructor(message) {
    super("message", message, 404);
  }
}

export class EmptyRequiredField extends BaseError {
  constructor(message) {
    super("message", message, 400);
  }
}
