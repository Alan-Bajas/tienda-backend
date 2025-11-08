import { Product } from '../models/product.model.js';

const buildFilter = (query) => {
  if (!query) return {};
  const [k, v] = String(query).split(':');
  if (k === 'category' && v) return { category: v };
  if (k === 'availability') return v === 'true' ? { stock: { $gt: 0 } } : {};
  return { $text: { $search: query } };
};

export const getProducts = async (req, res, next) => {
  try {
    const limit = Math.max(parseInt(req.query.limit || '10'), 1);
    const page  = Math.max(parseInt(req.query.page  || '1'), 1);
    const sortParam = req.query.sort; // asc | desc
    const queryParam = req.query.query;

    const filter = buildFilter(queryParam);
    const sort = {};
    if (sortParam === 'asc')  sort.price = 1;
    if (sortParam === 'desc') sort.price = -1;

    const totalDocs = await Product.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalDocs / limit), 1);
    const safePage = Math.min(page, totalPages);
    const skip = (safePage - 1) * limit;

    const payload = await Product.find(filter).sort(sort).skip(skip).limit(limit).lean();

    const hasPrevPage = safePage > 1;
    const hasNextPage = safePage < totalPages;

    const base = `${req.protocol}://${req.get('host')}${req.baseUrl || '/api/products'}`;
    const qs = new URLSearchParams(req.query);
    qs.set('page', String(safePage - 1));
    const prevLink = hasPrevPage ? `${base}?${qs.toString()}` : null;
    qs.set('page', String(safePage + 1));
    const nextLink = hasNextPage ? `${base}?${qs.toString()}` : null;

    res.json({
      status: 'success',
      payload,
      totalPages,
      prevPage: hasPrevPage ? safePage - 1 : null,
      nextPage: hasNextPage ? safePage + 1 : null,
      page: safePage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    });
  } catch (e) { next(e); }
};
