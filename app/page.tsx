"use client";

export default function Home() {
  const demoQuestions = [
    { q: "İlk buluşmamız neredeydi?", a: "Starbucks Kadıköy" },
    { q: "En sevdiğim yemek nedir?", a: "Mantı" },
    { q: "Hangi tarihte tanıştık?", a: "14 Şubat 2020" },
    { q: "Hayalindeki tatil yeri?", a: "Santorini" },
  ];

  const features = [
    "🎵 İstediğiniz şarkı çalar",
    "💕 Her doğru cevapta kalp animasyonu",
    "💌 Sonunda özel 14 Şubat mesajınız",
    "🔒 Kişiye özel link – sadece sevgiliniz erişir",
    "💡 3 yanlış cevapta ipucu verilir",
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f43f5e 100%)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: "3rem 1.25rem 4rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {/* ── Header ── */}
      <div style={{ textAlign: "center", maxWidth: 560, marginBottom: "2.5rem" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: 12 }}>💕</div>
        <h1 style={{
          color: "#fff",
          fontSize: "clamp(1.75rem, 5vw, 2.6rem)",
          fontWeight: 800,
          margin: "0 0 12px",
          lineHeight: 1.2,
          textShadow: "0 2px 12px rgba(0,0,0,.18)",
        }}>
          Aşkımızın Soruları
        </h1>
        <span style={{
          display: "inline-block",
          background: "rgba(255,255,255,.18)",
          backdropFilter: "blur(6px)",
          color: "#fff",
          borderRadius: 20,
          padding: "5px 16px",
          fontSize: "0.88rem",
          fontWeight: 600,
          marginBottom: 16,
        }}>
          14 Şubat Özel 💕
        </span>
        <p style={{
          color: "rgba(255,255,255,.92)",
          fontSize: "1.1rem",
          lineHeight: 1.6,
          margin: 0,
        }}>
          Sevgiliniz sizi ne kadar tanıyor? Özel bir quiz ile test edin!
        </p>
      </div>

      {/* ── Demo Card ── */}
      <div style={{
        background: "rgba(255,255,255,.95)",
        backdropFilter: "blur(10px)",
        borderRadius: 24,
        padding: "1.8rem 1.5rem",
        width: "100%",
        maxWidth: 520,
        boxShadow: "0 20px 60px rgba(0,0,0,.22)",
        marginBottom: "1.5rem",
      }}>
        <h2 style={{
          color: "#1a1a2e",
          fontSize: "1.2rem",
          fontWeight: 700,
          margin: "0 0 18px",
          textAlign: "center",
        }}>
          📝 Örnek Oyun – Nasıl Çalışır?
        </h2>

        {demoQuestions.map((item, i) => (
          <div key={i} style={{
            background: i % 2 === 0 ? "#fdf2f8" : "#f5f3ff",
            borderRadius: 14,
            padding: "14px 18px",
            marginBottom: 10,
            border: `1px solid ${i % 2 === 0 ? "#fbcfe8" : "#e9d5ff"}`,
          }}>
            <p style={{ margin: "0 0 6px", color: "#374151", fontWeight: 600, fontSize: "0.95rem" }}>
              📝 Soru {i + 1}: {item.q}
            </p>
            <p style={{ margin: 0, color: "#16a34a", fontWeight: 700, fontSize: "0.95rem" }}>
              ✅ Cevap: {item.a}
            </p>
          </div>
        ))}
      </div>

      {/* ── Features Card ── */}
      <div style={{
        background: "rgba(255,255,255,.95)",
        backdropFilter: "blur(10px)",
        borderRadius: 24,
        padding: "1.8rem 1.5rem",
        width: "100%",
        maxWidth: 520,
        boxShadow: "0 20px 60px rgba(0,0,0,.22)",
        marginBottom: "2rem",
      }}>
        <h2 style={{
          color: "#1a1a2e",
          fontSize: "1.2rem",
          fontWeight: 700,
          margin: "0 0 16px",
          textAlign: "center",
        }}>
          ✨ Özellikler
        </h2>

        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {features.map((f, i) => (
            <li key={i} style={{
              padding: "10px 0",
              borderBottom: i < features.length - 1 ? "1px solid #f0f0f0" : "none",
              color: "#374151",
              fontSize: "1rem",
              fontWeight: 500,
            }}>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* ── CTA Button ── */}
      <a
        href="https://dijisen.com/products/askimizin-sorulari-14-subat-ozel-quiz"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #ec4899, #a855f7)",
          color: "#fff",
          fontSize: "1.2rem",
          fontWeight: 800,
          padding: "1rem 2.5rem",
          borderRadius: 16,
          textDecoration: "none",
          boxShadow: "0 8px 30px rgba(168,85,247,.45)",
          transition: "transform .2s, box-shadow .2s",
          textAlign: "center",
          maxWidth: 520,
          width: "100%",
          boxSizing: "border-box",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 40px rgba(168,85,247,.55)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 30px rgba(168,85,247,.45)";
        }}
      >
        Hemen Satın Al 💝
      </a>
    </div>
  );
}
