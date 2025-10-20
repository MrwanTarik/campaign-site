#!/usr/bin/env node

/**
 * Manual cleanup script for old analytics data
 * Run this to clean up old analytics files and reduce blob usage
 */

const https = require("https");

const cleanupAnalytics = async () => {
  try {
    console.log("🧹 Starting analytics cleanup...");

    // Replace with your actual domain
    const domain = process.env.VERCEL_URL || "your-domain.vercel.app";
    const url = `https://${domain}/api/cleanup`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      console.log("✅ Cleanup completed successfully!");
      console.log(`📊 Deleted ${result.deletedCount} old files`);
      console.log(`📁 Total files processed: ${result.totalFiles}`);

      if (result.errors && result.errors.length > 0) {
        console.log("⚠️  Some files could not be deleted:", result.errors);
      }
    } else {
      console.error("❌ Cleanup failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Error running cleanup:", error.message);
    console.log("💡 Make sure your app is deployed and accessible");
  }
};

// Run cleanup
cleanupAnalytics();
