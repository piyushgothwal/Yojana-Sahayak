import { Landmark } from 'lucide-react';

export function Loading() {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-2xl bg-saffron-200 opacity-60" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-600 text-paper shadow-soft">
          <Landmark className="h-8 w-8" strokeWidth={1.75} />
        </div>
      </div>

      <h2 className="text-xl font-bold text-navy-600 sm:text-2xl">
        Checking your eligibility…
      </h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-navy-400">
        Matching your details against current government welfare schemes.
      </p>

      <div className="mt-8 flex items-center gap-1.5">
        <Dot delay="0ms" />
        <Dot delay="150ms" />
        <Dot delay="300ms" />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-2 w-2 animate-bounce rounded-full bg-saffron-400"
      style={{ animationDelay: delay }}
    />
  );
}
