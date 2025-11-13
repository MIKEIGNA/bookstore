require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/db');
const booksRouter = require('./src/controllers/booksController');
const authorsRouter = require('./src/controllers/authorsController');
const ordersRouter = require('./src/controllers/ordersController');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/books', booksRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/orders', ordersRouter);

app.get('/health', (req,res)=>res.json({status:'ok'}));

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
