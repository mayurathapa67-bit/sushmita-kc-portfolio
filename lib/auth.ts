import crypto from "node:crypto";

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "sushmita2025";
const SECRET = process.env.AUTH_SECRET ?? "sushmita-kc-portfolio-admin";
export const AUTH_COOKIE = "sk_admin_session";

export function sessionToken(): string {
  return crypto.createHmac("sha256", SECRET).update(ADMIN_PASSWORD).digest("hex");
}

export function verifySession(token: string | undefined): boolean {
  if (!token) return false;
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(sessionToken())
  );
}
