# DSA Pattern Mastery Tracker (Phase 1)

A full-stack concept tracker designed for developers preparing for technical interviews. The system helps you memorize the core "why" behind tricky algorithms, log personal mistakes dynamically, and use a spaced repetition system to make insights stick.

---

## Technical Stack
- **Backend:** NestJS (TypeScript), Modular Architecture, Prisma ORM
- **Database:** PostgreSQL (Dockerized)
- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Lucide Icons
- **Auth:** JWT Access Token (response body, memory storage) + Refresh Token (response body, `localStorage` storage)

---

## Directory Structure
- `/` — Docker Compose & Environment configuration
- `/backend` — NestJS API service & Prisma schema/seed scripts
- `/frontend` — React Vite single-page application

---

## Step-by-Step Local Setup

Follow these steps to run the application locally on your machine:

### 1. Prerequisite Environment Setup
Copy the example environment file at the root:
```bash
cp .env.example .env
```
Ensure the port numbers and default keys are correct. The defaults are pre-configured to work out of the box with the Docker Postgres database.

---

### 2. Run Database Container
Make sure Docker Desktop is running, then start the PostgreSQL 16 container in the background:
```bash
docker compose up -d
```
This container binds to local port `5432` with user `postgres` and password `postgrespassword`, saving data to a named volume `pgdata`.

---

### 3. Setup Backend & Seed Database
Navigate to the `backend` directory, install packages, run Prisma migrations, and run the seed script:
```bash
cd backend

# Install dependencies (if you haven't already)
npm install

# Run database migrations to construct the tables
npx prisma migrate dev --name init

# Seed the 12 Array patterns and 34 problems
npx prisma db seed
```

Once completed, the database will be fully populated with all Array concepts, code skeletons, complexity insights, trigger cues, and LeetCode problems.

---

### 4. Run the Backend Server
Start the backend development server from the `/backend` directory:
```bash
npm run start:dev
```
The server will start listening on [http://localhost:3000/api/v1/](http://localhost:3000/api/v1/).

---

### 5. Run the Frontend Client
Open a new terminal window, navigate to the `frontend` directory, install packages, and start the Vite dev server:
```bash
cd frontend

# Install dependencies (if you haven't already)
npm install

# Start the Vite dev server
npm run dev
```
The client dashboard will open at [http://localhost:5173](http://localhost:5173).

---

## Verification & Testing

### Run Automated Unit Tests
To run the automated tests for spaced-repetition logic and mistake log appenders:
```bash
cd backend
npm run test
```

### Manual Verification Flows
1. **Signup & Login**: Create a new account on [http://localhost:5173/signup](http://localhost:5173/signup) and log in.
2. **Explore Concepts**: Browse the **Pattern Library** page, select a pattern (e.g. *Kadane's*), read its trigger cues, implementation skeleton, and deep mathematical reasonings under **Why it Works**.
3. **Problem Workspace**: Click on a linked LeetCode problem. Try to:
   - Track a quick sample input trace in the **Monospace Dry Run** textbox.
   - Explain your intuition in **Why it Works**.
   - Append a personal mistake (e.g. *Off-by-one boundary checking*) using the append button. Confirm it gets appended historically with a timestamp.
   - Set status to **Solved** and confidence to **4**. Save the progress.
4. **Spaced Repetition Review**: Click the **Mark Reviewed** button.
   - Go back to the **Dashboard** homepage.
   - Verify the problem has been scheduled.
   - Change confidence to **1** (low), and review it again. Verify the next review date shifts to **+3 days** due to the low-confidence reset rule.
