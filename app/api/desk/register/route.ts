import { randomInt } from "crypto";
import { NextResponse } from "next/server";
import { deskConfigured, hashPassword, inviteMatches, inviteToken } from "@/lib/desk-auth";
import { sendDeskCode } from "@/lib/desk-otp";
import { clientAddress } from "@/lib/proposals";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const hits = new Map<string, { count: number; reset: number }>();

function limited(ip: string) {
  const now = Date.now();
  const current = hits.get(ip);
  if (!current || current.reset < now) {
    hits.set(ip, { count: 1, reset: now + 60 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 8;
}

export async function POST(request: Request) {
  if (!deskConfigured() || !inviteToken()) {
    return NextResponse.json({ ok: false, error: "Registration is closed." }, { status: 503 });
  }
  const ip = clientAddress(request);
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many tries. Wait an hour." }, { status: 429 });
  }

  let token = "";
  let name = "";
  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as {
      token?: string;
      name?: string;
      email?: string;
      password?: string;
    };
    token = body.token ?? "";
    name = (body.name ?? "").trim();
    email = (body.email ?? "").trim().toLowerCase();
    password = body.password ?? "";
  } catch {
    token = "";
  }

  if (!inviteMatches(token)) {
    return NextResponse.json({ ok: false, error: "Registration is closed." }, { status: 404 });
  }
  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ ok: false, error: "Add your name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    return NextResponse.json({ ok: false, error: "That email does not look right." }, { status: 400 });
  }
  if (password.length < 10 || password.length > 200) {
    return NextResponse.json({ ok: false, error: "Use a password of at least 10 characters." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "The desk is not set up yet." }, { status: 503 });
  }

  const { data: existing } = await supabase.from("desk_users").select("id").eq("email", email).maybeSingle();
  if (existing) {
    return NextResponse.json(
      { ok: false, error: "That email already has an account. Log in instead." },
      { status: 409 },
    );
  }

  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const saved = await supabase.from("desk_signups").upsert({
    email,
    name,
    password_hash: hashPassword(password),
    code_hash: hashPassword(code),
    attempts: 0,
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  });
  if (saved.error) {
    return NextResponse.json({ ok: false, error: "The code could not be saved." }, { status: 502 });
  }

  const mailed = await sendDeskCode(email, code);
  if (!mailed.sent) {
    await supabase.from("desk_signups").delete().eq("email", email);
    return NextResponse.json(
      { ok: false, error: "The code could not be emailed. Check the Resend sender and try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, email });
}
