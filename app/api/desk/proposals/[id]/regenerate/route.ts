import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deskCookie, sessionValid } from "@/lib/desk-auth";
import { clientAddress, expiryFromNow, newProposalToken, writeAudit } from "@/lib/proposals";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  if (!sessionValid(jar.get(deskCookie)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });

  const { id } = await context.params;
  const token = newProposalToken();
  const expiresAt = expiryFromNow();
  const { data, error } = await supabase
    .from("proposals")
    .update({ token, expires_at: expiresAt })
    .eq("id", id)
    .select("id, token, expires_at")
    .single();
  if (error || !data) return NextResponse.json({ ok: false }, { status: 404 });

  await writeAudit(id, "regenerated", clientAddress(request), "Old link stopped");
  return NextResponse.json({ ok: true, token: data.token, expiresAt: data.expires_at });
}
