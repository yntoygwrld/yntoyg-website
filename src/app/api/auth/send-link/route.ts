import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseService } from '@/lib/supabase';
import { resend } from '@/lib/resend';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseService();

    // Check if user exists with this email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Email not found. Please join via Telegram first.' },
        { status: 404 }
      );
    }

    // Generate token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token
    const { error: tokenError } = await supabase.from('email_tokens').insert({
      email: email.toLowerCase(),
      token,
      expires_at: expiresAt.toISOString(),
      used: false,
      type: 'dashboard_login',
    });

    if (tokenError) {
      console.error('Token storage error:', tokenError);
      return NextResponse.json(
        { error: 'Failed to generate login link' },
        { status: 500 }
      );
    }

    // Send email
    if (!resend) {
      console.error('Resend not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yntoyg.com';
    const loginUrl = `${baseUrl}/api/auth/verify?token=${token}`;

    await resend.emails.send({
      from: '$YNTOYG <onboarding@resend.dev>',
      to: email,
      subject: 'Access Your Covenant Dashboard',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #D4AF37; font-size: 32px; margin: 0;">$YNTOYG</h1>
              <p style="color: #F5F5DC; opacity: 0.8; margin-top: 8px;">The Covenant Dashboard</p>
            </div>

            <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(114, 47, 55, 0.1)); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 16px; padding: 32px; text-align: center;">
              <h2 style="color: #F5F5DC; font-size: 24px; margin: 0 0 16px 0;">Welcome Back, Gentleman</h2>
              <p style="color: #F5F5DC; opacity: 0.7; margin: 0 0 24px 0;">
                Click below to access your Covenant Dashboard and view your stats.
              </p>

              <a href="${loginUrl}" style="display: inline-block; background-color: #D4AF37; color: #0a0a0c; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px;">
                Enter the Covenant
              </a>

              <p style="color: #F5F5DC; opacity: 0.5; font-size: 12px; margin-top: 24px;">
                This link expires in 15 minutes
              </p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <p style="color: #F5F5DC; opacity: 0.4; font-size: 12px;">
                You're receiving this because you requested access to your dashboard at yntoyg.com
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send link error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
