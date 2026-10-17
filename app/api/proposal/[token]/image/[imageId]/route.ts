import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(_request: Request, context: { params: Promise<{ token: string; imageId: string }> }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return new NextResponse(null, { status: 503 });

  const { token, imageId } = await context.params;
  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, expires_at")
    .eq("token", token)
    .maybeSingle();
  if (!proposal || new Date(proposal.expires_at).getTime() < Date.now()) {
    return new NextResponse(null, { status: 404 });
  }

  const { data: image } = await supabase
    .from("proposal_images")
    .select("storage_path")
    .eq("id", imageId)
    .eq("proposal_id", proposal.id)
    .maybeSingle();
  if (!image) return new NextResponse(null, { status: 404 });

  const file = await supabase.storage.from("proposals").download(image.storage_path);
  if (file.error || !file.data) return new NextResponse(null, { status: 404 });

  const bytes = Buffer.from(await file.data.arrayBuffer());
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "private, no-store",
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
