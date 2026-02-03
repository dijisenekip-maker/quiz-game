import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "data", "codes.json");

function ensureDb(): Record<string, string> {
  const dir = path.resolve(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "{}");
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

export async function GET() {
  const db = ensureDb();
  return NextResponse.json(db);
}

export async function POST(req: Request) {
  const { code, base64url } = await req.json();
  if (!code || !base64url) return NextResponse.json({ error: "code ve base64url zorunlu" }, { status: 400 });
  const db = ensureDb();
  db[code.toLowerCase().trim()] = base64url;
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "code zorunlu" }, { status: 400 });
  const db = ensureDb();
  delete db[code.toLowerCase().trim()];
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  return NextResponse.json({ ok: true });
}
