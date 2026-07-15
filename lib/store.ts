import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

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

export function readSubmissions(): Submission[] {
  try {
    if (!fs.existsSync(SUBMISSIONS_FILE)) return [];
    const raw = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Submission[]) : [];
  } catch {
    return [];
  }
}

export function appendSubmission(
  entry: Omit<Submission, "id" | "createdAt">
): Submission {
  ensureDir();
  const submissions = readSubmissions();
  const submission: Submission = {
    ...entry,
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `sub_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  submissions.unshift(submission);
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf-8");
  return submission;
}

export function deleteSubmission(id: string): boolean {
  const submissions = readSubmissions();
  const next = submissions.filter((s) => s.id !== id);
  if (next.length === submissions.length) return false;
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(next, null, 2), "utf-8");
  return true;
}

export function writeContent(data: unknown): void {
  ensureDir();
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), "utf-8");
}
