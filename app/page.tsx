"use client";

import { useEffect, useState } from "react";
import { getConfig } from "@/lib/config";
import QuizGame from "@/components/QuizGame";
import type { QuizConfig } from "@/lib/defaultConfig";

export default function Home() {
  const [config, setConfig] = useState<QuizConfig | null>(null);

  useEffect(() => {
    // read ?c= on client side (safe in App Router client component)
    const params = new URLSearchParams(window.location.search);
    setConfig(getConfig(params));
  }, []);

  if (!config) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: "1.2rem"
      }}>
        Yükleniyor…
      </div>
    );
  }

  return <QuizGame config={config} />;
}
