import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items = await Product.find({}).lean();

    res.set('Content-Type', 'application/json');
    return res.status(200).send({ items, total: items.length });
  } catch (err) {
    return next(err);
  }
};

export const createNewProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title, image, category, description, price,
    } = req.body;

    const newProduct = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });

    return res.status(201).json(newProduct);
  } catch (err) {
    // 409
    if (err instanceof Error && err.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким заголовком уже существует'));
    }
    return next(err);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const {
      title, image, category, description, price,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        image,
        category,
        description,
        price,
      },
      { new: true, runValidators: true, context: 'query' },
    );

    if (!updatedProduct) {
      return next(new NotFoundError('Товар не найден'));
    }

    return res.status(200).send({
      message: 'Товар успешно обновлен',
      product: updatedProduct,
    });
  } catch (err) {
    // 409
    if (err instanceof Error && err.message.includes('E11000')) {
      return next(new ConflictError(`Oops... ${err.message}`));
    }
    return next(err);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return next(new NotFoundError('Товар не найден'));
    }

    return res
      .status(200)
      .send({ message: 'Товар успешно удален', product: deletedProduct });
  } catch (err) {
    return next(err);
  }
};
