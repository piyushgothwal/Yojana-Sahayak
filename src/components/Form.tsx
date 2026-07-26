import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type {
  Category,
  Gender,
  Occupation,
  UserAnswers,
} from '../types';
import { STATES } from '../data/states';

interface FormProps {
  onSubmit: (answers: UserAnswers) => void;
  onBack: () => void;
}

interface Field<T> {
  key: keyof UserAnswers;
  question: string;
  helper: string;
  placeholder?: string;
  type: 'number' | 'select';
  options?: readonly string[];
  validate: (v: T) => string | null;
}

const numericFields = ['age', 'monthlyIncome'] as const;

const fields: Field<any>[] = [
  {
    key: 'age',
    question: 'How old are you?',
    helper: 'Your age helps filter schemes with age-based eligibility.',
    type: 'number',
    placeholder: 'e.g. 32',
    validate: (v: number) =>
      v == null || Number.isNaN(v)
        ? 'Please enter your age.'
        : v < 1 || v > 120
          ? 'Enter an age between 1 and 120.'
          : null,
  },
  {
    key: 'occupation',
    question: 'What best describes your occupation?',
    helper: 'Different schemes are designed for different livelihoods.',
    type: 'select',
    options: [
      'Farmer',
      'Student',
      'Daily Wage Worker',
      'Senior Citizen',
      'Unemployed',
      'Other',
    ] as const,
    validate: (v: string) => (v ? null : 'Please select an occupation.'),
  },
  {
    key: 'monthlyIncome',
    question: 'What is your monthly household income?',
    helper: 'Enter the total income of everyone in your household, in INR.',
    type: 'number',
    placeholder: 'e.g. 12000',
    validate: (v: number) =>
      v == null || Number.isNaN(v)
        ? 'Please enter your monthly income.'
        : v < 0
          ? 'Income cannot be negative.'
          : null,
  },
  {
    key: 'state',
    question: 'Which state do you live in?',
    helper: 'Some schemes vary by state.',
    type: 'select',
    options: STATES,
    validate: (v: string) => (v ? null : 'Please select your state.'),
  },
  {
    key: 'category',
    question: 'Which category do you belong to?',
    helper: 'Used for category-specific schemes. Choose General if unsure.',
    type: 'select',
    options: ['General', 'OBC', 'SC', 'ST'] as const,
    validate: (v: string) => (v ? null : 'Please select a category.'),
  },
  {
    key: 'gender',
    question: 'What is your gender?',
    helper: 'A few schemes are gender-specific.',
    type: 'select',
    options: ['Male', 'Female', 'Other'] as const,
    validate: (v: string) => (v ? null : 'Please select your gender.'),
  },
];

const EMPTY: UserAnswers = {
  age: NaN,
  occupation: '' as Occupation,
  monthlyIncome: NaN,
  state: '',
  category: '' as Category,
  gender: '' as Gender,
};

export function Form({ onSubmit, onBack }: FormProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [fieldTouched, setFieldTouched] = useState(false);

  const field = fields[step];
  const total = fields.length;
  const value = answers[field.key];
  const isNumeric = numericFields.includes(field.key as any);

  useEffect(() => {
    setError(null);
    setFieldTouched(false);
  }, [step]);

  function update(val: string | number) {
    setAnswers((prev) => ({
      ...prev,
      [field.key]: isNumeric ? Number(val) : (val as any),
    }));
    setFieldTouched(true);
  }

  function next() {
    const err = field.validate(value);
    if (err) {
      setError(err);
      return;
    }
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      onSubmit(answers);
    }
  }

  function back() {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onBack();
    }
  }

  const progress = ((step + 1) / total) * 100;

  return (
    <div className="animate-fade-in-up w-full">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-navy-400">
          <span>
            Question {step + 1} of {total}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-navy-100">
          <div
            className="h-full rounded-full bg-saffron-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
        <h2 className="text-xl font-bold text-navy-600 sm:text-2xl">
          {field.question}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-navy-400">
          {field.helper}
        </p>

        <div className="mt-6">
          {field.type === 'number' ? (
            <input
              type="number"
              inputMode="numeric"
              value={
                isNumeric && !Number.isNaN(value)
                  ? String(value)
                  : ''
              }
              placeholder={field.placeholder}
              onChange={(e) => update(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') next();
              }}
              autoFocus
              className="w-full rounded-xl border border-navy-100 bg-paper px-4 py-3.5 text-lg text-navy-600 outline-none transition-all duration-200 placeholder:text-navy-300 focus:border-saffron-400 focus:bg-white focus:ring-4 focus:ring-saffron-100"
            />
          ) : (
            <select
              value={value as string}
              onChange={(e) => update(e.target.value)}
              autoFocus
              className="w-full appearance-none rounded-xl border border-navy-100 bg-paper bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat px-4 py-3.5 text-lg text-navy-600 outline-none transition-all duration-200 focus:border-saffron-400 focus:bg-white focus:ring-4 focus:ring-saffron-100"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231B2A4A' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
              }}
            >
              <option value="" disabled>
                Select an option
              </option>
              {field.options!.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
        </div>

        {error && fieldTouched && (
          <p className="mt-3 animate-fade-in text-sm font-medium text-saffron-600">
            {error}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-navy-400 transition-colors hover:text-navy-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {step === 0 ? 'Home' : 'Back'}
        </button>
        <button
          type="button"
          onClick={next}
          className="inline-flex items-center gap-2 rounded-xl bg-navy-600 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:bg-navy-700 hover:shadow-card focus:outline-none focus:ring-4 focus:ring-navy-200 active:scale-[0.99]"
        >
          {step === total - 1 ? 'See my matches' : 'Continue'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
