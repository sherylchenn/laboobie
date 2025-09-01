const UTM =
  "?utm_source=growth_experiments&utm_medium=showcase_dot_elevenlabs_dot_io&utm_campaign=showcase_dot_elevenlabs_dot_io"
export const categories = [
  {
    id: "agents",
    name: "Agents",
    href: "/showcase/agents",
    extHref: `https://elevenlabs.io/conversational-ai${UTM}`,
    iconSrc: "/icons/agents.svg",
    hidden: false,
  },
  {
    id: "music",
    name: "Music",
    href: "/showcase/music",
    extHref: `https://elevenlabs.io/music${UTM}`,
    iconSrc: "/icons/music.svg",
    hidden: false,
  },
  {
    id: "text-to-speech",
    name: "Text to Speech",
    href: "/showcase/text-to-speech",
    extHref: `https://elevenlabs.io/text-to-speech${UTM}`,
    iconSrc: "/icons/text-to-speech.svg",
    hidden: false,
  },
  {
    id: "voices",
    name: "Voices",
    href: "/showcase/voices",
    extHref: `https://elevenlabs.io/voice-cloning${UTM}`,
    iconSrc: "/icons/voices.svg",
    hidden: false,
  },
  {
    id: "speech-to-text",
    name: "Speech to Text",
    href: "/showcase/speech-to-text",
    extHref: `https://elevenlabs.io/speech-to-text${UTM}`,
    iconSrc: "/icons/speech-to-text.svg",
    hidden: false,
  },
] as const

export type CategoryId = (typeof categories)[number]["id"]

export function getCategoryById(id: string) {
  return categories.find((cat) => cat.id === id)
}

export function isValidCategoryId(id: string): id is CategoryId {
  return categories.some((cat) => cat.id === id)
}
