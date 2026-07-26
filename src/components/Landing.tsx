import { CheckCircle2, Landmark, ShieldCheck } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="animate-fade-in-up flex flex-col items-center text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-600 text-paper shadow-soft">
        <Landmark className="h-8 w-8" strokeWidth={1.75} />
      </div>

      <h1 className="text-3xl font-bold leading-tight text-navy-600 sm:text-4xl">
        Yojana Sahayak
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-navy-500 sm:text-lg">
        Find every government scheme you qualify for — in 2 minutes.
      </p>

      <button
        type="button"
        onClick={onStart}
        className="mt-10 w-full max-w-xs rounded-xl bg-saffron-400 px-6 py-4 text-base font-semibold text-white shadow-soft transition-all duration-200 hover:bg-saffron-500 hover:shadow-card focus:outline-none focus:ring-4 focus:ring-saffron-200 active:scale-[0.99] sm:max-w-sm"
      >
        Check My Eligibility
      </button>

      <div className="mt-12 grid w-full max-w-md gap-3 text-left">
        <TrustItem
          icon={<ShieldCheck className="h-5 w-5 text-teal-400" />}
          title="Private & confidential"
          text="Your answers stay on your device. No login, no personal ID required."
        />
        <TrustItem
          icon={<CheckCircle2 className="h-5 w-5 text-teal-400" />}
          title="Up-to-date schemes"
          text="Covers central welfare schemes across farmers, students, seniors and more."
        />
      </div>
    </div>
  );
}

function TrustItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-soft">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-navy-600">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-navy-400">{text}</p>
      </div>
    </div>
  );
}
