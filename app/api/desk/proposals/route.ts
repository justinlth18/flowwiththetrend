import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deskCookie, sessionValid } from "@/lib/desk-auth";
import { clientAddress, expiryFromNow, newProposalToken, writeAudit } from "@/lib/proposals";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { proposalTextLimit } from "@/lib/proposal-markup";
import { watermarkImage } from "@/lib/watermark";

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

async function authorized() {
  const jar = await cookies();
  return sessionValid(jar.get(deskCookie)?.value);
}

export async function GET() {
  if (!(await authorized())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });

  const { data: proposals, error } = await supabase
    .from("proposals")
    .select("id, created_at, client_name, title, description, token, expires_at, proposal_images(id, sort_order)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ ok: false }, { status: 502 });

  const ids = (proposals ?? []).map((item) => item.id);
  const { data: audit } = ids.length
    ? await supabase
        .from("proposal_audit")
        .select("id, proposal_id, created_at, event, detail, ip")
        .in("proposal_id", ids)
        .order("created_at", { ascending: false })
        .limit(200)
    : { data: [] };

  return NextResponse.json({ ok: true, proposals: proposals ?? [], audit: audit ?? [] });
}

export async function POST(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });

  const form = await request.formData();
  const clientName = String(form.get("clientName") ?? "").trim();
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const files = form.getAll("images").filter((item): item is File => item instanceof File && item.size > 0);

  if (clientName.length < 2 || clientName.length > 80) {
    return NextResponse.json({ ok: false, error: "Add the client name." }, { status: 400 });
  }
  if (title.length < 2 || title.length > 120) {
    return NextResponse.json({ ok: false, error: "Add a title." }, { status: 400 });
  }
  if (description.length < 10) {
    return NextResponse.json({ ok: false, error: "Write a description of at least a sentence." }, { status: 400 });
  }
  if (description.length > proposalTextLimit) {
    return NextResponse.json({ ok: false, error: "Keep the description under 12,000 characters." }, { status: 400 });
  }
  if (files.length < 1 || files.length > 6) {
    return NextResponse.json({ ok: false, error: "Add between 1 and 6 pictures." }, { status: 400 });
  }
  if (files.some((file) => !imageTypes.has(file.type) || file.size > 6 * 1024 * 1024)) {
    return NextResponse.json({ ok: false, error: "Use JPG, PNG, or WebP pictures under 6 MB." }, { status: 400 });
  }

  const token = newProposalToken();
  const { data: proposal, error } = await supabase
    .from("proposals")
    .insert({
      client_name: clientName,
      title,
      description,
      token,
      expires_at: expiryFromNow(),
    })
    .select("id, token, expires_at")
    .single();
  if (error || !proposal) return NextResponse.json({ ok: false, error: "The proposal was not saved." }, { status: 502 });

  for (const [index, file] of files.entries()) {
    const marked = await watermarkImage(Buffer.from(await file.arrayBuffer()));
    const imageId = crypto.randomUUID();
    const storagePath = `${proposal.id}/${imageId}.jpg`;
    const uploaded = await supabase.storage.from("proposals").upload(storagePath, marked, {
      contentType: "image/jpeg",
      upsert: false,
    });
    if (uploaded.error) {
      return NextResponse.json({ ok: false, error: "A picture could not be stored." }, { status: 502 });
    }
    const inserted = await supabase.from("proposal_images").insert({
      id: imageId,
      proposal_id: proposal.id,
      storage_path: storagePath,
      sort_order: index,
    });
    if (inserted.error) {
      return NextResponse.json({ ok: false, error: "A picture could not be saved." }, { status: 502 });
    }
  }

  await writeAudit(proposal.id, "created", clientAddress(request), clientName);
  return NextResponse.json({ ok: true, id: proposal.id, token: proposal.token, expiresAt: proposal.expires_at });
}
