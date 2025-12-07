# NestJS Auth + API Key Service

This project implements a **full authentication system** with:

- **User login via JWT**
- **Service-to-Service access via API keys**
- **Persistent PostgreSQL storage via Prisma v7**
- JWT and API key validation for secure routes  

---

## Table of Contents

1. Features
2. Tech Stack
3. Prerequisites
4. Installation
5. Environment Variables
6. Database Setup
7. Running the App
8. API Endpoints
9. Prisma Studio
10. Usage
11. License

---

## Features

- User signup and login with **JWT authentication**
- Generate and revoke API keys for services
- Validate JWTs and API keys in middleware
- Store users and API keys in **PostgreSQL**
- View and manage database entries via **Prisma Studio**
- Support for expiration and revocation of API keys

---

## Tech Stack

- **NestJS** – Backend framework  
- **PostgreSQL** – Database for persistent storage  
- **Prisma v7** – ORM to interact with PostgreSQL  
- **JWT** – User authentication  
- **bcrypt** – Password hashing  
- **Node.js** – Runtime  

---

## Prerequisites

- Node.js >= 18  
- npm or yarn  
- PostgreSQL running locally or remotely  

---

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd <repo-folder>
```

2. Install dependencies:

```bash
npm install
```

3. Initialize Prisma client:

```bash
npx prisma generate
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
JWT_SECRET="your-secret-key"
```

Replace:

- `username` → PostgreSQL user  
- `password` → PostgreSQL password  
- `mydb` → your database name  

---

## Database Setup

1. Make sure PostgreSQL is running:

```bash
sudo systemctl status postgresql
```

2. Create your database if it doesn’t exist:

```sql
CREATE DATABASE mydb;
```

3. Apply Prisma schema to create tables:

```bash
npx prisma db push
```

---

## Running the App

```bash
npm run start:dev
```

- Runs on `http://localhost:3000` by default

---

## API Endpoints

| Method | Route            | Description                        | Body Example |
|--------|----------------|------------------------------------|-------------|
| POST   | `/auth/signup`  | Register a new user                 | `{ "fullName": "John Doe", "email": "john@example.com", "password": "123456" }` |
| POST   | `/auth/login`   | Login and receive JWT               | `{ "email": "john@example.com", "password": "123456" }` |
| POST   | `/keys/create`  | Generate API key for a service      | `{ "serviceName": "payment-service" }` |
| POST   | `/keys/revoke`  | Revoke an existing API key          | `{ "key": "<api-key-to-revoke>" }` |

---

## Prisma Studio

View and manage your database visually:

```bash
npx prisma studio
```

- Opens GUI in browser: `http://localhost:5555`
- View `User` and `ApiKey` tables
- Update, delete, or inspect records

---

## Usage

1. **Sign up a user** with `/auth/signup`
2. **Login** to receive a JWT token
3. Use the **JWT token** for protected routes:  

```
Authorization: Bearer <your-jwt-token>
```

4. **Create an API key** for a service:

```json
{
  "serviceName": "payment-service"
}
```

5. **Revoke an API key**:

```json
{
  "key": "<api-key-to-revoke>"
}
```

6. Use the **API key** in headers for service-to-service access:

```
x-api-key: <your-api-key>
```

---

## Folder Structure

```
src/
├─ auth/                # Auth module, controller, service, DTOs
├─ api-keys/            # API key module, controller, service
├─ prisma/              # Prisma config and service
├─ app.module.ts
.env
prisma/
├─ schema.prisma
├─ prisma.config.ts
```

---

## License

MIT License

