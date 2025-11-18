C# BookStore API (source_repo)

Location: /src/BookStoreApi
Client: /src/BookStoreClient

Quick local demo:
1. docker-compose up --build
2. Seed DB:
   psql postgresql://postgres:postgres@localhost:5432/bookstore -f src/BookStoreApi/sql/init.sql
3. API available at http://localhost:5000/api
4. Run client (dotnet run in src/BookStoreClient)

APIGEE & AWS notes:
- Follow README_DEPLOY.md in src/BookStoreApi for steps to push to ECR, run ECS task, and configure Apigee proxy with Verify API Key.
