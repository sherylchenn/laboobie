"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { GenerateList } from "./list";
import { GeneratedResults } from "./results";

export function GenerateInline() {
  const [value, setValue] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(packageJson?: string) {
    try {
      setIsLoading(true);
      setError(null);
      setResult("");

      // const stream = await generateSample(packageJson || value);
      // for await (const delta of readStreamableValue(stream.output)) {
      //   setResult((currentResult) => `${currentResult}${delta}`);
      // }

      setFinished(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const hasResult = result.length > 0;

  return (
    <div>
      <div className="flex flex-col gap-4 w-full relative justify-center">
        <div
          className={cn("transition-all duration-1000", {
            "blur-sm opacity-0": hasResult,
          })}
        >
          <GenerateList />
        </div>
      </div>

      {hasResult && (
        <GeneratedResults
          result={result}
          onNew={() => {
            setValue("");
            setResult("");
            setFinished(false);
          }}
        />
      )}
    </div>
  );
}
