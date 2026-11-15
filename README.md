# CampusConnect

CampusConnect is a React, Vite, and TypeScript student collaboration app. Supabase provides authentication and the database for student profiles, opportunities, and applications.

## Local setup

1. Install dependencies with `npm install`.
2. Create a Supabase project.
3. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql).
4. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_ANON_KEY` to the project's publishable/anon key.
5. Start with `npm run dev`; run `npm run build` to verify a production build.

Only the publishable/anon key belongs in frontend environment variables. Never add a Supabase service-role key to this project or to Vercel's `VITE_` variables.

## Admin access

All new accounts are students. To grant admin access, first register and confirm the intended admin account. Then run the following in the Supabase SQL Editor, replacing the email:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'admin@example.edu');
```

Admin users can create, edit, publish, and delete opportunities and update application statuses. Row Level Security enforces these permissions in the database.

## Vercel deployment

Import the repository into Vercel and use the Vite defaults:

- Build command: `npm run build`
- Output directory: `dist`

Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Production (and Preview, if needed) environment variables in Vercel, then redeploy. `vercel.json` provides the single-page-app rewrite for client-side routes.

In Supabase Authentication → URL Configuration, set the Site URL to `https://campousconnnect.vercel.app` and allow:

- `https://campousconnnect.vercel.app/**`
- `https://campousconnnect-*-harshithavutukuri7-del.vercel.app/**`
- `http://localhost:5173/**` for local development

Email signup and email confirmation are enabled in Authentication → Sign In / Providers. After registering, students must confirm their email before their first login.
