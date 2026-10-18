import { readFileSync } from "fs";
import path from "path";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deskCookie, sessionValid } from "@/lib/desk-auth";
import { hrPortalProposal } from "@/lib/proposal-template";
import { clientAddress, deleteProposal, expiryFromNow, newProposalToken, writeAudit } from "@/lib/proposals";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { watermarkImage } from "@/lib/watermark";

export async function POST(request: Request) {
  const jar = await cookies();
  if (!sessionValid(jar.get(deskCookie)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ ok: false, error: "The desk is not set up yet." }, { status: 503 });

  const description = hrPortalProposal.description.trim();
  const token = newProposalToken();
  const { data: proposal, error } = await supabase
    .from("proposals")
    .insert({
      client_name: hrPortalProposal.clientName,
      title: hrPortalProposal.title,
      description,
      token,
      expires_at: expiryFromNow(),
    })
    .select("id, token, expires_at")
    .single();
  if (error || !proposal) {
    const tooLong = error?.code === "23514";
    return NextResponse.json(
      {
        ok: false,
        error: tooLong
          ? "Run the latest SQL in supabase/schema.sql so this proposal can be saved."
          : "The proposal was not saved.",
      },
      { status: tooLong ? 400 : 502 },
    );
  }

  for (const [index, fileName] of hrPortalProposal.images.entries()) {
    const source = readFileSync(path.join(process.cwd(), "content/proposals/schmidt-hr", fileName));
    const marked = await watermarkImage(source);
    const imageId = crypto.randomUUID();
    const storagePath = `${proposal.id}/${imageId}.jpg`;
    const uploaded = await supabase.storage.from("proposals").upload(storagePath, marked, {
      contentType: "image/jpeg",
      upsert: false,
    });
    if (uploaded.error) {
      await deleteProposal(proposal.id);
      return NextResponse.json({ ok: false, error: "A picture could not be stored." }, { status: 502 });
    }
    const inserted = await supabase.from("proposal_images").insert({
      id: imageId,
      proposal_id: proposal.id,
      storage_path: storagePath,
      sort_order: index,
    });
    if (inserted.error) {
      await deleteProposal(proposal.id);
      return NextResponse.json({ ok: false, error: "A picture could not be saved." }, { status: 502 });
    }
  }

  await writeAudit(proposal.id, "created", clientAddress(request), hrPortalProposal.clientName);

  const { data: earlier } = await supabase.from("proposals").select("id").neq("id", proposal.id);
  let warning = "";
  for (const row of earlier ?? []) {
    const removed = await deleteProposal(row.id);
    if (!removed.ok) warning = removed.error;
  }

  return NextResponse.json({ ok: true, id: proposal.id, token: proposal.token, expiresAt: proposal.expires_at, warning });
}
