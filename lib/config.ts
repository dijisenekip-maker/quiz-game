import { QuizConfig, defaultConfig } from "./defaultConfig";

// ── decode base64url → QuizConfig | null ──────────────────
export function decodeConfig(raw: string): QuizConfig | null {
  try {
    const base64 = raw.replace(/-/g, "+").replace(/_/g, "/");
    const json   = atob(base64);                          // works in browser
    const parsed = JSON.parse(json);
    return validate(parsed) ? (parsed as QuizConfig) : null;
  } catch {
    return null;
  }
}

// ── encode QuizConfig → base64url string ───────────────────
export function encodeConfig(cfg: QuizConfig): string {
  return btoa(JSON.stringify(cfg))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// ── pick config from URL or fall back to default ────────────
export function getConfig(params: URLSearchParams): QuizConfig {
  const c = params.get("c");
  return (c ? decodeConfig(c) : null) ?? defaultConfig;
}

// ── minimal shape validator ─────────────────────────────────
function validate(o: any): boolean {
  if (!o || typeof o !== "object") return false;
  if (typeof o.title !== "string")          return false;
  if (typeof o.youtubeUrl !== "string")     return false;
  if (typeof o.rewardMessage !== "string")  return false;
  if (typeof o.rewardImageUrl !== "string") return false;
  if (!Array.isArray(o.questions) || o.questions.length !== 4) return false;
  if (!o.questions.every((q: any) => typeof q?.q === "string" && typeof q?.a === "string")) return false;
  if (!o.theme || typeof o.theme.accent !== "string") return false;
  return true;
}
