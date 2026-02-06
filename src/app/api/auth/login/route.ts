import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_AUTH_SECRET = process.env.INTERNAL_AUTH_SECRET;

// Direct URL to API server (bypasses proxy for auth)
const API_SERVER_URL = process.env.API_SERVER_URL || 'http://owls-insight-api-server';

const isProduction = process.env.NODE_ENV === 'production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_SERVER_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Auth': INTERNAL_AUTH_SECRET || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    const res = NextResponse.json(data, { status: response.status });

    // Set cookie from the token in the response body with correct attributes
    // for the current environment (production API sets Secure which breaks localhost).
    // Only set on successful responses to avoid leaking tokens from error responses.
    // Use sameSite 'lax' to allow cookies on Stripe checkout redirects.
    if (response.ok && data.token) {
      res.cookies.set('token', data.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return res;
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { error: 'Service unavailable' },
      { status: 503 }
    );
  }
}
