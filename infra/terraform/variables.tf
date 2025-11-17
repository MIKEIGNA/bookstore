variable "project_name" {
  type    = string
  default = "bookstore"
}

variable "region" {
  type        = string
  description = "AWS region"
}

variable "ecr_repo_name" {
  type    = string
  default = "bookstore-api"
}

variable "cluster_name" {
  type    = string
  default = "bookstore-cluster"
}

variable "logs_group" {
  type    = string
  default = "/ecs/bookstore-api"
}