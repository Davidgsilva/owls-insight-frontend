import { NextRequest, NextResponse } from "next/server";

const API_SERVER_URL = process.env.API_SERVER_URL || "http://owls-insight-api-server";
const API_KEY = process.env.OWLS_INSIGHT_API_KEY || "";

const VALID_SPORTS = ["nba", "ncaab", "nfl", "nhl", "ncaaf", "mlb"];

// GET /api/odds?sport=nba — proxies odds requests with server-side API key
export async function GET(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const sport = request.nextUrl.searchParams.get("sport") || "nba";

    if (!VALID_SPORTS.includes(sport)) {
      return NextResponse.json({ error: "Invalid sport" }, { status: 400 });
    }

    const response = await fetch(`${API_SERVER_URL}/api/v1/${sport}/odds`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Accept": "application/json",
        "Accept-Encoding": "identity",
      },
    });

    const text = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Upstream returned non-JSON:", text.slice(0, 200));
      return NextResponse.json({ error: "Upstream returned invalid response" }, { status: 502 });
    }
    const res = NextResponse.json(data, { status: response.status });

    // Cache for 15 seconds so concurrent visitors share the same response
    if (response.ok) {
      res.headers.set("Cache-Control", "public, s-maxage=15, stale-while-revalidate=10");
    }

    return res;
  } catch (error) {
    console.error("Odds proxy error:", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
