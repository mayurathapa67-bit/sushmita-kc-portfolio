import { cookies } from "next/headers";
import { AUTH_COOKIE, verifySession } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin | Sushmita Kc Portfolio",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const authed = verifySession(token);
  const githubConfigured = Boolean(
    process.env.GITHUB_REPO && process.env.GITHUB_TOKEN
  );
  const cloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET)
  );
  return authed ? (
    <AdminDashboard
      githubConfigured={githubConfigured}
      cloudinaryConfigured={cloudinaryConfigured}
    />
  ) : (
    <AdminLogin />
  );
}
