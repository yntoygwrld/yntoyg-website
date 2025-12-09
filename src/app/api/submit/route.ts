import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabaseService } from '@/lib/supabase';

const POINTS_SUBMIT = 10;

// Platform URL patterns (copied from bot config)
const URL_PATTERNS: Record<string, RegExp> = {
  tiktok: /(?:https?:\/\/)?(?:www\.|m\.|vm\.|vt\.)?tiktok\.com\/(?:@[\w.-]+\/video\/\d+|[\w]+\/?)/i,
  instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|reels)\/[\w-]+\/?/i,
  twitter: /(?:https?:\/\/)?(?:www\.|mobile\.)?(?:twitter|x)\.com\/\w+\/status(?:es)?\/\d+(?:\/video\/\d+)?\/?/i,
};

const PLATFORM_NAMES: Record<string, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  twitter: 'Twitter/X',
};

export async function POST(request: Request) {
  try {
    // 1. Verify user is authenticated
    const user = await getSession();
    if (!user) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Please log in' },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { url, platform } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'missing_url', message: 'URL is required' },
        { status: 400 }
      );
    }

    // 3. Detect platform from URL if not provided
    let detectedPlatform = platform;
    if (!detectedPlatform) {
      for (const [platformName, pattern] of Object.entries(URL_PATTERNS)) {
        if (pattern.test(url)) {
          detectedPlatform = platformName;
          break;
        }
      }
    }

    if (!detectedPlatform) {
      return NextResponse.json(
        { error: 'invalid_url', message: 'URL must be from TikTok, Instagram, or Twitter/X' },
        { status: 400 }
      );
    }

    // 4. Validate URL format
    const pattern = URL_PATTERNS[detectedPlatform];
    if (!pattern || !pattern.test(url)) {
      return NextResponse.json(
        { error: 'invalid_url', message: `Invalid ${PLATFORM_NAMES[detectedPlatform]} URL format` },
        { status: 400 }
      );
    }

    const supabase = getSupabaseService();
    const today = new Date().toISOString().split('T')[0];

    // 5. Get today's claim to get video_id
    const { data: claim, error: claimError } = await supabase
      .from('daily_claims')
      .select('video_id')
      .eq('user_id', user.id)
      .eq('claim_date', today)
      .single();

    if (claimError || !claim) {
      return NextResponse.json(
        { error: 'no_claim', message: 'You must claim a video today before submitting' },
        { status: 400 }
      );
    }

    // 6. Check if already submitted to this platform
    const { data: existingRepost } = await supabase
      .from('reposts')
      .select('id')
      .eq('user_id', user.id)
      .eq('video_id', claim.video_id)
      .eq('platform', detectedPlatform)
      .single();

    if (existingRepost) {
      return NextResponse.json(
        { error: 'already_submitted', message: `You've already submitted to ${PLATFORM_NAMES[detectedPlatform]} for today's video` },
        { status: 400 }
      );
    }

    // 7. Create repost record
    const { error: repostError } = await supabase
      .from('reposts')
      .insert({
        user_id: user.id,
        video_id: claim.video_id,
        platform: detectedPlatform,
        post_url: url,
        verified: false,
      });

    if (repostError) {
      console.error('Repost insert error:', repostError);
      return NextResponse.json(
        { error: 'submit_failed', message: 'Failed to record submission' },
        { status: 500 }
      );
    }

    // 8. Award points
    await supabase
      .from('users')
      .update({
        gentleman_score: user.gentleman_score + POINTS_SUBMIT,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // 9. Get all submissions for this video to return remaining platforms
    const { data: allReposts } = await supabase
      .from('reposts')
      .select('platform')
      .eq('user_id', user.id)
      .eq('video_id', claim.video_id);

    const submittedPlatforms = allReposts?.map(r => r.platform) || [];
    const allPlatforms = ['tiktok', 'instagram', 'twitter'];
    const remainingPlatforms = allPlatforms.filter(p => !submittedPlatforms.includes(p));

    // 10. Calculate total points earned today
    const totalPointsToday = 5 + (submittedPlatforms.length * POINTS_SUBMIT);

    return NextResponse.json({
      success: true,
      platform: detectedPlatform,
      platform_name: PLATFORM_NAMES[detectedPlatform],
      points_awarded: POINTS_SUBMIT,
      total_points_today: totalPointsToday,
      submitted_platforms: submittedPlatforms,
      remaining_platforms: remainingPlatforms,
      all_submitted: remainingPlatforms.length === 0,
      message: remainingPlatforms.length === 0
        ? 'Amazing! You\'ve submitted to all platforms today! +35 points total!'
        : `+${POINTS_SUBMIT} points! Submit to ${remainingPlatforms.map(p => PLATFORM_NAMES[p]).join(', ')} for more points!`,
    });

  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
