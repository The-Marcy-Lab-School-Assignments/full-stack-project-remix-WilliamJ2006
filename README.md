# Persona 3 Reload Inspired Assignment Tracker

## Project Contract

### Project Name

Persona 3 Reload Inspired Assignment Tracker

---

# Project Overview

This project is a full stack web application inspired by the visual style and menu atmosphere of Persona 3 Reload.

The application is an assignment tracking platform that supports both students and professors.

Students can:

- View enrolled courses
- Track assignments
- Mark assignments as completed
- View assignment due dates
- Navigate a Persona-inspired dashboard UI

Professors can:

- Create courses
- Create assignments
- Manage assignments for courses they own
- View enrolled students
- View assignment completion data

The frontend is built using React with Vite.
The backend is built using Express and PostgreSQL.
Authentication uses cookie-session based login sessions.

---

# Core Features

## Authentication

### Register

Users can:

- Create an account
- Select either:
  - student
  - professor

Required fields:

- username
- email
- password
- role

Passwords are hashed using bcrypt.

---

## Login

Users can:

- Log into existing accounts
- Receive a persistent session cookie

Authenticated users are redirected to the dashboard.

---

## Logout

Users can:

- Destroy active sessions
- Return to login page

---

# Student Features

Students can:

- View enrolled courses
- View assignments by course
- Mark assignments completed
- View assignment due dates
- Access dashboard navigation

---

# Professor Features

Professors can:

- Create courses
- Create assignments
- Edit assignments
- Delete assignments
- View course enrollments
- View assignment completion statistics

---

# Dashboard Features

## Animated Background

The dashboard uses:

- an intro menu animation video
- a looping Persona-inspired menu background video

The intro animation plays once.
The looping background continues afterward.

---

## Persona Inspired UI

Planned UI features:

- dark blue/black color palette
- glowing hover effects
- futuristic typography
- animated dashboard menu
- game-style transitions
- scaling menu buttons
- translucent UI panels

---

# Database Schema

## users

Stores all users.

Columns:

- user_id
- username
- email
- password_hash
- role
- created_at

Roles:

- student
- professor

---

## courses

Stores courses created by professors.

Columns:

- course_id
- professor_id
- course_name
- description
- created_at

---

## enrollments

Links students to courses.

Columns:

- enrollment_id
- student_id
- course_id
- created_at

---

## assignments

Stores assignments for courses.

Columns:

- assignment_id
- name
- course_id
- description
- due_date
- created_at

---

## assignment_completions

Tracks completed assignments.

Columns:

- completion_id
- assignment_id
- student_id
- completed_at

A missing row means the assignment is incomplete.

---

# Backend Architecture

## Tech Stack

- Node.js
- Express
- PostgreSQL
- bcrypt
- cookie-session

---

# API Contract

## Auth Endpoints

| Method | Endpoint             | Request Body                          | Response                                       |
| ------ | -------------------- | ------------------------------------- | ---------------------------------------------- |
| POST   | `/api/auth/register` | `{ username, email, password, role }` | `{ user_id, username, email, role }`           |
| POST   | `/api/auth/login`    | `{ username, password }`              | `{ user_id, username, email, role }`           |
| GET    | `/api/auth/me`       | —                                     | `{ user_id, username, email, role }` or `null` |
| DELETE | `/api/auth/logout`   | —                                     | `{ message }`                                  |

---

## User Endpoints

| Method | Endpoint                               | Request Body            | Response                                         |
| ------ | -------------------------------------- | ----------------------- | ------------------------------------------------ |
| GET    | `/api/users`                           | —                       | `[{ user_id, username, email, role }]`           |
| GET    | `/api/users/:user_id/teaching-courses` | —                       | `[{ course_id, course_name, description }]`      |
| GET    | `/api/users/:user_id/enrollments`      | —                       | `[{ course_id, course_name, description }]`      |
| GET    | `/api/users/:user_id/assignments`      | —                       | `[{ assignment_id, name, course_id, due_date }]` |
| PATCH  | `/api/users/:user_id`                  | `{ email?, password? }` | `{ user_id, username, email, role }`             |
| DELETE | `/api/users/:user_id`                  | —                       | `{ message }`                                    |

All user endpoints require authentication.

---

## Course Endpoints

| Method | Endpoint                              | Request Body                     | Response                                                  |
| ------ | ------------------------------------- | -------------------------------- | --------------------------------------------------------- |
| GET    | `/api/courses`                        | —                                | `[{ course_id, course_name, description, professor_id }]` |
| POST   | `/api/courses`                        | `{ course_name, description }`   | `{ course_id, course_name, description, professor_id }`   |
| GET    | `/api/courses/:course_id`             | —                                | `{ course_id, course_name, description, professor_id }`   |
| GET    | `/api/courses/:course_id/assignments` | —                                | `[{ assignment_id, name, due_date }]`                     |
| PATCH  | `/api/courses/:course_id`             | `{ course_name?, description? }` | `{ course_id, course_name, description, professor_id }`   |
| DELETE | `/api/courses/:course_id`             | —                                | `{ message }`                                             |

Professor-only endpoints:

- POST `/api/courses`
- PATCH `/api/courses/:course_id`
- DELETE `/api/courses/:course_id`

All course endpoints require authentication.

---

## Assignment Endpoints

| Method | Endpoint                          | Request Body                                 | Response                                         |
| ------ | --------------------------------- | -------------------------------------------- | ------------------------------------------------ |
| GET    | `/api/assignments`                | —                                            | `[{ assignment_id, name, course_id, due_date }]` |
| POST   | `/api/assignments`                | `{ name, course_id, description, due_date }` | `{ assignment_id, name, course_id, due_date }`   |
| PATCH  | `/api/assignments/:assignment_id` | `{ name?, description?, due_date? }`         | `{ assignment_id, name, course_id, due_date }`   |
| DELETE | `/api/assignments/:assignment_id` | —                                            | `{ message }`                                    |

Professor-only endpoints:

- POST `/api/assignments`
- PATCH `/api/assignments/:assignment_id`
- DELETE `/api/assignments/:assignment_id`

All assignment endpoints require authentication.

---

# Frontend Architecture

## Tech Stack

- React
- React Router
- Vite

---

# Frontend Structure

```txt
src/
│
├── components/
│   ├── NavBar.jsx
│   ├── BackgroundVideo.jsx
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   └── DashboardMenu.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
│
├── fetch-helpers.js
├── App.jsx
└── main.jsx
```

---

# Routing

## Routes

### /

Login page.

### /register

Registration page.

### /dashboard

Authenticated dashboard.

---

# Authentication Flow

1. User registers or logs in
2. Backend creates session cookie
3. Frontend calls:

```txt
GET /api/auth/me
```

4. User state is stored globally in App.jsx
5. Dashboard renders based on role

---

# Planned Dashboard Navigation

Dashboard menu options may include:

- Courses
- Assignments
- Stats
- Settings
- Calendar

Hover effects:

- scale transforms
- glow effects
- box shadows

---

# Styling Direction

## Fonts

Recommended fonts:

- Orbitron
- Inter
- Rajdhani

---

## UI Style

The project aims to create:

- cinematic atmosphere
- animated game UI feel
- layered menu system
- fullscreen video backgrounds

---

# Future Improvements

Potential future features:

- assignment statistics
- grade tracking
- notifications
- animated transitions
- role-based dashboards
- calendar system
- assignment filtering
- mobile responsiveness

---

# Development Notes

## Session Authentication

Authentication uses:

- cookie-session
- bcrypt password hashing
- session persistence with credentials: include

---

## Role Authorization

Frontend role checks control UI visibility.
Backend role checks control actual permissions.

Example:

- professors can create assignments
- students cannot create assignments

---

# README

## Installation

### Backend

```bash
cd server
npm install
```

Create a .env file:

```env
PORT=8080
SESSION_SECRET=your_secret_here
PGHOST=localhost
PGPORT=5432
PGDATABASE=assignment_tracker_db
PGUSER=postgres
PGPASSWORD=your_password
```

Run database seed:

```bash
node db/seed.js
```

Start backend:

```bash
npm run dev
```

---

### Frontend

```bash
cd frontend
npm install
```

Install React Router:

```bash
npm install react-router-dom
```

Start frontend:

```bash
npm run dev
```

---

# Current Progress

Implemented:

- authentication
- sessions
- login/register pages
- React Router setup
- navbar navigation
- dashboard page
- video background system
- PostgreSQL schema
- user model
- auth controllers

In Progress:

- dashboard UI
- Persona menu styling
- course endpoints
- assignment endpoints
- role-based rendering

Planned:

- calendar transition animation
- assignment management
- professor tools
- dashboard widgets

---
