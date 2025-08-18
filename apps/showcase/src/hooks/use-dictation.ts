import * as React from "react";

export type UseDictationOptions = {
  endpoint?: string;
  onTranscribed?: (text: string) => void;
};

export type UseDictationState = {
  isRecording: boolean;
  isUploading: boolean;
  error: string | null;
  transcript: string;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  reset: () => void;
};

export function useDictation(
  options: UseDictationOptions = {},
): UseDictationState {
  const { endpoint = "/api/transcribe", onTranscribed } = options;
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [transcript, setTranscript] = React.useState("");

  const start = async () => {
    setError(null);
    chunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = "audio/webm";
    const rec = new MediaRecorder(stream, { mimeType });
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.onstop = async () => {
      setIsRecording(false);
      setIsUploading(true);
      try {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const form = new FormData();
        form.append("audio", blob, "dictation.webm");
        const res = await fetch(endpoint, { method: "POST", body: form });
        if (!res.ok) throw new Error(`Transcription failed: ${res.status}`);
        const json = (await res.json()) as { text?: string };
        const raw = json.text ?? "";
        const trimmed = raw.trimEnd();
        const text = trimmed.endsWith(".") ? trimmed.slice(0, -1) : trimmed;
        setTranscript(text);
        onTranscribed?.(text);
      } catch (e: unknown) {
        setError((e as Error).message);
      } finally {
        setIsUploading(false);
      }
    };
    mediaRecorderRef.current = rec;
    rec.start(100);
    setIsRecording(true);
  };

  const stop = async () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    mediaRecorderRef.current = null;
  };

  const reset = () => {
    setTranscript("");
    setError(null);
  };

  return { isRecording, isUploading, error, transcript, start, stop, reset };
}
