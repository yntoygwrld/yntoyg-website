import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import ViralCalculator from '@/components/ViralCalculator';
import JoinCTA from '@/components/JoinCTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-yg-navy">
      <Hero />
      <HowItWorks />
      <ViralCalculator />
      <JoinCTA />

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-yg-cream/10">
        <div className="max-w-6xl mx-auto text-center text-yg-cream/40 text-sm">
          © 2025 $YNTOYG. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
