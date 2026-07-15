const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_API =
  process.env.GITHUB_CONTENT_API ||
  (GITHUB_REPO
    ? `https://api.github.com/repos/${GITHUB_REPO}/contents`
    : undefined);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";

const isDevelopment = process.env.NODE_ENV === "development";

export function isGitHubEnabled(): boolean {
  return Boolean(GITHUB_API && GITHUB_TOKEN && !isDevelopment);
}

export interface GitHubFile {
  content: string;
  sha: string;
}

export async function getGitHubFile(relPath: string): Promise<GitHubFile | null> {
  if (!GITHUB_API || !GITHUB_TOKEN) return null;
  try {
    const url = `${GITHUB_API}/${relPath}?ref=${GITHUB_BRANCH}`;
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
    const data = (await res.json()) as {
      content?: string;
      sha?: string;
      encoding?: string;
    };
    if (!data.content || !data.sha) return null;
    const decoded =
      data.encoding === "base64"
        ? Buffer.from(data.content, "base64").toString("utf-8")
        : data.content;
    return { content: decoded, sha: data.sha };
  } catch {
    return null;
  }
}

export async function putGitHubFile(
  relPath: string,
  content: string,
  message: string,
  sha?: string
): Promise<boolean> {
  if (!GITHUB_API || !GITHUB_TOKEN) return false;
  try {
    const url = `${GITHUB_API}/${relPath}`;
    const body: Record<string, unknown> = {
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch: GITHUB_BRANCH,
    };
    if (sha) body.sha = sha;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      next: { revalidate: 0 },
    });
    return res.ok;
  } catch {
    return false;
  }
}
