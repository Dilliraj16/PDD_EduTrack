# Vercel Deployment Guide

The EduTrack-AI web application is fully optimized for Vercel deployment via Monorepo setup.

## Setup Steps
1. Push this repository to GitHub.
2. In Vercel, import the repository.
3. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web` (or leave root and let the workspace command run)
   - **Build Command**: `npm run build:web`
   - **Output Directory**: `apps/web/dist`
4. Add your Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Click **Deploy**.
