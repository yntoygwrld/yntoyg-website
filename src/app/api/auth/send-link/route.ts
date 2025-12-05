import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseService } from '@/lib/supabase';
import { resend } from '@/lib/resend';
import { randomBytes } from 'crypto';

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
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
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
      from: 'YNTOYG Covenant <noreply@yntoyg.com>',
      to: email,
      subject: 'Your Presence is Requested - Dashboard Access',
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
        <body style="margin: 0; padding: 0; background-color: #0a0a0c; font-family: 'Georgia', 'Times New Roman', serif;">
          <!-- Preheader text -->
          <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
            Esteemed member, your private chambers await. This passage expires in 15 minutes.
          </div>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0c;">
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
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0c; border-radius: 23px;">
                              <tr>
                                <td style="padding: 40px 32px; text-align: center;">

                                  <!-- Title with gold accent -->
                                  <h2 style="color: #F5F5DC; font-size: 26px; margin: 0 0 8px 0; font-weight: 400; font-family: 'Georgia', serif;">
                                    Welcome Back, <span style="color: #D4AF37;">Gentleman</span>
                                  </h2>

                                  <p style="color: rgba(245, 245, 220, 0.5); margin: 0 0 28px 0; font-size: 15px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    Your private chambers await. Kindly proceed to review your distinguished standing amongst the Covenant.
                                  </p>

                                  <!-- CTA Button -->
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                    <tr>
                                      <td style="border-radius: 12px; background: linear-gradient(135deg, #D4AF37 0%, #e6c55a 50%, #D4AF37 100%); box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);">
                                        <a href="${loginUrl}" style="display: inline-block; padding: 16px 36px; color: #0a0a0c; font-weight: 600; text-decoration: none; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: 0.5px;">
                                          Enter the Chamber →
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

                                  <!-- Info -->
                                  <p style="color: rgba(245, 245, 220, 0.4); font-size: 14px; margin: 0; font-family: -apple-system, sans-serif; font-style: italic;">
                                    View your statistics, track your ascension, and witness your transformation unfold.
                                  </p>

                                  <p style="color: rgba(245, 245, 220, 0.3); font-size: 12px; margin: 24px 0 0 0; font-family: -apple-system, sans-serif;">
                                    This passage expires in 15 minutes
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send link error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
