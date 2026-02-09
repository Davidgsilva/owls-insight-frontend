import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const isProduction = process.env.NODE_ENV === 'production';

const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI
  || 'https://owlsinsight.com/api/auth/discord/callback';

export async function GET(request: NextRequest) {
  if (!DISCORD_CLIENT_ID) {
    return NextResponse.json({ error: 'Discord OAuth not configured' }, { status: 503 });
  }

  // Generate cryptographically secure state for CSRF protection
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email',
    state,
    prompt: 'consent',
  });

  const discordAuthUrl = `https://discord.com/oauth2/authorize?${params.toString()}`;

  // Use NextResponse only for cookie-setting, then copy headers into a raw
  // Response. NextResponse.redirect() rewrites Location to the server's bind
  // address (0.0.0.0:3000) in standalone mode.
  const nr = new NextResponse(null);

  // Store state in httpOnly cookie for validation on callback
  // sameSite must be 'lax' to survive the cross-origin redirect from Discord
  nr.cookies.set('discord_oauth_state', state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 300, // 5 minutes
  });

  // Preserve tier param through OAuth flow (e.g., tier=mvp for free trial)
  const tier = request.nextUrl.searchParams.get('tier');
  const validTiers = ['bench', 'rookie', 'mvp'];
  if (tier && validTiers.includes(tier)) {
    nr.cookies.set('discord_oauth_tier', tier, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 300,
    });
  }

  const headers = new Headers(nr.headers);
  headers.set('Location', discordAuthUrl);
  return new Response(null, { status: 302, headers });
}
