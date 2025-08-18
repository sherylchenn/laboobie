import {
  BookOpen,
  Globe,
  MessageSquare,
  Mic,
  Music,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";

export type CategoryMeta = {
  id: string;
  label: string;
  Icon?: React.ComponentType<{ className?: string }>;
  iconSrc?: string;
};

const CATEGORY_MAP: Record<string, CategoryMeta> = {
  featured: { id: "featured", label: "Featured", Icon: Sparkles },
  "conversational-ai": {
    id: "conversational-ai",
    label: "Conversational AI",
    iconSrc: "/icons/conversational-ai.svg",
    Icon: MessageSquare,
  },
  "voice-cloning": {
    id: "voice-cloning",
    label: "Voice Cloning",
    iconSrc: "/icons/voice-cloning.svg",
    Icon: Mic,
  },
  audiobooks: { id: "audiobooks", label: "Audiobooks", Icon: BookOpen },
  video: { id: "video", label: "Video", Icon: Video },
  music: {
    id: "music",
    label: "Music",
    iconSrc: "/icons/music.svg",
    Icon: Music,
  },
  multilingual: { id: "multilingual", label: "Multilingual", Icon: Globe },
  api: { id: "api", label: "API", Icon: Zap },
  "speech-to-text": {
    id: "speech-to-text",
    label: "Speech to Text",
    iconSrc: "/icons/speech-to-text.svg",
  },
  "text-to-speech": {
    id: "text-to-speech",
    label: "Text to Speech",
    iconSrc: "/icons/text-to-speech.svg",
  },
};

function toTitleCaseFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((p) => (p.length ? `${p[0]?.toUpperCase()}${p.slice(1)}` : p))
    .join(" ");
}

export function getCategoryMeta(rawId: string): CategoryMeta {
  const id = rawId?.toLowerCase?.() ?? rawId;
  if (CATEGORY_MAP[id]) return CATEGORY_MAP[id]!;
  return { id, label: toTitleCaseFromSlug(id) };
}
