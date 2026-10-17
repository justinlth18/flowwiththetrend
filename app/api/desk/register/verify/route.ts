import { NextResponse } from "next/server";
import {
  deskConfigured,
  deskCookie,
  inviteMatches,
  inviteToken,
  newSessionValue,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/desk-auth";
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
  return current.count > 20;
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
  let email = "";
  let code = "";
  try {
    const body = (await request.json()) as { token?: string; email?: string; code?: string };
    token = body.token ?? "";
    email = (body.email ?? "").trim().toLowerCase();
    code = (body.code ?? "").replace(/\D/g, "");
  } catch {
    token = "";
  }

  if (!inviteMatches(token) || code.length !== 6) {
    return NextResponse.json({ ok: false, error: "That code is not right." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "The desk is not set up yet." }, { status: 503 });
  }

  const { data: pending } = await supabase.from("desk_signups").select("*").eq("email", email).maybeSingle();
  if (!pending || new Date(pending.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ ok: false, error: "That code has closed. Send a new one." }, { status: 400 });
  }
  if (pending.attempts >= 5) {
    await supabase.from("desk_signups").delete().eq("email", email);
    return NextResponse.json({ ok: false, error: "Too many wrong codes. Send a new one." }, { status: 400 });
  }
  if (!verifyPassword(code, pending.code_hash)) {
    await supabase.from("desk_signups").update({ attempts: pending.attempts + 1 }).eq("email", email);
    return NextResponse.json({ ok: false, error: "That code is not right." }, { status: 400 });
  }

  const { data: user, error } = await supabase
    .from("desk_users")
    .insert({ name: pending.name, email, password_hash: pending.password_hash })
    .select("id")
    .single();
  if (error || !user) {
    const duplicate = error?.code === "23505";
    return NextResponse.json(
      { ok: false, error: duplicate ? "That email already has an account. Log in instead." : "The account was not created." },
      { status: duplicate ? 409 : 502 },
    );
  }

  await supabase.from("desk_signups").delete().eq("email", email);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(deskCookie, newSessionValue(user.id), sessionCookieOptions);
  return response;
}
