import { NextRequest, NextResponse } from "next/server";
import { list, del } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting analytics data cleanup...");

    // List all blobs with analytics prefix
    const { blobs } = await list({
      prefix: "analytics-",
    });

    console.log(`Found ${blobs.length} analytics blobs`);

    // Calculate cutoff date (keep last 30 days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    const cutoffDateString = cutoffDate.toISOString().split("T")[0];

    let deletedCount = 0;
    const errors = [];

    for (const blob of blobs) {
      try {
        // Extract date from filename (analytics-YYYY-MM-DD.json)
        const filename = blob.pathname;
        const dateMatch = filename.match(/analytics-(\d{4}-\d{2}-\d{2})\.json/);

        if (dateMatch) {
          const fileDate = dateMatch[1];

          // Delete files older than 30 days
          if (fileDate < cutoffDateString) {
            await del(blob.url);
            deletedCount++;
            console.log(`Deleted old analytics file: ${filename}`);
          }
        }
      } catch (error) {
        console.error(`Error deleting blob ${blob.pathname}:`, error);
        errors.push(blob.pathname);
      }
    }

    console.log(`Cleanup completed. Deleted ${deletedCount} old files.`);

    return NextResponse.json({
      success: true,
      message: `Cleanup completed. Deleted ${deletedCount} old analytics files.`,
      deletedCount,
      totalFiles: blobs.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error during cleanup:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cleanup old data" },
      { status: 500 }
    );
  }
}
