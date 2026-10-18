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

export async function deleteProposal(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false as const, error: "The desk is not set up yet." };

  const { data: images, error: readError } = await supabase
    .from("proposal_images")
    .select("storage_path")
    .eq("proposal_id", id);
  if (readError) return { ok: false as const, error: "That proposal could not be removed." };

  const paths = (images ?? []).map((image) => image.storage_path).filter(Boolean);
  const removed = await supabase.from("proposals").delete().eq("id", id).select("id");
  if (removed.error) {
    const denied = removed.error.code === "42501" || /permission|privilege/i.test(removed.error.message);
    return {
      ok: false as const,
      error: denied
        ? "Run the latest SQL in supabase/schema.sql so a proposal can be deleted."
        : "That proposal could not be removed.",
    };
  }
  if (!removed.data?.length) return { ok: false as const, error: "That proposal was not found." };
  if (paths.length) await supabase.storage.from("proposals").remove(paths);
  return { ok: true as const };
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
