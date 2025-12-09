import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabaseService } from '@/lib/supabase';

const KOYEB_API_URL = process.env.KOYEB_API_URL;
const KOYEB_API_SECRET = process.env.KOYEB_API_SECRET;
const VIDEO_TTL_MINUTES = 30;

export async function POST() {
  try {
    // 1. Verify user is authenticated
    const user = await getSession();
    if (!user) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Please log in' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseService();
    const today = new Date().toISOString().split('T')[0];

    // 2. Get today's claim
    const { data: claim, error: claimError } = await supabase
      .from('daily_claims')
      .select('*, videos(telegram_file_id, title)')
      .eq('user_id', user.id)
      .eq('claim_date', today)
      .single();

    if (claimError || !claim) {
      return NextResponse.json(
        { error: 'no_claim', message: 'You haven\'t claimed a video today' },
        { status: 400 }
      );
    }

    // 3. Check if video link is actually expired (prevent abuse)
    if (claim.video_path && claim.video_expires_at) {
      const expiresAt = new Date(claim.video_expires_at);
      if (expiresAt > new Date()) {
        // Not expired yet - return existing link
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        return NextResponse.json({
          success: true,
          download_url: `${supabaseUrl}/storage/v1/object/public/unique-videos/${claim.video_path}`,
          expires_at: claim.video_expires_at,
          expires_in_seconds: Math.floor((expiresAt.getTime() - Date.now()) / 1000),
          video_title: (claim.videos as { title: string } | null)?.title || 'Daily Video',
          message: 'Your current link is still valid',
        });
      }
    }

    // 4. Delete old video from storage if exists
    if (claim.video_path) {
      try {
        await supabase.storage.from('unique-videos').remove([claim.video_path]);
      } catch (e) {
        console.error('Failed to delete old video:', e);
      }
    }

    // 5. Get video file_id from the joined videos table
    const videoData = claim.videos as { telegram_file_id: string; title: string } | null;
    if (!videoData?.telegram_file_id) {
      return NextResponse.json(
        { error: 'video_not_found', message: 'Original video not found' },
        { status: 404 }
      );
    }

    // 6. Generate new claim ID for storage path
    const newClaimId = `${claim.id}-regen-${Date.now()}`;

    // 7. Call Koyeb API to prepare new unique video
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
        file_id: videoData.telegram_file_id,
        claim_id: newClaimId,
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

    // 8. Calculate new expiry time
    const expiresAt = new Date(Date.now() + VIDEO_TTL_MINUTES * 60 * 1000);

    // 9. Update claim record with new video path and expiry
    const { error: updateError } = await supabase
      .from('daily_claims')
      .update({
        video_path: prepareResult.storage_path,
        video_expires_at: expiresAt.toISOString(),
        video_downloaded: false,
      })
      .eq('id', claim.id);

    if (updateError) {
      console.error('Update claim error:', updateError);
      return NextResponse.json(
        { error: 'update_failed', message: 'Failed to update claim record' },
        { status: 500 }
      );
    }

    // 10. Return new download link (NO additional points for regeneration)
    return NextResponse.json({
      success: true,
      download_url: prepareResult.download_url,
      expires_at: expiresAt.toISOString(),
      expires_in_seconds: VIDEO_TTL_MINUTES * 60,
      video_title: videoData.title || 'Daily Video',
      points_awarded: 0, // No points for regeneration
      message: 'New download link generated',
    });

  } catch (error) {
    console.error('Regenerate error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
