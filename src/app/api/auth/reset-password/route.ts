import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_AUTH_SECRET = process.env.INTERNAL_AUTH_SECRET;
const API_SERVER_URL = process.env.API_SERVER_URL || 'http://owls-insight-api-server';
const isProduction = process.env.NODE_ENV === 'production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_SERVER_URL}/api/v1/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Auth': INTERNAL_AUTH_SECRET || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    const res = NextResponse.json(data, { status: response.status });

    // Set JWT cookie on successful reset (same pattern as login)
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
    console.error('Reset password proxy error:', error);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
