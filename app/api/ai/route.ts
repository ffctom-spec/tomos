import { runAiConsole } from "@/app/_lib/ai-providers";
import type { AiConsoleRequest } from "@/app/_lib/portal-types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AiConsoleRequest>;
    const provider = body.provider === "gemini" ? "gemini" : "openai";
    const prompt =
      typeof body.prompt === "string"
        ? body.prompt
        : "今日のTOMOS Executive Briefを要約";

    const result = await runAiConsole({ provider, prompt });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error: "AI console request failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
