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
    const date = searchParams.get("date");
    const tz = searchParams.get("tz");

    const url = new URL(`${API_SERVER_URL}/api/v1/usage`);
    if (date) url.searchParams.set("date", date);
    if (tz) url.searchParams.set("tz", tz);

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
    console.error("Usage proxy error:", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
