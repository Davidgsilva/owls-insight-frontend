import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const INTERNAL_AUTH_SECRET = process.env.INTERNAL_AUTH_SECRET;
const API_SERVER_URL = process.env.API_SERVER_URL || 'http://owls-insight-api-server';
const isProduction = process.env.NODE_ENV === 'production' || !process.env.DISCORD_REDIRECT_URI?.includes('localhost');

const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI
  || 'https://owlsinsight.com/api/auth/discord/callback';

const ALLOWED_ORIGINS = new Set([
  'https://owlsinsight.com',
  'https://www.owlsinsight.com',
  'http://localhost:3000',
]);

/** Derive the public origin from headers, validated against allowlist to prevent open redirects */
function getOrigin(request: NextRequest): string {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  if (host) {
    const candidate = `${proto}://${host}`;
    if (ALLOWED_ORIGINS.has(candidate)) {
      return candidate;
    }
  }
  return new URL(DISCORD_REDIRECT_URI).origin;
}

/** Redirect to login with error, always clearing OAuth cookies */
function errorRedirect(request: NextRequest, error: string): NextResponse {
  const origin = getOrigin(request);
  const response = NextResponse.redirect(
    new URL(`/login?error=${encodeURIComponent(error)}`, origin)
  );
  response.cookies.set('discord_oauth_state', '', { expires: new Date(0), path: '/' });
  response.cookies.set('discord_oauth_tier', '', { expires: new Date(0), path: '/' });
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Handle Discord errors (user denied consent, etc.)
  if (error) {
    return errorRedirect(request, 'Authorization denied');
  }

  if (!code || !state) {
    return errorRedirect(request, 'missing_params');
  }

  // Validate state against cookie (CSRF protection)
  const storedState = request.cookies.get('discord_oauth_state')?.value;
  if (!storedState) {
    return errorRedirect(request, 'expired_state');
  }

  // Timing-safe comparison to prevent timing attacks
  const stateBuffer = Buffer.from(state);
  const storedBuffer = Buffer.from(storedState);
  if (stateBuffer.length !== storedBuffer.length ||
      !crypto.timingSafeEqual(stateBuffer, storedBuffer)) {
    return errorRedirect(request, 'invalid_state');
  }

  try {
    // Exchange code via backend API
    const response = await fetch(`${API_SERVER_URL}/api/v1/auth/discord/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Auth': INTERNAL_AUTH_SECRET || '',
      },
      body: JSON.stringify({ code, redirectUri: DISCORD_REDIRECT_URI }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await response.json();

    if (!response.ok) {
      return errorRedirect(request, data.error || 'discord_auth_failed');
    }

    // Check if a tier was preserved through the OAuth flow
    const oauthTier = request.cookies.get('discord_oauth_tier')?.value;
    const validTiers = ['bench', 'rookie', 'mvp'];

    // Determine redirect destination
    const origin = getOrigin(request);
    let redirectUrl = new URL('/dashboard', origin);
    if (oauthTier && validTiers.includes(oauthTier)) {
      // Redirect to Stripe checkout after Discord signup
      redirectUrl = new URL(`/dashboard?start_checkout=${oauthTier}`, origin);
    }

    const redirectResponse = NextResponse.redirect(redirectUrl);

    if (data.token) {
      redirectResponse.cookies.set('token', data.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    // Clear the state and tier cookies
    redirectResponse.cookies.set('discord_oauth_state', '', {
      expires: new Date(0),
      path: '/',
    });
    redirectResponse.cookies.set('discord_oauth_tier', '', {
      expires: new Date(0),
      path: '/',
    });

    return redirectResponse;
  } catch (err) {
    console.error('Discord callback proxy error:', err);
    return errorRedirect(request, 'service_unavailable');
  }
}
