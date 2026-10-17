import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeskRegister } from "@/components/desk-register";
import { inviteMatches } from "@/lib/desk-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Register",
  robots: { index: false, follow: false },
};

export default async function DeskRegisterPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!inviteMatches(token)) notFound();
  return <DeskRegister token={token} />;
}
