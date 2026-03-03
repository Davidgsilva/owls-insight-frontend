import { NextResponse } from "next/server";

const API_SERVER_URL = process.env.API_SERVER_URL || "http://owls-insight-api-server";
const API_KEY = process.env.OWLS_INSIGHT_API_KEY || "";

// GET /api/scores — proxies live scores with server-side API key
export async function GET() {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const response = await fetch(`${API_SERVER_URL}/api/v1/scores/live`, {
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

    if (response.ok) {
      res.headers.set("Cache-Control", "public, s-maxage=10, stale-while-revalidate=5");
    }

    return res;
  } catch (error) {
    console.error("Scores proxy error:", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
