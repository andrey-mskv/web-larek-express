import ApiError from './app-error';

class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409);
  }
}

export default ConflictError;
