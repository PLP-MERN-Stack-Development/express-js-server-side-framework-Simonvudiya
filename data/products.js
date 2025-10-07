// data/products.js
// Simple in-memory "database"
const { v4: uuidv4 } = require('uuid');

let products = [
  {
    id: uuidv4(),
    name: "Example Product A",
    description: "Sample desc A",
    price: 9.99,
    category: "electronics",
    inStock: true
  },
  {
    id: uuidv4(),
    name: "Example Product B",
    description: "Sample desc B",
    price: 19.99,
    category: "books",
    inStock: false
  }
];

module.exports = {
  getAll: () => products,
  getById: (id) => products.find(p => p.id === id),
  create: (product) => {
    products.push(product);
    return product;
  },
  update: (id, data) => {
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...data };
    return products[idx];
  },
  remove: (id) => {
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    products.splice(idx, 1);
    return true;
  },
  reset: (newList) => { products = newList; } // for tests
};
