"use client";

import QuizGame from "./QuizGame";
import type { QuizConfig } from "@/lib/defaultConfig";

export default function QuizGameWrapper({ config }: { config: QuizConfig }) {
  return <QuizGame config={config} />;
}
