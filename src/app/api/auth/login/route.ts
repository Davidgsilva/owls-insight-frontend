import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_AUTH_SECRET = process.env.INTERNAL_AUTH_SECRET;

// Direct URL to API server (bypasses proxy for auth)
const API_SERVER_URL = process.env.API_SERVER_URL || 'http://owls-insight-api-server';

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

    // Forward cookies from API response
    const apiCookies = response.headers.get('set-cookie');
    const res = NextResponse.json(data, { status: response.status });

    if (apiCookies) {
      res.headers.set('set-cookie', apiCookies);
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
