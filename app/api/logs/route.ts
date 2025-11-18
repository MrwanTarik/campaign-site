import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

// Increase timeout for this route (max 60 seconds for Pro plan)
export const maxDuration = 60;
// Make this route dynamic to prevent caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    // Check if we should limit results (for faster loading during development)
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const maxBlobs = limitParam ? parseInt(limitParam) : undefined;

    // Helper function to fetch all blobs with pagination
    async function getAllBlobs(prefix: string, maxResults?: number) {
      let allBlobs: any[] = [];
      let cursor: string | undefined;
      let hasMore = true;

      while (hasMore && (!maxResults || allBlobs.length < maxResults)) {
        const limit = maxResults 
          ? Math.min(1000, maxResults - allBlobs.length)
          : 1000;

        const result = await list({
          prefix,
          cursor,
          limit,
        });

        allBlobs = allBlobs.concat(result.blobs);
        cursor = result.cursor;
        hasMore = result.hasMore;

        console.log(
          `Fetched ${result.blobs.length} blobs with prefix "${prefix}", total so far: ${allBlobs.length}, hasMore: ${hasMore}`
        );

        // Safety check to prevent infinite loops
        if (allBlobs.length >= 10000) {
          console.warn(`Reached safety limit of 10000 blobs for prefix "${prefix}"`);
          break;
        }
      }

      return allBlobs;
    }

    // List all blobs (both analytics- and session- prefixes) with pagination
    const analyticsBlobs = await getAllBlobs("analytics-", maxBlobs);
    const sessionBlobs = await getAllBlobs("session-", maxBlobs);
    const roomsBlobs = await getAllBlobs("rooms-", maxBlobs);

    const blobs = [...analyticsBlobs, ...sessionBlobs, ...roomsBlobs];

    console.log(`Found total ${blobs.length} analytics blobs`);

    // Fetch and parse blobs in parallel batches to avoid timeout
    const BATCH_SIZE = 200; // Process 200 blobs at a time (increased for better performance)
    const logs = [];
    const startTime = Date.now();
    const MAX_EXECUTION_TIME = 55000; // 55 seconds max (leave 5 seconds buffer)
    
    for (let i = 0; i < blobs.length; i += BATCH_SIZE) {
      // Check if we're approaching timeout
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > MAX_EXECUTION_TIME) {
        console.warn(`Approaching timeout limit. Processed ${logs.length} logs out of ${blobs.length} blobs.`);
        break;
      }

      const batch = blobs.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(blobs.length / BATCH_SIZE)}, elapsed: ${Math.round(elapsedTime / 1000)}s`);
      
      const batchResults = await Promise.allSettled(
        batch.map(async (blob) => {
          try {
            const response = await fetch(blob.url, {
              signal: AbortSignal.timeout(5000), // 5 second timeout per blob
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch ${blob.pathname}: ${response.status}`);
            }
            return await response.json();
          } catch (error) {
            console.error(`Error fetching blob ${blob.pathname}:`, error);
            return null;
          }
        })
      );

      // Filter out failed fetches and null values
      const successfulLogs = batchResults
        .filter((result): result is PromiseFulfilledResult<any> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);

      logs.push(...successfulLogs);
      
      console.log(`Batch complete: ${successfulLogs.length} logs fetched, total: ${logs.length}, time: ${Math.round((Date.now() - startTime) / 1000)}s`);
    }

    // Sort by timestamp (newest first)
    const sortedLogs = logs.sort(
      (a: any, b: any) =>
        new Date(b.timestamp || b.ts).getTime() -
        new Date(a.timestamp || a.ts).getTime()
    );

    console.log(`Successfully loaded ${sortedLogs.length} analytics entries out of ${blobs.length} blobs`);

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
