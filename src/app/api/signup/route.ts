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
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Georgia', 'Times New Roman', serif;">
          <!-- Preheader text -->
          <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
            A distinguished invitation awaits your acceptance. Your transformation into a gentleman begins now.
          </div>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #000000;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 520px; margin: 0 auto;">

                  <!-- Decorative Header -->
                  <tr>
                    <td style="text-align: center; padding-bottom: 32px;">
                      <!-- Diamond ornament -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                        <tr>
                          <td style="width: 40px; height: 1px; background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5));"></td>
                          <td style="padding: 0 12px;">
                            <div style="width: 8px; height: 8px; background-color: #D4AF37; transform: rotate(45deg); opacity: 0.7;"></div>
                          </td>
                          <td style="width: 40px; height: 1px; background: linear-gradient(90deg, rgba(212, 175, 55, 0.5), transparent);"></td>
                        </tr>
                      </table>
                      <h1 style="color: #D4AF37; font-size: 32px; margin: 16px 0 0 0; font-weight: 400; letter-spacing: 3px; font-family: 'Georgia', serif;">YNTOYG</h1>
                    </td>
                  </tr>

                  <!-- Main Card -->
                  <tr>
                    <td>
                      <!-- Outer glow border -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-radius: 24px; background: linear-gradient(180deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 50%, rgba(212, 175, 55, 0.3) 100%); padding: 1px;">
                        <tr>
                          <td>
                            <!-- Inner card -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #000000; border-radius: 23px;">
                              <tr>
                                <td style="padding: 40px 32px; text-align: center;">

                                  <!-- Title with gold accent -->
                                  <h2 style="color: #F5F5DC; font-size: 26px; margin: 0 0 8px 0; font-weight: 400; font-family: 'Georgia', serif;">
                                    Welcome to the <span style="color: #D4AF37;">Covenant</span>
                                  </h2>

                                  <p style="color: rgba(245, 245, 220, 0.5); margin: 0 0 28px 0; font-size: 15px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    Your journey toward refinement commences here. Kindly proceed to establish your credentials and take your rightful place among the distinguished.
                                  </p>

                                  <!-- CTA Button -->
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                    <tr>
                                      <td style="border-radius: 12px; background: linear-gradient(135deg, #D4AF37 0%, #e6c55a 50%, #D4AF37 100%); box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);">
                                        <a href="${magicLink}" style="display: inline-block; padding: 16px 36px; color: #000000; font-weight: 600; text-decoration: none; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: 0.5px;">
                                          Accept Invitation →
                                        </a>
                                      </td>
                                    </tr>
                                  </table>

                                  <!-- Divider -->
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 28px 0;">
                                    <tr>
                                      <td style="height: 1px; background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);"></td>
                                    </tr>
                                  </table>

                                  <!-- Steps -->
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="text-align: left;">
                                    <tr>
                                      <td style="padding: 8px 0;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                          <tr>
                                            <td style="width: 28px; height: 28px; background-color: rgba(212, 175, 55, 0.15); border-radius: 50%; text-align: center; vertical-align: middle;">
                                              <span style="color: #D4AF37; font-size: 13px; font-weight: 600;">I</span>
                                            </td>
                                            <td style="padding-left: 14px; color: rgba(245, 245, 220, 0.6); font-size: 14px; font-family: -apple-system, sans-serif;">Accept the invitation above</td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="padding: 8px 0;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                          <tr>
                                            <td style="width: 28px; height: 28px; background-color: rgba(212, 175, 55, 0.15); border-radius: 50%; text-align: center; vertical-align: middle;">
                                              <span style="color: #D4AF37; font-size: 13px; font-weight: 600;">II</span>
                                            </td>
                                            <td style="padding-left: 14px; color: rgba(245, 245, 220, 0.6); font-size: 14px; font-family: -apple-system, sans-serif;">Establish your Telegram credentials</td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="padding: 8px 0;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                          <tr>
                                            <td style="width: 28px; height: 28px; background-color: rgba(212, 175, 55, 0.15); border-radius: 50%; text-align: center; vertical-align: middle;">
                                              <span style="color: #D4AF37; font-size: 13px; font-weight: 600;">III</span>
                                            </td>
                                            <td style="padding-left: 14px; color: rgba(245, 245, 220, 0.6); font-size: 14px; font-family: -apple-system, sans-serif;">Ascend the ranks of distinction</td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>

                                  <p style="color: rgba(245, 245, 220, 0.3); font-size: 12px; margin: 24px 0 0 0; font-family: -apple-system, sans-serif;">
                                    This invitation remains valid for 24 hours
                                  </p>

                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="text-align: center; padding-top: 32px;">
                      <p style="color: rgba(245, 245, 220, 0.25); font-size: 11px; line-height: 1.5; margin: 0; font-family: -apple-system, sans-serif;">
                        This correspondence was dispatched from yntoyg.com<br/>
                        Should this request not be of your making, you may disregard it with our regards.
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
