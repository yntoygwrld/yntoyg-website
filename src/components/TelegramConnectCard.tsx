'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Check, Loader2, ExternalLink } from 'lucide-react';

interface TelegramStatus {
  connected: boolean;
  telegram_id: number | null;
  telegram_username: string | null;
  connected_at: string | null;
  bonus_claimed: boolean;
  has_pending_token: boolean;
  token_expires_at: string | null;
}

interface TelegramConnectCardProps {
  onPointsUpdate?: (points: number) => void;
}

export default function TelegramConnectCard({ onPointsUpdate }: TelegramConnectCardProps) {
  const [status, setStatus] = useState<TelegramStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState('');

  // Fetch telegram connection status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/telegram/status');
      if (res.ok) {
        const data = await res.json();

        // Check if connection just completed (was polling, now connected)
        if (polling && data.connected && !status?.connected) {
          // Connection successful! Award points locally
          if (onPointsUpdate) {
            onPointsUpdate(100);
          }
          setPolling(false);
        }

        setStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch telegram status:', err);
    } finally {
      setLoading(false);
    }
  }, [polling, status?.connected, onPointsUpdate]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Poll while waiting for connection
  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(() => {
      fetchStatus();
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [polling, fetchStatus]);

  // Handle connect button click
  const handleConnect = async () => {
    setConnecting(true);
    setError('');

    try {
      const res = await fetch('/api/telegram/connect', { method: 'POST' });
      const data = await res.json();

      if (res.ok && data.success) {
        // Open Telegram deep link
        window.open(data.deep_link, '_blank');

        // Start polling for connection status
        setPolling(true);
        setStatus(prev => prev ? { ...prev, has_pending_token: true, token_expires_at: data.expires_at } : prev);
      } else {
        setError(data.message || 'Failed to generate connection link');
      }
    } catch (err) {
      console.error('Connect error:', err);
      setError('Failed to connect. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-3 py-2">
          <Loader2 className="w-5 h-5 text-yg-gold animate-spin" />
          <span className="text-white/50">Checking Telegram status...</span>
        </div>
      </div>
    );
  }

  // Already connected state
  if (status?.connected) {
    return (
      <div className="glass-card rounded-xl p-6 mb-6 border border-green-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-500/20">
            <Check className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">Telegram Connected</p>
            <p className="text-white/40 text-sm">
              {status.telegram_username ? `@${status.telegram_username}` : 'Connected'}
              {status.bonus_claimed && ' • +100 pts claimed'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Polling/waiting state
  if (polling || status?.has_pending_token) {
    return (
      <div className="glass-card rounded-xl p-6 mb-6 border border-yg-gold/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-yg-gold/20">
            <Loader2 className="w-5 h-5 text-yg-gold animate-spin" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">Waiting for Telegram...</p>
            <p className="text-white/40 text-sm">
              Complete the connection in Telegram to claim +100 pts
            </p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={handleConnect}
            className="text-yg-gold text-sm hover:underline"
          >
            Didn't open? Click to try again
          </button>
        </div>
      </div>
    );
  }

  // Not connected - show connect button
  return (
    <div className="glass-card rounded-xl p-6 mb-6 border border-yg-gold/30 bg-gradient-to-r from-yg-gold/5 to-transparent">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-yg-gold/20">
            <MessageCircle className="w-5 h-5 text-yg-gold" />
          </div>
          <div>
            <p className="text-white font-medium">Connect Telegram</p>
            <p className="text-white/40 text-sm">
              Join the Covenant community & earn bonus points
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-yg-gold font-bold text-lg">+100 pts</span>
        </div>
      </div>

      <button
        onClick={handleConnect}
        disabled={connecting}
        className="mt-4 w-full btn-royal-gold py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {connecting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Link...
          </>
        ) : (
          <>
            <MessageCircle className="w-5 h-5" />
            Connect & Claim 100 pts
            <ExternalLink className="w-4 h-4 opacity-50" />
          </>
        )}
      </button>

      {error && (
        <p className="mt-3 text-red-400 text-sm text-center">{error}</p>
      )}

      <p className="mt-3 text-white/30 text-xs text-center">
        You must join the Covenant Telegram group to claim this bonus
      </p>
    </div>
  );
}
