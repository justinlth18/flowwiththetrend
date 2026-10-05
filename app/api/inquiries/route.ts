import { NextResponse } from "next/server";
import { validateInquiry } from "@/lib/inquiry";
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
  const ip = (request.headers.get("x-forwarded-for") ?? "local").split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Try again in a little while." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "That message could not be read." }, { status: 400 });
  }

  if (json && typeof json === "object" && "website" in json) {
    const trap = String((json as { website?: unknown }).website ?? "").trim();
    if (trap) return NextResponse.json({ ok: true, persisted: true });
  }

  const parsed = validateInquiry(json);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ ok: true, persisted: false, dev: true });
    }
    return NextResponse.json(
      { ok: false, error: "The studio inbox is not connected yet. Please try again soon." },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("inquiries").insert(parsed.data);
  if (error) {
    console.error("inquiry insert failed", error.code);
    return NextResponse.json(
      { ok: false, error: "We could not save that message. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, persisted: true });
}
