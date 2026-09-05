# AI Learning Platform

A full-stack AI-powered learning platform built with React, Node.js, Prisma, PostgreSQL, and OpenAI.

The system enables users to learn through an AI-driven flow, while storing structured learning history and providing an admin overview of activity.

---

## Features

- User registration and login (email + password)
- Category & subcategory learning flow
- AI-generated educational responses (OpenAI integration)
- Learning history tracking per user
- Admin view for monitoring users and activity

---

## Architecture

**Frontend (React)**

- Learning dashboard
- History view
- Admin interface

**Backend (Node.js + Express)**

- REST API (users, categories, prompts)
- Service-based structure
- OpenAI integration
- Validation & error handling

**Database (PostgreSQL + Prisma)**

- Relational schema
- Prisma ORM for queries and migrations

---

## System Flow

User registers → selects category → submits question → AI generates response → result is saved → history is available anytime

---

## Tech Stack

- React + Vite
- Node.js + Express
- Prisma ORM
- PostgreSQL
- OpenAI API
- Docker + Docker Compose

---

## Environment Variables (.env)

The backend requires the following environment variables:

- `DATABASE_URL`
- `PORT`
- `NODE_ENV`
- `OPENAI_API_KEY`
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

The seed hashes the password, upserts the user by email, and sets `role = ADMIN`. It is safe to run repeatedly. The server also runs this seed on startup (existing project behavior).

---

## How to Run the Project




 Run:
   docker compose up --build
 Open the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000



