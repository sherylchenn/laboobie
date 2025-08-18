import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ElevenLabs } from "../ui/elevenlabs";
import { Textarea } from "../ui/textarea";

export function GenerateInput({
  value,
  setValue,
  onSubmit,
  isLoading,
}: {
  value: string;
  setValue: (value: string) => void;
  onSubmit: (packageJson?: string) => void;
  isLoading: boolean;
}) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const placeholder = "Describe your speech...";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (
      file?.name?.endsWith("package.json") ||
      file?.name?.endsWith("requirements.txt") ||
      file?.name?.endsWith(".cursorrules")
    ) {
      const text = await file.text();

      setValue("Loading...");
      onSubmit(text);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit();
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="relative h-full">
      <div className="w-full max-w-2xl mx-auto h-[100px]">
        <form
          className="h-full"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onSubmit={handleSubmit}
        >
          <div className="relative h-full">
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-xs p-4 resize-none focus:outline-none h-full rounded-lg border-[#1A1A1A]"
            />

            {!value && (
              <div className="absolute top-4 left-4 pointer-events-none">
                {placeholder.split("").map((char, index) => (
                  <span
                    key={index.toString()}
                    style={{
                      display: "inline-block",
                      opacity: 0,
                      color: "#585858",
                      animation: `fadeIn 0.02s ease forwards ${0.2 + index * 0.002}s`,
                      fontSize: "14px",
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </div>
            )}
          </div>
        </form>
        <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            filter: blur(2px);
          }
          to {
            opacity: 1;
            filter: blur(0);
          }
        }
      `}</style>
      </div>
    </div>
  );
}
