import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabaseService } from '@/lib/supabase';

const KOYEB_API_URL = process.env.KOYEB_API_URL;
const KOYEB_API_SECRET = process.env.KOYEB_API_SECRET;
const POINTS_CLAIM = 5;
const VIDEO_TTL_MINUTES = 30;

export async function POST() {
  try {
    // 1. Verify user is authenticated
    const user = await getSession();
    if (!user) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Please log in to claim videos' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseService();
    const today = new Date().toISOString().split('T')[0];

    // 2. Check if user has already claimed today
    const { data: existingClaim } = await supabase
      .from('daily_claims')
      .select('*')
      .eq('user_id', user.id)
      .eq('claim_date', today)
      .single();

    if (existingClaim) {
      // User already claimed - check if video is still available
      if (existingClaim.video_path && existingClaim.video_expires_at) {
        const expiresAt = new Date(existingClaim.video_expires_at);

        if (expiresAt > new Date()) {
          // Video still available
          const { data: video } = await supabase
            .from('videos')
            .select('title')
            .eq('id', existingClaim.video_id)
            .single();

          return NextResponse.json({
            success: true,
            already_claimed: true,
            download_url: getPublicUrl(existingClaim.video_path),
            expires_at: existingClaim.video_expires_at,
            expires_in_seconds: Math.floor((expiresAt.getTime() - Date.now()) / 1000),
            video_title: video?.title || 'Daily Video',
            points_awarded: 0,
          });
        } else {
          // Link expired - tell user to regenerate
          return NextResponse.json({
            success: true,
            already_claimed: true,
            expired: true,
            message: 'Your download link has expired. Click regenerate to get a new one.',
            can_regenerate: true,
          });
        }
      }

      // Claimed but no video path - something went wrong, allow regenerate
      return NextResponse.json({
        success: true,
        already_claimed: true,
        expired: true,
        message: 'Video not available. Click regenerate to get a new link.',
        can_regenerate: true,
      });
    }

    // 3. Lazy cleanup - delete expired videos from storage
    await cleanupExpiredVideos(supabase);

    // 4. Get random video from pool (weighted by least claimed)
    const { data: videos, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('is_active', true);

    if (videoError || !videos || videos.length === 0) {
      return NextResponse.json(
        { error: 'no_videos', message: 'No videos available right now. Please try later.' },
        { status: 503 }
      );
    }

    // Find minimum times_claimed and pick from those
    const minClaims = Math.min(...videos.map(v => v.times_claimed));
    const leastClaimed = videos.filter(v => v.times_claimed === minClaims);
    const selectedVideo = leastClaimed[Math.floor(Math.random() * leastClaimed.length)];

    // 5. Generate unique claim ID
    const claimId = crypto.randomUUID();

    // 6. Call Koyeb API to prepare video
    if (!KOYEB_API_URL || !KOYEB_API_SECRET) {
      return NextResponse.json(
        { error: 'config_error', message: 'Video service not configured' },
        { status: 500 }
      );
    }

    const prepareResponse = await fetch(`${KOYEB_API_URL}/api/video/prepare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KOYEB_API_SECRET}`,
      },
      body: JSON.stringify({
        file_id: selectedVideo.telegram_file_id,
        claim_id: claimId,
        user_id: user.id,
      }),
    });

    if (!prepareResponse.ok) {
      const errorData = await prepareResponse.json().catch(() => ({}));
      console.error('Video prepare error:', errorData);
      return NextResponse.json(
        { error: 'prepare_failed', message: 'Failed to prepare video. Please try again.' },
        { status: 500 }
      );
    }

    const prepareResult = await prepareResponse.json();

    // 7. Calculate expiry time
    const expiresAt = new Date(Date.now() + VIDEO_TTL_MINUTES * 60 * 1000);

    // 8. Create claim record
    const { error: claimError } = await supabase
      .from('daily_claims')
      .insert({
        id: claimId,
        user_id: user.id,
        video_id: selectedVideo.id,
        claim_date: today,
        video_path: prepareResult.storage_path,
        video_expires_at: expiresAt.toISOString(),
      });

    if (claimError) {
      console.error('Claim insert error:', claimError);
      // Try to cleanup the uploaded video
      await cleanupVideo(prepareResult.storage_path);
      return NextResponse.json(
        { error: 'claim_failed', message: 'Failed to record claim. Please try again.' },
        { status: 500 }
      );
    }

    // 9. Increment video times_claimed
    await supabase
      .from('videos')
      .update({ times_claimed: selectedVideo.times_claimed + 1 })
      .eq('id', selectedVideo.id);

    // 10. Award points and update user stats
    await supabase
      .from('users')
      .update({
        gentleman_score: user.gentleman_score + POINTS_CLAIM,
        total_claims: user.total_claims + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // 11. Return success response
    return NextResponse.json({
      success: true,
      already_claimed: false,
      download_url: prepareResult.download_url,
      expires_at: expiresAt.toISOString(),
      expires_in_seconds: VIDEO_TTL_MINUTES * 60,
      video_title: selectedVideo.title,
      points_awarded: POINTS_CLAIM,
      metadata: prepareResult.metadata,
    });

  } catch (error) {
    console.error('Claim error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Helper function to get public URL from storage path
function getPublicUrl(storagePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/unique-videos/${storagePath}`;
}

// Helper function to cleanup expired videos
async function cleanupExpiredVideos(supabase: ReturnType<typeof getSupabaseService>) {
  try {
    // Get all claims with expired videos
    const { data: expiredClaims } = await supabase
      .from('daily_claims')
      .select('id, video_path')
      .lt('video_expires_at', new Date().toISOString())
      .not('video_path', 'is', null);

    if (!expiredClaims || expiredClaims.length === 0) return;

    // Collect paths to delete
    const pathsToDelete = expiredClaims
      .map(c => c.video_path)
      .filter((p): p is string => p !== null);

    if (pathsToDelete.length > 0) {
      // Delete from storage
      await supabase.storage.from('unique-videos').remove(pathsToDelete);

      // Clear video_path in database
      const ids = expiredClaims.map(c => c.id);
      await supabase
        .from('daily_claims')
        .update({ video_path: null })
        .in('id', ids);

      console.log(`Cleaned up ${pathsToDelete.length} expired videos`);
    }
  } catch (error) {
    console.error('Cleanup error:', error);
    // Don't fail the request if cleanup fails
  }
}

// Helper function to cleanup a single video
async function cleanupVideo(storagePath: string) {
  try {
    if (!KOYEB_API_URL || !KOYEB_API_SECRET) return;

    await fetch(`${KOYEB_API_URL}/api/video/cleanup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KOYEB_API_SECRET}`,
      },
      body: JSON.stringify({ storage_path: storagePath }),
    });
  } catch (error) {
    console.error('Cleanup video error:', error);
  }
}
