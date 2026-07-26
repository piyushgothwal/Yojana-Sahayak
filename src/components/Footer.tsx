import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-navy-50 bg-white/60 py-6">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <p className="text-xs leading-relaxed text-navy-400">
          Yojana Sahayak is an independent helper tool and is not affiliated
          with any government body. Always confirm eligibility on official
          portals before applying.
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-navy-300">
          Made with <Heart className="h-3 w-3 fill-saffron-300 text-saffron-300" /> for citizens
        </p>
      </div>
    </footer>
  );
}
