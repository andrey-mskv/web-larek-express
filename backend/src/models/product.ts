import mongoose from "mongoose";

interface IImage {
  _id: mongoose.Types.ObjectId;
  fileName: string;
  originalName: string;
}

interface IProduct {
  _id: mongoose.Types.ObjectId;
  title: string;
  image: IImage;
  category: string;
  description?: string;
  price?: number | null;
}

const imageSchema = new mongoose.Schema<IImage>({
  fileName: {
    type: String,
    required: [true, "Поле fileName не может быть пустым"],
  },
  originalName: {
    type: String,
    required: [true, "Поле originalName не может быть пустым"],
  },
});

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: [true, "Поле title не может быть пустым"],
    unique: true,
    minlength: [2, "Минимальная длина title - 2 символа"],
    maxlength: [30, "Максимальная длина title - 30 символов"],
    trim: true,
  },
  image: {
    type: imageSchema,
    required: true,
  },
  category: {
    type: String,
    required: [true, "Поле category не может быть пустым"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    default: null,
    validate: {
      validator: (value: number) => value >= 0,
      message: "Цена не может быть отрицательной",
    },
  },
});

const Product = mongoose.model<IProduct>("product", productSchema);

export default Product;
