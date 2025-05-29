"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

interface VoiceSample {
  id: string;
  name: string;
  prompt: string;
  description: string;
  category: string;
  audioUrl: string;
  duration: string;
  votes: number;
  author?: string;
}

const voiceSamples: VoiceSample[] = [
  {
    id: "1",
    name: "Morgan Freeman Narration",
    prompt:
      "In a world where technology meets humanity, one voice stands above the rest. This is the story of innovation, told with the warmth and gravitas you've come to expect.",
    description: "Deep, authoritative narration style",
    category: "Narration",
    audioUrl: "/samples/morgan-freeman.mp3",
    duration: "0:18",
    votes: 1247,
    author: "Alex Chen",
  },
  {
    id: "2",
    name: "Excited Product Launch",
    prompt:
      "Introducing the revolutionary new iPhone 16 Pro Max Ultra! With features that will blow your mind and a design that screams innovation!",
    description: "High-energy tech announcement",
    category: "Commercial",
    audioUrl: "/samples/product-launch.mp3",
    duration: "0:15",
    votes: 892,
    author: "Sarah Kim",
  },
  {
    id: "3",
    name: "Bedtime Story",
    prompt:
      "Once upon a time, in a magical forest where the moonlight danced between ancient trees, lived a little rabbit named Luna who loved to explore...",
    description: "Gentle, soothing children's story",
    category: "Storytelling",
    audioUrl: "/samples/bedtime-story.mp3",
    duration: "0:22",
    votes: 756,
    author: "Emma Wilson",
  },
  {
    id: "4",
    name: "News Anchor",
    prompt:
      "Breaking news: Scientists at MIT have discovered a groundbreaking method to reverse climate change using quantum computing technology.",
    description: "Professional broadcast voice",
    category: "News",
    audioUrl: "/samples/news-anchor.mp3",
    duration: "0:12",
    votes: 634,
    author: "James Liu",
  },
  {
    id: "5",
    name: "Spanish Poetry",
    prompt:
      "En el jardín de mis sueños, donde las flores cantan melodías olvidadas, encontré tu recuerdo bailando con el viento...",
    description: "Emotional Spanish recitation",
    category: "Multilingual",
    audioUrl: "/samples/spanish-poetry.mp3",
    duration: "0:16",
    votes: 589,
    author: "Carlos Mendez",
  },
  {
    id: "6",
    name: "Meditation Guide",
    prompt:
      "Take a deep breath in... and slowly release. Feel your body relaxing, starting from the top of your head, flowing down through your shoulders...",
    description: "Calming meditation voice",
    category: "Wellness",
    audioUrl: "/samples/meditation.mp3",
    duration: "0:20",
    votes: 512,
    author: "Maya Patel",
  },
  {
    id: "7",
    name: "Game Character",
    prompt:
      "You dare challenge me, mortal? I am Zarthok, destroyer of worlds! Your puny weapons cannot pierce my ancient armor!",
    description: "Epic villain voice",
    category: "Gaming",
    audioUrl: "/samples/game-villain.mp3",
    duration: "0:14",
    votes: 445,
    author: "Ryan Torres",
  },
  {
    id: "8",
    name: "French Cooking Show",
    prompt:
      "Aujourd'hui, nous allons préparer un magnifique coq au vin avec une touche moderne. D'abord, prenez votre plus belle cocotte...",
    description: "Elegant French chef",
    category: "Multilingual",
    audioUrl: "/samples/french-cooking.mp3",
    duration: "0:17",
    votes: 398,
    author: "Sophie Laurent",
  },
  {
    id: "9",
    name: "Podcast Intro",
    prompt:
      "Welcome back to 'Tech Talk Daily,' where we dive deep into the latest innovations shaping our digital future. I'm your host, and today we have an incredible guest...",
    description: "Engaging podcast host",
    category: "Podcast",
    audioUrl: "/samples/podcast-intro.mp3",
    duration: "0:13",
    votes: 367,
    author: "Mike Johnson",
  },
];

export function VoiceSamples() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>(
    voiceSamples.reduce(
      (acc, sample) => ({ ...acc, [sample.id]: sample.votes }),
      {},
    ),
  );
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [expandedPrompts, setExpandedPrompts] = useState<Set<string>>(
    new Set(),
  );

  const handlePlay = (sample: VoiceSample) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (playing === sample.id) {
      setPlaying(null);
      return;
    }

    const newAudio = new Audio(sample.audioUrl);
    newAudio
      .play()
      .catch((err) => console.error("Audio playback failed:", err));
    newAudio.onended = () => setPlaying(null);
    setAudio(newAudio);
    setPlaying(sample.id);
  };

  const handleVote = (e: React.MouseEvent, sampleId: string) => {
    e.stopPropagation();
    if (voted.has(sampleId)) {
      setVoted((prev) => {
        const newSet = new Set(prev);
        newSet.delete(sampleId);
        return newSet;
      });
      setVotes((prev) => ({ ...prev, [sampleId]: prev[sampleId] - 1 }));
    } else {
      setVoted((prev) => new Set(prev).add(sampleId));
      setVotes((prev) => ({ ...prev, [sampleId]: prev[sampleId] + 1 }));
    }
  };

  const togglePrompt = (e: React.MouseEvent, sampleId: string) => {
    e.stopPropagation();
    setExpandedPrompts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sampleId)) {
        newSet.delete(sampleId);
      } else {
        newSet.add(sampleId);
      }
      return newSet;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
      {voiceSamples.map((sample, index) => (
        <motion.div
          key={sample.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          className="group relative bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626] rounded-lg p-5 hover:border-[#878787] dark:hover:border-[#404040] transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-medium text-base mb-1">{sample.name}</h3>
              <p className="text-sm text-[#878787] mb-2">
                {sample.description}
              </p>

              {/* Prompt section */}
              <div className="mb-3">
                <button
                  onClick={(e) => togglePrompt(e, sample.id)}
                  className="text-xs text-[#878787] hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>View prompt</span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className={`transition-transform ${expandedPrompts.has(sample.id) ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {expandedPrompts.has(sample.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-3 bg-[#F5F5F5] dark:bg-[#1A1A1A] rounded text-xs text-[#666] dark:text-[#999] italic"
                  >
                    <Link href={`/${sample.slug}`}>
                      <div className="h-full overflow-y-auto">
                        <code className={cn("block pr-3", "text-xs")}>
                          truncateContent(sample.content, small ? 70 : 200)
                        </code>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
            <button
              onClick={() => handlePlay(sample)}
              className="ml-3 w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0"
              aria-label={playing === sample.id ? "Pause" : "Play"}
            >
              {playing === sample.id ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#F5F5F5] dark:bg-[#1A1A1A] rounded text-[#666] dark:text-[#999]">
                {sample.category}
              </span>
              <span className="text-[#878787]">{sample.duration}</span>
            </div>

            <div className="flex items-center gap-2">
              {sample.author && (
                <span className="text-[#878787]">by {sample.author}</span>
              )}
              <button
                onClick={(e) => handleVote(e, sample.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                  voted.has(sample.id)
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#666] dark:text-[#999] hover:bg-[#E5E5E5] dark:hover:bg-[#262626]"
                }`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill={voted.has(sample.id) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{votes[sample.id]}</span>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
