const db = require('../db');

const OrderRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM orders ORDER BY id');
    return res.rows;
  },
  async getById(id) {
    const res = await db.query('SELECT * FROM orders WHERE id=$1', [id]);
    return res.rows[0];
  },
  async create(order) {
    const res = await db.query(
      'INSERT INTO orders(book_id, quantity, total_price, customer_name) VALUES($1,$2,$3,$4) RETURNING *',
      [order.book_id, order.quantity, order.total_price, order.customer_name]
    );
    return res.rows[0];
  },
  async replace(id, order) {
    const res = await db.query(
      'UPDATE orders SET book_id=$1, quantity=$2, total_price=$3, customer_name=$4 WHERE id=$5 RETURNING *',
      [order.book_id, order.quantity, order.total_price, order.customer_name, id]
    );
    return res.rows[0];
  },
  async update(id, partial) {
    const keys = Object.keys(partial);
    if(keys.length===0) return this.getById(id);
    const sets = keys.map((k,i)=>`${k}=$${i+1}`).join(',');
    const vals = keys.map(k=>partial[k]);
    vals.push(id);
    const res = await db.query(`UPDATE orders SET ${sets} WHERE id=$${vals.length} RETURNING *`, vals);
    return res.rows[0];
  },
  async delete(id) {
    await db.query('DELETE FROM orders WHERE id=$1', [id]);
    return { deleted: true };
  }
};

module.exports = OrderRepository;
