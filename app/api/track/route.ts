import { NextRequest, NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    // Check if Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn(
        "BLOB_READ_WRITE_TOKEN not configured. Analytics will not be stored."
      );
      return NextResponse.json(
        {
          success: false,
          error: "Blob storage not configured",
        },
        { status: 503 }
      );
    }

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

    const sessionId = body.sessionId || body.guid;
    const pageName = body.pageName || "unknown";

    // Check if there's an existing record for this session
    const { blobs } = await list({ prefix: `session-${sessionId}` });

    let mergedData: any = {
      ...body,
      serverIP,
      timestamp: new Date().toISOString(),
    };

    if (blobs.length > 0) {
      // Found existing session record - merge the data
      console.log(
        `Found ${blobs.length} existing record(s) for session ${sessionId}`
      );

      // Fetch the existing record
      const existingBlob = blobs[0];
      const existingResponse = await fetch(existingBlob.url);
      const existingData = await existingResponse.json();

      console.log("Merging with existing data");

      // Merge the data intelligently
      mergedData = {
        ...existingData,
        // Update timestamp to latest
        timestamp: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),

        // Keep session identifiers
        guid: existingData.guid || body.guid,
        sessionId: existingData.sessionId || body.sessionId,
        ip: existingData.ip || body.ip,
        country: existingData.country || body.country,
        ua: existingData.ua || body.ua,
        lang: existingData.lang || body.lang,
        source: existingData.source || body.source,
        sourceTimestamp: existingData.sourceTimestamp || body.sourceTimestamp,
        location: existingData.location || body.location,
        locationTimestamp: existingData.locationTimestamp || body.locationTimestamp,

        // Merge page visits
        pageVisits: [
          ...(existingData.pageVisits || []),
          {
            pageName: pageName,
            timestamp: body.ts || new Date().toISOString(),
            secondsOnPage: body.secondsOnPage,
            activeSecondsOnPage: body.activeSecondsOnPage,
            exitedAt: body.exitedAt,
            sessionEnded: body.sessionEnded,
          },
        ],

        // Combine landing page data
        landingPage: {
          ...(existingData.landingPage || {}),
          ...(pageName === "landing"
            ? {
                sectionsViewed: body.sectionsViewed || [],
                navClicks: body.navClicks || [],
                menuClicks: body.menuClicks || [],
                faqOpened: body.faqOpened || [],
                events: body.events || [],
                secondsOnPage: body.secondsOnPage,
                activeSecondsOnPage: body.activeSecondsOnPage,
                exitedAt: body.exitedAt,
              }
            : existingData.landingPage || {}),
        },

        // Combine interest page data
        interestPage: {
          ...(existingData.interestPage || {}),
          ...(pageName === "interest"
            ? {
                selectedOptions:
                  body.selectedOptions ||
                  existingData.interestPage?.selectedOptions ||
                  [],
                selectedJiwar1:
                  body.selectedJiwar1 ||
                  existingData.interestPage?.selectedJiwar1 ||
                  [],
                selectedJiwar2:
                  body.selectedJiwar2 ||
                  existingData.interestPage?.selectedJiwar2 ||
                  [],
                form: body.form || existingData.interestPage?.form || {},
                formHasData:
                  body.formHasData || existingData.interestPage?.formHasData,
                // If either current or existing is submitted, mark as submitted
                submitted:
                  body.submitted === true ||
                  existingData.interestPage?.submitted === true,
                interestSource:
                  body.interestSource ||
                  existingData.interestPage?.interestSource,
                sourceTimestamp:
                  body.sourceTimestamp ||
                  existingData.interestPage?.sourceTimestamp,
                location:
                  body.location ||
                  existingData.interestPage?.location,
                locationTimestamp:
                  body.locationTimestamp ||
                  existingData.interestPage?.locationTimestamp,
                secondsOnPage:
                  body.secondsOnPage ||
                  existingData.interestPage?.secondsOnPage,
                activeSecondsOnPage:
                  body.activeSecondsOnPage ||
                  existingData.interestPage?.activeSecondsOnPage,
                exitedAt: body.exitedAt || existingData.interestPage?.exitedAt,
              }
            : existingData.interestPage || {}),
        },

        // Calculate total time across all pages
        totalSecondsOnSite:
          (existingData.totalSecondsOnSite || 0) + (body.secondsOnPage || 0),
        totalActiveSecondsOnSite:
          (existingData.totalActiveSecondsOnSite || 0) +
          (body.activeSecondsOnPage || 0),

        // Track if session has ended
        sessionEnded: body.sessionEnded || existingData.sessionEnded,
      };

      // Delete old blob
      await del(existingBlob.url);
      console.log("Deleted old session record");
    } else {
      // First record for this session
      console.log("Creating first record for session");
      mergedData = {
        guid: body.guid,
        sessionId: body.sessionId,
        ip: body.ip,
        country: body.country,
        ua: body.ua,
        lang: body.lang,
        source: body.source,
        sourceTimestamp: body.sourceTimestamp,
        location: body.location,
        locationTimestamp: body.locationTimestamp,
        serverIP,
        timestamp: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),

        pageVisits: [
          {
            pageName: pageName,
            timestamp: body.ts || new Date().toISOString(),
            secondsOnPage: body.secondsOnPage,
            activeSecondsOnPage: body.activeSecondsOnPage,
            exitedAt: body.exitedAt,
            sessionEnded: body.sessionEnded,
          },
        ],

        landingPage:
          pageName === "landing"
            ? {
                sectionsViewed: body.sectionsViewed || [],
                navClicks: body.navClicks || [],
                menuClicks: body.menuClicks || [],
                faqOpened: body.faqOpened || [],
                events: body.events || [],
                secondsOnPage: body.secondsOnPage,
                activeSecondsOnPage: body.activeSecondsOnPage,
                exitedAt: body.exitedAt,
              }
            : {},

        interestPage:
          pageName === "interest"
            ? {
                selectedOptions: body.selectedOptions || [],
                selectedJiwar1: body.selectedJiwar1 || [],
                selectedJiwar2: body.selectedJiwar2 || [],
                form: body.form || {},
                formHasData: body.formHasData,
                submitted: body.submitted,
                interestSource: body.interestSource,
                sourceTimestamp: body.sourceTimestamp,
                location: body.location,
                locationTimestamp: body.locationTimestamp,
                secondsOnPage: body.secondsOnPage,
                activeSecondsOnPage: body.activeSecondsOnPage,
                exitedAt: body.exitedAt,
              }
            : {},

        totalSecondsOnSite: body.secondsOnPage || 0,
        totalActiveSecondsOnSite: body.activeSecondsOnPage || 0,
        sessionEnded: body.sessionEnded,
      };
    }

    // Use consistent filename for the session
    const filename = `session-${sessionId}.json`;

    // Store in Vercel Blob
    const blob = await put(filename, JSON.stringify(mergedData, null, 2), {
      access: "public",
      contentType: "application/json",
    });

    console.log("Merged analytics data stored in Vercel Blob:", blob.url);

    return NextResponse.json({
      success: true,
      message: "Analytics data merged successfully",
      blobUrl: blob.url,
      sessionId: sessionId,
      merged: blobs.length > 0,
    });
  } catch (error) {
    console.error("Error storing analytics data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to store analytics data" },
      { status: 500 }
    );
  }
}
