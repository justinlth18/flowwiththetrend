import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deskCookie, sessionValid } from "@/lib/desk-auth";
import { proposalTextLimit } from "@/lib/proposal-markup";
import { clientAddress, deleteProposal, writeAudit } from "@/lib/proposals";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { watermarkImage } from "@/lib/watermark";

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  if (!sessionValid(jar.get(deskCookie)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ ok: false, error: "The desk is not set up yet." }, { status: 503 });

  const { id } = await context.params;
  const form = await request.formData();
  const clientName = String(form.get("clientName") ?? "").trim();
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const remove = new Set(form.getAll("remove").map((item) => String(item)));
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
  if (files.some((file) => !imageTypes.has(file.type) || file.size > 6 * 1024 * 1024)) {
    return NextResponse.json({ ok: false, error: "Use JPG, PNG, or WebP pictures under 6 MB." }, { status: 400 });
  }

  const { data: current } = await supabase
    .from("proposal_images")
    .select("id, storage_path, sort_order")
    .eq("proposal_id", id);
  if (!current) return NextResponse.json({ ok: false, error: "That proposal was not found." }, { status: 404 });

  const kept = current.filter((image) => !remove.has(image.id));
  const total = kept.length + files.length;
  if (total < 1 || total > 6) {
    return NextResponse.json({ ok: false, error: "Keep between 1 and 6 pictures." }, { status: 400 });
  }

  const saved = await supabase
    .from("proposals")
    .update({ client_name: clientName, title, description })
    .eq("id", id)
    .select("id")
    .single();
  if (saved.error || !saved.data) {
    return NextResponse.json({ ok: false, error: "The proposal was not saved." }, { status: 502 });
  }

  const dropping = current.filter((image) => remove.has(image.id));
  if (dropping.length) {
    await supabase.storage.from("proposals").remove(dropping.map((image) => image.storage_path));
    const removed = await supabase.from("proposal_images").delete().in(
      "id",
      dropping.map((image) => image.id),
    );
    if (removed.error) {
      return NextResponse.json({ ok: false, error: "A picture could not be removed." }, { status: 502 });
    }
  }

  const start = kept.reduce((max, image) => Math.max(max, image.sort_order), -1) + 1;
  for (const [index, file] of files.entries()) {
    const marked = await watermarkImage(Buffer.from(await file.arrayBuffer()));
    const imageId = crypto.randomUUID();
    const storagePath = `${id}/${imageId}.jpg`;
    const uploaded = await supabase.storage.from("proposals").upload(storagePath, marked, {
      contentType: "image/jpeg",
      upsert: false,
    });
    if (uploaded.error) {
      return NextResponse.json({ ok: false, error: "A picture could not be stored." }, { status: 502 });
    }
    const inserted = await supabase.from("proposal_images").insert({
      id: imageId,
      proposal_id: id,
      storage_path: storagePath,
      sort_order: start + index,
    });
    if (inserted.error) {
      return NextResponse.json({ ok: false, error: "A picture could not be saved." }, { status: 502 });
    }
  }

  await writeAudit(id, "edited", clientAddress(request), clientName);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  if (!sessionValid(jar.get(deskCookie)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!getSupabaseAdmin()) return NextResponse.json({ ok: false, error: "The desk is not set up yet." }, { status: 503 });

  const { id } = await context.params;
  const removed = await deleteProposal(id);
  if (!removed.ok) {
    const missing = removed.error === "That proposal was not found.";
    return NextResponse.json({ ok: false, error: removed.error }, { status: missing ? 404 : 502 });
  }
  return NextResponse.json({ ok: true });
}
