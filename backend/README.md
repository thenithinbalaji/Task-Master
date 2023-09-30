# Getting Started with Backend

Backend was made using Go - Gin, Gorm and Postgres.

## Available Scripts

In the project directory, you can run:

```bash
go run main.go
```

Runs the backend in [http://localhost:8080](http://localhost:8080).

## Available Endpoints

Refer to [ROUTES.md](ROUTES.md) for the available endpoints.

## Data Retention Policy

The following data retention policy is followed in the application:

- Deleting a project will soft delete the project.
- Deleting a task will hard delete the task.
- Soft deleting a project will hard delete all the tasks associated with it.
- Deleting a user will
  - soft delete the user
  - soft delete the projects associated with the user.

## Environment Variables

In the project directory, you can create a `.env` file to set the environment variables:

```env
PORT = 8080
GIN_MODE = "release"

# postgres connection
DB_HOST = ""
DB_PORT = 
DB_NAME = ""
DB_USER = ""
DB_PASSWORD = ""

JWT_SECRET = "" # can be anything
```
