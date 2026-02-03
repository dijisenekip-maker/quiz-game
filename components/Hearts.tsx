"use client";

import { useState, useEffect } from "react";

interface Heart { id: number; left: number }

export default function Hearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    let id = 0;
    const interval = setInterval(() => {
      id++;
      setHearts(prev => [...prev, { id, left: 5 + Math.random() * 85 }]);
    }, 280);

    const stop = setTimeout(() => clearInterval(interval), 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 5 }}>
      {hearts.map(h => (
        <span
          key={h.id}
          style={{
            position: "absolute",
            bottom: "-40px",
            left: `${h.left}%`,
            fontSize: "1.8rem",
            animation: "rise 3s ease-out forwards"
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}
