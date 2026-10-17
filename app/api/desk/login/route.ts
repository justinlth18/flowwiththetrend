import { NextResponse } from "next/server";
import {
  deskConfigured,
  deskCookie,
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
  return current.count > 8;
}

export async function POST(request: Request) {
  if (!deskConfigured()) {
    return NextResponse.json({ ok: false, error: "The desk is not set up yet." }, { status: 503 });
  }
  const ip = clientAddress(request);
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many tries. Wait an hour." }, { status: 429 });
  }

  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    email = (body.email ?? "").trim().toLowerCase();
    password = body.password ?? "";
  } catch {
    email = "";
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "The desk is not set up yet." }, { status: 503 });
  }

  const { data: user } = await supabase
    .from("desk_users")
    .select("id, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ ok: false, error: "That email or password is not right." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(deskCookie, newSessionValue(user.id), sessionCookieOptions);
  return response;
}
