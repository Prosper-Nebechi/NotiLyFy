# Notificacion – Centralized Notification System

## Overview
An event-driven notification service for email, SMS, and in-app messaging.  
Supports user preferences, delivery tracking, retries, and role-based access.

## Features
- Event-driven architecture
- Queue-based async processing (BullMQ / Redis)
- JWT authentication with refresh token support
- Admin routes for inspecting & retrying failed notifications
- Flutter frontend with auto-login and role-based routing

## Tech Stack
- Backend: Node.js + Express + TypeScript
- Queue: BullMQ + Redis
- Database: MongoDB Atlas
- Auth: JWT + Refresh Tokens
- Frontend: Flutter

## Setup

### Backend
```bash
cd server
npm install
npm run dev
