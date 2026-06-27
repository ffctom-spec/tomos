import { reviewContentWithOpenAI } from "@/app/_lib/ai-providers";
import type { AiReviewRequest } from "@/app/_lib/portal-types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AiReviewRequest>;
    const payload: AiReviewRequest = {
      content:
        typeof body.content === "string"
          ? body.content
          : "0円でできる土壌改良を紹介します。",
      brand: typeof body.brand === "string" ? body.brand : "VERDNA",
      channel: typeof body.channel === "string" ? body.channel : "Instagram",
    };

    const result = await reviewContentWithOpenAI(payload);

    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error: "Content review failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
