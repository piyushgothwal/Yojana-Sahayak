import type { Scheme } from '../types';

/**
 * Reference catalogue of government welfare schemes with their eligibility
 * rules. These rules are sent to the AI (Claude) as context so it can reason
 * about each applicant's answers and decide eligibility.
 *
 * The `isEligible` / `reason` fields are a deterministic fallback used only
 * when the AI service is unavailable, so the app still works end to end.
 */
export const SCHEMES: Scheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Income support of ₹6,000 per year for farmers, paid in 3 installments.',
    documents: [
      { name: 'Land ownership papers' },
      { name: 'Aadhaar card' },
      { name: 'Bank account details' },
    ],
    isEligible: (a) => a.occupation === 'Farmer',
    reason: () => 'You are a farmer, which is the core requirement for PM-KISAN income support.',
  },
  {
    id: 'nmms',
    name: 'National Means-cum-Merit Scholarship',
    ministry: 'Ministry of Education',
    description: 'Scholarship of ₹12,000 per year for eligible students from low-income families.',
    documents: [
      { name: 'Aadhaar card' },
      { name: 'Income certificate' },
      { name: 'School enrollment proof' },
      { name: 'Previous year marksheet' },
    ],
    isEligible: (a) =>
      a.occupation === 'Student' && a.monthlyIncome < 12500,
    reason: () =>
      'You are a student with a monthly household income below ₹12,500, meeting the scholarship criteria.',
  },
  {
    id: 'pmjay',
    name: 'Ayushman Bharat (PM-JAY) Health Insurance',
    ministry: 'Ministry of Health & Family Welfare',
    description: 'Free health insurance cover of up to ₹5 lakh per family per year.',
    documents: [
      { name: 'Aadhaar card' },
      { name: 'Ration card' },
      { name: 'Income certificate' },
    ],
    isEligible: (a) => a.monthlyIncome < 8300,
    reason: () =>
      'Your monthly household income is below ₹8,300, the ceiling for free PM-JAY health cover.',
  },
  {
    id: 'ignoaps',
    name: 'Indira Gandhi National Old Age Pension Scheme',
    ministry: 'Ministry of Rural Development',
    description: 'Monthly pension of ₹200–500 (varies by state) for low-income seniors.',
    documents: [
      { name: 'Age proof' },
      { name: 'Aadhaar card' },
      { name: 'BPL certificate' },
    ],
    isEligible: (a) => a.age >= 60 && a.monthlyIncome < 8300,
    reason: () =>
      'You are aged 60 or above with monthly household income below ₹8,300, qualifying for the old age pension.',
  },
];

/**
 * Plain-English eligibility rules sent to the AI as context. Kept in sync with
 * the structured `SCHEMES` above so the AI's decisions match the catalogue.
 */
export const SCHEME_RULES_TEXT = `1. PM-KISAN (Income support for farmers)
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

/** Serialise the scheme catalogue into a compact id → documents map. */
export function schemesToDocumentsContext(): string {
  return SCHEMES.map(
    (s) =>
      `${s.id}: ${s.documents.map((d) => d.name).join(', ')}`,
  ).join('\n');
}
