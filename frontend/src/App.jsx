import React, { useEffect, useState } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
export default function App() {
  const [books, setBooks] = useState([]);
  const [created, setCreated] = useState(null);
  useEffect(()=> { fetchBooks(); }, []);
  async function fetchBooks(){ const res = await fetch(`${API_BASE}/books`); const data = await res.json(); setBooks(data); }
  async function getById(id){ const r = await fetch(`${API_BASE}/books/${id}`); alert(JSON.stringify(await r.json(), null, 2)); }
  async function createBook(){ const payload = { title: 'New Book '+Date.now(), author_id:1, isbn:'ISBND'+Date.now(), price:5.5, published_date:'2025-01-01' }; const r = await fetch(`${API_BASE}/books`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }); const j = await r.json(); setCreated(j); await fetchBooks(); }
  async function replaceBook(id){ const payload = { title: 'Replaced Title', author_id:1, isbn:'REPL-'+id, price:99.9, published_date:'2020-01-01' }; await fetch(`${API_BASE}/books/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }); await fetchBooks(); }
  async function patchBook(id){ const payload = { price: 1.23 }; await fetch(`${API_BASE}/books/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }); await fetchBooks(); }
  async function deleteBook(id){ await fetch(`${API_BASE}/books/${id}`, { method:'DELETE' }); await fetchBooks(); }
  return (<div className="container">
    <h1>BookStore Client (React + Vite)</h1>
    <div className="controls">
      <button onClick={fetchBooks}>Refresh Books</button>
      <button onClick={createBook}>Create Book (POST)</button>
    </div>
    <div className="list">
      <h2>Books ({books.length})</h2>
      <ul>{books.map(b=>(
        <li key={b.id}>
          <div className="row"><strong>{b.title}</strong> — ${b.price} — ISBN: {b.isbn}</div>
          <div className="actions">
            <button onClick={()=>getById(b.id)}>GET by ID</button>
            <button onClick={()=>replaceBook(b.id)}>PUT</button>
            <button onClick={()=>patchBook(b.id)}>PATCH</button>
            <button onClick={()=>deleteBook(b.id)}>DELETE</button>
          </div>
        </li>
      ))}</ul>
      {created && <pre>Last created: {JSON.stringify(created,null,2)}</pre>}
    </div>
  </div>);
}
