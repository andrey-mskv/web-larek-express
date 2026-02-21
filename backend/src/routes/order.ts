import express from 'express';
import createOrder from '../controllers/order';
import { orderValidation } from '../middlewares/validators';

const router = express.Router();

router.post('/', orderValidation, createOrder);

export default router;
