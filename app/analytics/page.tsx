"use client";

import React, { useState, useEffect } from "react";

interface AnalyticsData {
  guid: string;
  sessionId: string;
  ip: string | null;
  country: string | null;
  ua: string;
  lang?: string;
  source?: string | null;
  sourceTimestamp?: string | null;
  location?: string | null;
  locationTimestamp?: string | null;
  timestamp: string;
  lastUpdated?: string;

  // Page visits tracking
  pageVisits?: Array<{
    pageName: string;
    timestamp: string;
    secondsOnPage: number;
    activeSecondsOnPage?: number;
    exitedAt?: string;
    sessionEnded?: boolean;
  }>;

  // Landing page data
  landingPage?: {
    sectionsViewed?: string[];
    navClicks?: Array<{ t: number; label: string; href: string }>;
    menuClicks?: Array<{ t: number; label: string; href: string }>;
    faqOpened?: string[];
    events?: Array<{ t: number; type: string; [key: string]: any }>;
    secondsOnPage?: number;
    activeSecondsOnPage?: number;
    exitedAt?: string;
  };

  // Interest page data
  interestPage?: {
    selectedOptions?: string[];
    selectedJiwar1?: string[];
    selectedJiwar2?: string[];
    form?: any;
    formHasData?: boolean;
    submitted?: boolean;
    interestSource?: string;
    sourceTimestamp?: string;
    location?: string;
    locationTimestamp?: string;
    secondsOnPage?: number;
    activeSecondsOnPage?: number;
    exitedAt?: string;
  };

  // Totals
  totalSecondsOnSite?: number;
  totalActiveSecondsOnSite?: number;
  sessionEnded?: boolean;

  // Legacy fields for backward compatibility
  secondsOnPage?: number;
  activeSecondsOnPage?: number;
  sectionsViewed?: string[];
  navClicks?: Array<{ t: number; label: string; href: string }>;
  menuClicks?: Array<{ t: number; label: string; href: string }>;
  faqOpened?: string[];
  ts?: string;
}

// Static credentials - same as logs page
const AUTH_USERNAME = "jiwar_admin";
const AUTH_PASSWORD = "Jiwar@2025#Secure";

export default function AnalyticsPage() {
  const [logs, setLogs] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const authToken = localStorage.getItem("jiwar_logs_auth");
    if (authToken === btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`)) {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  // Prevent tracking on the analytics page
  useEffect(() => {
    // Mark this page as a tracking-excluded page
    if (typeof window !== "undefined") {
      (window as any).__JIWAR_NO_TRACKING__ = true;
    }
    return () => {
      if (typeof window !== "undefined") {
        (window as any).__JIWAR_NO_TRACKING__ = false;
      }
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
      const authToken = btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`);
      localStorage.setItem("jiwar_logs_auth", authToken);
      setIsAuthenticated(true);
    } else {
      setLoginError("اسم المستخدم أو كلمة المرور غير صحيحة");
      setPassword("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jiwar_logs_auth");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  const fetchLogs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Add cache-busting parameter to ensure fresh data
      const response = await fetch(`/api/logs?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      const data = await response.json();

      // Normalize and deduplicate logs
      const normalized = normalizeLogs(
        Array.isArray(data.logs) ? data.logs : []
      );
      const uniqueLogs = deduplicateLogs(normalized);
      setLogs(uniqueLogs);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper functions for data normalization and deduplication
  const normalizeLogs = (logs: any[]): AnalyticsData[] => {
    return logs.map((log) => ({
      ...log,
      timestamp: log.timestamp || log.ts || new Date().toISOString(),
      country: log.country || "غير محدد",
      source: cleanPlatformSource(log.source), // Clean and validate platform source
      location: log.location || null,
      locationTimestamp: log.locationTimestamp || null,
    }));
  };

  // Helper function to clean platform sources
  const cleanPlatformSource = (
    source: string | null | undefined
  ): string | null => {
    if (!source) return null;

    // List of valid platform sources
    const validPlatforms = [
      "facebook",
      "twitter",
      "snapchat",
      "tiktok",
      "instagram",
    ];

    // If it's a valid platform, return it
    if (validPlatforms.includes(source.toLowerCase())) {
      return source.toLowerCase();
    }

    // If it's an interest source (like header_cta, hero_cta_primary, etc.), return null
    // These should not be counted as platform sources
    const interestSources = [
      "header_cta",
      "hero_cta_primary",
      "investment_section_cta",
      "jiwar_card_برج جِوار ١",
      "jiwar_card_برج جِوار ٢",
      "direct",
    ];

    if (interestSources.some((interest) => source.includes(interest))) {
      return null; // This will be counted as "مباشر" (direct)
    }

    // For any other unknown source, return null (direct)
    return null;
  };

  const deduplicateLogs = (logs: AnalyticsData[]): AnalyticsData[] => {
    const seen = new Set();
    return logs.filter((log) => {
      const key = `${log.guid}-${log.sessionId}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fffe] to-[#e6f7f3] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c9a6f]"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fffe] to-[#e6f7f3] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#1c9a6f]/20">
          <div className="text-center mb-8">
            <LogoJiwar className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#0b3d2e] mb-2">
              لوحة التحليلات
            </h1>
            <p className="text-[#0b3d2e]/60">
              يرجى تسجيل الدخول للوصول إلى لوحة التحليلات
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0b3d2e] mb-2">
                اسم المستخدم
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c9a6f] focus:border-transparent transition-all"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0b3d2e] mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c9a6f] focus:border-transparent transition-all"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1c9a6f] to-[#0b3d2e] text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main analytics dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fffe] to-[#e6f7f3]">
      {/* Header */}
      <div className="bg-white border-b border-[#1c9a6f]/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <LogoJiwar className="w-8 h-8" />
              <h1 className="text-xl font-bold text-[#0b3d2e]">
                لوحة التحليلات - جِوار
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => fetchLogs(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-[#1c9a6f] text-white rounded-lg hover:bg-[#0b3d2e] transition-colors disabled:opacity-50"
              >
                <svg
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {refreshing ? "جاري التحديث..." : "تحديث"}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !refreshing ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c9a6f]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              خطأ في تحميل البيانات: {error}
            </div>
          </div>
        ) : (
          <>
            {/* Last Updated Info */}
            {lastUpdated && (
              <div className="mb-6 text-sm text-[#0b3d2e]/60">
                آخر تحديث: {lastUpdated.toLocaleString("ar-SA")}
              </div>
            )}

            {/* Analytics Dashboard */}
            <AnalyticsDashboard logs={logs} />
          </>
        )}
      </div>
    </div>
  );
}

function AnalyticsDashboard({ logs }: { logs: AnalyticsData[] }) {
  // State for country filter
  const [selectedCountry, setSelectedCountry] = React.useState<string>("all");

  // Calculate metrics
  const totalVisitors = logs.length; // Total unique visitors (each log is one visitor)

  // Count unique sessions (using guid-sessionId combination)
  const uniqueSessionIds = new Set(
    logs.map((log) => `${log.guid}-${log.sessionId}`)
  );
  const totalSessions = uniqueSessionIds.size;

  const avgSessionTime =
    logs.length > 0
      ? Math.round(
          logs.reduce(
            (sum, log) =>
              sum + (log.totalSecondsOnSite || log.secondsOnPage || 0),
            0
          ) / logs.length
        )
      : 0;

  // Users by country
  const countryStats = logs.reduce((acc, log) => {
    const country = log.country || "غير محدد";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCountries = Object.entries(countryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // Users by location parameter (from URL)
  const locationStats = logs.reduce((acc, log) => {
    if (log.location) {
      const location = log.location;
      acc[location] = (acc[location] || 0) + 1;
      console.log("Found location:", location, "Total count:", acc[location]);
    }
    return acc;
  }, {} as Record<string, number>);

  console.log("Total logs:", logs.length);
  console.log("Logs with location:", logs.filter((l) => l.location).length);
  console.log("Location stats:", locationStats);

  const topLocations = Object.entries(locationStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const totalWithLocation = Object.values(locationStats).reduce(
    (sum, count) => sum + count,
    0
  );

  // Get all countries sorted by count for filter dropdown
  const allCountries = Object.entries(countryStats).sort(
    ([, a], [, b]) => b - a
  );

  // Filter logs by selected country for platform stats
  const filteredLogs =
    selectedCountry === "all"
      ? logs
      : logs.filter((log) => (log.country || "غير محدد") === selectedCountry);

  // Users by platform (source) - filtered by country
  const platformStats = filteredLogs.reduce((acc, log) => {
    // Only count actual platform sources, use "مباشر" for null/undefined sources
    const source = log.source || "مباشر";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const platformData = Object.entries(platformStats).sort(
    ([, a], [, b]) => b - a
  );

  const filteredTotalVisitors = filteredLogs.length;

  // Registered users by platform
  const registeredByPlatform = logs
    .filter((log) => log.interestPage?.submitted === true)
    .reduce((acc, log) => {
      // For submitted forms without source, assume Facebook (initial 5 registrations)
      // New registrations from links will have actual source
      const source = log.source || "facebook";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const registeredPlatformData = Object.entries(registeredByPlatform).sort(
    ([, a], [, b]) => b - a
  );

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}د ${remainingSeconds}ث`;
  };

  // Platform name mapping
  const platformNames: Record<string, string> = {
    facebook: "فيسبوك",
    twitter: "تويتر (X)",
    snapchat: "سناب شات",
    tiktok: "تيك توك",
    instagram: "إنستغرام",
    مباشر: "مباشر",
  };

  const getPlatformName = (key: string) => platformNames[key] || key;

  // Platform colors
  const platformColors: Record<string, string> = {
    facebook: "#1877F2",
    twitter: "#1DA1F2",
    snapchat: "#FFFC00",
    tiktok: "#000000",
    instagram: "#E4405F",
    مباشر: "#6B7280",
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Section Title */}
      <div className="bg-gradient-to-r from-[#1c9a6f] to-[#0b3d2e] rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">لوحة التحليلات المتقدمة</h2>
        <p className="text-white/80">
          تحليل شامل لسلوك الزوار والمصادر والتفاعلات
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-[#0b3d2e]/60 mb-1">إجمالي الزوار</p>
              <p className="text-3xl font-bold text-[#0b3d2e]">
                {totalVisitors}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-[#0b3d2e]/60 mb-1">متوسط وقت الجلسة</p>
              <p
                style={{ direction: "rtl" }}
                className="text-3xl font-bold text-[#0b3d2e] direction-ltr"
              >
                {formatDuration(avgSessionTime)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-[#0b3d2e]/60 mb-1">إجمالي الجلسات</p>
              <p className="text-3xl font-bold text-[#0b3d2e]">
                {totalSessions}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row - Updated to 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users by Country */}
        <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
          <h3 className="text-lg font-bold text-[#0b3d2e] mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#1c9a6f]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            الزوار حسب الدولة
          </h3>
          <div className="space-y-3">
            {topCountries.map(([country, count]) => {
              const percentage = ((count / totalVisitors) * 100).toFixed(1);
              return (
                <div key={country}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#0b3d2e]">
                      {country}
                    </span>
                    <span className="text-sm text-[#0b3d2e]/60">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#1c9a6f] h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Users by Platform */}
        <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0b3d2e] flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#1c9a6f]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              الزوار حسب المنصة
            </h3>

            {/* Country Filter Dropdown */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 border bg-[#1c9a6f]  border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1c9a6f] focus:border-transparent transition-all"
            >
              <option value="all">جميع الدول</option>
              {allCountries.map(([country, count]) => (
                <option key={country} value={country}>
                  {country} ({count})
                </option>
              ))}
            </select>
          </div>

          {/* Show selected country info */}
          {selectedCountry !== "all" && (
            <div className="mb-3 px-3 py-2 bg-[#1c9a6f]/10 rounded-lg text-sm text-[#0b3d2e]">
              عرض البيانات من:{" "}
              <span className="font-bold">{selectedCountry}</span> (
              {filteredTotalVisitors} زائر)
            </div>
          )}

          <div className="space-y-3">
            {platformData.length > 0 ? (
              platformData.map(([platform, count]) => {
                const percentage = (
                  (count / filteredTotalVisitors) *
                  100
                ).toFixed(1);
                const color = platformColors[platform] || "#1c9a6f";
                return (
                  <div key={platform}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#0b3d2e]">
                        {getPlatformName(platform)}
                      </span>
                      <span className="text-sm text-[#0b3d2e]/60">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-[#0b3d2e]/60">
                لا توجد بيانات للدولة المحددة
              </div>
            )}
          </div>
        </div>

        {/* Users by Target Location (URL Parameter) */}
        <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
          <h3 className="text-lg font-bold text-[#0b3d2e] mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#1c9a6f]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            الزوار حسب الموقع المستهدف
          </h3>

          {topLocations.length > 0 ? (
            <>
              <div className="mb-3 px-3 py-2 bg-[#1c9a6f]/10 rounded-lg text-sm text-[#0b3d2e]">
                الزوار مع معلومات الموقع:{" "}
                <span className="font-bold">{totalWithLocation}</span> من{" "}
                {totalVisitors}
              </div>
              <div className="space-y-3">
                {topLocations.map(([location, count]) => {
                  const percentage = (
                    (count / totalWithLocation) *
                    100
                  ).toFixed(1);
                  return (
                    <div key={location}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[#0b3d2e] flex items-center gap-2">
                          <span className="text-base">📍</span>
                          {location}
                        </span>
                        <span className="text-sm text-[#0b3d2e]/60">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#1c9a6f] h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-[#0b3d2e]/60">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-[#0b3d2e]/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-medium mb-1">لا توجد بيانات موقع متاحة</p>
              <p className="text-xs">
                استخدم معامل location في الروابط لتتبع المواقع المستهدفة
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Analytics Section */}
      <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
        <h3 className="text-lg font-bold text-[#0b3d2e] mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[#1c9a6f]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          المستخدمون المسجلون حسب المنصة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registeredPlatformData.map(([platform, count]) => {
            const totalFromPlatform = platformStats[platform] || 0;
            const conversionRate =
              totalFromPlatform > 0
                ? ((count / totalFromPlatform) * 100).toFixed(1)
                : "0.0";
            const color = platformColors[platform] || "#1c9a6f";

            return (
              <div key={platform} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium text-[#0b3d2e]">
                    {getPlatformName(platform)}
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#0b3d2e] mb-1">
                  {count}
                </div>
                <div className="text-sm text-[#0b3d2e]/60">
                  معدل التحويل: {conversionRate}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registered Users Details Table */}
      <RegisteredUsersTable logs={logs} getPlatformName={getPlatformName} />
    </div>
  );
}

// Registered Users Details Table Component
function RegisteredUsersTable({
  logs,
  getPlatformName,
}: {
  logs: AnalyticsData[];
  getPlatformName: (key: string) => string;
}) {
  // Filter only submitted registrations
  const registeredUsers = logs.filter(
    (log) => log.interestPage?.submitted === true
  );

  // Format interest source for display
  const formatInterestSource = (source: string | undefined) => {
    if (!source || source === "direct") return "مباشر";

    const sourceMap: Record<string, string> = {
      header_cta: "زر التسجيل (الهيدر)",
      hero_cta_primary: "زر التسجيل الرئيسي (Hero)",
      investment_section_cta: "زر قسم الاستثمار",
      "jiwar_card_برج جِوار ١": "بطاقة برج جِوار ١",
      "jiwar_card_برج جِوار ٢": "بطاقة برج جِوار ٢",
    };

    return sourceMap[source] || source.replace(/_/g, " ");
  };

  if (registeredUsers.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
        <h3 className="text-lg font-bold text-[#0b3d2e] mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[#1c9a6f]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          تفاصيل المستخدمين المسجلين
        </h3>
        <div className="text-center py-8 text-[#0b3d2e]/60">
          <p>لا توجد تسجيلات حتى الآن</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
      <h3 className="text-lg font-bold text-[#0b3d2e] mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-[#1c9a6f]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        تفاصيل المستخدمين المسجلين ({registeredUsers.length})
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1c9a6f]/10 border-b-2 border-[#1c9a6f]">
              <th className="text-right p-3 text-sm font-bold text-[#0b3d2e]">
                الاسم
              </th>
              <th className="text-right p-3 text-sm font-bold text-[#0b3d2e]">
                الدولة
              </th>
              <th className="text-right p-3 text-sm font-bold text-[#0b3d2e]">
                المنصة
              </th>
              <th className="text-right p-3 text-sm font-bold text-[#0b3d2e]">
                الاهتمام
              </th>
              <th className="text-right p-3 text-sm font-bold text-[#0b3d2e]">
                العقارات المحددة
              </th>
            </tr>
          </thead>
          <tbody>
            {registeredUsers.map((log, index) => {
              const form = log.interestPage?.form;
              const selectedJiwar1 = log.interestPage?.selectedJiwar1 || [];
              const selectedJiwar2 = log.interestPage?.selectedJiwar2 || [];
              const source = log.source || "مباشر";
              const interestSource = log.interestPage?.interestSource;

              return (
                <tr
                  key={`${log.guid}-${log.sessionId}-${index}`}
                  className="border-b border-[#1c9a6f]/20 hover:bg-[#1c9a6f]/5 transition-colors"
                >
                  <td className="p-3 text-sm text-[#0b3d2e]">
                    {form?.name || "غير متوفر"}
                  </td>
                  <td className="p-3 text-sm text-[#0b3d2e]">
                    {form?.country || log.country || "غير محدد"}
                  </td>
                  <td className="p-3 text-sm text-[#0b3d2e]">
                    <span className="inline-flex items-center gap-2">
                      {getPlatformName(source)}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-[#0b3d2e]">
                    {formatInterestSource(interestSource)}
                  </td>
                  <td className="p-3 text-sm text-[#0b3d2e]">
                    {selectedJiwar1.length === 0 &&
                    selectedJiwar2.length === 0 ? (
                      <span className="text-[#0b3d2e]/40">—</span>
                    ) : (
                      <div className="space-y-2">
                        {selectedJiwar1.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-[#1c9a6f] mb-1">
                              جِوار ١:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {selectedJiwar1.map((id: string) => (
                                <span
                                  key={id}
                                  className="px-2 py-0.5 bg-[#1c9a6f]/10 text-[#1c9a6f] text-xs rounded"
                                >
                                  {id}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedJiwar2.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-[#0b3d2e] mb-1">
                              جِوار ٢:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {selectedJiwar2.map((id: string) => (
                                <span
                                  key={id}
                                  className="px-2 py-0.5 bg-[#0b3d2e]/10 text-[#0b3d2e] text-xs rounded"
                                >
                                  {id}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LogoJiwar({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="شعار جِوار">
      <rect
        x="0"
        y="0"
        width="64"
        height="64"
        rx="14"
        fill="#ffffff"
        stroke="#1c9a6f"
        strokeWidth="1.5"
      />
      <rect
        x="18"
        y="18"
        width="28"
        height="28"
        rx="6"
        fill="#ffffff"
        stroke="#1c9a6f"
        strokeWidth="2"
      />
      <rect x="18" y="26" width="28" height="4" fill="#1c9a6f" />
      <circle cx="32" cy="40" r="2" fill="#1c9a6f" />
    </svg>
  );
}
