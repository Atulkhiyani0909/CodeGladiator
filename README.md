# ⚔️ Code Gladiator

> **Where Code Meets Glory.** A real-time competitive programming arena built for developers to battle, rank up, and prove their algorithmic prowess.

<img width="1904" height="834" alt="image" src="https://github.com/user-attachments/assets/0b048d7b-6222-499b-92be-04ee4a8f9928" />
<img width="1889" height="862" alt="image" src="https://github.com/user-attachments/assets/4d017196-15a9-4d06-be5e-ba90e455a3a8" />
<img width="1900" height="869" alt="image" src="https://github.com/user-attachments/assets/ba53a51c-68f6-4f15-9d0c-52c9b033d88f" />
<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/274c0a67-f7dd-469f-9bd8-36731c471a1c" />
<img width="1898" height="862" alt="image" src="https://github.com/user-attachments/assets/b8b3123b-f061-4f58-b125-f2b615d8da35" />

# Battle Mode 
<img width="1905" height="903" alt="image" src="https://github.com/user-attachments/assets/adfac69f-acd7-4c2b-8824-e18a0f23b200" />


<img width="1904" height="862" alt="image" src="https://github.com/user-attachments/assets/f5e90ca3-72fc-409f-b2af-fe955e952f82" />








## 🚀 Introduction

**Code Gladiator** is a 1v1 coding battle platform. It connects developers via WebSockets for real-time algorithmic duels. Unlike standard coding platforms, Code Gladiator focuses on **concurrency, speed, and live competition**.

It features an anonymous matchmaking system, isolated code execution environments using Docker, and a global Elo-based ranking system.

## 🏗️ System Architecture

This project utilizes an **Event-Driven Architecture** to handle high-concurrency code submissions without blocking the main server threads.



**The Data Flow:**
1.  **Matchmaking:** Users join a Queue via WebSocket. The server pairs them and spins up a unique `RoomID`.
2.  **Submission:** When a user submits code, it is pushed to a **Redis Queue**.
3.  **Processing:** A separate Worker Service pulls the code from Redis.
4.  **Execution:** The Worker spins up an isolated **Docker Container** to execute the code safely (preventing infinite loops/malicious attacks).
5.  **Result:** The output is published back to Redis (Pub/Sub), which notifies the WebSocket server to update the frontend client.

## ⚡ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React, Framer Motion |
| **Backend** | Node.js, Express, Native WebSockets (`ws`) |
| **Database** | PostgreSQL, Prisma ORM |
| **Queue & Pub/Sub** | Redis |
| **Code Execution** | Docker |
| **Authentication** | Clerk Auth |


## ✨ Key Features

* **🛡️ Anonymous Matchmaking:** Instant 1v1 queue system ("Omegle for Coding").
* **⚡ Real-Time Battles:** Live status updates, opponent progress tracking, and instant results.
* **🐳 Secure Code Execution:** Dockerized judge engine supporting multiple languages.
* **🏆 Global Leaderboards:** Dynamic ranking system with "Hall of Fame" highlighting top 3 players.
* **🗺️ Journey System:** Gamified progression from *Novice* to *Warlord*.
* **🎨 Cyber-Gladiator UI:** Dark-themed, glassmorphism-inspired interface with Bento Grid layouts.

---

## 🛠️ Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v18+)
* Docker (Desktop ) running
* PostgreSQL Database
* Redis instance 

### 1. Clone the Repository
```bash
git clone [https://github.com/Atulkhiyani0909/CodeGladiator.git]
cd code-gladiator
```

###2. Infrastructure Setup (Docker)
If you don't have Postgres/Redis installed locally, you can spin them up via Docker:
``` bash
# (Optional) Run Redis and Postgres via Docker Compose
docker run -d --name gladiator-redis -p 6379:6379 redis ]
```

### 3. Backend Setup
Navigate to the backend folder (or root if monolithic):

```bash
cd backend
npm install

# Setup Database
npx prisma generate
npx prisma migrate dev --name init
```

```bash
npm run dev
```

### 4. Frontend Setup
Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```

```bash
npm run dev
```
