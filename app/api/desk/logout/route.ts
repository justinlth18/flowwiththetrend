import { NextResponse } from "next/server";
import { deskCookie } from "@/lib/desk-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(deskCookie, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
