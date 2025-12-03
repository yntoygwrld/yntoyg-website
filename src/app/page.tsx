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
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-yg-cream/40 text-sm">
          <div>
            © 2025 $YNTOYG. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-yg-gold transition-colors">Terms</a>
            <a href="#" className="hover:text-yg-gold transition-colors">Privacy</a>
            <a href="#" className="hover:text-yg-gold transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
