import { Router } from 'express';
const router = Router();

router.get('/products', async (req, res) => {
  try {
    const base = `${req.protocol}://${req.get('host')}`;
    const qs = new URLSearchParams(req.query).toString();
    const resp = await fetch(`${base}/api/products?${qs}`);
    if (!resp.ok) throw new Error(`API products error ${resp.status}`);
    const data = await resp.json();

    res.render('products', {
      ...data,
      query: req.query.query || '',
      sort: req.query.sort || '',
      limit: req.query.limit || ''
    });
  } catch (e) {
    console.error('Error cargando /products:', e);
    res.render('products', {
      status: 'error',
      payload: [],
      totalPages: 1,
      page: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevLink: null,
      nextLink: null,
      query: req.query.query || '',
      sort: req.query.sort || '',
      limit: req.query.limit || '',
      error: e.message
    });
  }
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const base = `${req.protocol}://${req.get('host')}`;
    const resp = await fetch(`${base}/api/carts/${req.params.cid}`);
    if (!resp.ok) throw new Error(`API cart error ${resp.status}`);
    const data = await resp.json();
    if (!data || !data.payload) throw new Error('Respuesta sin payload');

    res.render('cart', { cart: data.payload, cid: req.params.cid });
  } catch (e) {
    console.error('Error cargando /carts/:cid:', e);
    res.render('cart', { cart: { products: [] }, cid: req.params.cid, error: e.message });
  }
});

export default router;
