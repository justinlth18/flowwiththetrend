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

const proposalSelect =
  "id, created_at, client_name, title, description, token, expires_at, proposal_images(id, sort_order)";

export async function listDeskProposals() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase.from("proposals").select(proposalSelect).order("created_at", { ascending: false });
  return data ?? [];
}

export async function loadDeskProposal(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data: proposal } = await supabase.from("proposals").select(proposalSelect).eq("id", id).maybeSingle();
  if (!proposal) return null;
  const { data: audit } = await supabase
    .from("proposal_audit")
    .select("id, proposal_id, created_at, event, detail, ip")
    .eq("proposal_id", id)
    .order("created_at", { ascending: false })
    .limit(50);
  return { proposal, audit: audit ?? [] };
}

export async function writeAudit(
  proposalId: string,
  event: "created" | "viewed" | "regenerated" | "expired" | "edited",
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
