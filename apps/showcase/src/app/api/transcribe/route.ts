import { elevenlabs } from "@ai-sdk/elevenlabs";
import { experimental_transcribe as transcribe } from "ai";
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Missing ELEVENLABS_API_KEY. Add it to apps/showcase/.env.local or your hosting env.",
        },
        { status: 500 },
      );
    }

    const form = await req.formData();
    const file = form.get("audio");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing audio" }, { status: 400 });
    }
    const arrayBuf = await file.arrayBuffer();
    const model = elevenlabs.transcription("scribe_v1");
    const result = await transcribe({ model, audio: arrayBuf });
    return NextResponse.json({ text: result.text ?? "" });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
