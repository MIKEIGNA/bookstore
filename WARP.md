# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Essential commands

- Start full stack with Docker Compose (backend, frontend, Postgres)
  - docker-compose up --build
- Seed the database (two options)
  - Host (requires DATABASE_URL reachable from host):
    - (cd backend && npm install && npm run seed)
  - Inside the backend container (uses service networking):
    - docker-compose exec backend node scripts/seed.js
- Backend (Node/Express)
  - Dev (nodemon): (cd backend && npm install && npm run dev)
  - Start: (cd backend && npm start)
  - Lint: (cd backend && npm run lint)
  - Migrate via psql: (cd backend && npm run migrate)  # requires psql and DATABASE_URL
- Frontend (Vite/React)
  - Dev: (cd frontend && npm install && npm run dev)
  - Build: (cd frontend && npm run build)
  - Preview build: (cd frontend && npm run preview)
- Health checks
  - Backend liveness: curl http://localhost:4000/health
  - Backend readiness (DB ping): curl http://localhost:4000/ready
- Postman collection
  - Import postman/bookstore.postman_collection.json and set {{base}} to http://localhost:4000/api

Notes
- No test framework or scripts are configured in this repo as-is.

## Architecture overview

High level
- A simple bookstore system split into:
  - backend/ — Express API for Books, Authors, Orders backed by PostgreSQL
  - frontend/ — Vite + React demo client exercising CRUD across all three resources
  - docker-compose.yml orchestrates Postgres + backend + frontend for local demo

Backend (Express + pg)
- Entrypoint: backend/index.js
  - Middleware: helmet, cors (CORS_ORIGIN), morgan, bodyParser.json
  - Health endpoints: GET /health (liveness), GET /ready (queries DB)
  - API mounts: /api/books, /api/authors, /api/orders
  - Error handling: src/middleware/error.js provides notFound and errorHandler applied last
- Data access
  - src/db.js wraps pg Pool; connection via DATABASE_URL (default local fallback)
  - Repository pattern per resource: src/repositories/*Repository.js encapsulate SQL
  - DTOs and mappers: src/dtos/*Dtos.js define Create/Update/Read DTOs; src/mappers/*Mapper.js map DB rows to outbound DTOs
- Request validation
  - Controllers (src/controllers/*Controller.js) validate inputs with Joi
  - Typical flow: Controller (Joi) -> Repository (SQL) -> Mapper -> DTO response
- Database
  - backend/sql/init.sql creates tables, indexes, and seeds 10 rows per table
  - Seeding is executed by backend/scripts/seed.js (Node + pg), using DATABASE_URL

Frontend (Vite + React)
- Entrypoint: frontend/src/main.jsx; app: frontend/src/App.jsx
- API integration
  - API base: VITE_API_BASE (defaults to http://localhost:4000/api)
  - Optional VITE_API_KEY appended as x-api-key header (for Apigee-protected deployments)
  - Demonstrates all 6 HTTP actions (GET list, GET by id, POST, PUT, PATCH, DELETE) for Books, Authors, Orders

Containers and orchestration
- docker-compose.yml
  - postgres:15-alpine exposed on 5432
  - backend service exposes 4000, env DATABASE_URL uses service DNS (postgres)
  - frontend service serves on 5173 with VITE_API_BASE pointing to backend
- Dockerfiles
  - backend/Dockerfile: node:18-alpine, npm install --production, runs index.js
  - frontend/Dockerfile: multi-stage (build with Vite, serve static with "serve" on 5173)

## Environment

Backend
- DATABASE_URL: Postgres connection string
- PORT: default 4000
- CORS_ORIGIN: default "*"
- NODE_ENV: affects morgan format
- Example file: backend/.env.example

Frontend
- VITE_API_BASE: API base URL (e.g., http://localhost:4000/api)
- VITE_API_KEY: optional API key header x-api-key (used when fronting API with Apigee)

## Pointers from README
- Quick start relies on docker-compose up --build, then database seed
- Postman collection expects {{base}} to be http://localhost:4000/api
