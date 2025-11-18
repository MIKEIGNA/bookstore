const db = require('../db');

const AuthorRepository = {
  async getAll() {
    const res = await db.query('SELECT * FROM authors ORDER BY id');
    return res.rows;
  },
  async getById(id) {
    const res = await db.query('SELECT * FROM authors WHERE id=$1', [id]);
    return res.rows[0];
  },
  async create(author) {
    const res = await db.query(
      'INSERT INTO authors(name, bio) VALUES($1,$2) RETURNING *',
      [author.name, author.bio]
    );
    return res.rows[0];
  },
  async replace(id, author) {
    const res = await db.query(
      'UPDATE authors SET name=$1, bio=$2 WHERE id=$3 RETURNING *',
      [author.name, author.bio, id]
    );
    return res.rows[0];
  },
  async update(id, partial) {
    const keys = Object.keys(partial);
    if(keys.length===0) return this.getById(id);
    const sets = keys.map((k,i)=>`${k}=$${i+1}`).join(',');
    const vals = keys.map(k=>partial[k]);
    vals.push(id);
    const res = await db.query(`UPDATE authors SET ${sets} WHERE id=$${vals.length} RETURNING *`, vals);
    return res.rows[0];
  },
  async delete(id) {
    await db.query('DELETE FROM authors WHERE id=$1', [id]);
    return { deleted: true };
  }
};

module.exports = AuthorRepository;
