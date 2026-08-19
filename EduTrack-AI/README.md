# EduTrack AI - Enterprise Monorepo

Data-Driven Smart Campus Management Platform.

## 🏗️ Architecture

This repository is structured as an Enterprise Monorepo to support high scalability, maintainability, and deployment readiness across multiple platforms.

```text
EduTrack-AI/
├── apps/
│   ├── web/               # React 19 Frontend
│   └── mobile/            # Flutter Mobile App
├── backend/
│   └── supabase/          # Database, Auth, Functions, Policies
├── deployment/            # Docker, Vercel, Render configurations
├── docs/                  # Architecture & Deployment Guides
├── packages/              # Shared logic (UI, theme, utils)
└── .github/               # CI/CD Workflows
```

## 🚀 Quick Start

### Web Application (React + Vite)
```sh
npm install
npm run dev:web
```

### Mobile Application (Flutter)
```sh
cd apps/mobile
flutter pub get
flutter run
```

## ⚙️ Tech Stack
* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Zustand.
* **Mobile**: Flutter, Riverpod.
* **Backend**: Supabase (PostgreSQL, Realtime, Edge Functions).

## 🌍 Depoyment Options
Fully configured for:
- Vercel (`vercel.json`)
- Render (`render.yaml`)
- Docker (`deployment/docker/`)
- Android APK/AAB (GitHub Actions `.github/workflows/deploy.yml`)
