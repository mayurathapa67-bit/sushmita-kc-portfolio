import fs from "node:fs";
import path from "node:path";
import contentJson from "@/data/content.json";
import type { SiteContent } from "./types";

const bundledContent = contentJson as SiteContent;

const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_API =
  process.env.GITHUB_CONTENT_API ||
  (GITHUB_REPO
    ? `https://api.github.com/repos/${GITHUB_REPO}/contents/data/content.json`
    : undefined);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";

const isDevelopment = process.env.NODE_ENV === "development";

function isGitHubEnabled(): boolean {
  return Boolean(GITHUB_API && GITHUB_TOKEN && !isDevelopment);
}

async function fetchFromGitHub(): Promise<SiteContent | null> {
  if (!GITHUB_API || !GITHUB_TOKEN) return null;
  try {
    const url = `${GITHUB_API}?ref=${GITHUB_BRANCH}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Cache-Control": "no-store",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: string; encoding?: string };
    if (!data.content) return null;
    const decoded =
      data.encoding === "base64"
        ? Buffer.from(data.content, "base64").toString("utf-8")
        : data.content;
    return JSON.parse(decoded) as SiteContent;
  } catch {
    return null;
  }
}

function readLocalFile(): SiteContent {
  try {
    const filePath = path.join(process.cwd(), "data", "content.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as SiteContent;
  } catch {
    return bundledContent;
  }
}

export async function getContent(): Promise<SiteContent> {
  if (isGitHubEnabled()) {
    const remote = await fetchFromGitHub();
    if (remote) return remote;
  }
  return readLocalFile();
}

export function getContentSync(): SiteContent {
  return readLocalFile();
}
