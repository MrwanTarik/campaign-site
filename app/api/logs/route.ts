import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

// Simple in-memory cache
let cache: {
  data: any[] | null;
  timestamp: number;
  ttl: number;
} = {
  data: null,
  timestamp: 0,
  ttl: 5 * 60 * 1000, // 5 minutes
};

export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const now = Date.now();
    if (cache.data && now - cache.timestamp < cache.ttl) {
      console.log("Returning cached analytics data");
      return NextResponse.json({
        success: true,
        logs: cache.data,
        count: cache.data.length,
        cached: true,
      });
    }

    console.log("Reading analytics from Vercel Blob...");

    // List all blobs with analytics prefix
    const { blobs } = await list({
      prefix: "analytics-",
    });

    console.log(`Found ${blobs.length} analytics blobs`);

    // Fetch and parse each blob
    const logs = [];
    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url);
        const data = await response.json();

        // Handle both old format (single objects) and new format (arrays)
        if (Array.isArray(data)) {
          logs.push(...data);
        } else {
          logs.push(data);
        }
      } catch (error) {
        console.error(`Error fetching blob ${blob.pathname}:`, error);
      }
    }

    // Sort by timestamp (newest first)
    const sortedLogs = logs.sort(
      (a: any, b: any) =>
        new Date(b.timestamp || b.ts).getTime() -
        new Date(a.timestamp || a.ts).getTime()
    );

    // Update cache
    cache.data = sortedLogs;
    cache.timestamp = now;

    console.log(`Successfully loaded ${sortedLogs.length} analytics entries`);

    return NextResponse.json({
      success: true,
      logs: sortedLogs,
      count: sortedLogs.length,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
