output "ecr_repository_url" { value = aws_ecr_repository.api.repository_url }
output "ecr_repository_arn" { value = aws_ecr_repository.api.arn }
output "ecs_cluster_arn" { value = aws_ecs_cluster.this.arn }
output "ecs_task_execution_role_arn" { value = aws_iam_role.ecs_task_execution.arn }
output "ecs_task_role_arn" { value = aws_iam_role.ecs_task.arn }
output "log_group_name" { value = aws_cloudwatch_log_group.ecs.name }