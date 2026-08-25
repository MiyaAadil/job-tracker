# Job Application Tracker

A full-stack job application tracker with AI-assisted cover letter generation, built to solve a real problem I was facing during my own job search: scattered applications, no tracking system, and repetitive cover-letter writing.

**Live demo:** [https://job-tracker-for-you.vercel.app/]

## Why this project

Most portfolio projects are tutorial-shaped CRUD apps that don't reflect real product decisions. This one was built to actually use — every feature exists because I needed it, not because it made a good demo. It also let me go deep on two things most junior portfolios skip: real per-user authentication with database-level security, and AI integration that solves an actual workflow problem rather than being a thin wrapper around an API call.

## Features

- **Authentication** — sign up / log in with Supabase Auth, including a display name captured at signup
- **Application tracking** — add, view, update status (applied / interview / offer / rejected), and delete job applications
- **Profile** — stores skills and experience once, reused across every AI generation
- **AI-assisted cover letters** — paste a job description into an application, generate a tailored cover letter using the candidate's actual profile data as context, view it in an accessible modal
- **Toast feedback** on every meaningful action (sign up, log in, sign out, add, delete)
- **Skeleton loading states** instead of bare loading text

## Tech stack

- **Frontend:** React + TypeScript, Vite, Tailwind CSS
- **Backend:** Vercel Serverless Functions (Node.js)
- **Database & Auth:** Supabase (Postgres + Supabase Auth)
- **AI:** Google Gemini API
- **Deployment:** Vercel

## Architecture decisions worth knowing

**Row Level Security, not app-level filtering.** Every table has RLS policies enforced by Postgres itself — a user can only read or write rows where `auth.uid()` matches the row's owner. This means even if there were a bug in the frontend query logic, or someone hit the API directly with the public anon key, the database itself refuses to leak another user's data. Security lives at the data layer, not just in application code.

**Why the AI call is a serverless function, not a direct browser call.** The Gemini API key must never be exposed client-side. The frontend calls a Vercel serverless function (`/api/tailor`), which holds the key server-side and proxies the request. The Supabase anon key, by contrast, is safe to expose in the frontend — that's Supabase's intended design, since access control is enforced by RLS rather than by hiding the key.

**Why cover letter generation is separate from application data.** The AI feature reads job description + profile data live at generation time rather than duplicating that logic elsewhere, so tailoring stays accurate as a user's profile evolves.

## Database schema

```sql
profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  skills text,
  experience text,
  updated_at timestamp
)

applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  company text,
  role text,
  status text, -- 'applied' | 'interview' | 'offer' | 'rejected'
  date_applied date,
  job_description text,
  notes text,
  created_at timestamp
)
```

Both tables have RLS enabled with policies restricting all operations to rows owned by the authenticated user.

## Running locally

```bash
git clone [https://github.com/MiyaAadil/job-tracker]
cd job-tracker
npm install
```

Create a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

Run with the Vercel CLI (required for serverless functions to work locally):

```bash
npm install -g vercel
vercel dev
```

## What I'd add next

- Dashboard with application funnel stats (applied → interview → offer conversion)
- Follow-up reminders for applications with no response after N days
- Export applications to CSV