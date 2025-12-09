'use client';

import { useState, useEffect, useCallback } from 'react';
import { Film, Download, RefreshCw, Clock, Check, ExternalLink, Loader2 } from 'lucide-react';

interface ClaimStatus {
  can_claim?: boolean;
  has_claimed_today?: boolean;
  download_url?: string;
  expires_at?: string;
  expires_in_seconds?: number;
  video_title?: string;
  video_id?: string;
  submitted_platforms?: string[];
  expired?: boolean;
  can_regenerate?: boolean;
  points_awarded?: number;
  already_claimed?: boolean;
}

interface ClaimSectionProps {
  onPointsUpdate?: (newPoints: number) => void;
}

const PLATFORM_CONFIG = {
  tiktok: { name: 'TikTok', color: 'bg-pink-500/20 border-pink-500/30 text-pink-400 hover:bg-pink-500/30' },
  instagram: { name: 'Instagram', color: 'bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30' },
  twitter: { name: 'X/Twitter', color: 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30' },
};

export default function ClaimSection({ onPointsUpdate }: ClaimSectionProps) {
  const [status, setStatus] = useState<ClaimStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Fetch claim status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/claim/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        if (data.expires_in_seconds && data.expires_in_seconds > 0) {
          setCountdown(data.expires_in_seconds);
        }
      }
    } catch (error) {
      console.error('Failed to fetch claim status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Timer expired - refresh status
          fetchStatus();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, fetchStatus]);

  // Format countdown
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle claim
  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await fetch('/api/claim', { method: 'POST' });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          has_claimed_today: true,
          download_url: data.download_url,
          expires_at: data.expires_at,
          expires_in_seconds: data.expires_in_seconds,
          video_title: data.video_title,
          submitted_platforms: [],
          expired: false,
        });
        setCountdown(data.expires_in_seconds);

        if (data.points_awarded && onPointsUpdate) {
          onPointsUpdate(data.points_awarded);
        }
      } else {
        console.error('Claim failed:', data);
        alert(data.message || 'Failed to claim video');
      }
    } catch (error) {
      console.error('Claim error:', error);
      alert('Failed to claim video. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  // Handle regenerate
  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await fetch('/api/claim/regenerate', { method: 'POST' });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus(prev => ({
          ...prev,
          download_url: data.download_url,
          expires_at: data.expires_at,
          expires_in_seconds: data.expires_in_seconds,
          expired: false,
        }));
        setCountdown(data.expires_in_seconds);
      } else {
        alert(data.message || 'Failed to regenerate link');
      }
    } catch (error) {
      console.error('Regenerate error:', error);
      alert('Failed to regenerate link. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  // Handle submit proof
  const handleSubmit = async () => {
    if (!submitUrl.trim()) {
      setSubmitError('Please enter a URL');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: submitUrl }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitSuccess(data.message);
        setSubmitUrl('');
        setStatus(prev => ({
          ...prev,
          submitted_platforms: data.submitted_platforms,
        }));

        if (data.points_awarded && onPointsUpdate) {
          onPointsUpdate(data.points_awarded);
        }
      } else {
        setSubmitError(data.message || 'Failed to submit');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="flex items-center justify-center gap-3 py-4">
          <Loader2 className="w-5 h-5 text-yg-gold animate-spin" />
          <span className="text-white/50">Loading claim status...</span>
        </div>
      </div>
    );
  }

  // State: Can claim (hasn't claimed today)
  if (status?.can_claim) {
    return (
      <div className="glass-card rounded-xl p-6 mb-8 border border-yg-gold/30">
        <div className="text-center">
          <Film className="w-10 h-10 text-yg-gold mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Today's Video Ready</h3>
          <p className="text-white/50 text-sm mb-4">
            Claim your daily video and share it to earn points!
          </p>
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="btn-royal-gold px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {claiming ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                Preparing Video...
              </>
            ) : (
              <>
                <Film className="w-5 h-5 inline mr-2" />
                Claim Video (+5 pts)
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // State: Claimed, link expired
  if (status?.has_claimed_today && status?.expired) {
    return (
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="text-center">
          <Clock className="w-10 h-10 text-orange-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Download Link Expired</h3>
          <p className="text-white/50 text-sm mb-4">
            No worries! Generate a fresh download link below.
          </p>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="btn-royal-gold px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {regenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Regenerate Download Link
              </>
            )}
          </button>
        </div>

        {/* Still show submit section even if expired */}
        {status.submitted_platforms && status.submitted_platforms.length < 3 && (
          <SubmitSection
            submittedPlatforms={status.submitted_platforms}
            submitUrl={submitUrl}
            setSubmitUrl={setSubmitUrl}
            submitError={submitError}
            submitSuccess={submitSuccess}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    );
  }

  // State: Claimed, video available
  if (status?.has_claimed_today && status?.download_url) {
    const allSubmitted = status.submitted_platforms?.length === 3;

    return (
      <div className="glass-card rounded-xl p-6 mb-8 border border-green-500/30">
        <div className="text-center mb-4">
          <Check className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-1">
            {allSubmitted ? "Amazing Work Today!" : "Video Ready!"}
          </h3>
          {status.video_title && (
            <p className="text-white/40 text-sm">{status.video_title}</p>
          )}
        </div>

        {/* Countdown Timer */}
        <div className={`text-center mb-4 p-3 rounded-lg ${countdown < 300 ? 'bg-red-500/20 border border-red-500/30' : 'bg-white/5 border border-white/10'}`}>
          <div className="flex items-center justify-center gap-2">
            <Clock className={`w-4 h-4 ${countdown < 300 ? 'text-red-400' : 'text-white/50'}`} />
            <span className={`text-sm ${countdown < 300 ? 'text-red-400' : 'text-white/50'}`}>
              Download within:
            </span>
            <span className={`text-xl font-mono font-bold ${countdown < 300 ? 'text-red-400' : 'text-yg-gold'}`}>
              {formatCountdown(countdown)}
            </span>
          </div>
          {countdown < 300 && countdown > 0 && (
            <p className="text-red-400 text-xs mt-1">Link expires soon - download now!</p>
          )}
        </div>

        {/* Download Button */}
        <div className="text-center mb-6">
          <a
            href={status.download_url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-royal-gold px-6 py-3 text-lg"
          >
            <Download className="w-5 h-5" />
            Download Video
            <ExternalLink className="w-4 h-4 opacity-50" />
          </a>
        </div>

        {/* Submit Section */}
        {!allSubmitted ? (
          <SubmitSection
            submittedPlatforms={status.submitted_platforms || []}
            submitUrl={submitUrl}
            setSubmitUrl={setSubmitUrl}
            submitError={submitError}
            submitSuccess={submitSuccess}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        ) : (
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-green-400 font-bold">
              +35 points earned today!
            </p>
            <p className="text-white/40 text-sm mt-1">
              Come back tomorrow for more videos
            </p>
          </div>
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className="glass-card rounded-xl p-6 mb-8">
      <div className="text-center text-white/50">
        <Film className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Unable to load claim status</p>
        <button
          onClick={fetchStatus}
          className="text-yg-gold text-sm mt-2 hover:underline"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// Submit section sub-component
interface SubmitSectionProps {
  submittedPlatforms: string[];
  submitUrl: string;
  setSubmitUrl: (url: string) => void;
  submitError: string;
  submitSuccess: string;
  submitting: boolean;
  onSubmit: () => void;
}

function SubmitSection({
  submittedPlatforms,
  submitUrl,
  setSubmitUrl,
  submitError,
  submitSuccess,
  submitting,
  onSubmit,
}: SubmitSectionProps) {
  const remainingPlatforms = Object.entries(PLATFORM_CONFIG)
    .filter(([key]) => !submittedPlatforms.includes(key));

  return (
    <div className="border-t border-white/10 pt-4 mt-4">
      <h4 className="text-white font-medium mb-3 text-center">
        Share to Earn More Points
      </h4>

      {/* Platform Status */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {Object.entries(PLATFORM_CONFIG).map(([key, config]) => {
          const isSubmitted = submittedPlatforms.includes(key);
          return (
            <span
              key={key}
              className={`px-3 py-1 rounded-full text-xs border ${
                isSubmitted
                  ? 'bg-green-500/20 border-green-500/30 text-green-400'
                  : config.color
              }`}
            >
              {isSubmitted && <Check className="w-3 h-3 inline mr-1" />}
              {config.name} {!isSubmitted && '+10'}
            </span>
          );
        })}
      </div>

      {/* Submit Form */}
      {remainingPlatforms.length > 0 && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={submitUrl}
              onChange={(e) => setSubmitUrl(e.target.value)}
              placeholder="Paste your TikTok, Instagram, or X post URL"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-yg-gold/50"
              disabled={submitting}
            />
            <button
              onClick={onSubmit}
              disabled={submitting || !submitUrl.trim()}
              className="px-4 py-2 bg-yg-gold/20 border border-yg-gold/30 rounded-lg text-yg-gold text-sm font-medium hover:bg-yg-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
            </button>
          </div>

          {submitError && (
            <p className="text-red-400 text-sm text-center">{submitError}</p>
          )}
          {submitSuccess && (
            <p className="text-green-400 text-sm text-center">{submitSuccess}</p>
          )}
        </div>
      )}
    </div>
  );
}
