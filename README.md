# StaffLink

A staffing platform: clients request staff (cooks, drivers, gatemen, house help),
workers register and get medically cleared, and an admin (your sister) matches
them and tracks invoicing.

Built with React + Vite (frontend) and Supabase (database, auth, hosting-ready backend).

## What you'll need (all free to start)

1. A [Supabase](https://supabase.com) account — this is your database + login system.
2. A [Vercel](https://vercel.com) account (or Netlify) — this hosts the live site.
3. Node.js installed on your computer (or a developer/friend who has it) to run the
   build commands below. If you don't have this, tell me and I'll walk through
   alternatives (e.g. deploying straight from GitHub without a local install).

## Step 1 — Set up the database

1. Go to supabase.com, create a free account, then "New project".
2. Once it's created, go to the **SQL Editor** tab.
3. Open `database/schema.sql` from this project, copy all of it, paste it into
   the SQL editor, and click **Run**. This creates the `workers` and `requests`
   tables with the right security rules.

## Step 2 — Create the admin login

1. In Supabase, go to **Authentication → Users → Add user**.
2. Create a user with your sister's email and a password. This is what she'll
   use to log into the `/admin` page.
3. (You can add more admin users the same way later if she hires help.)

## Step 3 — Connect the app to your database

1. In Supabase, go to **Settings → API**. Copy the **Project URL** and the
   **anon public** key.
2. In this project folder, copy `.env.example` to a new file named `.env`.
3. Paste your Project URL and anon key into `.env`.

## Step 4 — Run it locally to test

```
npm install
npm run dev
```

Open the local address it prints (usually http://localhost:5173). Try submitting
a client request, registering as a worker, and logging into `/admin` with the
user you created in Step 2.

## Step 5 — Deploy it live

1. Push this project to a GitHub repository (ask me if you want help with this part).
2. Go to vercel.com, sign in with GitHub, and import the repository.
3. When Vercel asks for environment variables, add the same two from your `.env` file
   (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
4. Click deploy. Vercel gives you a live URL (e.g. `stafflink.vercel.app`) — you can
   later attach a custom domain like `stafflink.com` in Vercel's settings.

## What's already built

- **Request staff** (`/`) — public form, no login needed, clients submit requests.
- **Join as staff** (`/join`) — public form, workers register themselves.
- **Admin** (`/admin`) — requires login. Your sister can:
  - See stats: total/open requests, staff registered, medically cleared, placements, revenue collected.
  - Mark a worker's medical status as cleared.
  - Assign a medically-cleared worker (matching the requested role) to a request.
  - Mark a placement as closed.
  - Record an invoice amount per request and mark it paid — this is the basic
    invoicing/reporting layer.

## Known limitations / what to build next

- **Clients and workers can't check status themselves.** Right now, submitting
  a request or registering doesn't let them log back in to see updates (only
  the admin can see everything) — this was a deliberate simplicity/privacy
  tradeoff so anyone's phone number and notes aren't visible to other users.
  Next step could be a magic-link or phone-OTP lookup so they can check their
  own status.
- **No SMS/email notifications yet.** When a worker is matched, nobody is
  automatically notified. Adding this means signing up for Twilio (SMS) or
  an email service, then adding a Supabase Edge Function that fires on a match.
  I can build this next.
- **No online payments.** Invoicing currently just tracks amount + paid/unpaid
  manually. Adding real payment collection means integrating Paystack or Stripe.
- **Not yet packaged as a native mobile app.** As built, this is a responsive
  web app that works well on phones (add to home screen). Wrapping it as an
  actual iOS/Android app (via Capacitor) is a small additional step once the
  web version is solid — I can do that when you're ready.
