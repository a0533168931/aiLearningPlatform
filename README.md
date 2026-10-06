# AI Learning Platform

A full-stack AI-powered learning platform built with React, Node.js, Express, Prisma, PostgreSQL, and Gemini.

The system enables users to learn through an AI-driven flow, while storing structured learning history and providing an admin overview of activity.

---

## Features

- User registration and login (email + password) with JWT authentication
- Role-based authorization for `USER` and `ADMIN`
- Category & subcategory learning flow
- AI-generated educational responses (Gemini integration)
- Learning history tracking per user
- Admin view for monitoring users and activity

---

## Architecture

### Frontend (React)

- Learning dashboard
- History view
- Admin interface

### Backend (Node.js + Express)

- REST API (users, categories, prompts)
- JWT authentication
- Role-based authorization
- Service-based structure
- Gemini integration
- Validation & error handling

### Database (PostgreSQL + Prisma)

- Relational schema
- Prisma ORM for queries and migrations

---

## System Flow

User registers → selects category → submits question → AI generates response → result is saved → history is available anytime

---

## Tech Stack

- React + Vite
- Node.js + Express
- JWT
- Prisma ORM
- PostgreSQL
- Gemini API
- Docker + Docker Compose

---

## Environment Variables (.env)

The backend requires the following environment variables:

- `DATABASE_URL`
- `PORT`
- `NODE_ENV`
- `GEMINI_API_KEY` (or `OPENAI_API_KEY`, which is still accepted)
- `GEMINI_MODEL` (optional, defaults to `gemini-3.8-flash`)
- `JWT_SECRET`
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` (optional, used to bootstrap the first admin)
- `ADMIN_NAME` (optional, defaults to `Admin`)

Copy `server/.env.example` to `server/.env` and fill in real values. Never commit a real admin password.

### Seed / first ADMIN user

Public registration always creates `role = USER`. The first administrator is created by the Prisma seed, not by the register endpoint.

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env`.
2. From the `server/` directory, apply migrations and run:

```bash
npx prisma migrate deploy
npx prisma db seed
```

The seed creates the first ADMIN user only when none exists, and hashes that initial password. If an admin already exists, the password is left unchanged. It is safe to run repeatedly. The server also runs this seed on startup.

---

## How to Run the Project

```bash
docker compose up --build
```

The server container applies database migrations with `prisma migrate deploy`, then starts. The startup seed runs after that.

Open the application:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
