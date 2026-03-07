import { NextRequest, NextResponse } from "next/server";

const INTERNAL_AUTH_SECRET = process.env.INTERNAL_AUTH_SECRET;
const API_SERVER_URL = process.env.API_SERVER_URL || "http://owls-insight-api-server";

export async function GET(request: NextRequest) {
  try {
    // Forward cookies from the request
    const cookies = request.headers.get("cookie") || "";

    const response = await fetch(`${API_SERVER_URL}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Auth": INTERNAL_AUTH_SECRET || "",
        Cookie: cookies,
      },
    });

    const text = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Auth me upstream returned non-JSON:", text.slice(0, 200));
      return NextResponse.json({ error: "Upstream returned invalid response" }, { status: 502 });
    }

    // If the token is invalid/expired, clear the httpOnly cookie so the
    // middleware stops redirecting /login → /dashboard in a loop
    if (response.status === 401) {
      const res = NextResponse.json(data, { status: 401 });
      res.cookies.set('token', '', { expires: new Date(0), path: '/' });
      return res;
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Auth me proxy error:", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
