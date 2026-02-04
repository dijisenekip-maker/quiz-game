"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { QuizConfig } from "@/lib/defaultConfig";
import YoutubeAudio, { extractVideoId } from "./YoutubeAudio";
import Hearts from "./Hearts";
import confetti from "canvas-confetti";

/* ── shuffle a word into an array of letters (never returns original order) ── */
function shuffleWord(word: string): string[] {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (arr.join("") === word && word.length > 1) return shuffleWord(word);
  return arr;
}

type Screen = "intro" | "quiz" | "chest" | "reveal";

export default function QuizGame({ config }: { config: QuizConfig }) {
  /* ── state ── */
  const [screen,        setScreen]        = useState<Screen>("intro");
  const [qIndex,        setQIndex]        = useState(0);
  const [answer,        setAnswer]        = useState("");
  const [wrongCount,    setWrongCount]    = useState(0);
  const [errMsg,        setErrMsg]        = useState("");
  const [hint,          setHint]          = useState<string[] | null>(null);
  const [videoId,       setVideoId]       = useState<string | null>(null);
  const [showRewardImg, setShowRewardImg] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accent = config.theme.accent;

  /* ── auto-focus input whenever quiz screen or question changes ── */
  useEffect(() => {
    if (screen === "quiz") {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [screen, qIndex]);

  /* ── SUBMIT (shared by button click & Enter key) ── */
  const submitAnswer = useCallback(() => {
    const typed   = answer.trim().toLowerCase();
    if (!typed) return;

    const correct = config.questions[qIndex].a.trim().toLowerCase();

    if (typed === correct) {
      heartConfetti();
      setErrMsg("");
      setHint(null);
      setWrongCount(0);
      setAnswer("");
      qIndex < config.questions.length - 1
        ? setQIndex(prev => prev + 1)
        : setScreen("chest");
    } else {
      const next = wrongCount + 1;
      setWrongCount(next);
      if (next >= 3) {
        setHint(shuffleWord(config.questions[qIndex].a));
        setErrMsg("Yanlış cevap! İşte ipucu 👇");
      } else {
        setHint(null);
        setErrMsg(`Yanlış cevap! (${next}/3)`);
      }
    }
  }, [answer, qIndex, wrongCount, config.questions]);

  /* ── Enter key ── */
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); submitAnswer(); }
  }, [submitAnswer]);

  /* ── kalp konfeti ── */
  const heartConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.4 },
      shapes: ["circle"],
      colors: ["#ff0000", "#ff69b4", "#ff1493"],
      gravity: 1.2,
      scalar: 1.5
    });
  };

  /* ── mobil klavye scroll ── */
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }, 300);
  };

  /* ── Oyunu Başlat ── */
  const startGame = () => {
    setVideoId(extractVideoId(config.youtubeUrl));
    setScreen("quiz");
  };

  /* ── Aç (chest → reveal) ── */
  const openChest = () => {
    setScreen("reveal");
    setShowRewardImg(false);
    setTimeout(() => setShowRewardImg(true), 1000);
  };

  /* ── shared styles ── */
  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 24,
    padding: "2rem 1.5rem",
    boxShadow: "0 24px 60px rgba(0,0,0,.28)",
    width: "100%",
    maxWidth: 460,
    animation: "pop .35s cubic-bezier(.34,1.56,.64,1) both"
  };

  const btn = (active = true): React.CSSProperties => ({
    width: "100%",
    padding: "0.9rem 0",
    border: "none",
    borderRadius: 12,
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#fff",
    background: active ? accent : "#ccc",
    cursor: active ? "pointer" : "not-allowed",
    opacity: active ? 1 : 0.55,
    transition: "background .2s, opacity .2s, transform .15s",
    userSelect: "none"
  });

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem"
    }}>
      {/* hidden YouTube player (mounts after Oyunu Başlat) */}
      {videoId && <YoutubeAudio videoId={videoId} accent={accent} />}

      {/* ─── INTRO ─── */}
      {screen === "intro" && (
        <div style={card}>
          <h1 style={{ textAlign: "center", color: accent, fontSize: "2rem", marginBottom: 8 }}>
            {config.title}
          </h1>
          <p style={{ textAlign: "center", color: "#666", marginBottom: 20, lineHeight: 1.5 }}>
            Sevgilinizin seçtiği size özel müzik eşliğinde soruları doğru cevapla ve ödülünü kazan! 🎁
          </p>

          <button style={btn()} onClick={startGame}>Oyunu Başlat</button>
        </div>
      )}

      {/* ─── QUIZ ─── */}
      {screen === "quiz" && (
        <div style={card}>
          {/* progress pill */}
          <div style={{
            background: "#f0f0f0", borderRadius: 20, padding: "6px 18px",
            textAlign: "center", color: "#666", fontWeight: 600,
            marginBottom: 20, fontSize: ".9rem"
          }}>
            Soru {qIndex + 1} / {config.questions.length}
          </div>

          {/* question text */}
          <h2 style={{ textAlign: "center", color: "#222", fontSize: "1.25rem", lineHeight: 1.5, marginBottom: 24 }}>
            {config.questions[qIndex].q}
          </h2>

          {/* ── input  –  NO <form> tag ── */}
          <input
            ref={inputRef}
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={handleInputFocus}
            placeholder="Cevabını yaz..."
            style={{
              width: "100%", padding: "0.75rem 1rem",
              border: "2px solid #e0e0e0", borderRadius: 12,
              fontSize: "1rem", marginBottom: 12
            }}
          />

          {/* error banner + hint box */}
          {errMsg && (
            <div style={{ marginBottom: 12 }}>
              <p style={{
                color: "#e74c3c", fontWeight: 600, textAlign: "center",
                background: "#ffe5e5", borderRadius: 8, padding: "10px 14px"
              }}>
                {errMsg}
              </p>

              {hint && (
                <div style={{
                  marginTop: 10, background: "#fff3cd",
                  border: "2px solid #ffc107", borderRadius: 12,
                  padding: "14px 10px", textAlign: "center"
                }}>
                  <p style={{ color: "#856404", fontWeight: 600, marginBottom: 8 }}>💡 İpucu</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                    {hint.map((letter, i) => (
                      <span key={i} style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 38, height: 44, background: "#fff",
                        border: "2px solid #ffc107", borderRadius: 8,
                        fontWeight: 800, fontSize: "1.3rem", color: "#856404",
                        textTransform: "uppercase", boxShadow: "0 2px 4px rgba(0,0,0,.1)"
                      }}>
                        {letter}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Gönder butonu  –  sadece onClick, form yok ── */}
          <button style={btn(!!answer.trim())} onClick={submitAnswer}>
            Gönder
          </button>
        </div>
      )}

      {/* ─── CHEST ─── */}
      {screen === "chest" && (
        <div style={card}>
          <div style={{ fontSize: "5rem", textAlign: "center", animation: "bounce 1s ease infinite" }}>🎁</div>
          <h2 style={{ textAlign: "center", color: accent, fontSize: "1.5rem", margin: "12px 0 8px" }}>
            Ödül Sandığı
          </h2>
          <p style={{ textAlign: "center", color: "#666", marginBottom: 24 }}>
            Tüm soruları doğru cevapladın!
          </p>
          <button style={btn()} onClick={openChest}>Aç</button>
        </div>
      )}

      {/* ─── REVEAL ─── */}
      {screen === "reveal" && (
        <div style={{ ...card, position: "relative", overflow: "hidden" }}>
          <Hearts />
          <p style={{
            textAlign: "center", fontSize: "1.15rem", color: "#333",
            fontWeight: 500, lineHeight: 1.6, marginBottom: 20,
            position: "relative", zIndex: 2
          }}>
            {config.rewardMessage}
          </p>
          {showRewardImg && (
            <img
              src={config.rewardImageUrl}
              alt="Ödül"
              style={{
                width: "100%", borderRadius: 16,
                animation: "imgIn .5s ease both",
                position: "relative", zIndex: 2
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
