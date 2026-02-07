import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_AUTH_SECRET = process.env.INTERNAL_AUTH_SECRET;
const API_SERVER_URL = process.env.API_SERVER_URL || 'http://owls-insight-api-server';

export async function POST(request: NextRequest) {
  try {
    const cookies = request.headers.get('cookie') || '';

    const response = await fetch(`${API_SERVER_URL}/api/v1/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Auth': INTERNAL_AUTH_SECRET || '',
        Cookie: cookies,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Resend verification proxy error:', error);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
