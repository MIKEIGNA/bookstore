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
3. Seed the database (no psql required):
   # From repo root
   (cd backend && npm install && npm run seed)
4. Backend will be available at http://localhost:4000 (API base /api)
5. Frontend available at http://localhost:5173
6. Import postman/bookstore.postman_collection.json into Postman and set {{base}} to http://localhost:4000/api

## Notes
- Copy backend/.env.example to backend/.env for custom env settings if running outside docker-compose
- The included SQL file creates tables and inserts 10 rows per table (authors, books, orders)

## Production (ECR/ECS one-off task + Apigee)
- Terraform IaC is provided under `infra/terraform` (ECR, ECS cluster, IAM roles, logs). See `infra/README.md`.
- Create an RDS Postgres and put its connection string into GitHub secret `DATABASE_URL`.
- Set GitHub secrets: `AWS_ROLE_TO_ASSUME`, `AWS_REGION`, `ECR_REPOSITORY`, `ECS_CLUSTER`, `ECS_TASK_FAMILY`, `ECS_EXECUTION_ROLE_ARN`, `ECS_TASK_ROLE_ARN`, `SUBNET_IDS`, `SECURITY_GROUP_IDS`, `DATABASE_URL`.
- Run the workflow: GitHub Actions > `infra-terraform` (apply) to provision, then `deploy-backend-to-ecs-task` (provide `image_tag`).
- After the task starts, note the task Public IP and verify `/health`.
- Apigee: proxy bundle in `apigee/`. Import, set base path `/bookstore/api`, update TargetEndpoint URL to your task IP, add Verify API Key (already included), create a Product and two Developer Apps, then use `x-api-key`.
- Client: set `VITE_API_BASE` to the Apigee URL and `VITE_API_KEY` to the issued key.

## Diagrams
See `docs/architecture.md` for architecture and ERD diagrams.
