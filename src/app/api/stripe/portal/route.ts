import { NextRequest, NextResponse } from "next/server";

const INTERNAL_AUTH_SECRET = process.env.INTERNAL_AUTH_SECRET;
const API_SERVER_URL = process.env.API_SERVER_URL || "http://owls-insight-api-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const cookies = request.headers.get("cookie") || "";

    const response = await fetch(`${API_SERVER_URL}/api/v1/stripe/portal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Auth": INTERNAL_AUTH_SECRET || "",
        Cookie: cookies,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Stripe portal proxy error:", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
