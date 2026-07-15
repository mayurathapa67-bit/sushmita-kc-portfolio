import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifySession } from "@/lib/auth";
import { deleteSubmission, readSubmissions } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!verifySession(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    { submissions: readSubmissions() },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

export async function DELETE(req: NextRequest) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!verifySession(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json().catch(() => ({ id: "" }));
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const removed = deleteSubmission(id);
  return NextResponse.json(
    { ok: removed },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
