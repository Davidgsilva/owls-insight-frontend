import { NextRequest, NextResponse } from "next/server";

const INTERNAL_AUTH_SECRET = process.env.INTERNAL_AUTH_SECRET;
const API_SERVER_URL = process.env.API_SERVER_URL || "http://owls-insight-api-server";

export async function POST(request: NextRequest) {
  try {
    const cookies = request.headers.get("cookie") || "";

    // Call backend logout endpoint if it exists
    try {
      await fetch(`${API_SERVER_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Auth": INTERNAL_AUTH_SECRET || "",
          Cookie: cookies,
        },
      });
    } catch {
      // Backend logout is best-effort
    }

    // Clear the token cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("token", "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
