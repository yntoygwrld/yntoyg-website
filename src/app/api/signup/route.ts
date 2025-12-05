import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { getSupabaseService } from '@/lib/supabase';
import { randomBytes } from 'crypto';

// Generate a secure token
function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    if (!resend) {
      console.error('Resend API key not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Generate magic link token
    const token = generateToken();
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'ygclaimbot';
    const magicLink = `https://t.me/${botUsername}?start=${token}`;

    // Store token in Supabase with expiration
    const { error: tokenError } = await getSupabaseService().from('email_tokens').insert({
      email,
      token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      used: false,
    });

    if (tokenError) {
      console.error('Token storage error:', tokenError);
      return NextResponse.json(
        { error: 'Failed to generate magic link' },
        { status: 500 }
      );
    }

    // Send magic link email via Resend
    const { data, error } = await resend.emails.send({
      from: 'YNTOYG <noreply@yntoyg.com>',
      to: email,
      subject: '🎩 Your $YNTOYG Magic Link',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #1a1a2e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #D4AF37; font-size: 32px; margin: 0;">🎩 $YNTOYG</h1>
              <p style="color: #F5F5DC; opacity: 0.8; margin-top: 8px;">From YN to YG</p>
            </div>

            <!-- Main content -->
            <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(114, 47, 55, 0.1)); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 16px; padding: 32px; text-align: center;">
              <h2 style="color: #F5F5DC; font-size: 24px; margin: 0 0 16px 0;">Welcome, Gentleman</h2>
              <p style="color: #F5F5DC; opacity: 0.7; margin: 0 0 24px 0;">
                Click the button below to join our Telegram and start claiming your daily videos.
              </p>

              <!-- CTA Button -->
              <a href="${magicLink}" style="display: inline-block; background-color: #D4AF37; color: #1a1a2e; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px;">
                Join $YNTOYG on Telegram
              </a>

              <p style="color: #F5F5DC; opacity: 0.5; font-size: 12px; margin-top: 24px;">
                This link expires in 24 hours
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px;">
              <p style="color: #F5F5DC; opacity: 0.4; font-size: 12px;">
                You're receiving this because you signed up at yntoyg.com
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Magic link sent! Check your email.',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
