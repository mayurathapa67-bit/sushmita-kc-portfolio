import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifySession } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/content";
import type { SiteContent } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(
    { content },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

export async function PUT(req: NextRequest) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!verifySession(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  const current = await getContent();
  const merged: SiteContent = { ...current, ...(body as Partial<SiteContent>) };

  const status = await saveContent(merged);
  if (status === "failed") {
    return NextResponse.json(
      { error: "Could not persist content on this environment" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { ok: true, persisted: status },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
