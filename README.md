# 🌉 Rojgar Bridge Frontend

A modern, fast, responsive Next.js 15 (App Router) web application and Admin Curation Portal for **Rojgar Bridge**, powered by the live [RojgarBridge Core Backend](https://rojgarbridge.onrender.com).

---

## 📁 Project Structure

```text
rojgar-bridge/
├── frontend/                 # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/              # Next.js App router pages & layouts
│   │   │   ├── page.tsx      # Public Candidate Jobs Feed
│   │   │   └── admin/        # AI Scraped Draft Notices Review Center
│   │   ├── components/       # Reusable UI components & modals
│   │   ├── lib/              # API fetch clients & helper utilities
│   │   └── types/            # TypeScript interfaces
│   ├── public/               # Static assets
│   ├── Dockerfile            # Container configuration
│   ├── package.json          # Node dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   └── tailwind.config.ts    # Tailwind styling config
│
├── docker-compose.yml        # Docker service configuration
├── render.yaml               # Render Blueprint deployment configuration
└── README.md                 # Project documentation
```

---

## 🛠 Prerequisites

- **Node.js** (v20+ recommended)
- **npm** or **pnpm**

---

## 🚀 Running Locally

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.
- **Candidate Portal**: `http://localhost:3000/`
- **Admin Review Queue**: `http://localhost:3000/admin`

The app connects automatically to the live backend API at **`https://rojgarbridge.onrender.com`**.

---

## 🐳 Running with Docker

```bash
docker compose up --build
```
Open **`http://localhost:3000`**.
