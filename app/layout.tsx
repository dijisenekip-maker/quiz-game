import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Oyunu",
  description: "Müzik eşliğinde soru-cevap oyunu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
