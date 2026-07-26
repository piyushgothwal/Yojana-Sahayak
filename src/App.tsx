import { useCallback, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Landing } from './components/Landing';
import { Form } from './components/Form';
import { Loading } from './components/Loading';
import { Results } from './components/Results';
import { checkEligibility } from './eligibility';
import type { SchemeMatch, UserAnswers } from './types';

type Screen = 'landing' | 'form' | 'loading' | 'results';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [matches, setMatches] = useState<SchemeMatch[]>([]);

  const handleStart = useCallback(() => setScreen('form'), []);

  const handleBack = useCallback(() => setScreen('landing'), []);

  const handleSubmit = useCallback(async (answers: UserAnswers) => {
    setScreen('loading');
    const result = await checkEligibility(answers);
    setMatches(result);
    setScreen('results');
  }, []);

  const handleRestart = useCallback(() => {
    setMatches([]);
    setScreen('landing');
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
        <div className="w-full max-w-xl">
          {screen === 'landing' && <Landing onStart={handleStart} />}
          {screen === 'form' && (
            <Form onSubmit={handleSubmit} onBack={handleBack} />
          )}
          {screen === 'loading' && <Loading />}
          {screen === 'results' && (
            <Results matches={matches} onRestart={handleRestart} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
