// middleware/validate.js
const ValidationError = require('../errors/ValidationError');

function isString(v) { return typeof v === 'string' && v.trim().length > 0; }
function isNumber(v) { return typeof v === 'number' && Number.isFinite(v); }
function isBoolean(v) { return typeof v === 'boolean' || v === 'true' || v === 'false'; }

module.exports = (req, res, next) => {
  const method = req.method;
  const body = req.body || {};

  // For POST require required fields
  if (method === 'POST') {
    const errors = [];
    if (!isString(body.name)) errors.push('name (non-empty string) is required');
    if (!('description' in body) || !isString(String(body.description))) errors.push('description (string) is required');
    if (!('price' in body) || !isNumber(Number(body.price))) errors.push('price (number) is required');
    if (!('category' in body) || !isString(body.category)) errors.push('category (string) is required');
    if (!('inStock' in body)) errors.push('inStock (boolean) is required');

    if (errors.length) return next(new ValidationError(errors.join('; ')));
    // coerce types
    body.price = Number(body.price);
    body.inStock = (body.inStock === true || body.inStock === 'true');
    req.body = body;
    return next();
  }

  // For PUT allow partial updates but if present validate types
  if (method === 'PUT') {
    const errors = [];
    if ('name' in body && !isString(body.name)) errors.push('name must be a non-empty string');
    if ('description' in body && !isString(String(body.description))) errors.push('description must be a string');
    if ('price' in body && !isNumber(Number(body.price))) errors.push('price must be a number');
    if ('category' in body && !isString(body.category)) errors.push('category must be a string');
    if ('inStock' in body && !isBoolean(body.inStock)) errors.push('inStock must be boolean');

    if (errors.length) return next(new ValidationError(errors.join('; ')));

    if ('price' in body) body.price = Number(body.price);
    if ('inStock' in body) body.inStock = (body.inStock === true || body.inStock === 'true');

    req.body = body;
    return next();
  }

  // other methods skip
  next();
};
