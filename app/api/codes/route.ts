import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function GET() {
  const keys = await redis.keys("code:*");
  const codes: Record<string, string> = {};
  for (const key of keys) {
    const code = key.replace("code:", "");
    const value = await redis.get(key);
    if (value) codes[code] = value as string;
  }
  return NextResponse.json(codes);
}

export async function POST(req: Request) {
  const { code, base64url } = await req.json();
  if (!code || !base64url) return NextResponse.json({ error: "code ve base64url zorunlu" }, { status: 400 });
  await redis.set(`code:${code.toLowerCase().trim()}`, base64url);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "code zorunlu" }, { status: 400 });
  await redis.del(`code:${code.toLowerCase().trim()}`);
  return NextResponse.json({ ok: true });
}
