# Persona Assignment Tracker - Full-Stack Case Study

A full-stack assignment tracking app built with React, Express, and Postgres. Demonstrates session-based authentication, role-based student/professor workflows, course enrollment, assignment management, completion tracking, and a Persona 3 Reload-inspired dashboard UI with animated video backgrounds.

## User Stories

**Auth**
- A user can register for an account with a username, email, password, and role
- A user can choose either a student or professor role when registering
- A user can log in to an existing account
- A user can log out
- A returning user with an active session is automatically rehydrated when they revisit the app
- A logged-in user can update their email or password
- A logged-in user can delete their own account

**Students**
- A student can view all available courses
- A student can enroll in a course that has available capacity
- A student can unenroll from a course
- A student can view their enrolled courses
- A student can view assignments from courses they are enrolled in
- A student can mark an assignment as complete
- A student can mark a completed assignment as incomplete
- A student can view professors connected to their courses

**Professors**
- A professor can create a course with a name, description, and max capacity
- A professor can view courses they own
- A professor can edit their own courses
- A professor can delete their own courses
- A professor can create assignments for their own courses
- A professor can edit assignments for their own courses
- A professor can delete assignments for their own courses
- A professor can view students enrolled in their courses
- A professor can view completion status for an assignment

**Dashboard**
- A logged-in user can navigate between courses, assignments, users, and account settings
- The dashboard uses Persona-inspired menu styling and animated background videos
- The UI conditionally renders student or professor actions based on the logged-in user's role

## Schema

```txt
users
─────────────────────────────
user_id       SERIAL PRIMARY KEY
username      TEXT UNIQUE NOT NULL
email         TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL
role          TEXT NOT NULL CHECK (role IN ('student', 'professor'))
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP

courses
─────────────────────────────
course_id     SERIAL PRIMARY KEY
professor_id  INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
course_name   TEXT UNIQUE NOT NULL
description   TEXT
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
max_capacity  INTEGER NOT NULL

enrollments
─────────────────────────────
enrollment_id SERIAL PRIMARY KEY
student_id    INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
course_id     INTEGER NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
UNIQUE(student_id, course_id)

assignments
─────────────────────────────
assignment_id SERIAL PRIMARY KEY
title         TEXT NOT NULL
course_id     INTEGER NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE
description   TEXT
due_date      DATE
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP

assignment_completions
─────────────────────────────
completion_id SERIAL PRIMARY KEY
assignment_id INTEGER NOT NULL REFERENCES assignments(assignment_id) ON DELETE CASCADE
student_id    INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
completed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
UNIQUE(assignment_id, student_id)
```

A professor has many courses. A course has many enrollments and assignments. A student has many enrollments and assignment completions. Deleting a user cascades through their related courses, enrollments, and completions. Deleting a course cascades to its assignments and enrollments.

## API Contract

### Auth endpoints

| Method | Endpoint             | Request Body                         | Response                              |
| ------ | -------------------- | ------------------------------------ | ------------------------------------- |
| POST   | `/api/auth/register` | `{ username, email, password, role }` | `{ user_id, username, email, role }` |
| POST   | `/api/auth/login`    | `{ username, password }`             | `{ user_id, username, email, role }` |
| GET    | `/api/auth/me`       | -                                    | `{ user_id, username, email, role }` or `null` |
| DELETE | `/api/auth/logout`   | -                                    | `{ message }`                         |

### User endpoints

| Method | Endpoint                      | Request Body     | Response |
| ------ | ----------------------------- | ---------------- | -------- |
| GET    | `/api/users`                  | -                | `[{ user_id, username, email, role }]` |
| POST   | `/api/users/role`             | `{ role }`       | `[{ user_id, username, email, role }]` |
| GET    | `/api/users/:user_id/students` | -               | Students enrolled in a professor's courses |
| GET    | `/api/users/:user_id/professors` | -             | Professors connected to a student's enrolled courses |
| PATCH  | `/api/users/:user_id`         | `{ password, email }` | `{ user_id, username, email, role }` |
| DELETE | `/api/users/:user_id`         | -                | `{ user_id, username, email, role }` |

### Course endpoints

| Method | Endpoint                         | Request Body                                  | Response |
| ------ | -------------------------------- | --------------------------------------------- | -------- |
| GET    | `/api/courses`                   | -                                             | All courses with professor name, enrollment count, and enrollment status |
| GET    | `/api/courses/students/:user_id` | -                                             | Courses for the logged-in student |
| GET    | `/api/courses/professors/:user_id` | -                                           | Courses owned by the logged-in professor |
| GET    | `/api/courses/:course_id`        | -                                             | One course |
| POST   | `/api/courses`                   | `{ course_name, description, max_capacity }`  | Created course |
| PATCH  | `/api/courses/:course_id`        | `{ course_name, description, max_capacity }`  | Updated course |
| DELETE | `/api/courses/:course_id`        | -                                             | Deleted course |
| POST   | `/api/courses/:course_id/enroll` | -                                             | `true` |
| DELETE | `/api/courses/:course_id/enroll` | -                                             | `204 No Content` |

### Assignment endpoints

| Method | Endpoint                              | Request Body                                  | Response |
| ------ | ------------------------------------- | --------------------------------------------- | -------- |
| GET    | `/api/assignments/students/:user_id`  | -                                             | Assignments for the logged-in student's enrolled courses |
| GET    | `/api/assignments/professors/:user_id` | -                                            | Assignments for the logged-in professor's courses |
| GET    | `/api/assignments/:assignment_id`     | -                                             | One assignment |
| POST   | `/api/assignments`                    | `{ title, description, due_date, course_id }` | Created assignment |
| PATCH  | `/api/assignments/:assignment_id`     | `{ title, description, due_date }`            | Updated assignment |
| DELETE | `/api/assignments/:assignment_id`     | -                                             | Deleted assignment |
| GET    | `/api/assignments/:assignment_id/status` | -                                          | `[{ user_id, username, completed }]` |
| POST   | `/api/assignments/:assignment_id/complete` | -                                       | `true` |
| DELETE | `/api/assignments/:assignment_id/complete` | -                                      | `204 No Content` |

### Student progress endpoints

| Method | Endpoint                    | Request Body | Response |
| ------ | --------------------------- | ------------ | -------- |
| GET    | `/api/users/:user_id/enrollments` | -      | Courses the logged-in student is enrolled in |
| GET    | `/api/users/:user_id/completions` | -       | Assignments the logged-in student has completed |

## Setup

### 1. Database

Create a local Postgres database:

```sh
createdb assignment_tracker_db
```

### 2. Server

```sh
cd server
npm install
cp .env.template .env
```

Open `.env` and fill in your Postgres credentials and session secret:

```txt
SESSION_SECRET="your-session-secret"
PGHOST='127.0.0.1'
PGPORT=5432
PGDATABASE='assignment_tracker_db'
PGUSER='your-postgres-user'
PGPASSWORD='your-postgres-password'
```

Seed the database:

```sh
node db/seed.js
```

Start the server:

```sh
node index.js
```

The server runs on `http://localhost:8080`.

### 3. Frontend

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. The Vite dev proxy forwards all `/api` requests to the Express server so session cookies work correctly.

## Seed Users

After running `node db/seed.js`, these accounts are available:

| Username | Email | Role | Password |
| -------- | ----- | ---- | -------- |
| mitsuru | mitsuru@gekkan.edu | professor | kirijo123 |
| yukari | yukari@gekkan.edu | student | archer456 |
| junpei | junpei@gekkan.edu | student | ace789 |
| aigis | aigis@gekkan.edu | student | toaster999 |
| akihiko | akihiko@gekkan.edu | professor | boxing321 |

## Seed Data

The seed file creates two courses:

| Course | Professor | Max Capacity |
| ------ | --------- | ------------ |
| Shadow Tactics | mitsuru | 30 |
| Persona Combat Training | akihiko | 20 |

It also creates sample enrollments, assignments, and assignment completion records so both student and professor dashboards have data immediately after seeding.

## Application Structure

```txt
full-stack-project-remix-WilliamJ2006/
├── frontend/                         # React app (Vite)
│   ├── public/
│   │   └── videos/                   # Persona-inspired intro and loop background videos
│   ├── src/
│   │   ├── App.jsx                   # Routes, current user state, session rehydration
│   │   ├── main.jsx                  # React entry point
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Register.jsx          # Register page
│   │   │   └── Dashboard.jsx         # Dashboard view router
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js
│   │   │   ├── user-adapters.js
│   │   │   ├── course-adapters.js
│   │   │   ├── enrollment-adapters.js
│   │   │   ├── assignment-adapters.js
│   │   │   └── assignment-completion-adapters.js
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── NavBar.jsx
│   │   │   ├── BackgroundVideo.jsx
│   │   │   ├── DashboardButtons.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── CreateCourse.jsx
│   │   │   ├── EditCourseForm.jsx
│   │   │   ├── Assignments.jsx
│   │   │   ├── CreateAssignment.jsx
│   │   │   ├── EditAssignmentForm.jsx
│   │   │   ├── UsersList.jsx
│   │   │   └── AccountSettings.jsx
│   │   └── css/                      # Page and component styles
│   └── vite.config.js                # Proxies /api requests to Express in development
└── server/                           # Express + Postgres API
    ├── index.js                      # App entry point, middleware, route definitions
    ├── controllers/
    │   ├── authControllers.js
    │   ├── userControllers.js
    │   ├── courseControllers.js
    │   ├── enrollmentControllers.js
    │   ├── assignmentControllers.js
    │   └── assignmentCompletionsControllers.js
    ├── models/
    │   ├── userModel.js
    │   ├── courseModel.js
    │   ├── enrollmentModel.js
    │   ├── assignmentModel.js
    │   └── assignmentCompletionsModel.js
    ├── middleware/
    │   ├── checkAuthentication.js    # Blocks unauthenticated protected requests
    │   └── logRoutes.js              # Logs each incoming request
    └── db/
        ├── pool.js                   # Postgres connection pool
        └── seed.js                   # Creates tables and inserts sample data
```
