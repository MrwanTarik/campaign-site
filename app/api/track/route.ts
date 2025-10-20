import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Debug: Log the incoming analytics data
    console.log("Incoming analytics data:", JSON.stringify(body, null, 2));

    // Get real IP from server headers (more reliable than client-side)
    const forwarded = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const cfConnectingIP = request.headers.get("cf-connecting-ip");

    const serverIP =
      cfConnectingIP || realIP || forwarded?.split(",")[0] || null;

    // Override client IP with server-detected IP if available
    if (serverIP && (!body.ip || body.ip === "null")) {
      body.ip = serverIP;
    }

    // Add timestamp and unique ID
    const analyticsEntry = {
      ...body,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    // Generate unique filename
    const filename = `analytics-${analyticsEntry.id}.json`;

    // Store in Vercel Blob
    const blob = await put(filename, JSON.stringify(analyticsEntry, null, 2), {
      access: "public",
      contentType: "application/json",
    });

    console.log("Analytics data stored in Vercel Blob:", blob.url);

    return NextResponse.json({
      success: true,
      message: "Analytics data stored successfully",
      blobUrl: blob.url,
    });
  } catch (error) {
    console.error("Error storing analytics data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to store analytics data" },
      { status: 500 }
    );
  }
}
