import { Router } from 'express';
import {
  getCartById,
  deleteProductFromCart,
  replaceCartProducts,
  updateProductQuantity,
  emptyCart,
  createCart
} from '../controllers/cart.controller.js';

const router = Router();

router.post('/', createCart); 
router.get('/:cid', getCartById);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', replaceCartProducts);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid', emptyCart);

export default router;
