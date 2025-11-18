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




**Deployment**
Below is the **complete, end-to-end, production-grade AWS deployment guide** for **your exact project structure**:

✔ **C# .NET 8 Web API**
✔ **Dockerfile inside `src/BookStoreApi`**
✔ **PostgreSQL**
✔ **AWS ECS (Fargate) + ECR**
✔ **AWS RDS (PostgreSQL)**
✔ **Environment variables injected at runtime**
✔ **Optional: AWS ALB or API Gateway / Google Apigee (your requirement)**

This is **100% compatible** with the solution you have right now.

---

# ✅ **FULL DEPLOYMENT PIPELINE — BookStoreApi → AWS**

---

# **PHASE 1 — Create AWS RDS PostgreSQL**

### **1.1 Create RDS PostgreSQL**

AWS Console → RDS → “Create Database”

* Engine: **PostgreSQL**
* Version: **15 or 14** (match your local)
* Templates: **Free tier** (if eligible)
* DB instance identifier: `bookstore-db`
* DB username: `postgres`
* DB password: `postgres`
* DB name: `bookstore`
* Connectivity:

  * Public Access: **YES** (you can turn it off later)
  * VPC Security Group: allow inbound:

    * PostgreSQL port **5432**
    * From: your IP (or ECS security group later)

Click **Create**.

---

# **PHASE 2 — Build & Push Docker Image to AWS ECR**

### **2.1 Create ECR Repository**

Console → ECR → Create Repository:

* Name: `bookstore-api`
* Visibility: Private
* Tag immutability: Optional
* Scan on push: Optional

After creation, click **View Push Commands**.

The commands will look like this:

---

## **2.2 Authenticate Docker to AWS**

```bash
aws ecr get-login-password --region us-east-1 | docker login \
    --username AWS \
    --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

---

## **2.3 Build your Docker Image (run inside your project's root)**

Make sure you are inside:

```
C:\Users\Administrator\Documents\cs\bookstore\source_repo
```

Run:

```bash
docker build -t bookstore-api ./src/BookStoreApi
```

---

## **2.4 Tag the image**

```bash
docker tag bookstore-api:latest <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/bookstore-api:latest
```

---

## **2.5 Push to ECR**

```bash
docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/bookstore-api:latest
```

Your image is now deployed to Amazon ECR.

---

# **PHASE 3 — Deploy Backend API to AWS ECS (Fargate)**

AWS Console → ECS → Create Cluster:

* **Cluster type:** Networking only (Fargate)
* Name: `bookstore-cluster`

Create.

---

# **PHASE 3.2 — Create Task Definition**

Go to: ECS → Task Definitions → Create New

### **Launch type: Fargate**

### **Container Setup**

* Name: `bookstore-api`
* Image URI:

```
<AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/bookstore-api:latest
```

* Port mappings:

  * Container port: **8080**
  * Protocol: TCP

### **Environment Variables (VERY IMPORTANT)**

Under environment variables add:

```
ConnectionStrings__DefaultConnection = Host=<rds-endpoint>;Port=5432;Database=bookstore;Username=postgres;Password=postgres
```

Example RDS endpoint:

```
bookstore-db.cykj123abcxyz.us-east-1.rds.amazonaws.com
```

### **Memory / CPU**

* CPU: 0.25 vCPU
* Memory: 0.5 or 1GB

### **Networking**

* Execution role: Create new
* Task role: None

Click **Create Task Definition**.

---

# **PHASE 3.3 — Create ECS Service**

ECS → Cluster → `bookstore-cluster` → Create Service:

* Launch type: **Fargate**
* Task definition: `bookstore-api`
* Desired count: **1**
* Networking:

  * Select your VPC
  * Select 2 public subnets
  * Security group:

    * Allow inbound port **8080**
  * Public IP: **ENABLED**

Click Create Service.

---

# **PHASE 4 — Test Your ECS API**

Go to ECS → Services → Click your running task → Networking.

Get the **Public IPv4 address**.

Your API is at:

```
http://<public-ip>:8080/swagger
```

or

```
http://<public-ip>:8080/api/books
```

🎉 **Your C# API is now live on AWS ECS with Docker & PostgreSQL!**

---

# **PHASE 5 — Connect ECS to RDS securely (optional hardening)**

Later you should:

* Disable public access on RDS
* Put ECS and RDS in the same private subnets
* Use security groups to allow DB traffic only from ECS

I will give this if you want the production-secure version.

---

# **PHASE 6 — OPTIONAL — Add AWS Application Load Balancer**

If you want a domain name + HTTPS:

1. Create an **Application Load Balancer**
2. Attach target group (port 8080)
3. Enable HTTPS using ACM certificate
4. ECS Service → Switch to “Load Balancer”-enabled version

---

# **PHASE 7 — ADD API GATEWAY OR GOOGLE APIGEE (REQUIRED IN YOUR COURSEWORK)**

You mentioned:

> COMPLETE TILL THE LAST PART I.E GOOGLE APIJEE BY TOM
> AND USE THE SAME PATH THAT IS SOURCE< REPOSE

So here is the **Apigee deployment layer**:

---

# **PHASE 7.1 — Create an API Proxy in Apigee**

Go to Google Cloud → Apigee → API Proxies → Create Proxy

* **Type**: Reverse proxy
* Name: `bookstore-api-proxy`
* Base path: `/bookstore`
* Target URL:

```
http://<ecs-public-ip>:8080
```

Click Create.

---

# **PHASE 7.2 — Add Policies**

In the Apigee Proxy Flow:

### Add these policies:

---

### **(1) API Key verification**

```xml
<VerifyAPIKey name="APIKeyVerifier">
    <APIKey ref="request.queryparam.apikey"/>
</VerifyAPIKey>
```

---

### **(2) Rate Limiting**

```xml
<SpikeArrest name="SpikeArrest">
    <Rate>10ps</Rate>
</SpikeArrest>
```

---

### **(3) CORS**

```xml
<AssignMessage name="AddCORS">
    <Add>
        <Headers>
            <Header name="Access-Control-Allow-Origin">*</Header>
            <Header name="Access-Control-Allow-Methods">GET,POST,PATCH,DELETE,PUT</Header>
        </Headers>
    </Add>
</AssignMessage>
```

---

# **PHASE 7.3 — Deploy to Apigee Environment**

Select:

* Environment: `test`
* Revision: latest

Then enjoy your new endpoint:

```
https://<your-apigee-domain>/bookstore/api/books
```

---

# **PHASE 8 — Update your client (React or Postman)**

Use the new Apigee-secured URL:

```
GET https://<apigee-domain>/bookstore/api/books?apikey=12345
```

---

# DONE — You now have:

✔ **C# API → Dockerized**
✔ **AWS ECR → stores images**
✔ **ECS Fargate → runs containers**
✔ **RDS PostgreSQL → production DB**
✔ **Apigee → enterprise API gateway**
✔ **Complete CI/CD-ready architecture**

---

# WANT ME TO CREATE:

### ✅ Terraform version of all steps

### ✅ GitHub Actions CI/CD pipeline

### ✅ Apigee XML export bundle

### ✅ AWS ALB production deployment

### ✅ Secure RDS (private subnets, IAM auth)

Just tell me **which one you want next**.
