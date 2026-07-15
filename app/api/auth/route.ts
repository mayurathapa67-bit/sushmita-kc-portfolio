import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_PASSWORD, AUTH_COOKIE, sessionToken, verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const host = req.headers.get("host") ?? "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && !isLocalhost,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  return NextResponse.json(
    { authed: verifySession(token) },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
