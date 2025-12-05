import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabaseService } from '@/lib/supabase';

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseService();

    // Get repost count
    const { count: repostCount } = await supabase
      .from('reposts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get leaderboard position
    const { data: allUsers } = await supabase
      .from('users')
      .select('id, gentleman_score')
      .order('gentleman_score', { ascending: false });

    const rank = allUsers?.findIndex(u => u.id === user.id) ?? -1;
    const leaderboardRank = rank >= 0 ? rank + 1 : 0;

    return NextResponse.json({
      email: user.email,
      wallet_address: user.wallet_address,
      points: user.gentleman_score,
      total_claims: user.total_claims,
      reposts_submitted: repostCount || 0,
      leaderboard_rank: leaderboardRank,
      total_users: allUsers?.length || 0,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
