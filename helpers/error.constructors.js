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

export class RegValidErr extends BaseError {
  constructor(message) {
    super("message", message, 400);
  }
}

export class RegConflictErr extends BaseError {
  constructor(message) {
    super("message", message, 409);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message) {
    super("message", message, 401);
  }
}

export class QueryErr extends BaseError {
  constructor(message) {
    super("message", message, 400);
  }
}

export class SubscriptionValueError extends BaseError {
  constructor(message) {
    super("message", message, 400);
  }
}

export class CreateAvatarError extends BaseError {
  constructor(message) {
    super("message", message, 501);
  }
}
