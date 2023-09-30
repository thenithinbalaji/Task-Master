# API Routes

## User Routes

### Signup

- **POST** `/signup`
  - Sign up a new user.

### Login

- **POST** `/login`
  - Log in an existing user.

## Authenticated Routes

All routes below require authentication using the appropriate middleware.

### Validate User

- **GET** `/validate`
  - Fetches info about the currently logged in user.

### Logout

- **POST** `/logout`
  - Log out the user.

### Delete Account

- **POST** `/deleteme`
  - Delete the user's account.

### Project Routes

#### Fetch Projects

- **GET** `/projects`
  - Fetch a list of projects.

#### Fetch Project by ID

- **GET** `/projects/:pid`
  - Fetch a specific project by its ID.

#### Update Project

- **PATCH** `/projects/:pid`
  - Update a project.

#### Create Project

- **POST** `/projects`
  - Create a new project.

#### Delete Project

- **DELETE** `/projects/:pid`
  - Delete a project.

### Task Routes

#### Fetch Tasks

- **GET** `/projects/:pid/tasks`
  - Fetch tasks within a project.

#### Create Task

- **POST** `/projects/:pid/tasks`
  - Create a new task within a project.

#### Fetch Task by ID

- **GET** `/projects/:pid/tasks/:tid`
  - Fetch a specific task by its ID.

#### Update Task

- **PATCH** `/projects/:pid/tasks/:tid`
  - Update a task within a project.

#### Delete Task

- **DELETE** `/projects/:pid/tasks/:tid`
  - Delete a task within a project.

#### Complete Task

- **PATCH** `/projects/:pid/tasks/:tid/complete`
  - Mark a task as completed.

#### Uncomplete Task

- **PATCH** `/projects/:pid/tasks/:tid/uncomplete`
  - Mark a task as incomplete.

#### CSV Upload Tasks

- **POST** `/projects/:pid/tasks/csv`
  - Upload tasks in CSV format.

#### CSV Download Tasks

- **GET** `/projects/:pid/tasks/csv`
  - Download tasks in CSV format.

### Information Routes

#### Fetch Colleagues

- **GET** `/users`
  - Fetches all colleagues.

#### Fetch Group Info

- **GET** `/groupinfo`
  - Fetch information about the user's group.

Please note that the above routes are defined in the codebase and may require appropriate authentication and authorization to access them.
