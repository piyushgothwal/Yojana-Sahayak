import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Gemini free-tier model. Update to a newer model id when Google releases one.
const MODEL = "gemini-2.0-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const SCHEME_RULES_TEXT = `1. PM-KISAN (Income support for farmers)
Eligible if: occupation is "Farmer"
Gives: ₹6,000/year in 3 installments
Documents needed: Land ownership papers, Aadhaar card, bank account details

2. National Means-cum-Merit Scholarship
Eligible if: occupation is "Student" AND monthly household income is below ₹12,500
Gives: ₹12,000/year scholarship
Documents needed: Aadhaar card, income certificate, school enrollment proof, previous year marksheet

3. Ayushman Bharat (PM-JAY) Health Insurance
Eligible if: monthly household income is below ₹8,300, any occupation
Gives: ₹5 lakh/year free health insurance coverage per family
Documents needed: Aadhaar card, ration card, income certificate

4. Indira Gandhi National Old Age Pension Scheme
Eligible if: age is 60 or above AND monthly household income is below ₹8,300
Gives: ₹200-500/month pension (varies by state)
Documents needed: Age proof, Aadhaar card, BPL certificate`;

const SCHEME_IDS = [
  "pm-kisan",
  "nmms",
  "pmjay",
  "ignoaps",
] as const;

interface ApplicantAnswers {
  age: number;
  occupation: string;
  monthlyIncome: number;
  state: string;
  category: string;
  gender: string;
}

interface AiSchemeVerdict {
  schemeId: string;
  eligible: boolean;
  reason: string;
}

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function buildPrompt(a: ApplicantAnswers): string {
  return [
    "You are Yojana Sahayak, an assistant that decides which Indian government welfare schemes an applicant qualifies for.",
    "",
    "Applicant details:",
    `- Age: ${a.age}`,
    `- Occupation: ${a.occupation}`,
    `- Monthly household income (INR): ${a.monthlyIncome}`,
    `- State: ${a.state}`,
    `- Category: ${a.category}`,
    `- Gender: ${a.gender}`,
    "",
    "Scheme eligibility rules:",
    SCHEME_RULES_TEXT,
    "",
    "Instructions:",
    "- Evaluate EACH of the four schemes against the applicant's details using ONLY the rules above.",
    "- For every scheme, set eligible to true or false based strictly on the eligibility condition.",
    '- "reason" must be ONE short sentence. If eligible, explain why. If not eligible, explain the missing condition.',
    "- Return ONLY valid JSON, no markdown, no explanation outside the JSON.",
    '- JSON shape: { "results": [{ "schemeId": "pm-kisan" | "nmms" | "pmjay" | "ignoaps", "eligible": boolean, "reason": string }] }',
    "- The results array must contain exactly four entries, one per scheme id.",
  ].join("\n");
}

function extractJson(text: string): unknown {
  let cleaned = text.trim();
  // Strip markdown code fences if present.
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  }
  return JSON.parse(cleaned);
}

function normaliseVerdicts(raw: unknown): AiSchemeVerdict[] {
  if (
    typeof raw !== "object" ||
    raw === null ||
    !Array.isArray((raw as any).results)
  ) {
    throw new Error("Malformed AI response: missing results array.");
  }
  const seen = new Set<string>();
  const verdicts: AiSchemeVerdict[] = [];
  for (const item of (raw as any).results) {
    if (typeof item !== "object" || item === null) continue;
    const schemeId = String(item.schemeId);
    if (!SCHEME_IDS.includes(schemeId as any)) continue;
    if (seen.has(schemeId)) continue;
    seen.add(schemeId);
    verdicts.push({
      schemeId,
      eligible: Boolean(item.eligible),
      reason: typeof item.reason === "string" ? item.reason : "",
    });
  }
  return verdicts;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonError(405, "Method not allowed. Use POST.");
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return jsonError(
      500,
      "Gemini API key is not configured. Set the GEMINI_API_KEY edge function secret.",
    );
  }

  let answers: ApplicantAnswers;
  try {
    const body = await req.json();
    if (
      typeof body?.age !== "number" ||
      typeof body?.occupation !== "string" ||
      typeof body?.monthlyIncome !== "number" ||
      typeof body?.state !== "string" ||
      typeof body?.category !== "string" ||
      typeof body?.gender !== "string"
    ) {
      return jsonError(400, "Missing or invalid applicant answers.");
    }
    answers = body as ApplicantAnswers;
  } catch {
    return jsonError(400, "Invalid JSON body.");
  }

  try {
    const response = await fetch(`${API_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildPrompt(answers) }],
          },
        ],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("Gemini API error:", response.status, errText);
      return jsonError(
        502,
        `The AI service returned an error (status ${response.status}).`,
      );
    }

    const data = await response.json();
    // Gemini response shape: { candidates: [{ content: { parts: [{ text }] } }] }
    const text: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ??
      "";
    if (!text) {
      return jsonError(502, "The AI service returned an empty response.");
    }

    let parsed: unknown;
    try {
      parsed = extractJson(text);
    } catch {
      console.error("Failed to parse AI JSON:", text);
      return jsonError(502, "The AI service returned malformed JSON.");
    }

    const verdicts = normaliseVerdicts(parsed);
    return new Response(
      JSON.stringify({ results: verdicts }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return jsonError(500, "Unexpected error while checking eligibility.");
  }
});
