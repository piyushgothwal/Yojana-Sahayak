import { Landmark } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-navy-50 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-xl items-center gap-2.5 px-4 py-3.5 sm:px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-600 text-paper">
          <Landmark className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="leading-tight">
          <p className="font-serif text-base font-bold text-navy-600">
            Yojana Sahayak
          </p>
          <p className="hidden text-xs text-navy-400 sm:block">
            Find every government scheme you qualify for
          </p>
        </div>
      </div>
    </header>
  );
}
