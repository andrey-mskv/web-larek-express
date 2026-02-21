import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

interface IOrder {
  _id: mongoose.Types.ObjectId;
  payment: string; // card || online
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

const createOrder = async (
  req: Request<unknown, unknown, IOrder>,
  res: Response,
  next: any,
) => {
  try {
    const { items, total } = req.body;

    // Фильтруем товары по ID
    const itemsId = items.map((id) => new mongoose.Types.ObjectId(id));
    const products = await Product.find({ _id: { $in: itemsId } });
    const existingIds = new Set(
      products.map((product) => product._id.toString()),
    );

    // Проверяем, что все товары существуют
    const notFoundIds = items.filter((id) => !existingIds.has(id));

    if (notFoundIds.length > 0) {
      // Здесь у тебя есть конкретный список несуществующих id
      throw new BadRequestError(`Товары не найдены: ${notFoundIds.join(', ')}`);
    }

    // Проверяем, что все товары в продаже
    const notForSaleIds = products
      .filter((p) => p.price === null || p.price === undefined)
      .map((p) => p._id.toString());

    if (notForSaleIds.length > 0) {
      throw new BadRequestError(
        `Товар с id ${notForSaleIds.join(', ')} не продается`,
      );
    }

    // Проверяем, что сумма заказа не превышает общую стоимость товаров
    const sum = products.reduce((acc, p) => acc + Number(p.price), 0);
    if (sum !== total) {
      throw new BadRequestError('Неверная сумма заказа');
    }

    // Генерация уникального ID
    const id = faker.string.uuid();

    res.status(200).send({ id, total: sum });
  } catch (err) {
    next(err);
  }
};

export default createOrder;
