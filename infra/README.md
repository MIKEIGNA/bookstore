# Infrastructure (Terraform)

This Terraform stack provisions:
- ECR repository for the backend image
- ECS cluster (Fargate-ready)
- IAM roles for ECS task execution and task role
- CloudWatch Log Group for container logs

It intentionally does NOT create a VPC/subnets/SGs. Use existing networking when running your task (via GitHub Actions workflow or CLI).

## Usage
1. Ensure AWS credentials allow you to create IAM, ECR, ECS, and CloudWatch Logs resources.
2. Copy variables example and edit as needed:
   ```bash
   cp infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars
   ```
3. Init/apply:
   ```bash
   cd infra/terraform
   terraform init
   terraform plan
   terraform apply
   ```
4. Outputs will provide ARNs/URLs referenced by the GitHub Actions workflow.