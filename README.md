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

Free-plan projects pause after about a week of no traffic. Opening the project in the Supabase dashboard wakes it up.

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
