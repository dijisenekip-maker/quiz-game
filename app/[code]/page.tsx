import fs from "fs";
import path from "path";
import { decodeConfig } from "@/lib/config";
import QuizGameWrapper from "@/components/QuizGameWrapper";

const DB_PATH = path.resolve(process.cwd(), "data", "codes.json");

function readDb(): Record<string, string> {
  if (!fs.existsSync(DB_PATH)) return {};
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

export default function ShortCodePage({ params }: { params: { code: string } }) {
  const slug = params.code?.toLowerCase();
  if (slug === "admin" || slug === "api") return null;
  const db = readDb();
  const raw = db[slug];
  const config = raw ? decodeConfig(raw) : null;

  if (!config) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: "2.5rem 2rem", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,.4)" }}>
          <div style={{ fontSize: "4rem", marginBottom: 12 }}>😔</div>
          <h1 style={{ color: "#1a1a2e", fontSize: "1.5rem", marginBottom: 8 }}>Link Bulunamadı</h1>
          <p style={{ color: "#888", fontSize: "0.95rem", lineHeight: 1.5 }}>Bu link geçersiz veya kaldırılmış olabilir.<br />Lütfen tekrar kontrol edin.</p>
        </div>
      </div>
    );
  }
  return <QuizGameWrapper config={config} />;
}
