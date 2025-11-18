const db = require('../db');

const BookRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM books ORDER BY id');
    return res.rows;
  },
  async getById(id) {
    const res = await db.query('SELECT * FROM books WHERE id=$1', [id]);
    return res.rows[0];
  },
  async create(book) {
    const res = await db.query(
      'INSERT INTO books(title, author_id, isbn, price, published_date) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [book.title, book.author_id, book.isbn, book.price, book.published_date]
    );
    return res.rows[0];
  },
  async replace(id, book) {
    const res = await db.query(
      'UPDATE books SET title=$1, author_id=$2, isbn=$3, price=$4, published_date=$5 WHERE id=$6 RETURNING *',
      [book.title, book.author_id, book.isbn, book.price, book.published_date, id]
    );
    return res.rows[0];
  },
  async update(id, partial) {
    const keys = Object.keys(partial);
    if(keys.length===0) return this.getById(id);
    const sets = keys.map((k,i)=>`${k}=$${i+1}`).join(',');
    const vals = keys.map(k=>partial[k]);
    vals.push(id);
    const res = await db.query(`UPDATE books SET ${sets} WHERE id=$${vals.length} RETURNING *`, vals);
    return res.rows[0];
  },
  async delete(id) {
    await db.query('DELETE FROM books WHERE id=$1', [id]);
    return { deleted: true };
  }
};

module.exports = BookRepository;
