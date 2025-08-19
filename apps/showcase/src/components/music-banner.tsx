"use client";

import AudioMotionAnalyzer from "audiomotion-analyzer";
import { type MotionValue, motionValue } from "framer-motion";
import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume2Icon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { BannerVisualizer } from "./audio-visualizer/banner-visualizer";

// AudioMotionAnalyzer-based audio analyzer
interface AudioAnalyzerOptions {
  source: HTMLMediaElement | AudioNode;
  audioCtx?: AudioContext;
  smoothing?: number;
}

class AudioAnalyzer {
  analyzer: AudioMotionAnalyzer;
  bass: MotionValue = motionValue(0);
  lowMid: MotionValue = motionValue(0);
  mid: MotionValue = motionValue(0);
  highMid: MotionValue = motionValue(0);
  treble: MotionValue = motionValue(0);
  peak: MotionValue = motionValue(0);

  constructor({ source, audioCtx, smoothing = 0.9 }: AudioAnalyzerOptions) {
    this.analyzer = new AudioMotionAnalyzer({
      source,
      audioCtx,
      smoothing,
      useCanvas: false,
      fftSize: 1024,
      mode: 8,
      frequencyScale: "log",
      onCanvasDraw: (instance) => {
        this.bass.set(instance.getEnergy("bass"));
        this.lowMid.set(instance.getEnergy("lowMid"));
        this.mid.set(instance.getEnergy("mid"));
        this.highMid.set(instance.getEnergy("highMid"));
        this.treble.set(instance.getEnergy("treble"));
        this.peak.set(instance.getEnergy("peak"));
      },
    });
    this.analyzer.start();
  }

  get bars() {
    return this.analyzer.getBars();
  }

  destroy() {
    this.analyzer.destroy();
  }
}

/**
 * TE-style music banner
 *
 * Place your audio files in /public, e.g. /song-1.mp3
 * Update the `playlist` array with your tracks.
 */
export const MusicBanner = memo(function MusicBanner() {
  const pathname = usePathname();
  // Remove excessive logging - only log once on mount
  useEffect(() => {
    console.log("MusicBanner mounted, pathname:", pathname);
  }, []);

  // Visibility / entrance animation (keeps your original behavior)
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [animateDirection, setAnimateDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("MusicBanner: Setting isVisible to true");
      setIsVisible(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(() => setIsAnimating(false), 260);
    return () => clearTimeout(t);
  }, [isVisible]);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsAnimating(true);
    setAnimateDirection("down");
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
    }, 260);
  };

  // Hide on certain routes (same spirit as your original component)
  if (
    pathname === "/generate" ||
    pathname.includes("/games") ||
    pathname.includes("/board") ||
    pathname.endsWith("/new") ||
    pathname.endsWith("/edit")
  ) {
    return null;
  }

  // --- Player state ---
  const playlist = useMemo(
    () => [
      { src: "/music/song-80s.mp3", title: "ElevenLabs - 80s vibes" },
      { src: "/music/song-ethereal.mp3", title: "ElevenLabs - Ethereal" },
      { src: "/music/song-glitch-1.mp3", title: "ElevenLabs - Dubstep 1" },
      { src: "/music/song-rap-1.mp3", title: "ElevenLabs - Rap 1" },
      { src: "/music/song-glitch-2.mp3", title: "ElevenLabs - Dubstep 2" },
      { src: "/music/song-rap-2.mp3", title: "ElevenLabs - Rap 2" },
    ],
    [],
  );

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.9);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLInputElement | null>(null);
  const decodedDurationsRef = useRef<Map<number, number>>(new Map());
  const [resolvedDuration, setResolvedDuration] = useState<number | null>(null);
  const changeTokenRef = useRef(0);

  // Web Audio: hook analyser to audio element
  const [analyzer, setAnalyzer] = useState<AudioAnalyzer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{
    source?: MediaElementAudioSourceNode;
    analyser?: AnalyserNode;
  }>({});
  const audioInitializedRef = useRef(false);

  // Create audio context when component is visible and audio element is ready
  useEffect(() => {
    if (!isVisible) return;

    const audio = audioRef.current;
    if (!audio || audioInitializedRef.current) {
      if (audioInitializedRef.current) {
        console.log("Audio already initialized, skipping");
      }
      return;
    }

    console.log("Initializing audio context...");

    try {
      const AC: typeof AudioContext =
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) {
        console.error("AudioContext not available");
        return;
      }

      const ctx = new AC();
      audioContextRef.current = ctx;
      console.log("Created AudioContext, state:", ctx.state);

      // Create AudioAnalyzer wrapper with higher smoothing for less sensitivity
      const audioAnalyzer = new AudioAnalyzer({
        source: audio,
        audioCtx: ctx,
        smoothing: 0.935, // Higher smoothing = less sensitive/jumpy
      });
      setAnalyzer(audioAnalyzer);
      audioInitializedRef.current = true;

      console.log("AudioMotionAnalyzer initialized");
    } catch (err) {
      console.error("Failed to create audio context:", err);
      setAnalyzer(null);
    }

    // Cleanup
    return () => {
      // Use the current analyzer state
      setAnalyzer((currentAnalyzer) => {
        if (currentAnalyzer) {
          currentAnalyzer.destroy();
        }
        return null;
      });
    };
  }, [isVisible]); // Run when component becomes visible

  // Resume audio context when playing
  const ensureAudioContextResumed = async () => {
    const ctx = audioContextRef.current;
    if (ctx && ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch (err) {
        console.error("Failed to resume audio context:", err);
      }
    }
  };

  // Load & react to track changes and when the banner becomes visible
  useEffect(() => {
    if (!isVisible) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = playlist[trackIndex]?.src || "";
    audio.load();
    const onError = () => {
      // eslint-disable-next-line no-console
      console.error("Audio failed to load:", audio.error, "src:", audio.src);
    };
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("error", onError);
    };
  }, [trackIndex, isVisible]);

  // Hook up audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      const d = audio.duration;
      if (Number.isFinite(d) && d > 0) {
        setDuration(d);
        setResolvedDuration(d);
      }
    };
    const onDuration = () => {
      const d = audio.duration;
      if (Number.isFinite(d) && d > 0) {
        setDuration(d);
        setResolvedDuration(d);
      }
    };
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onEnded = () => handleNext(true);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("durationchange", onDuration);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("durationchange", onDuration);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // Keep currentTime in sync while playing (in case timeupdate is throttled)
  useEffect(() => {
    if (!isPlaying) return;
    const audio = audioRef.current;
    if (!audio) return;
    let rafId = 0;
    const tick = () => {
      setCurrentTime(audio.currentTime || 0);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying]);

  // Try to resolve duration by decoding the audio if metadata is missing/Infinity
  const resolveDurationViaDecode = async (
    src: string,
  ): Promise<number | null> => {
    try {
      const res = await fetch(src);
      if (!res.ok) return null;
      const arrayBuffer = await res.arrayBuffer();
      const AC: typeof AudioContext =
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
      const seconds = audioBuffer?.duration ?? 0;
      ctx.close?.();
      return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
    } catch {
      return null;
    }
  };

  const ensureResolvedDuration = async () => {
    const cached = decodedDurationsRef.current.get(trackIndex);
    if (typeof cached === "number" && cached > 0) {
      setResolvedDuration(cached);
      return;
    }
    const src = playlist[trackIndex]?.src;
    if (!src) return;
    const d = await resolveDurationViaDecode(src);
    if (typeof d === "number" && d > 0) {
      decodedDurationsRef.current.set(trackIndex, d);
      setResolvedDuration(d);
    }
  };

  // Reset resolved duration on track change
  useEffect(() => {
    setResolvedDuration(decodedDurationsRef.current.get(trackIndex) ?? null);
  }, [trackIndex]);

  // When playback starts, attempt to resolve duration if still unknown
  useEffect(() => {
    if (!isPlaying) return;
    const hasKnown = Number.isFinite(duration) && duration > 0;
    if (!hasKnown && (resolvedDuration == null || resolvedDuration <= 0)) {
      void ensureResolvedDuration();
    }
  }, [isPlaying, trackIndex, duration, resolvedDuration]);

  // React to play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    if (isPlaying) {
      audio
        .play()
        .then(() => {})
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, volume]);

  // Core loader that switches tracks and optionally autoplays from 0
  const loadTrack = async (nextIdx: number, autoplay: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    const token = ++changeTokenRef.current;
    const src = playlist[nextIdx]?.src || "";
    setTrackIndex(nextIdx);
    setCurrentTime(0);
    setDuration(0);
    setResolvedDuration(decodedDurationsRef.current.get(nextIdx) ?? null);

    audio.src = src;
    audio.currentTime = 0;
    audio.load();

    const tryPlay = async () => {
      if (!autoplay) return;
      if (token !== changeTokenRef.current) return;
      try {
        await ensureAudioContextResumed();
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Failed to play audio:", err);
        setIsPlaying(false);
      }
    };

    const onCanPlay = () => {
      audio.removeEventListener("canplay", onCanPlay);
      void tryPlay();
    };

    audio.addEventListener("canplay", onCanPlay, { once: true });
    // Fallback: try to play immediately as well
    void tryPlay();
  };

  const togglePlay = () => {
    if (!isPlaying) {
      void ensureAudioContextResumed();
    }
    setIsPlaying((p) => !p);
  };

  // Spotify-like prev behavior: if >2s into track, seek to start; otherwise go to previous track
  const handlePrev = async () => {
    const audio = audioRef.current;
    const wasPlaying = isPlaying;
    if (audio && audio.currentTime > 2) {
      audio.currentTime = 0;
      setCurrentTime(0);
      if (!wasPlaying) return; // keep paused if it was paused
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }
    const prevIdx = (trackIndex - 1 + playlist.length) % playlist.length;
    // Autoplay only if it was playing before
    await loadTrack(prevIdx, wasPlaying);
  };

  // Spotify-like next behavior: autoplay only if currently playing
  const handleNext = async (forceAutoplay?: boolean) => {
    const wasPlaying = isPlaying;
    const nextIdx = (trackIndex + 1) % playlist.length;
    await loadTrack(nextIdx, forceAutoplay ?? wasPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(e.target.value);
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const prettyTime = (t: number) => {
    if (!Number.isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const slideClass = isAnimating
    ? animateDirection === "down"
      ? "animate-out slide-out-to-bottom duration-300"
      : "animate-in slide-in-from-bottom-full duration-300"
    : "";

  if (!isVisible) return null;

  // Choose the best-known duration (metadata or decoded) for slider max/right time
  const targetDuration =
    (Number.isFinite(duration) && duration > 0 ? duration : Number.NaN) ||
    (typeof resolvedDuration === "number" && resolvedDuration > 0
      ? resolvedDuration
      : Number.NaN);
  const hasKnownDuration =
    Number.isFinite(targetDuration) && targetDuration > 0;
  const effectiveMax = hasKnownDuration
    ? (targetDuration as number)
    : Math.max(currentTime, 1);
  const effectiveRightTime = hasKnownDuration
    ? (targetDuration as number)
    : currentTime;

  return (
    <div
      className={`fixed ${slideClass} z-50 bottom-0 left-0 right-0 md:bottom-4 md:left-auto md:right-6 w-full md:w-[380px] overflow-hidden border border-neutral-800/70 rounded-t-2xl md:rounded-2xl text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]`}
      style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        background: "linear-gradient(to bottom, #171717 0%, #121212 100%)",
      }}
    >
      {/* Top bar */}
      <div className="relative">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-2 top-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          <XIcon className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-[84px_1fr] gap-3 p-4">
          {/* Visualizer */}
          <div className="relative flex items-center justify-center">
            <div className="h-[100px] w-[100px] overflow-hidden bg-transparent">
              <BannerVisualizer analyser={analyzer} isPlaying={isPlaying} />
            </div>
          </div>

          {/* Meta & Controls */}
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2">
              <Link
                href="https://elevenlabs.io/music"
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-[10px] uppercase tracking-[0.1em] text-neutral-400 hover:text-neutral-300 transition-colors"
              >
                ElevenLabs Music API
              </Link>
            </div>
            <div className="truncate font-medium leading-tight">
              {playlist[trackIndex]?.title}
            </div>

            {/* Transport */}
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous"
                className="h-7 w-7 rounded-xl border border-neutral-700 hover:border-neutral-500 active:scale-[0.98] grid place-items-center"
              >
                <SkipBackIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="h-8 px-3 rounded-xl border border-neutral-300 text-black bg-white hover:bg-neutral-100 active:scale-[0.98] inline-flex items-center gap-1"
              >
                {isPlaying ? (
                  <>
                    <PauseIcon className="h-4 w-4" />
                    <span className="text-xs">Pause</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4" />
                    <span className="text-xs">Play</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => void handleNext()}
                aria-label="Next"
                className="h-7 w-7 rounded-xl border border-neutral-700 hover:border-neutral-500 active:scale-[0.98] grid place-items-center"
              >
                <SkipForwardIcon className="h-4 w-4" />
              </button>

              {/* Volume */}
              <div className="ml-auto flex items-center gap-1">
                <Volume2Icon className="h-3.5 w-3.5 text-neutral-500" />
                <input
                  aria-label="Volume"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="h-1.5 w-20 accent-white cursor-pointer"
                />
              </div>
            </div>

            {/* Seek bar */}
            <div className="mt-2">
              <input
                ref={progressRef}
                type="range"
                min={0}
                max={effectiveMax}
                step={0.01}
                value={Math.min(currentTime, effectiveMax)}
                onChange={handleSeek}
                className="w-full h-1.5 accent-white cursor-pointer"
                aria-label="Seek"
              />
              <div className="mt-1 flex justify-between text-[10px] text-neutral-500">
                <span>{prettyTime(currentTime)}</span>
                <span>{prettyTime(effectiveRightTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      {/* biome-ignore lint/a11y/useMediaCaption: Music player doesn't need captions */}
      <audio
        ref={audioRef}
        preload="metadata"
        src={playlist[trackIndex]?.src || ""}
        aria-label="Music"
        aria-describedby="music-banner-audio"
      />
    </div>
  );
});
