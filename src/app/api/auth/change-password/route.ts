import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_AUTH_SECRET = process.env.INTERNAL_AUTH_SECRET;
const API_SERVER_URL = process.env.API_SERVER_URL || 'http://owls-insight-api-server';
const isProduction = process.env.NODE_ENV === 'production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookies = request.headers.get('cookie') || '';

    const response = await fetch(`${API_SERVER_URL}/api/v1/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Auth': INTERNAL_AUTH_SECRET || '',
        Cookie: cookies,
      },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      return NextResponse.json({ error: 'Unexpected response from server' }, { status: 502 });
    }

    const res = NextResponse.json(data, { status: response.status });

    // Set cookie from the token in the response body with correct attributes
    // for the current environment (production API sets Secure which breaks localhost).
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
    console.error('Change password proxy error:', error);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
