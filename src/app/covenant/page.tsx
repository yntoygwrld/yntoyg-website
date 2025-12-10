'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Film, Share2, Star, Wallet, LogOut, Loader2 } from 'lucide-react';
import ClaimSection from '@/components/ClaimSection';
import TelegramConnectCard from '@/components/TelegramConnectCard';

interface UserStats {
  email: string;
  wallet_address: string | null;
  points: number;
  total_claims: number;
  reposts_submitted: number;
  leaderboard_rank: number;
  total_users: number;
  created_at: string;
}

export default function CovenantDashboard() {
  const [user, setUser] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/user/me');
      if (!res.ok) {
        router.push('/covenant/login');
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch {
      router.push('/covenant/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Handle points update from ClaimSection
  const handlePointsUpdate = (pointsAdded: number) => {
    if (user) {
      setUser({
        ...user,
        points: user.points + pointsAdded,
      });
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yg-gold animate-spin" />
      </main>
    );
  }

  if (!user) return null;

  const stats = [
    { icon: Star, label: 'Points', value: user.points.toLocaleString(), color: 'text-yg-gold' },
    { icon: Film, label: 'Videos Claimed', value: user.total_claims.toString(), color: 'text-blue-400' },
    { icon: Share2, label: 'Reposts', value: user.reposts_submitted.toString(), color: 'text-green-400' },
    { icon: Trophy, label: 'Rank', value: `#${user.leaderboard_rank}`, color: 'text-purple-400' },
  ];

  const percentile = user.total_users > 0
    ? Math.round((1 - (user.leaderboard_rank / user.total_users)) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-[#0a0a0c] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            {/* Ornament centered over "Covenant" text - offset by "The " width */}
            <div className="inline-flex items-center gap-3 mb-2 ml-[52px]">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-yg-gold/50 to-transparent" />
              <div className="w-1.5 h-1.5 rotate-45 bg-yg-gold/50" />
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-yg-gold/50 to-transparent" />
            </div>
            <h1 className="text-3xl font-serif text-white">
              The <span className="text-glow-gold">Covenant</span>
            </h1>
            <p className="text-white/40 text-sm mt-1">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-white/40 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Telegram Connect Section */}
        <TelegramConnectCard onPointsUpdate={handlePointsUpdate} />

        {/* Claim Video Section */}
        <ClaimSection onPointsUpdate={handlePointsUpdate} />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4">
              <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/40 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Wallet */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-5 h-5 text-yg-gold" />
            <span className="text-white font-medium">Connected Wallet</span>
          </div>
          {user.wallet_address ? (
            <code className="text-white/60 text-sm break-all">{user.wallet_address}</code>
          ) : (
            <p className="text-white/40 text-sm">No wallet connected yet. Wallet connection coming soon.</p>
          )}
        </div>

        {/* Progress */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h3 className="text-white font-medium mb-4">Your Progress</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-white/60">
              <span>Member since</span>
              <span>{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Community standing</span>
              <span className="text-yg-gold">Top {percentile}%</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Points breakdown</span>
              <span>+5/claim, +10/submit</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-white/30 text-sm">You're part of the Covenant. Claim daily videos and earn points!</p>
        </div>

        {/* Contract Address & Socials */}
        <div className="glass-card rounded-xl p-6 mt-8">
          <div className="text-center mb-4">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Contract Address</p>
            <a
              href="https://pump.fun/coin/DKQK952DZY59uhAgvZDNyMkDieGc7U25kNf4Q5FJpump"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yg-gold text-sm font-mono hover:text-yg-gold/80 transition-colors break-all"
            >
              DKQK952DZY59uhAgvZDNyMkDieGc7U25kNf4Q5FJpump
            </a>
          </div>
          <div className="flex justify-center gap-4 pt-4 border-t border-white/10">
            <a
              href="https://pump.fun/coin/DKQK952DZY59uhAgvZDNyMkDieGc7U25kNf4Q5FJpump"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              title="pump.fun"
            >
              <svg className="w-5 h-5 text-white/60 hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                <ellipse cx="12" cy="12" rx="6" ry="10" transform="rotate(-30 12 12)" />
              </svg>
            </a>
            <a
              href="https://dexscreener.com/solana/DKQK952DZY59uhAgvZDNyMkDieGc7U25kNf4Q5FJpump"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              title="DexScreener"
            >
              <svg className="w-5 h-5 text-white/60 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18" />
                <path d="M18 9l-5 5-4-4-3 3" />
              </svg>
            </a>
            <a
              href="https://x.com/yntoyg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              title="X / Twitter"
            >
              <svg className="w-5 h-5 text-white/60 hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://t.me/YNTOYGCovenant"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              title="Telegram"
            >
              <svg className="w-5 h-5 text-white/60 hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-8">
          <a href="/" className="text-white/30 text-sm hover:text-white/50 transition-colors">
            &larr; Back to home
          </a>
        </div>
      </div>
    </main>
  );
}
