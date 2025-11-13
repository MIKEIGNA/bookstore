# BookStore Full Project (Node + Express + Postgres + React (Vite))

## What is included
- backend/ : Express API with 3 controllers (books, authors, orders), repository pattern, DTOs, mappers, Dockerfile, SQL seed file
- frontend/ : Vite + React app that demonstrates all 6 HTTP actions for books; Dockerfile included
- docker-compose.yml : brings up Postgres, backend, and frontend for local demo
- postman/ : Postman collection with sample requests

## Quick start (local demo)
1. Ensure Docker and Docker Compose are installed.
2. From repository root run:
   docker-compose up --build
3. Wait for Postgres to initialize, then seed the database:
   # Option A: from host (requires psql client)
   psql postgresql://postgres:postgres@localhost:5432/bookstore -f backend/sql/init.sql
   # Option B: exec into container
   docker exec -it $(docker ps -q -f ancestor=postgres:15-alpine) psql -U postgres -d bookstore -f /var/lib/postgresql/data/init.sql
4. Backend will be available at http://localhost:4000 (API base /api)
5. Frontend available at http://localhost:5173
6. Import postman/bookstore.postman_collection.json into Postman and set {{base}} to http://localhost:4000/api

## Notes
- Copy backend/.env.example to backend/.env for custom env settings if running outside docker-compose
- The included SQL file creates tables and inserts 10 rows per table (authors, books, orders)
