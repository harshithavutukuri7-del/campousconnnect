# CampusConnect

CampusConnect is a student collaboration demo built with React, Vite, and TypeScript. It uses sample data and browser localStorage, so no external database configuration is required.

## Features
- Smart team matching
- Skill exchange and collaboration flows
- Student dashboard and profile management
- Opportunity hub
- Responsive student collaboration pages

## Local setup
1. Install dependencies: `npm install`
2. Start the app: `npm run dev`
3. Build for production: `npm run build`

## Demo account
- Email: `aisha@campus.edu`
- Password: `demo123`

## Deploy to Vercel
Import the repository into Vercel and keep the default Vite settings:
- Build command: `npm run build`
- Output directory: `dist`

`vercel.json` includes a single-page-app rewrite so direct navigation to React routes works after deployment.

## Project structure
- `src/components` – reusable UI building blocks
- `src/pages` – landing, dashboard, auth, and feature pages
- `src/services` – Firebase/demo service modules
- `src/data` – demo dataset and app state
- `backend` – database and security rule scaffolding
