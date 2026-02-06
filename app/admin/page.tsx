"use client";

import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "Ekip@2025";
const DOMAIN = "askimizinsorulari.com.tr";
const emptyQ = { q: "", a: "" };

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const tryLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setAuthError("");
    } else {
      setAuthError("Yanlış şifre!");
    }
  };

  if (!loggedIn) return <LoginScreen password={password} setPassword={setPassword} tryLogin={tryLogin} authError={authError} />;
  return <LinkGenerator />;
}

function LoginScreen({ password, setPassword, tryLogin, authError }: any) {
  return (
    <div style={pageWrap}>
      <div style={card}>
        <div style={{ fontSize: "3rem", textAlign: "center", marginBottom: 8 }}>🔐</div>
        <h1 style={{ textAlign: "center", color: "#1a1a2e", fontSize: "1.6rem", marginBottom: 4 }}>Admin Paneli</h1>
        <p style={{ textAlign: "center", color: "#888", fontSize: "0.88rem", marginBottom: 24 }}>Şifrenizi girin</p>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && tryLogin()}
          placeholder="Şifre"
          autoFocus
          style={inputStyle}
        />
        {authError && (
          <p style={{ color: "#e74c3c", textAlign: "center", fontWeight: 600, marginBottom: 12, fontSize: "0.88rem" }}>{authError}</p>
        )}
        <button onClick={tryLogin} style={primaryBtn}>Giriş</button>
      </div>
    </div>
  );
}

function LinkGenerator() {
  const [title, setTitle] = useState("Aşkın Oyunu");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [questions, setQuestions] = useState([{ ...emptyQ }, { ...emptyQ }, { ...emptyQ }, { ...emptyQ }]);
  const [rewardMessage, setRewardMessage] = useState("");
  const [rewardImageUrl, setRewardImageUrl] = useState("");
  const [accent, setAccent] = useState("#ff4d6d");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [allCodes, setAllCodes] = useState<Record<string,string>>({});

  useEffect(() => {
    fetch("/api/codes").then(r => r.json()).then(d => setAllCodes(d)).catch(() => {});
  }, []);

  const generateRandomCode = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const updateQuestion = (i: number, field: "q" | "a", value: string) => {
    setQuestions(prev => prev.map((q, idx) => (idx === i ? { ...q, [field]: value } : q)));
  };
  const addQuestion = () => setQuestions(prev => [...prev, { ...emptyQ }]);
  const removeQuestion = (i: number) => { if (questions.length > 1) setQuestions(prev => prev.filter((_, idx) => idx !== i)); };

  const validate = (): string | null => {
    if (!title.trim()) return "Başlık boş!";
    if (!youtubeUrl.trim()) return "YouTube URL boş!";
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].q.trim()) return `${i + 1}. soru boş!`;
      if (!questions[i].a.trim()) return `${i + 1}. sorunun cevabı boş!`;
    }
    if (!rewardMessage.trim()) return "Ödül mesajı boş!";
    if (!rewardImageUrl.trim()) return "Ödül resim URL'si boş!";
    return null;
  };

  const generateAndSave = async () => {
    const err = validate();
    if (err) { setValidationError(err); return; }
    setValidationError("");

    const finalCode = shortCode.trim() || generateRandomCode();
    if (!/^[a-z0-9]+$/.test(finalCode)) {
      setValidationError("Kısa kod sadece küçük harf ve rakam içerebilir!");
      return;
    }

    const config = { title, youtubeUrl, questions, rewardMessage, rewardImageUrl, theme: { accent } };
    const base64url = btoa(unescape(encodeURIComponent(JSON.stringify(config)))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"");
    const slug = finalCode.toLowerCase();
    await fetch("/api/codes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: slug, base64url }) });
    setGeneratedLink(`${DOMAIN}/${slug}`);
    setCopied(false);
    fetch("/api/codes").then(r => r.json()).then(d => setAllCodes(d));
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const resetForm = () => {
    setTitle("Aşkın Oyunu");
    setYoutubeUrl("");
    setQuestions([{ ...emptyQ }, { ...emptyQ }, { ...emptyQ }, { ...emptyQ }]);
    setRewardMessage("");
    setRewardImageUrl("");
    setAccent("#ff4d6d");
    setGeneratedLink("");
    setValidationError("");
  };

  return (
    <div style={pageWrap}>
      <div style={{ maxWidth: 580, width: "100%", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 style={{ color: "#fff", fontSize: "1.5rem", margin: 0 }}>🔗 Link Üretici</h1>
            <p style={{ color: "#aaa", fontSize: "0.82rem", margin: "2px 0 0" }}>Müşteri bilgilerini dol, link hazır olsun</p>
          </div>
          <button onClick={resetForm} style={{ background: "rgba(255,255,255,.12)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}>🗑️ Temizle</button>
        </div>

        <div style={card}>
          <Section label="Oyun Başlığı">
            <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Örn: Zeynep & Emre'nin Oyunu" />
          </Section>

          <Section label="YouTube URL">
            <input style={inputStyle} value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          </Section>

          <Section label="Kısa Kod">
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <span style={{ background: "#f0f0f0", border: "2px solid #e0e0e0", borderRight: "none", borderRadius: "10px 0 0 10px", padding: "10px 10px", fontSize: "0.88rem", color: "#666" }}>{DOMAIN}/</span>
              <input style={{ ...inputStyle, borderRadius: "0 10px 10px 0", flex: 1 }} value={shortCode} onChange={e => setShortCode(e.target.value)} placeholder="Boş bırakın, otomatik oluşturulur (Örn: x3k9m2)" />
            </div>
            <p style={{ color: "#667eea", fontSize: "0.85rem", margin: 0 }}>💡 Boş bırakırsanız 6 haneli rastgele kod oluşturulur</p>
          </Section>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={labelStyle}>Sorular <span style={{ color: "#667eea" }}>({questions.length})</span></label>
              <button onClick={addQuestion} style={greenBtn}>+ Soru Ekle</button>
            </div>
            {questions.map((q, i) => (
              <div key={i} style={{ background: "#f8f9fa", borderRadius: 12, padding: "12px 14px", marginBottom: 10, border: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, color: "#667eea", fontSize: "0.85rem" }}>{i + 1}. Soru</span>
                  {questions.length > 1 && <button onClick={() => removeQuestion(i)} style={redBtn}>Sil</button>}
                </div>
                <input style={{ ...inputStyle, marginBottom: 8 }} value={q.q} onChange={e => updateQuestion(i, "q", e.target.value)} placeholder="Soru yazın..." />
                <input style={inputStyle} value={q.a} onChange={e => updateQuestion(i, "a", e.target.value)} placeholder="Cevap yazın..." />
              </div>
            ))}
          </div>

          <Section label="Ödül Mesajı">
            <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={rewardMessage} onChange={e => setRewardMessage(e.target.value)} placeholder="Örn: Seni çok seviyorum ❤️" />
          </Section>

          <Section label="Ödül Resim URL'si">
            <input style={inputStyle} value={rewardImageUrl} onChange={e => setRewardImageUrl(e.target.value)} placeholder="https://resim-linki.com/resim.jpg" />
          </Section>

          <Section label="Tema Rengi">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <input type="color" value={accent} onChange={e => setAccent(e.target.value)} style={{ width: 52, height: 44, border: "none", borderRadius: 10, cursor: "pointer", padding: 3 }} />
              <span style={{ color: "#555", fontWeight: 700, fontSize: "0.95rem" }}>{accent}</span>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: accent, boxShadow: "0 2px 8px rgba(0,0,0,.2)" }} />
            </div>
          </Section>

          {validationError && (
            <p style={{ color: "#e74c3c", fontWeight: 600, textAlign: "center", background: "#ffe5e5", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: "0.9rem" }}>⚠️ {validationError}</p>
          )}

          <button onClick={generateAndSave} style={primaryBtn}>🔗 Link Üret & Kaydet</button>
        </div>

        {generatedLink && (
          <div style={{ ...card, marginTop: 16 }}>
            <p style={{ fontWeight: 700, color: "#22c55e", marginBottom: 8, fontSize: "0.92rem" }}>✅ Link Hazır!</p>
            <div style={{ background: "#f0fdf4", border: "2px solid #22c55e", borderRadius: 10, padding: "12px 14px", wordBreak: "break-all", fontSize: "0.8rem", color: "#166534", marginBottom: 14 }}>{generatedLink}</div>
            <button onClick={copyLink} style={{ ...primaryBtn, background: copied ? "#22c55e" : "#667eea", transition: "background .3s" }}>{copied ? "✅ Kopyalandı!" : "📋 Kopyala"}</button>
          </div>
        )}

        {Object.keys(allCodes).length > 0 && (
          <div style={{ ...card, marginTop: 20 }}>
            <h2 style={{ color: "#1a1a2e", fontSize: "1.1rem", marginBottom: 14 }}>📋 Kayıtlı Müşteriler</h2>
            {Object.keys(allCodes).map(code => (
              <div key={code} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8f9fa", borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: "#667eea" }}>{DOMAIN}/{code}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => navigator.clipboard.writeText(`${DOMAIN}/${code}`)} style={{ background: "#667eea", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.8rem" }}>📋 Kopi</button>
                  <button onClick={async () => { await fetch("/api/codes", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) }); fetch("/api/codes").then(r => r.json()).then(d => setAllCodes(d)); }} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.8rem" }}>🗑️ Sil</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

const pageWrap: React.CSSProperties = { minHeight: "100vh", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" };
const card: React.CSSProperties = { background: "#fff", borderRadius: 20, padding: "1.8rem 1.5rem", boxShadow: "0 20px 60px rgba(0,0,0,.4)", width: "100%" };
const labelStyle: React.CSSProperties = { display: "block", fontWeight: 600, color: "#333", marginBottom: 6, fontSize: "0.88rem" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", border: "2px solid #e0e0e0", borderRadius: 10, fontSize: "0.95rem", boxSizing: "border-box" as any, background: "#fff" };
const primaryBtn: React.CSSProperties = { width: "100%", padding: "0.9rem", border: "none", borderRadius: 12, background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", fontSize: "1.05rem", fontWeight: 700, cursor: "pointer" };
const greenBtn: React.CSSProperties = { background: "#22c55e", color: "#fff", border: "none", borderRadius: 8, padding: "5px 14px", cursor: "pointer", fontWeight: 700, fontSize: "0.82rem" };
const redBtn: React.CSSProperties = { background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 };
