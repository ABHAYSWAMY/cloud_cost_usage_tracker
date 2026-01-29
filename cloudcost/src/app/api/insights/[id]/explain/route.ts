import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1️⃣ Fetch insight
  const insight = await prisma.insight.findUnique({
    where: { id },
  });

  if (!insight) {
    return NextResponse.json(
      { error: "Insight not found" },
      { status: 404 }
    );
  }

  const metadata = insight.metadata as any;

  // 2️⃣ If explanation already exists → return it
  if (metadata?.explanation) {
    return NextResponse.json({
      explanation: metadata.explanation,
      cached: true,
    });
  }

  // 3️⃣ Build AI prompt (very controlled)
  const prompt = `
You are a cloud cost optimization assistant.

Explain the following cost anomaly in simple, non-technical language.

Rules:
- Do NOT invent data
- Do NOT assume certainty
- Use phrases like "likely", "possibly", "often"
- Keep it concise (3–4 sentences max)

Anomaly details:
${JSON.stringify(metadata, null, 2)}
`;

  // 4️⃣ Call OpenAI
  let explanation = "";

try {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You explain cloud cost anomalies." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  explanation =
    completion.choices[0].message.content ??
    "No explanation generated.";

} catch (err: any) {
  // 🔥 Graceful fallback
  explanation =
    "This cost spike was detected based on a significant increase compared to the previous day. Such spikes often occur due to scaling events, new deployments, or increased usage in the affected service and region. Reviewing recent changes or workload activity during this period may help identify the exact cause.";
}


  // 5️⃣ Persist explanation
  await prisma.insight.update({
    where: { id },
    data: {
      metadata: {
        ...metadata,
        explanation,
      },
    },
  });

  return NextResponse.json({
    explanation,
    cached: false,
  });
}
