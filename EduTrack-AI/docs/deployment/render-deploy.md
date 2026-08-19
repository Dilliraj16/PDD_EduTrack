# Render Deployment Guide

If you choose to run backend services, background workers, or a custom Node.js admin proxy, Render is configured via `render.yaml`.

## Setup Steps
1. Push this repository to GitHub.
2. Go to Render.com -> Blueprints.
3. Connect your repository.
4. Render will detect `deployment/render/render.yaml`.
5. Set any missing Environment Variables in the Render dashboard.

## Notes
- To deploy the frontend on Render instead of Vercel, use a "Static Site" configuration pointing to `apps/web/dist` after running `npm run build:web`.
