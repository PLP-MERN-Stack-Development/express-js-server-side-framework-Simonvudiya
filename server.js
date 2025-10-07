// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json()); // Task: parse JSON bodies
app.use(logger);            // custom logger middleware

// Hello world root
app.get('/', (req, res) => res.send('Hello, Express!'));

// Protect API routes with API key middleware (applies to all /api routes)
app.use('/api', auth);

// Routes
app.use('/api/products', productsRouter);

// 404 handler for unknown routes
app.use((req, res, next) => {
  const err = new (require('./errors/NotFoundError'))(`Route ${req.method} ${req.originalUrl} not found`);
  next(err);
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
