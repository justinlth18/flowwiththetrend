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
