import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabaseService } from '@/lib/supabase';
import { randomBytes } from 'crypto';

const TELEGRAM_BOT_USERNAME = 'yntoyg_claim_bot';
const TOKEN_EXPIRY_MINUTES = 10;

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

    // 2. Check if user already has Telegram connected
    if (user.telegram_id) {
      return NextResponse.json(
        {
          error: 'already_connected',
          message: 'Your account is already connected to Telegram',
          telegram_id: user.telegram_id,
          telegram_username: user.telegram_username
        },
        { status: 400 }
      );
    }

    // 3. Check if bonus already claimed (extra safety)
    const { data: userData } = await supabase
      .from('users')
      .select('telegram_bonus_claimed, telegram_id')
      .eq('id', user.id)
      .single();

    if (userData?.telegram_bonus_claimed) {
      return NextResponse.json(
        { error: 'bonus_claimed', message: 'Telegram bonus already claimed' },
        { status: 400 }
      );
    }

    if (userData?.telegram_id) {
      return NextResponse.json(
        { error: 'already_connected', message: 'Telegram already connected' },
        { status: 400 }
      );
    }

    // 4. Check for existing valid token
    const { data: existingToken } = await supabase
      .from('telegram_connect_tokens')
      .select('token, expires_at')
      .eq('user_id', user.id)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (existingToken) {
      // Return existing valid token
      const deepLink = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=connect_${existingToken.token}`;
      return NextResponse.json({
        success: true,
        deep_link: deepLink,
        expires_at: existingToken.expires_at,
        message: 'Click the link to connect your Telegram'
      });
    }

    // 5. Delete any old unused tokens for this user
    await supabase
      .from('telegram_connect_tokens')
      .delete()
      .eq('user_id', user.id)
      .is('used_at', null);

    // 6. Generate new token
    const token = `ct_${randomBytes(16).toString('hex')}`;
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

    // 7. Insert new token
    const { error: insertError } = await supabase
      .from('telegram_connect_tokens')
      .insert({
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString()
      });

    if (insertError) {
      console.error('Token insert error:', insertError);
      return NextResponse.json(
        { error: 'token_failed', message: 'Failed to generate connection token' },
        { status: 500 }
      );
    }

    // 8. Return deep link
    const deepLink = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=connect_${token}`;

    return NextResponse.json({
      success: true,
      deep_link: deepLink,
      expires_at: expiresAt.toISOString(),
      message: 'Click the link to connect your Telegram'
    });

  } catch (error) {
    console.error('Telegram connect error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
