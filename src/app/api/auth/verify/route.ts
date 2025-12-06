import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseService } from '@/lib/supabase';
import { createSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/covenant/login?error=invalid', request.url));
  }

  try {
    const supabase = getSupabaseService();

    // Find token - for dashboard_login tokens, we DON'T require used=false
    // because link previews (Telegram, browsers) can consume the token before
    // the user actually clicks. The token still expires naturally in 7 days.
    const { data: tokenData, error: tokenError } = await supabase
      .from('email_tokens')
      .select('*')
      .eq('token', token)
      .eq('type', 'dashboard_login')
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.redirect(new URL('/covenant/login?error=invalid', request.url));
    }

    // Check expiration
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.redirect(new URL('/covenant/login?error=expired', request.url));
    }

    // Find user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', tokenData.email)
      .single();

    if (userError || !user) {
      return NextResponse.redirect(new URL('/covenant/login?error=notfound', request.url));
    }

    // Mark token as used
    await supabase.from('email_tokens').update({ used: true }).eq('id', tokenData.id);

    // Create session
    const sessionToken = await createSession(user.id);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('covenant_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      path: '/',
    });

    return NextResponse.redirect(new URL('/covenant', request.url));
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.redirect(new URL('/covenant/login?error=invalid', request.url));
  }
}
