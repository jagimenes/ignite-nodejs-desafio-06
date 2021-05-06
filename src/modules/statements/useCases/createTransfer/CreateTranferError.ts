import { AppError } from "../../../../shared/errors/AppError";

export class SenderNotFound extends AppError {
  constructor() {
    super('User (sender) not found', 404);
  }
}

export class ReceiverNotFound extends AppError {
  constructor() {
    super('User (receiver) not found', 404);
  }
}

export class InsufficientFunds extends AppError {
  constructor() {
    super('User have insufficient funds to do this operation.', 400);
  }
}
