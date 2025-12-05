'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Film, Share2, Star, Wallet, LogOut, Loader2 } from 'lucide-react';

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

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
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
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/covenant/login');
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
            <div className="inline-flex items-center gap-3 mb-2">
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
            <p className="text-white/40 text-sm">No wallet connected. Use /wallet in Telegram.</p>
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
              <span>+10/claim, +25/submit</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-white/30 text-sm mb-4">Keep claiming and posting to climb the leaderboard</p>
          <a
            href="https://t.me/yntoyg_claim_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z" />
            </svg>
            Open Telegram Bot
          </a>
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
