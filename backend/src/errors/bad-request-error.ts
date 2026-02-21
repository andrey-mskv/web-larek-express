import AppError from './app-error';

class BadRequestError extends AppError {
  constructor(message = 'Переданы некорректные данные') {
    super(message, 400);
  }
}

export default BadRequestError;
