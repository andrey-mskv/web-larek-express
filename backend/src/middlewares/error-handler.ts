import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/app-error';

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
}
