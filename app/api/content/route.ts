import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifySession } from "@/lib/auth";
import { getContentSync, getContent } from "@/lib/content";
import { writeContent } from "@/lib/store";
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

  const current = getContentSync();
  const merged: SiteContent = { ...current, ...(body as Partial<SiteContent>) };

  try {
    writeContent(merged);
  } catch {
    return NextResponse.json(
      { error: "Could not persist content on this environment" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
