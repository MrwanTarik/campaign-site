import { NextRequest, NextResponse } from "next/server";
import { del, list } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    // Check if Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: "Blob storage not configured",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { action, confirmationCode } = body;

    // Security check - require confirmation code
    if (confirmationCode !== "DELETE_ALL_LOGS_CONFIRM") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid confirmation code",
        },
        { status: 403 }
      );
    }

    if (action === "delete_all") {
      // List all blobs
      const { blobs: analyticsBlobs } = await list({ prefix: "analytics-" });
      const { blobs: sessionBlobs } = await list({ prefix: "session-" });
      const { blobs: roomsBlobs } = await list({ prefix: "rooms-" });

      const allBlobs = [...analyticsBlobs, ...sessionBlobs, ...roomsBlobs];

      console.log(`Deleting ${allBlobs.length} analytics records...`);

      // Delete all blobs
      const deletePromises = allBlobs.map((blob) => del(blob.url));
      await Promise.all(deletePromises);

      console.log(`Successfully deleted ${allBlobs.length} records`);

      return NextResponse.json({
        success: true,
        message: `Deleted ${allBlobs.length} records`,
        count: allBlobs.length,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in cleanup:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cleanup data" },
      { status: 500 }
    );
  }
}
