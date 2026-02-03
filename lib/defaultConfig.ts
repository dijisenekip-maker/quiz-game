export interface QuizConfig {
  title: string;
  youtubeUrl: string;
  questions: { q: string; a: string }[];
  rewardMessage: string;
  rewardImageUrl: string;
  theme: { accent: string };
}

export const defaultConfig: QuizConfig = {
  title: "Aşkın Oyunu",
  youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  questions: [
    { q: "İlk öpüşmemiz nerede oldu?",            a: "park" },
    { q: "Bana ilk verdiğin lakap neydi?",        a: "prenses" },
    { q: "İlk yıldönümümüzde nereye gittik?",     a: "sahil" },
    { q: "Favori şarkımızın adı ne?",             a: "unutulmaz" },
    { q: "Favori şarkımızın adı ne?",             a: "mayın tarlası" },
    { q: "Favori şarkımızın adı ne?",             a: "unutulmaz" },
    { q: "Favori şarkımızın adı ne?",             a: "unutulmaz" }
  ],
  rewardMessage:
    "Tgsdgrsgfsrgrsgsrggrr anımız muhteşem. Seni çok seviyorum! ❤️💕✨",
  rewardImageUrl:
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=600&fit=crop",
  theme: { accent: "#ff4d6d" }
};
