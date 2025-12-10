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

    // 2. Get current telegram connection status
    const { data: userData, error } = await supabase
      .from('users')
      .select('telegram_id, telegram_username, telegram_connected_at, telegram_bonus_claimed')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('User fetch error:', error);
      return NextResponse.json(
        { error: 'fetch_failed', message: 'Failed to get connection status' },
        { status: 500 }
      );
    }

    // 3. Check if connected
    const isConnected = !!userData?.telegram_id;

    // 4. Check for pending token (if not connected)
    let hasPendingToken = false;
    let tokenExpiresAt = null;

    if (!isConnected) {
      const { data: pendingToken } = await supabase
        .from('telegram_connect_tokens')
        .select('expires_at')
        .eq('user_id', user.id)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (pendingToken) {
        hasPendingToken = true;
        tokenExpiresAt = pendingToken.expires_at;
      }
    }

    return NextResponse.json({
      connected: isConnected,
      telegram_id: userData?.telegram_id || null,
      telegram_username: userData?.telegram_username || null,
      connected_at: userData?.telegram_connected_at || null,
      bonus_claimed: userData?.telegram_bonus_claimed || false,
      has_pending_token: hasPendingToken,
      token_expires_at: tokenExpiresAt
    });

  } catch (error) {
    console.error('Telegram status error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
