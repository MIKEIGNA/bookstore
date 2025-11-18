require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./src/db');
const booksRouter = require('./src/controllers/booksController');
const authorsRouter = require('./src/controllers/authorsController');
const ordersRouter = require('./src/controllers/ordersController');
const { notFound, errorHandler } = require('./src/middleware/error');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*'}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(bodyParser.json());

app.get('/', (req,res)=>res.json({ name: 'bookstore-api', version: '1.0.0' }));
app.get('/health', (req,res)=>res.json({status:'ok'}));
app.get('/ready', async (req,res)=>{
  try { await db.query('SELECT 1'); res.json({ ready: true }); }
  catch (e) { res.status(503).json({ ready: false, error: e.message }); }
});

app.use('/api/books', booksRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/orders', ordersRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, async () => {
  console.log(`BookStore API listening on port ${PORT}`);
  try {
    await db.init();
    console.log('DB initialized (pool ready)');
  } catch (err) {
    console.error('DB init error:', err.message);
  }
});

process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(()=> process.exit(0));
});
