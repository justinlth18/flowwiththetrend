# Flow With The Trend

A studio site for restaurant websites and portfolios. Loud color, a menu people can read, and a form that saves leads.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend

Inquiries go to [Supabase](https://supabase.com), on the free plan.

1. Create a project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy the project URL and the **service role** key into `.env.local`:

```bash
cp .env.example .env.local
```

```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

The service role key stays on the server. Do not prefix it with `NEXT_PUBLIC_`.

Without those keys, `npm run dev` still accepts the form and shows a developer note instead of saving. A production build without keys refuses to store the message.

The private desk is at `/desk`. Log in with the email and password from your account. New accounts can be created only from `/desk/register/<DESK_INVITE_TOKEN>`. That link is not shown on the site. A six-digit code is emailed before the account is saved. Set `DESK_SESSION_SECRET` and `DESK_INVITE_TOKEN` in `.env.local` and on Vercel. Run the proposal and desk tables at the bottom of `supabase/schema.sql` in the SQL editor before the first account. Each client link lasts 7 days. Making a new link stops the old one. Pictures are watermarked when you upload them.

Free-plan projects pause after about a week of no traffic. Vercel calls `/api/keepalive` once a day, which counts as activity. Set `CRON_SECRET` on the Vercel project to the same value the cron sends. If Supabase has already paused the project, restore it from the dashboard first. A paused project does not wake up from this call.

## Email

Each saved brief also sends a note through [Resend](https://resend.com), on the free plan.

1. Create an API key.
2. Add these to `.env.local` and to the Vercel project, then redeploy:

```
RESEND_API_KEY=re_your_key
INQUIRY_NOTIFY_EMAIL=you@example.com
```

`INQUIRY_NOTIFY_EMAIL` is the inbox that receives the brief. Reply goes to the person who sent it.

Until you verify a domain, Resend only delivers from `onboarding@resend.dev`, and only to the email on the Resend account. After the domain is verified, set `INQUIRY_FROM_EMAIL` to an address on that domain.
