import ApiError from "../errors/app-error";
import {  Request, Response } from "express";

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  return res
    .status(500)
    .send({ message: "Ошибка 500: Внутренняя ошибка сервера" });
}
