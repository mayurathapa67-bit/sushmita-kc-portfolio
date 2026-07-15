import { NextRequest, NextResponse } from "next/server";
import { appendSubmission } from "@/lib/store";

export const dynamic = "force-dynamic";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => null);
  if (!data) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, message, type, company, service } = data as Record<
    string,
    string
  >;

  if (type === "newsletter") {
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    appendSubmission({
      name: name || "Newsletter",
      email,
      message: "",
      type: "newsletter",
    });
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required" },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  appendSubmission({
    name,
    email,
    message,
    company: company ?? "",
    service: service ?? "",
    type: type === "audit" ? "audit" : "contact",
  });

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
