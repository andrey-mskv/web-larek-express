import express from "express";
import {
  getProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product";
import {
  validateObjId,
  validateProductUpdateBody,
} from "../middlewares/validators";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createNewProduct);
router.patch(
  "/:productId",
  validateObjId,
  validateProductUpdateBody,
  updateProduct,
);
router.delete("/:productId", validateObjId, deleteProduct);

export default router;
