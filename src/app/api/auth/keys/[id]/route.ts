import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_AUTH_SECRET = process.env.INTERNAL_AUTH_SECRET;
const API_SERVER_URL = process.env.API_SERVER_URL || 'http://owls-insight-api-server';

// DELETE /api/auth/keys/:id - Delete an API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate key ID format to prevent path traversal / SSRF
    if (!id || !/^key_\d+_[a-z0-9]+$/.test(id)) {
      return NextResponse.json({ error: 'Invalid key ID' }, { status: 400 });
    }

    if (!INTERNAL_AUTH_SECRET) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const authHeader = request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie');

    const headers: Record<string, string> = {
      'X-Internal-Auth': INTERNAL_AUTH_SECRET,
    };

    if (authHeader) headers['Authorization'] = authHeader;
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    const response = await fetch(`${API_SERVER_URL}/api/v1/auth/keys/${id}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Delete key proxy error:', error);
    return NextResponse.json(
      { error: 'Service unavailable' },
      { status: 503 }
    );
  }
}
