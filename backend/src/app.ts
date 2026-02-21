import { config } from "./config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productRoutes from "./routes/product";
import orderRoutes from "./routes/order";
import path from "path";
import { errors as CelebrateError } from "celebrate";
import errorHandler from "./middlewares/error-handler";
import NotFoundError from "./errors/not-found-error";
import { requestLogger, errorLogger } from "./middlewares/logger";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Служит для раздачи статических файлов из папки "public"

mongoose
  .connect(config.dbAddress)
  .then(() => console.log(`Подключение к MongoDB, ${config.dbAddress}`))
  .catch((err) => console.error("Ошибка подключения к MongoDB", err));

app.use(requestLogger); // Логирование всех входящих запросов

app.use("/product", productRoutes);
app.use("/order", orderRoutes);

// 404
app.use((_req, _res, next) => {
  next(new NotFoundError("Oops! Маршрут не найден"));
});

app.use(errorLogger); // Логирование всех ошибок

app.use(CelebrateError());
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Сервер запущен на порту ${config.port}`);
});
