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

    // Generate filename with date to batch by day
    const today = new Date().toISOString().split("T")[0];
    const filename = `analytics-${today}.json`;

    // Try to get existing data for today
    let existingData = [];
    try {
      const existingBlob = await fetch(
        `https://timemarketing-blob.vercel-storage.com/${filename}`
      );
      if (existingBlob.ok) {
        existingData = await existingBlob.json();
      }
    } catch (error) {
      // File doesn't exist yet, start with empty array
      console.log("No existing data for today, starting fresh");
    }

    // Add new entry to existing data
    existingData.push(analyticsEntry);

    // Store batched data in Vercel Blob
    const blob = await put(filename, JSON.stringify(existingData, null, 2), {
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
