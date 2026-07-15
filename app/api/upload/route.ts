import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!verifySession(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (process.env.CLOUDINARY_URL) {
    try {
      const { v2: cloudinary } = await import("cloudinary");
      const dataUri = `data:${file.type || "image/png"};base64,${buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "sushmita-portfolio",
        resource_type: "auto",
      });
      return NextResponse.json(
        { url: result.secure_url },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    } catch {
      // Fall through to demo URL on Cloudinary failure
    }
  }

  const seed = encodeURIComponent(file.name || `img-${Date.now()}`);
  return NextResponse.json(
    {
      url: `https://picsum.photos/seed/${seed}/1200/800`,
      demo: true,
      note: "Cloudinary not configured — using placeholder URL.",
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
