import express from "express";
import {
  getProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product";
import {
  validateObjId,
  validateProductBody,
  validateProductUpdateBody,
} from "../middlewares/validators";

const router = express.Router();

router.get("/", getProducts);
router.post("/", validateProductBody,createNewProduct);
router.patch(
  "/:productId",
  validateObjId,
  validateProductUpdateBody,
  updateProduct,
);
router.delete("/:productId", validateObjId, deleteProduct);

export default router;
