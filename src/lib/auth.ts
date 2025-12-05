import { cookies } from 'next/headers';
import { getSupabaseService } from './supabase';

export interface SessionUser {
  id: string;
  telegram_id: number;
  email: string;
  wallet_address: string | null;
  gentleman_score: number;
  total_claims: number;
  created_at: string;
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('covenant_session')?.value;

    if (!sessionToken) {
      return null;
    }

    const supabase = getSupabaseService();

    // Verify session exists and not expired
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single();

    if (sessionError || !session) {
      return null;
    }

    // Check expiration
    if (new Date(session.expires_at) < new Date()) {
      // Delete expired session
      await supabase.from('sessions').delete().eq('id', session.id);
      return null;
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user_id)
      .single();

    if (userError || !user) {
      return null;
    }

    return user as SessionUser;
  } catch {
    return null;
  }
}

export async function createSession(userId: string): Promise<string> {
  const crypto = await import('crypto');
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const supabase = getSupabaseService();
  await supabase.from('sessions').insert({
    user_id: userId,
    session_token: sessionToken,
    expires_at: expiresAt.toISOString(),
  });

  return sessionToken;
}

export async function deleteSession(sessionToken: string): Promise<void> {
  const supabase = getSupabaseService();
  await supabase.from('sessions').delete().eq('session_token', sessionToken);
}
