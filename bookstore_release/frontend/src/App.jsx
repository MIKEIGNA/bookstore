import React, { useEffect, useState } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
const API_KEY = import.meta.env.VITE_API_KEY; // for Apigee "Verify API Key"

async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (API_KEY) headers['x-api-key'] = API_KEY;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  return res;
}

export default function App() {
  const [books, setBooks] = useState([]);
  const [createdBook, setCreatedBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(()=> { fetchBooks(); fetchAuthors(); fetchOrders(); }, []);

  // Books
  async function fetchBooks(){ const res = await apiFetch('/books'); const data = await res.json(); setBooks(data); }
  async function getBookById(id){ const r = await apiFetch(`/books/${id}`); alert(JSON.stringify(await r.json(), null, 2)); }
  async function createBook(){ const payload = { title: 'New Book '+Date.now(), author_id:1, isbn:'ISBND'+Date.now(), price:5.5, published_date:'2025-01-01' }; const r = await apiFetch('/books', { method:'POST', body: JSON.stringify(payload) }); const j = await r.json(); setCreatedBook(j); await fetchBooks(); }
  async function replaceBook(id){ const payload = { title: 'Replaced Title', author_id:1, isbn:'REPL-'+id, price:99.9, published_date:'2020-01-01' }; await apiFetch(`/books/${id}`, { method:'PUT', body: JSON.stringify(payload) }); await fetchBooks(); }
  async function patchBook(id){ const payload = { price: 1.23 }; await apiFetch(`/books/${id}`, { method:'PATCH', body: JSON.stringify(payload) }); await fetchBooks(); }
  async function deleteBook(id){ await apiFetch(`/books/${id}`, { method:'DELETE' }); await fetchBooks(); }

  // Authors
  async function fetchAuthors(){ const res = await apiFetch('/authors'); setAuthors(await res.json()); }
  async function getAuthorById(id){ const r = await apiFetch(`/authors/${id}`); alert(JSON.stringify(await r.json(), null, 2)); }
  async function createAuthor(){ const payload = { name: 'Author '+Date.now(), bio: 'Bio' }; await apiFetch('/authors', { method:'POST', body: JSON.stringify(payload) }); await fetchAuthors(); }
  async function replaceAuthor(id){ const payload = { name: 'Replaced Author', bio: 'New bio' }; await apiFetch(`/authors/${id}`, { method:'PUT', body: JSON.stringify(payload) }); await fetchAuthors(); }
  async function patchAuthor(id){ const payload = { bio: 'Patched bio' }; await apiFetch(`/authors/${id}`, { method:'PATCH', body: JSON.stringify(payload) }); await fetchAuthors(); }
  async function deleteAuthor(id){ await apiFetch(`/authors/${id}`, { method:'DELETE' }); await fetchAuthors(); }

  // Orders
  async function fetchOrders(){ const res = await apiFetch('/orders'); setOrders(await res.json()); }
  async function getOrderById(id){ const r = await apiFetch(`/orders/${id}`); alert(JSON.stringify(await r.json(), null, 2)); }
  async function createOrder(){ const payload = { book_id:1, quantity:1, total_price:9.99, customer_name:'Customer '+Date.now() }; await apiFetch('/orders', { method:'POST', body: JSON.stringify(payload) }); await fetchOrders(); }
  async function replaceOrder(id){ const payload = { book_id:1, quantity:2, total_price:19.98, customer_name:'Replaced' }; await apiFetch(`/orders/${id}`, { method:'PUT', body: JSON.stringify(payload) }); await fetchOrders(); }
  async function patchOrder(id){ const payload = { quantity: 3 }; await apiFetch(`/orders/${id}`, { method:'PATCH', body: JSON.stringify(payload) }); await fetchOrders(); }
  async function deleteOrder(id){ await apiFetch(`/orders/${id}`, { method:'DELETE' }); await fetchOrders(); }

  return (
    <div className="container">
      <h1>BookStore Client (React + Vite)</h1>

      <section className="list">
        <h2>Books ({books.length})</h2>
        <div className="controls">
          <button onClick={fetchBooks}>Refresh</button>
          <button onClick={createBook}>Create (POST)</button>
        </div>
        <ul>{books.map(b=> (
          <li key={b.id}>
            <div className="row"><strong>{b.title}</strong> — ${b.price} — ISBN: {b.isbn}</div>
            <div className="actions">
              <button onClick={()=>getBookById(b.id)}>GET by ID</button>
              <button onClick={()=>replaceBook(b.id)}>PUT</button>
              <button onClick={()=>patchBook(b.id)}>PATCH</button>
              <button onClick={()=>deleteBook(b.id)}>DELETE</button>
            </div>
          </li>
        ))}</ul>
        {createdBook && <pre>Last created book: {JSON.stringify(createdBook,null,2)}</pre>}
      </section>

      <section className="list">
        <h2>Authors ({authors.length})</h2>
        <div className="controls">
          <button onClick={fetchAuthors}>Refresh</button>
          <button onClick={createAuthor}>Create (POST)</button>
        </div>
        <ul>{authors.map(a=> (
          <li key={a.id}>
            <div className="row"><strong>{a.name}</strong> — {a.bio}</div>
            <div className="actions">
              <button onClick={()=>getAuthorById(a.id)}>GET by ID</button>
              <button onClick={()=>replaceAuthor(a.id)}>PUT</button>
              <button onClick={()=>patchAuthor(a.id)}>PATCH</button>
              <button onClick={()=>deleteAuthor(a.id)}>DELETE</button>
            </div>
          </li>
        ))}</ul>
      </section>

      <section className="list">
        <h2>Orders ({orders.length})</h2>
        <div className="controls">
          <button onClick={fetchOrders}>Refresh</button>
          <button onClick={createOrder}>Create (POST)</button>
        </div>
        <ul>{orders.map(o=> (
          <li key={o.id}>
            <div className="row">Book #{o.book_id} — qty {o.quantity} — total ${o.total_price} — {o.customer_name}</div>
            <div className="actions">
              <button onClick={()=>getOrderById(o.id)}>GET by ID</button>
              <button onClick={()=>replaceOrder(o.id)}>PUT</button>
              <button onClick={()=>patchOrder(o.id)}>PATCH</button>
              <button onClick={()=>deleteOrder(o.id)}>DELETE</button>
            </div>
          </li>
        ))}</ul>
      </section>
    </div>
  );
}
