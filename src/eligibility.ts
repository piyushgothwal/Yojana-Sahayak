import type { SchemeMatch, UserAnswers } from './types';
import { SCHEMES } from './data/schemes';

/**
 * AI eligibility check.
 *
 * The frontend POSTs the user's answers to the `check-eligibility` Supabase
 * Edge Function, which forwards them (plus the scheme eligibility rules) to
 * the Anthropic Claude API. Claude returns a per-scheme eligible/reason
 * verdict; we map those onto the local scheme catalogue (which carries the
 * document checklists) and keep only the eligible ones.
 *
 * If the AI service is unreachable or returns an error, we fall back to the
 * deterministic local matcher so the app never shows a blank failure.
 */

export interface AiSchemeVerdict {
  schemeId: string;
  eligible: boolean;
  reason: string;
}

interface EligibilityApiResponse {
  results: AiSchemeVerdict[];
  error?: string;
}

const MIN_LOADING_MS = 1400;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function edgeFunctionUrl(): string {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return `${url}/functions/v1/check-eligibility`;
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
}

function localMatches(answers: UserAnswers): SchemeMatch[] {
  return SCHEMES.filter((s) => s.isEligible(answers)).map((scheme) => ({
    scheme,
    reason: scheme.reason(answers),
  }));
}

/**
 * Call the AI-backed edge function and return only the schemes Claude marked
 * eligible. Falls back to the deterministic matcher on any failure.
 */
export async function checkEligibility(
  answers: UserAnswers,
): Promise<SchemeMatch[]> {
  const start = Date.now();

  let aiResults: AiSchemeVerdict[] | null = null;
  try {
    const response = await fetch(edgeFunctionUrl(), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(answers),
    });

    if (response.ok) {
      const data = (await response.json()) as EligibilityApiResponse;
      if (Array.isArray(data.results)) {
        aiResults = data.results;
      }
    }
  } catch {
    // Network error — fall through to local matcher.
    aiResults = null;
  }

  const matches: SchemeMatch[] =
    aiResults !== null ? matchesFromAi(aiResults) : localMatches(answers);

  const elapsed = Date.now() - start;
  if (elapsed < MIN_LOADING_MS) {
    await delay(MIN_LOADING_MS - elapsed);
  }

  return matches;
}

function matchesFromAi(verdicts: AiSchemeVerdict[]): SchemeMatch[] {
  const byId = new Map(SCHEMES.map((s) => [s.id, s]));
  const matches: SchemeMatch[] = [];
  for (const v of verdicts) {
    if (!v.eligible) continue;
    const scheme = byId.get(v.schemeId);
    if (!scheme) continue;
    matches.push({
      scheme,
      reason: v.reason || scheme.reason({} as UserAnswers),
    });
  }
  return matches;
}
