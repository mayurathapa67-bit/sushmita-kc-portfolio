import fs from "node:fs";
import path from "node:path";
import contentJson from "@/data/content.json";
import type { SiteContent } from "./types";
import { getGitHubFile, putGitHubFile, isGitHubEnabled } from "./github";

const bundledContent = contentJson as SiteContent;

const CONTENT_PATH = "data/content.json";

function isGitHubAvailable(): boolean {
  return isGitHubEnabled();
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
  if (isGitHubAvailable()) {
    const file = await getGitHubFile(CONTENT_PATH);
    if (file) {
      try {
        return JSON.parse(file.content) as SiteContent;
      } catch {
        /* fall through to local */
      }
    }
  }
  return readLocalFile();
}

export function getContentSync(): SiteContent {
  return readLocalFile();
}

export async function saveContent(
  data: SiteContent
): Promise<"github" | "local" | "failed"> {
  if (isGitHubAvailable()) {
    const file = await getGitHubFile(CONTENT_PATH);
    if (file) {
      const ok = await putGitHubFile(
        CONTENT_PATH,
        JSON.stringify(data, null, 2),
        "Update site content via admin",
        file.sha
      );
      if (ok) return "github";
    }
  }
  try {
    const filePath = path.join(process.cwd(), "data", "content.json");
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return "local";
  } catch {
    return "failed";
  }
}
