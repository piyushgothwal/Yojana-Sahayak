# Yojana Sahayak

AI-powered government scheme eligibility assistant that helps citizens discover which welfare schemes they qualify for — in plain language, in under 2 minutes.

## Problem
Millions of eligible citizens miss out on government welfare schemes because information is scattered across complex PDFs and portals, written in language that's hard to parse. This "last-mile" gap means funds meant to help people go unused every year.

## Solution
Yojana Sahayak asks users 6 simple questions — age, occupation, income, state, category, gender — then uses an AI model to reason over real scheme eligibility criteria and explain, in plain language, which schemes they qualify for, why, and what documents they need.

## AI Architecture
- User inputs are sent to a secure backend edge function, which forwards them to the Gemini API along with curated scheme eligibility rules
- The AI evaluates each scheme and returns which ones the user qualifies for, with a one-line reason for each — this is reasoning over rules, not rigid if-else logic, so it handles nuance and overlapping eligibility correctly
- Only qualifying schemes are shown, each as a card with the reason and a documents-needed checklist
- If the AI call fails for any reason, the app falls back to a deterministic rule-checker so it never shows a broken screen

## Tech Stack
- Frontend: React + TypeScript + Tailwind CSS (built via Bolt.new)
- Backend: Supabase Edge Functions
- AI: Google Gemini API for eligibility reasoning
- Hosting: Bolt Hosting

## Local Setup
1. Clone this repo: `git clone https://github.com/piyushgothwal/Yojana-Sahayak.git`
2. Install dependencies: `npm install`
3. Add your Gemini API key as a secret named `GEMINI_API_KEY` in your Supabase Edge Functions settings
4. Run: `npm run dev`

## Live Demo
https://yojana-sahayak.bolt.host

## Schemes Currently Covered
- PM-KISAN (income support for farmers)
- National Means-cum-Merit Scholarship
- Ayushman Bharat (PM-JAY) Health Insurance
- Indira Gandhi National Old Age Pension Scheme

## Roadmap
- Voice input/output for low-literacy users
- Multi-language support (Hindi and regional languages)
- Expand to state-specific schemes and full pan-India coverage

## Team
:Team Name - (Ctrl+Alt+Win)

:Team Leader - Piyush Gothwal

:UI/UX designer - Mehak 

:Content Producer - Riya Sharma 
