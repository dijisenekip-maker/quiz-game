"use client";

import { useEffect, useRef, useState } from "react";

/* ── global YT types (minimal) ── */
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface Props {
  videoId: string;
  accent: string;
  onError?: () => void;
}

/* ── parse VIDEO_ID from any YouTube URL ── */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&#]+)/,          // youtube.com/watch?v=ID
    /youtu\.be\/([^?&#]+)/,    // youtu.be/ID
    /\/embed\/([^?&#]+)/       // youtube.com/embed/ID
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

export default function YoutubeAudio({ videoId, accent, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef    = useRef<any>(null);
  const [ready,   setReady]   = useState(false);
  const [playing, setPlaying] = useState(false);

  /* ── load IFrame API once, then init player ── */
  useEffect(() => {
    const init = () => {
      if (!containerRef.current || playerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: "1", width: "1", videoId,
        playerVars: { autoplay: 0, controls: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady:       (ev: any) => { setReady(true); ev.target.playVideo(); },
          onError:       ()        => onError?.(),
          onStateChange: (ev: any) => setPlaying(ev.data === 1)
        }
      });
    };

    if (window.YT?.Player) {
      init();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = init;
    }

    return () => {
      try { playerRef.current?.destroy(); } catch {}
      playerRef.current = null;
    };
  }, [videoId]);                            // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    try {
      playing ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo();
    } catch {}
  };

  return (
    <>
      {/* hidden 1×1 container for YT to attach to */}
      <div ref={containerRef} style={{ position: "fixed", left: "-9999px", top: 0, width: 1, height: 1 }} />

      {/* floating play / pause button – visible only after player is ready */}
      {ready && (
        <button
          onClick={toggle}
          aria-label={playing ? "Müziği duraklat" : "Müziği çal"}
          style={{
            position: "fixed", bottom: "1.5rem", right: "1.5rem",
            width: 56, height: 56, borderRadius: "50%",
            background: accent, color: "#fff", border: "none",
            fontSize: "1.4rem", cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0,0,0,.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 999,
            animation: "pulse 2s infinite"
          }}
        >
          {playing ? "⏸️" : "▶️"}
        </button>
      )}
    </>
  );
}
