import { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { SchemeMatch } from '../types';

interface ResultsProps {
  matches: SchemeMatch[];
  onRestart: () => void;
}

export function Results({ matches, onRestart }: ResultsProps) {
  if (matches.length === 0) {
    return <NoMatches onRestart={onRestart} />;
  }

  return (
    <div className="animate-fade-in-up w-full">
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-sm font-semibold text-teal-600">
          <Sparkles className="h-4 w-4" />
          {matches.length} {matches.length === 1 ? 'scheme' : 'schemes'} matched
        </div>
        <h2 className="text-2xl font-bold text-navy-600 sm:text-3xl">
          Schemes you may qualify for
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-navy-400">
          These are indicative matches based on your answers. Confirm final
          eligibility at the nearest government office or official portal.
        </p>
      </div>

      <div className="space-y-4">
        {matches.map((m, i) => (
          <SchemeCard key={m.scheme.id} match={m} index={i} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-6 py-3 text-sm font-semibold text-navy-600 shadow-soft transition-all duration-200 hover:border-navy-300 hover:shadow-card active:scale-[0.99]"
        >
          <RotateCcw className="h-4 w-4" />
          Start Over
        </button>
      </div>
    </div>
  );
}

function SchemeCard({ match, index }: { match: SchemeMatch; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const { scheme, reason } = match;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-navy-50 bg-white shadow-card transition-shadow duration-200 hover:shadow-soft"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 flex-shrink-0 text-teal-400" />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold leading-snug text-navy-600">
              {scheme.name}
            </h3>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-navy-300">
              {scheme.ministry}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-navy-500">
          {scheme.description}
        </p>

        <div className="mt-4 rounded-xl bg-teal-50 px-4 py-3">
          <p className="text-sm font-semibold text-teal-600">
            Why you qualify
          </p>
          <p className="mt-1 text-sm leading-relaxed text-teal-700">
            {reason}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-4 inline-flex w-full items-center justify-between rounded-lg py-1 text-sm font-semibold text-navy-500 transition-colors hover:text-navy-700"
        >
          <span className="inline-flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents needed ({scheme.documents.length})
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>

        {open && (
          <ul className="mt-3 animate-fade-in space-y-2 border-t border-navy-50 pt-4">
            {scheme.documents.map((doc) => (
              <li
                key={doc.name}
                className="flex items-center gap-2.5 text-sm text-navy-500"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-navy-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-navy-300" />
                </span>
                {doc.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function NoMatches({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="animate-fade-in-up flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-card sm:p-12">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-400">
        <Sparkles className="h-8 w-8" strokeWidth={1.75} />
      </div>
      <h2 className="text-xl font-bold text-navy-600 sm:text-2xl">
        No matches yet
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-navy-400">
        Schemes are added regularly, check back soon. You can also revisit your
        answers to explore other options.
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-saffron-400 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:bg-saffron-500 hover:shadow-card active:scale-[0.99]"
      >
        <RotateCcw className="h-4 w-4" />
        Start Over
      </button>
    </div>
  );
}
