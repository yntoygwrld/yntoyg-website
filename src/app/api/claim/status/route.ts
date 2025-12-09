import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabaseService } from '@/lib/supabase';

export async function GET() {
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

    // 2. Check today's claim
    const { data: claim } = await supabase
      .from('daily_claims')
      .select('*, videos(title)')
      .eq('user_id', user.id)
      .eq('claim_date', today)
      .single();

    if (!claim) {
      // No claim today - user can claim
      return NextResponse.json({
        can_claim: true,
        has_claimed_today: false,
      });
    }

    // 3. User has claimed - check video status
    const videoTitle = (claim.videos as { title: string } | null)?.title || 'Daily Video';

    if (claim.video_path && claim.video_expires_at) {
      const expiresAt = new Date(claim.video_expires_at);
      const now = new Date();

      if (expiresAt > now) {
        // Video still available
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const downloadUrl = `${supabaseUrl}/storage/v1/object/public/unique-videos/${claim.video_path}`;

        // Get submitted platforms
        const { data: reposts } = await supabase
          .from('reposts')
          .select('platform')
          .eq('user_id', user.id)
          .eq('video_id', claim.video_id);

        const submittedPlatforms = reposts?.map(r => r.platform) || [];

        return NextResponse.json({
          can_claim: false,
          has_claimed_today: true,
          download_url: downloadUrl,
          expires_at: claim.video_expires_at,
          expires_in_seconds: Math.floor((expiresAt.getTime() - now.getTime()) / 1000),
          video_title: videoTitle,
          video_id: claim.video_id,
          submitted_platforms: submittedPlatforms,
          expired: false,
        });
      } else {
        // Link expired
        const { data: reposts } = await supabase
          .from('reposts')
          .select('platform')
          .eq('user_id', user.id)
          .eq('video_id', claim.video_id);

        return NextResponse.json({
          can_claim: false,
          has_claimed_today: true,
          expired: true,
          can_regenerate: true,
          video_title: videoTitle,
          video_id: claim.video_id,
          submitted_platforms: reposts?.map(r => r.platform) || [],
        });
      }
    }

    // Claimed but no video info - allow regenerate
    return NextResponse.json({
      can_claim: false,
      has_claimed_today: true,
      expired: true,
      can_regenerate: true,
      video_title: videoTitle,
      video_id: claim.video_id,
      submitted_platforms: [],
    });

  } catch (error) {
    console.error('Claim status error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'Failed to get claim status' },
      { status: 500 }
    );
  }
}
