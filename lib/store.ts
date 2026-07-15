import fs from "node:fs";
import path from "node:path";
import { getGitHubFile, putGitHubFile, isGitHubEnabled } from "./github";

const DATA_DIR = path.join(process.cwd(), "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");
const SUBMISSIONS_PATH = "data/submissions.json";

export interface Submission {
  id: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
  type: "contact" | "audit" | "newsletter";
  createdAt: string;
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function readSubmissions(): Promise<Submission[]> {
  if (isGitHubEnabled()) {
    const file = await getGitHubFile(SUBMISSIONS_PATH);
    if (file) {
      try {
        const parsed = JSON.parse(file.content);
        return Array.isArray(parsed) ? (parsed as Submission[]) : [];
      } catch {
        return [];
      }
    }
    return [];
  }
  try {
    if (!fs.existsSync(SUBMISSIONS_FILE)) return [];
    const raw = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Submission[]) : [];
  } catch {
    return [];
  }
}

async function writeSubmissions(list: Submission[]): Promise<boolean> {
  const content = JSON.stringify(list, null, 2);
  if (isGitHubEnabled()) {
    const file = await getGitHubFile(SUBMISSIONS_PATH);
    return putGitHubFile(
      SUBMISSIONS_PATH,
      content,
      "Update submissions via admin",
      file?.sha
    );
  }
  try {
    ensureDir();
    fs.writeFileSync(SUBMISSIONS_FILE, content, "utf-8");
    return true;
  } catch {
    return false;
  }
}

export async function appendSubmission(
  entry: Omit<Submission, "id" | "createdAt">
): Promise<Submission> {
  const submissions = await readSubmissions();
  const submission: Submission = {
    ...entry,
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `sub_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  submissions.unshift(submission);
  await writeSubmissions(submissions);
  return submission;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const submissions = await readSubmissions();
  const next = submissions.filter((s) => s.id !== id);
  if (next.length === submissions.length) return false;
  return writeSubmissions(next);
}

export { readSubmissions };
