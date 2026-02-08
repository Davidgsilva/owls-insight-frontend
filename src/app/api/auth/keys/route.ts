import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_AUTH_SECRET = process.env.INTERNAL_AUTH_SECRET;

// Direct URL to API server (bypasses proxy for auth)
const API_SERVER_URL = process.env.API_SERVER_URL || 'http://owls-insight-api-server';

// GET /api/auth/keys - List API keys
export async function GET(request: NextRequest) {
  try {
    if (!INTERNAL_AUTH_SECRET) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Forward auth headers from client
    const authHeader = request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie');

    const headers: Record<string, string> = {
      'X-Internal-Auth': INTERNAL_AUTH_SECRET,
    };

    if (authHeader) headers['Authorization'] = authHeader;
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    const response = await fetch(`${API_SERVER_URL}/api/v1/auth/generate-key`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('List keys proxy error:', error);
    return NextResponse.json(
      { error: 'Service unavailable' },
      { status: 503 }
    );
  }
}

// POST /api/auth/keys - Generate new API key
export async function POST(request: NextRequest) {
  try {
    if (!INTERNAL_AUTH_SECRET) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));

    // Forward auth headers from client
    const authHeader = request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Internal-Auth': INTERNAL_AUTH_SECRET,
    };

    if (authHeader) headers['Authorization'] = authHeader;
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    const response = await fetch(`${API_SERVER_URL}/api/v1/auth/generate-key`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Generate key proxy error:', error);
    return NextResponse.json(
      { error: 'Service unavailable' },
      { status: 503 }
    );
  }
}
