import { celebrate, Joi, Segments } from "celebrate";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import BadRequestError from "../errors/bad-request-error";

interface Order {
  payment: string; // card || online
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Схема валидации для создания заказа
export const orderValidation = celebrate({
  [Segments.BODY]: Joi.object({
    payment: Joi.string().valid("card", "online").required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^\+?[\d\s()-]{10,20}$/)
      .required(),
    address: Joi.string().min(5).max(100).required(),
    total: Joi.number().integer().min(0).required(),
    items: Joi.array()
      .items(Joi.string().hex().length(24))
      .min(1)
      .unique()
      .required(),
  }),
});

// Валидация ObjectId товара
export const validateObjId = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId as string)) {
    return next(new BadRequestError("Некорректный формат id"));
  }

  return next();
};

// Валидация обновления товара
export const validateProductUpdateBody = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(2).max(30),
    image: Joi.object({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }),
    category: Joi.string(),
    description: Joi.string().allow("").max(500),
    price: Joi.number().integer().min(0).allow(null),
  })
    .min(1)
    .unknown(false),
});
