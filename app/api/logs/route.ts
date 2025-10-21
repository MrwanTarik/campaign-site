import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET(request: NextRequest) {
  try {
    // Check if Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn(
        "BLOB_READ_WRITE_TOKEN not configured. Returning empty logs."
      );
      return NextResponse.json({
        success: true,
        logs: [],
        count: 0,
      });
    }

    console.log("Reading analytics from Vercel Blob...");

    // List all blobs (both analytics- and session- prefixes)
    const { blobs: analyticsBlobs } = await list({
      prefix: "analytics-",
    });

    const { blobs: sessionBlobs } = await list({
      prefix: "session-",
    });

    const { blobs: roomsBlobs } = await list({
      prefix: "rooms-",
    });

    const blobs = [...analyticsBlobs, ...sessionBlobs, ...roomsBlobs];

    console.log(`Found ${blobs.length} analytics blobs`);

    // Fetch and parse each blob
    const logs = [];
    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url);
        const data = await response.json();
        logs.push(data);
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

    console.log(`Successfully loaded ${sortedLogs.length} analytics entries`);

    return NextResponse.json({
      success: true,
      logs: sortedLogs,
      count: sortedLogs.length,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
