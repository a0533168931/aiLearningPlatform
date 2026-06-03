# AI Learning Platform

A full-stack AI-powered learning platform built with React, Node.js, Prisma, PostgreSQL, and OpenAI.

The system enables users to learn through an AI-driven flow, while storing structured learning history and providing an admin overview of activity.

---

## Features

- User registration (phone-based)
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
DATABASE_URL
PORT
NODE_ENV
OPENAI_API_KEY

---

## How to Run the Project




 Run:
   docker compose up --build
 Open the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000



