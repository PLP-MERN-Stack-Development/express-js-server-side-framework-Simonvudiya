// routes/products.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const productsDB = require('../data/products');
const asyncHandler = require('../utils/asyncHandler');
const validateProduct = require('../middleware/validate');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

/**
 * GET /api/products
 * supports:
 *  - filter by category: ?category=electronics
 *  - search by name: ?search=phone
 *  - pagination: ?page=1&limit=10 (page starts at 1)
 */
router.get('/', asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;
  let items = productsDB.getAll();

  if (category) {
    items = items.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(p => p.name.toLowerCase().includes(q));
  }

  // Pagination
  const pageNum = Math.max(parseInt(page, 10), 1);
  const lim = Math.max(parseInt(limit, 10), 1);
  const start = (pageNum - 1) * lim;
  const end = start + lim;
  const paged = items.slice(start, end);

  res.json({
    meta: {
      total: items.length,
      page: pageNum,
      limit: lim
    },
    data: paged
  });
}));

/**
 * GET /api/products/:id
 */
router.get('/:id', asyncHandler(async (req, res, next) => {
  const prod = productsDB.getById(req.params.id);
  if (!prod) throw new NotFoundError('Product not found');
  res.json(prod);
}));

/**
 * POST /api/products
 */
router.post('/', validateProduct, asyncHandler(async (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock: Boolean(inStock)
  };
  productsDB.create(newProduct);
  res.status(201).json(newProduct);
}));

/**
 * PUT /api/products/:id
 */
router.put('/:id', validateProduct, asyncHandler(async (req, res) => {
  const update = req.body;
  const updated = productsDB.update(req.params.id, update);
  if (!updated) throw new NotFoundError('Product to update not found');
  res.json(updated);
}));

/**
 * DELETE /api/products/:id
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const removed = productsDB.remove(req.params.id);
  if (!removed) throw new NotFoundError('Product to delete not found');
  res.status(204).send();
}));

/**
 * GET /api/products/stats
 * Returns count by category
 */
router.get('/stats', asyncHandler(async (req, res) => {
  const items = productsDB.getAll();
  const counts = items.reduce((acc, p) => {
    const cat = p.category || 'uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  res.json({ total: items.length, counts });
}));

module.exports = router;
