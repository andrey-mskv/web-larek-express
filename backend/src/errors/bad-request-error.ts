import ApiError from './app-error';

class BadRequestError extends ApiError {
  constructor(message = 'Переданы некорректные данные') {
    super(message, 400);
  }
}

export default BadRequestError;
