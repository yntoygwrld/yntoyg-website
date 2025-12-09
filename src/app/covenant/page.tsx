'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Film, Share2, Star, Wallet, LogOut, Loader2 } from 'lucide-react';
import ClaimSection from '@/components/ClaimSection';

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
