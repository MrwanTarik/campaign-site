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

    // Helper function to fetch all blobs with pagination
    async function getAllBlobs(prefix: string) {
      let allBlobs: any[] = [];
      let cursor: string | undefined;
      let hasMore = true;

      while (hasMore) {
        const result = await list({
          prefix,
          cursor,
          limit: 1000, // Maximum per page
        });

        allBlobs = allBlobs.concat(result.blobs);
        cursor = result.cursor;
        hasMore = result.hasMore;

        console.log(
          `Fetched ${result.blobs.length} blobs with prefix "${prefix}", total so far: ${allBlobs.length}, hasMore: ${hasMore}`
        );
      }

      return allBlobs;
    }

    // List all blobs (both analytics- and session- prefixes) with pagination
    const analyticsBlobs = await getAllBlobs("analytics-");
    const sessionBlobs = await getAllBlobs("session-");
    const roomsBlobs = await getAllBlobs("rooms-");

    const blobs = [...analyticsBlobs, ...sessionBlobs, ...roomsBlobs];

    console.log(`Found total ${blobs.length} analytics blobs`);

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
