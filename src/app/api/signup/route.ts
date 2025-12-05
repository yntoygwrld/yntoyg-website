import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { getSupabaseService } from '@/lib/supabase';
import { randomBytes } from 'crypto';

// Generate a secure token
function generateToken(): string {
  return randomBytes(32).toString('hex');
}

// Verify Turnstile token with Cloudflare
async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

// Rate limiting constants
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Check and update rate limit
async function checkRateLimit(email: string): Promise<{ allowed: boolean; waitSeconds?: number }> {
  const supabase = getSupabaseService();
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

  // Check existing attempts in the window
  const { data: existing, error: fetchError } = await supabase
    .from('email_rate_limits')
    .select('*')
    .eq('email', email.toLowerCase())
    .gte('first_attempt_at', windowStart)
    .order('first_attempt_at', { ascending: false })
    .limit(1)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Rate limit check error:', fetchError);
    // Allow on error to not block legitimate users
    return { allowed: true };
  }

  if (existing) {
    if (existing.attempts >= MAX_ATTEMPTS) {
      // Calculate remaining wait time
      const firstAttempt = new Date(existing.first_attempt_at).getTime();
      const windowEnd = firstAttempt + RATE_LIMIT_WINDOW_MS;
      const waitSeconds = Math.ceil((windowEnd - Date.now()) / 1000);
      return { allowed: false, waitSeconds: Math.max(0, waitSeconds) };
    }

    // Increment attempts
    await supabase
      .from('email_rate_limits')
      .update({ attempts: existing.attempts + 1 })
      .eq('id', existing.id);

    return { allowed: true };
  }

  // Create new rate limit record
  await supabase.from('email_rate_limits').insert({
    email: email.toLowerCase(),
    attempts: 1,
    first_attempt_at: new Date().toISOString(),
  });

  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    const { email, turnstileToken } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Verify Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Security verification required' },
        { status: 400 }
      );
    }

    const isValidTurnstile = await verifyTurnstile(turnstileToken);
    if (!isValidTurnstile) {
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(email);
    if (!rateLimit.allowed) {
      const minutes = Math.ceil((rateLimit.waitSeconds || 0) / 60);
      return NextResponse.json(
        {
          error: `Too many attempts. Please wait ${minutes} minute${minutes !== 1 ? 's' : ''} before trying again.`,
          waitSeconds: rateLimit.waitSeconds
        },
        { status: 429 }
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
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'yntoyg_claim_bot';
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
      from: 'YNTOYG Covenant <noreply@yntoyg.com>',
      to: email,
      subject: 'Your Invitation to the Covenant Awaits',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!--[if mso]>
          <style type="text/css">
            table, td {border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}
          </style>
          <![endif]-->
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
            Your invitation to the $YNTOYG Covenant awaits. Connect your Telegram and unlock daily viral content.
          </div>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #000000;">
            <tr>
              <td style="padding: 40px 16px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 480px; margin: 0 auto;">

                  <!-- Main Card with thin gold border -->
                  <tr>
                    <td style="background-color: #0a0a0a; border: 1px solid #D4AF37; border-radius: 16px; padding: 32px 24px;">

                      <!-- Diamond ornament -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                        <tr>
                          <td style="text-align: center;">
                            <span style="color: #D4AF37; font-size: 10px;">◆</span>
                          </td>
                        </tr>
                      </table>

                      <!-- Title -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding-bottom: 12px;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 400; font-family: Georgia, 'Times New Roman', serif; color: #FFFFFF;">
                              Welcome to the <span style="color: #D4AF37; font-style: italic;">Covenant</span>
                            </h1>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align: center; padding-bottom: 28px;">
                            <p style="margin: 0; font-size: 14px; color: #808080; line-height: 1.5;">
                              Your exclusive access to the $YNTOYG ecosystem
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- CTA Button -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px;">
                        <tr>
                          <td style="text-align: center;">
                            <a href="${magicLink}" style="display: inline-block; padding: 14px 32px; background-color: #D4AF37; color: #000000; font-weight: 600; text-decoration: none; font-size: 14px; border-radius: 8px;">
                              Accept Invitation →
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Features Section -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <!-- Feature 1: Telegram Bot -->
                        <tr>
                          <td style="padding: 16px 0; border-top: 1px solid #1a1a1a;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td style="width: 44px; vertical-align: top;">
                                  <div style="width: 36px; height: 36px; border: 1px solid #D4AF37; border-radius: 8px; text-align: center; line-height: 36px;">
                                    <span style="color: #D4AF37; font-size: 14px; font-family: Georgia, serif;">I</span>
                                  </div>
                                </td>
                                <td style="vertical-align: top; padding-left: 12px;">
                                  <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: #FFFFFF;">The Telegram Bot</p>
                                  <p style="margin: 0; font-size: 12px; color: #808080; line-height: 1.4;">Connect and receive daily viral content designed to go viral on your socials.</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        <!-- Feature 2: Points System -->
                        <tr>
                          <td style="padding: 16px 0; border-top: 1px solid #1a1a1a;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td style="width: 44px; vertical-align: top;">
                                  <div style="width: 36px; height: 36px; border: 1px solid #D4AF37; border-radius: 8px; text-align: center; line-height: 36px;">
                                    <span style="color: #D4AF37; font-size: 14px; font-family: Georgia, serif;">II</span>
                                  </div>
                                </td>
                                <td style="vertical-align: top; padding-left: 12px;">
                                  <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: #FFFFFF;">The Points System</p>
                                  <p style="margin: 0; font-size: 12px; color: #808080; line-height: 1.4;">Every post earns points. Climb the leaderboard and earn exclusive rewards.</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Expiry notice -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
                        <tr>
                          <td style="text-align: center;">
                            <p style="margin: 0; font-size: 11px; color: #555555;">
                              This invitation expires in 24 hours
                            </p>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="text-align: center; padding-top: 24px;">
                      <p style="margin: 0; font-size: 11px; color: #444444;">
                        yntoyg.com
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
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
