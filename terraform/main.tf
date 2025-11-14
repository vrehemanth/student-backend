# ----------------------------
# Terraform Provider Settings
# ----------------------------

terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }

  required_version = ">= 1.0"
}

provider "docker" {}

# ----------------------------
# Pull your Docker image
# ----------------------------

resource "docker_image" "student_backend" {
  name         = "vrehemanth/student-backend:latest"
  keep_locally = true
}

# ----------------------------
# Run Container
# ----------------------------

resource "docker_container" "student_backend_container" {
  name  = "student-backend-tf"
  image = docker_image.student_backend.image_id

  ports {
    internal = 3000   # container port
    external = 4000   # host port
  }
}
