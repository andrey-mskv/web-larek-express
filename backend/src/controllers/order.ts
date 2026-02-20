import { Request, Response } from "express";
import Product from "../models/product";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import BadRequestError from "../errors/bad-request-error";

interface IOrder {
  _id: mongoose.Types.ObjectId;
  payment: string; // card || online
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export const createOrder = async (
  req: Request<unknown, unknown, IOrder>,
  res: Response,
  next: any,
) => {
  try {
    const { items, total } = req.body;

    // Фильтруем товары по ID
    const itemsId = items.map((id) => new mongoose.Types.ObjectId(id));
    const products = await Product.find({ _id: { $in: itemsId } });

    // Проверяем, что все товары существуют
    if (products.length !== items.length) {
      throw new BadRequestError("Некоторые товары не найдены");
    }

    // Проверяем, что все товары в продаже
    const notForSale = products.find((p) => p.price === null);
    if (notForSale) {
      throw new BadRequestError("В заказе есть товары не в продаже");
    }

    // Проверяем, что сумма заказа не превышает общую стоимость товаров
    const sum = products.reduce((acc, p) => acc + Number(p.price), 0);
    if (sum !== total) {
      throw new BadRequestError(
        "Сумма заказа не соответствует общей стоимости товаров",
      );
    }

    // Генерация уникального ID
    const id = faker.string.uuid();

    res.status(200).send({ id, total: sum });
  } catch (err) {
    next(err);
  }
};
