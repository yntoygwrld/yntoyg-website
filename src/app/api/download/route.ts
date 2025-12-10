import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabaseService } from '@/lib/supabase';

export async function GET(request: NextRequest) {
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

    // 2. Get today's claim for this user
    const { data: claim, error: claimError } = await supabase
      .from('daily_claims')
      .select('video_path, video_expires_at, video_id')
      .eq('user_id', user.id)
      .eq('claim_date', today)
      .single();

    if (claimError || !claim) {
      return NextResponse.json(
        { error: 'no_claim', message: 'No video claimed today' },
        { status: 404 }
      );
    }

    // 3. Check if video is still available
    if (!claim.video_path || !claim.video_expires_at) {
      return NextResponse.json(
        { error: 'expired', message: 'Video link has expired' },
        { status: 410 }
      );
    }

    const expiresAt = new Date(claim.video_expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'expired', message: 'Video link has expired' },
        { status: 410 }
      );
    }

    // 4. Download the video from Supabase storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('unique-videos')
      .download(claim.video_path);

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError);
      return NextResponse.json(
        { error: 'download_failed', message: 'Failed to download video' },
        { status: 500 }
      );
    }

    // 5. Get video title for filename
    const { data: video } = await supabase
      .from('videos')
      .select('title')
      .eq('id', claim.video_id)
      .single();

    // Generate a clean filename
    const title = video?.title || 'YNTOYG-Video';
    const cleanTitle = title.replace(/[^a-zA-Z0-9-_]/g, '-').substring(0, 50);
    const filename = `${cleanTitle}-${Date.now()}.mp4`;

    // 6. Return with Content-Disposition: attachment to force download
    return new NextResponse(fileData, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileData.size.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
