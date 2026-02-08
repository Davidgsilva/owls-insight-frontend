import { NextRequest, NextResponse } from "next/server";

const INTERNAL_AUTH_SECRET = process.env.INTERNAL_AUTH_SECRET;
const API_SERVER_URL = process.env.API_SERVER_URL || "http://owls-insight-api-server";

export async function GET(request: NextRequest) {
  try {
    if (!INTERNAL_AUTH_SECRET) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const cookies = request.headers.get("cookie") || "";
    const searchParams = request.nextUrl.searchParams;

    const url = new URL(`${API_SERVER_URL}/api/v1/usage/logs`);
    const limit = searchParams.get("limit");
    const since = searchParams.get("since");
    if (limit) url.searchParams.set("limit", limit);
    if (since) url.searchParams.set("since", since);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Auth": INTERNAL_AUTH_SECRET,
        Cookie: cookies,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Usage logs proxy error:", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
