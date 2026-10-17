import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deskCookie, sessionValid } from "@/lib/desk-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(_request: Request, context: { params: Promise<{ imageId: string }> }) {
  const jar = await cookies();
  if (!sessionValid(jar.get(deskCookie)?.value)) {
    return new NextResponse(null, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return new NextResponse(null, { status: 503 });

  const { imageId } = await context.params;
  const { data: image } = await supabase
    .from("proposal_images")
    .select("storage_path")
    .eq("id", imageId)
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
    },
  });
}
