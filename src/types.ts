export type Occupation =
  | 'Farmer'
  | 'Student'
  | 'Daily Wage Worker'
  | 'Senior Citizen'
  | 'Unemployed'
  | 'Other';

export type Category = 'General' | 'OBC' | 'SC' | 'ST';

export type Gender = 'Male' | 'Female' | 'Other';

export interface UserAnswers {
  age: number;
  occupation: Occupation;
  monthlyIncome: number;
  state: string;
  category: Category;
  gender: Gender;
}

export interface SchemeDocument {
  name: string;
  required?: boolean;
}

export interface Scheme {
  id: string;
  name: string;
  ministry: string;
  description: string;
  documents: SchemeDocument[];
  /** Returns true when the user meets this scheme's eligibility rules. */
  isEligible: (a: UserAnswers) => boolean;
  /** A short, human-readable reason for eligibility (can use the answers). */
  reason: (a: UserAnswers) => string;
}

export interface SchemeMatch {
  scheme: Scheme;
  reason: string;
}
