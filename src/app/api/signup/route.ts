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
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="color-scheme" content="dark">
          <meta name="supported-color-schemes" content="dark">
          <title>Welcome to the Covenant</title>
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <style type="text/css">
            body, table, td, p, a { font-family: Arial, sans-serif !important; }
            table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          </style>
          <![endif]-->
          <style type="text/css">
            :root { color-scheme: dark; supported-color-schemes: dark; }
            body, html { margin: 0 !important; padding: 0 !important; background-color: #000000 !important; }
            @media only screen and (max-width: 600px) {
              .container { width: 100% !important; padding: 16px !important; }
            }
          </style>
        </head>
        <body style="margin: 0 !important; padding: 0 !important; background-color: #000000 !important; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" bgcolor="#000000">
          <!-- Preheader text -->
          <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #000000;">
            Your invitation to the $YNTOYG Covenant awaits. Connect and unlock exclusive access.
            &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
          </div>

          <!-- Wrapper table for dark background -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" height="100%" style="background-color: #000000 !important; min-height: 100vh;" bgcolor="#000000">
            <tr>
              <td align="center" valign="top" style="background-color: #000000 !important; padding: 40px 16px;" bgcolor="#000000">

                <!-- Inner container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 480px; background-color: #000000 !important;" bgcolor="#000000" class="container">

                  <!-- Main Card -->
                  <tr>
                    <td style="background-color: #0a0a0a !important; border: 1px solid #D4AF37; border-radius: 16px; padding: 32px 24px;" bgcolor="#0a0a0a">

                      <!-- Diamond ornament -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                        <tr>
                          <td align="center" style="padding-bottom: 20px; background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                            <span style="color: #D4AF37; font-size: 12px;">&#9670;</span>
                          </td>
                        </tr>
                      </table>

                      <!-- Title -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                        <tr>
                          <td align="center" style="padding-bottom: 12px; background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 400; font-family: Georgia, 'Times New Roman', serif; color: #FFFFFF !important; mso-line-height-rule: exactly; line-height: 1.3;">
                              Welcome to the <span style="color: #D4AF37 !important; font-style: italic;">Covenant</span>
                            </h1>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding-bottom: 28px; background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                            <p style="margin: 0; font-size: 14px; color: #888888 !important; line-height: 1.5;">
                              Your exclusive access to the $YNTOYG ecosystem
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- CTA Button -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px; background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                        <tr>
                          <td align="center" style="background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                            <!--[if mso]>
                            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${magicLink}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="17%" strokecolor="#D4AF37" fillcolor="#D4AF37">
                              <w:anchorlock/>
                              <center style="color:#000000;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">Accept Invitation</center>
                            </v:roundrect>
                            <![endif]-->
                            <!--[if !mso]><!-->
                            <a href="${magicLink}" style="display: inline-block; padding: 14px 36px; background-color: #D4AF37 !important; color: #000000 !important; font-weight: 700; text-decoration: none; font-size: 14px; border-radius: 8px; letter-spacing: 0.5px;">
                              Accept Invitation &#8594;
                            </a>
                            <!--<![endif]-->
                          </td>
                        </tr>
                      </table>

                      <!-- Fallback link -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px; background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                        <tr>
                          <td align="center" style="background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                            <p style="margin: 0 0 8px 0; font-size: 11px; color: #666666 !important;">
                              Button not working? Copy this link:
                            </p>
                            <p style="margin: 0; font-size: 10px; color: #D4AF37 !important; word-break: break-all; padding: 10px 12px; background-color: #111111 !important; border-radius: 6px; border: 1px solid #222222;">
                              ${magicLink}
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Features Section -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                        <!-- Feature 1: Dashboard -->
                        <tr>
                          <td style="padding: 16px 0; border-top: 1px solid #1f1f1f; background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                              <tr>
                                <td width="44" valign="top" style="background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 36px; height: 36px; border: 1px solid #D4AF37; border-radius: 8px; background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                                    <tr>
                                      <td align="center" valign="middle" style="color: #D4AF37 !important; font-size: 14px; font-family: Georgia, serif; background-color: #0a0a0a !important;" bgcolor="#0a0a0a">I</td>
                                    </tr>
                                  </table>
                                </td>
                                <td valign="top" style="padding-left: 12px; background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                                  <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: #FFFFFF !important;">Your Personal Dashboard</p>
                                  <p style="margin: 0; font-size: 12px; color: #888888 !important; line-height: 1.4;">Access exclusive content and track your transformation journey.</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        <!-- Feature 2: Points System -->
                        <tr>
                          <td style="padding: 16px 0; border-top: 1px solid #1f1f1f; background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                              <tr>
                                <td width="44" valign="top" style="background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 36px; height: 36px; border: 1px solid #D4AF37; border-radius: 8px; background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                                    <tr>
                                      <td align="center" valign="middle" style="color: #D4AF37 !important; font-size: 14px; font-family: Georgia, serif; background-color: #0a0a0a !important;" bgcolor="#0a0a0a">II</td>
                                    </tr>
                                  </table>
                                </td>
                                <td valign="top" style="padding-left: 12px; background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                                  <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: #FFFFFF !important;">The Points System</p>
                                  <p style="margin: 0; font-size: 12px; color: #888888 !important; line-height: 1.4;">Every post earns points. Climb the leaderboard and earn exclusive rewards.</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Expiry notice -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px; background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                        <tr>
                          <td align="center" style="background-color: #0a0a0a !important;" bgcolor="#0a0a0a">
                            <p style="margin: 0; font-size: 11px; color: #555555 !important;">
                              This invitation expires in 24 hours
                            </p>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding-top: 24px; background-color: #000000 !important;" bgcolor="#000000">
                      <p style="margin: 0; font-size: 11px; color: #444444 !important;">
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
