import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET(request: NextRequest) {
  try {
    console.log("Reading analytics from Vercel Blob...");

    const blobToken =
      process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_TOKEN;
    if (!blobToken) {
      console.error(
        "Missing Vercel Blob token (BLOB_READ_WRITE_TOKEN or BLOB_READ_TOKEN)"
      );
      return NextResponse.json(
        {
          success: false,
          error: "Server misconfiguration: missing blob token",
        },
        { status: 500 }
      );
    }

    // List all blobs with analytics prefix
    const { blobs } = await list({
      prefix: "analytics-",
      token: blobToken,
    });

    console.log(`Found ${blobs.length} analytics blobs`);

    // Fetch and parse each blob
    const logs = [];
    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url, { cache: "no-store" });
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
