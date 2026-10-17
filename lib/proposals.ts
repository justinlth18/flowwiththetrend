import { randomBytes } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const proposalDays = 7;

export function newProposalToken() {
  return randomBytes(24).toString("base64url");
}

export function expiryFromNow() {
  return new Date(Date.now() + proposalDays * 24 * 60 * 60 * 1000).toISOString();
}

export function clientAddress(request: Request) {
  return (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0]?.trim() || "unknown";
}

export async function writeAudit(
  proposalId: string,
  event: "created" | "viewed" | "regenerated" | "expired",
  ip: string,
  detail = "",
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  await supabase.from("proposal_audit").insert({
    proposal_id: proposalId,
    event,
    ip,
    detail: detail || null,
  });
}
