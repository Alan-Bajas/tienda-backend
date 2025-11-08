import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';

export const getCartById = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product').lean();
    if (!cart) return res.status(404).json({ status:'error', message:'Carrito no encontrado' });
    res.json({ status:'success', payload: cart });
  } catch (e) { next(e); }
};

export const deleteProductFromCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status:'error', message:'Carrito no encontrado' });
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    await cart.populate('products.product');
    res.json({ status:'success', payload: cart });
  } catch (e) { next(e); }
};

export const replaceCartProducts = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ status:'error', message:'products debe ser un array' });
    }
    const pids = products.map(p => p.product);
    const count = await Product.countDocuments({ _id: { $in: pids } });
    if (count !== pids.length) {
      return res.status(400).json({ status:'error', message:'Alguno(s) productId no existe(n)' });
    }
    const cart = await Cart.findByIdAndUpdate(
      cid,
      { $set: { products } },
      { new: true, runValidators: true }
    ).populate('products.product');
    if (!cart) return res.status(404).json({ status:'error', message:'Carrito no encontrado' });
    res.json({ status:'success', payload: cart });
  } catch (e) { next(e); }
};

export const updateProductQuantity = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ status:'error', message:'quantity inválida' });
    }
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status:'error', message:'Carrito no encontrado' });
    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return res.status(404).json({ status:'error', message:'Producto no está en el carrito' });
    item.quantity = quantity;
    await cart.save();
    await cart.populate('products.product');
    res.json({ status:'success', payload: cart });
  } catch (e) { next(e); }
};

export const emptyCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findByIdAndUpdate(
      cid,
      { $set: { products: [] } },
      { new: true }
    ).populate('products.product');
    if (!cart) return res.status(404).json({ status:'error', message:'Carrito no encontrado' });
    res.json({ status:'success', payload: cart });
  } catch (e) { next(e); }
};

export const createCart = async (req, res, next) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json({ status:'success', payload: cart });
  } catch (e) { next(e); }
};
