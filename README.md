# 🌉 Rojgar Bridge

A modern, scalable full-stack application with a **Next.js 15 (App Router)** frontend and a high-performance **Golang (Go 1.22+)** backend.

---

## 📁 Project Structure

```text
rojgar-bridge/
├── backend/                  # Golang REST API Service
│   ├── cmd/
│   │   └── server/
│   │       └── main.go       # Application entry point
│   ├── internal/
│   │   ├── api/
│   │   │   ├── handlers/     # HTTP route handlers (health, jobs, etc.)
│   │   │   ├── middleware/   # CORS, logging, auth middleware
│   │   │   └── router.go     # HTTP routing definition
│   │   ├── config/           # Environment config loader
│   │   └── models/           # Data models and structs
│   ├── Dockerfile            # Container configuration
│   ├── go.mod                # Go module definition
│   └── .env.example          # Environment variables template
│
├── frontend/                 # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/              # Next.js App router pages & layouts
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # API fetch clients & helper utilities
│   │   └── types/            # TypeScript interfaces
│   ├── public/               # Static assets
│   ├── Dockerfile            # Container configuration
│   ├── package.json          # Node dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   ├── tailwind.config.ts    # Tailwind styling config
│   └── .env.example          # Environment variables template
│
├── docker-compose.yml        # Multi-container orchestration (Frontend + Backend)
├── .gitignore                # Global gitignore
└── README.md                 # Project documentation
```

---

## 🛠 Prerequisites

To run locally without Docker, ensure you have installed:
- **Node.js** (v20+ recommended)
- **Go** (v1.22+ recommended)

> [!TIP]
> If you do not have Node.js or Go installed yet on Windows, you can install them via `winget` in PowerShell:
> ```powershell
> winget install OpenJS.NodeJS.LTS
> winget install GoLang.Go
> ```

---

## 🚀 Getting Started

### 1. Running the Backend (Go)

```bash
cd backend

# Run the server
go run ./cmd/server
```
The Go API will be available at: **`http://localhost:8080`**
- Health Check: `GET http://localhost:8080/api/health`
- List Jobs: `GET http://localhost:8080/api/jobs`

### 2. Running the Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The Next.js application will be running at: **`http://localhost:3000`**

---

## 🐳 Running with Docker Compose

Since Docker is installed, you can spin up both services with a single command:

```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
