"use client";

import React, { useState, useEffect } from "react";

interface AnalyticsData {
  guid: string;
  sessionId: string;
  ip: string | null;
  country: string | null;
  ua: string;
  lang?: string;
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

export default function LogsPage() {
  const [logs, setLogs] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<AnalyticsData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showCleanupConfirm, setShowCleanupConfirm] = useState(false);
  const [cleaning, setCleaning] = useState(false);

  // Prevent tracking on the logs page
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
    fetchLogs();
  }, []);

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

  const handleCleanup = async () => {
    if (!showCleanupConfirm) {
      setShowCleanupConfirm(true);
      return;
    }

    try {
      setCleaning(true);
      const response = await fetch("/api/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_all",
          confirmationCode: "DELETE_ALL_LOGS_CONFIRM",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to cleanup logs");
      }

      const data = await response.json();
      alert(`تم حذف ${data.count} سجل بنجاح`);
      setShowCleanupConfirm(false);
      fetchLogs(true);
    } catch (err) {
      alert("فشل في حذف السجلات: " + (err instanceof Error ? err.message : ""));
    } finally {
      setCleaning(false);
    }
  };

  // Sort logs by timestamp (newest first)
  const deduplicateLogs = (logs: AnalyticsData[]) => {
    return logs.sort((a, b) => {
      const dateA = new Date(a.timestamp || a.ts || 0).getTime();
      const dateB = new Date(b.timestamp || b.ts || 0).getTime();
      return dateB - dateA; // Newest first
    });
  };

  // Ensure every log has safe defaults to avoid undefined access
  const normalizeLogs = (rawLogs: any[]): AnalyticsData[] => {
    return rawLogs.map((log) => ({
      guid: typeof log?.guid === "string" ? log.guid : "",
      sessionId: typeof log?.sessionId === "string" ? log.sessionId : "",
      ip: (log?.ip ?? null) as string | null,
      country: (log?.country ?? null) as string | null,
      ua: typeof log?.ua === "string" ? log.ua : "",
      lang: log?.lang || undefined,
      timestamp: log?.timestamp || log?.ts || new Date().toISOString(),
      lastUpdated: log?.lastUpdated,

      // Page visits
      pageVisits: log?.pageVisits || [],

      // Landing page data
      landingPage: log?.landingPage || {},

      // Interest page data
      interestPage: log?.interestPage || {},

      // Totals
      totalSecondsOnSite: log?.totalSecondsOnSite,
      totalActiveSecondsOnSite: log?.totalActiveSecondsOnSite,
      sessionEnded: log?.sessionEnded,

      // Legacy fields for backward compatibility
      secondsOnPage: log?.secondsOnPage,
      activeSecondsOnPage: log?.activeSecondsOnPage,
      sectionsViewed:
        log?.sectionsViewed || log?.landingPage?.sectionsViewed || [],
      navClicks: log?.navClicks || log?.landingPage?.navClicks || [],
      menuClicks: log?.menuClicks || log?.landingPage?.menuClicks || [],
      faqOpened: log?.faqOpened || log?.landingPage?.faqOpened || [],
      ts: log?.ts || log?.timestamp,
    }));
  };

  const formatDate = (timestamp: string) => {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return "غير معروف";
    return d.toLocaleString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}د ${remainingSeconds}ث`;
  };

  // Calculate statistics
  const totalVisits = logs.length; // Number of unique sessions

  const avgTimeOnPage =
    logs.length > 0
      ? Math.round(
          logs.reduce(
            (sum, log) =>
              sum + (log.totalSecondsOnSite || log.secondsOnPage || 0),
            0
          ) / logs.length
        )
      : 0;
  const avgActiveTime =
    logs.length > 0
      ? Math.round(
          logs.reduce(
            (sum, log) =>
              sum +
              (log.totalActiveSecondsOnSite ||
                log.activeSecondsOnPage ||
                log.secondsOnPage ||
                0),
            0
          ) / logs.length
        )
      : 0;
  const totalSectionsViewed = logs.reduce(
    (sum, log) =>
      sum +
      (log.landingPage?.sectionsViewed?.length ||
        log.sectionsViewed?.length ||
        0),
    0
  );
  const uniqueCountries = new Set(
    logs.map((log) => log.country).filter(Boolean)
  ).size;

  // Count page visits from the pageVisits array
  const landingPageVisits = logs.filter(
    (log) =>
      log.pageVisits?.some((visit) => visit.pageName === "landing") ||
      (log.landingPage && Object.keys(log.landingPage).length > 0)
  ).length;
  const interestPageVisits = logs.filter(
    (log) =>
      log.pageVisits?.some((visit) => visit.pageName === "interest") ||
      (log.interestPage && Object.keys(log.interestPage).length > 0)
  ).length;

  const submittedForms = logs.filter(
    (log) => log.interestPage?.submitted === true
  ).length;
  const incompleteForms = logs.filter(
    (log) => log.interestPage?.formHasData && !log.interestPage?.submitted
  ).length;

  // Group logs by session for better visualization
  const uniqueSessions = logs.length; // Each log is now one complete session

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c9a6f] mx-auto"></div>
          <p className="mt-4 text-[#0b3d2e]">جاري تحميل السجلات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">خطأ: {error}</p>
          <button
            onClick={() => fetchLogs(false)}
            className="px-4 py-2 bg-[#1c9a6f] text-white rounded-lg hover:bg-[#1c9a6f]/80"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8faf9]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#1c9a6f]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LogoJiwar className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-[#0b3d2e]">
                  سجلات الزوار
                </h1>
                <p className="text-sm text-[#0b3d2e]/60">
                  تحليل سلوك الزوار والتفاعلات
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchLogs(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1c9a6f]/30 bg-white text-[#0b3d2e] hover:bg-[#1c9a6f]/5 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
              {showCleanupConfirm ? (
                <button
                  onClick={handleCleanup}
                  disabled={cleaning}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {cleaning ? "جاري الحذف..." : "تأكيد الحذف"}
                </button>
              ) : (
                <button
                  onClick={handleCleanup}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-600/30 bg-white text-red-600 hover:bg-red-50 transition-colors font-medium"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  حذف جميع السجلات
                </button>
              )}
              {showCleanupConfirm && (
                <button
                  onClick={() => setShowCleanupConfirm(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1c9a6f]/30 bg-white text-[#0b3d2e] hover:bg-[#1c9a6f]/5 transition-colors font-medium"
                >
                  إلغاء
                </button>
              )}
              <a
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1c9a6f] text-white hover:bg-[#1c9a6f]/90 transition-colors font-medium"
              >
                الصفحة الرئيسية
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#0b3d2e]/60">
                جلسات فريدة
              </p>
              <div className="w-10 h-10 rounded-lg bg-[#1c9a6f]/10 flex items-center justify-center">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0b3d2e]">
              {uniqueSessions}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#0b3d2e]/60">
                إجمالي الزيارات
              </p>
              <div className="w-10 h-10 rounded-lg bg-[#1c9a6f]/10 flex items-center justify-center">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0b3d2e]">{totalVisits}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#0b3d2e]/60">
                متوسط الوقت
              </p>
              <div className="w-10 h-10 rounded-lg bg-[#1c9a6f]/10 flex items-center justify-center">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0b3d2e]">
              {formatDuration(avgTimeOnPage)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#0b3d2e]/60">
                الأقسام المشاهدة
              </p>
              <div className="w-10 h-10 rounded-lg bg-[#1c9a6f]/10 flex items-center justify-center">
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0b3d2e]">
              {totalSectionsViewed}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#0b3d2e]/60">الدول</p>
              <div className="w-10 h-10 rounded-lg bg-[#1c9a6f]/10 flex items-center justify-center">
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
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0b3d2e]">
              {uniqueCountries}
            </p>
          </div>
        </div>

        {/* Additional Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#0b3d2e]/60">
                نماذج مُرسلة
              </p>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0b3d2e]">
              {submittedForms}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#0b3d2e]/60">
                نماذج غير مكتملة
              </p>
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0b3d2e]">
              {incompleteForms}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#0b3d2e]/60">
                زيارات صفحة الهبوط
              </p>
              <div className="w-10 h-10 rounded-lg bg-[#1c9a6f]/10 flex items-center justify-center">
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0b3d2e]">
              {landingPageVisits}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#0b3d2e]/60">
                زيارات صفحة التسجيل
              </p>
              <div className="w-10 h-10 rounded-lg bg-[#1c9a6f]/10 flex items-center justify-center">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#0b3d2e]">
              {interestPageVisits}
            </p>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-xl border border-[#1c9a6f]/20 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1c9a6f]/10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0b3d2e]">
                سجل الزيارات التفصيلي
              </h2>
              {lastUpdated && (
                <p className="text-xs text-[#0b3d2e]/60">
                  آخر تحديث: {lastUpdated.toLocaleTimeString("ar-SA")}
                </p>
              )}
            </div>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#1c9a6f]/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#1c9a6f]/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-[#0b3d2e]/60 font-medium">
                لا توجد سجلات متاحة حالياً
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#1c9a6f]/10">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="px-6 py-5 hover:bg-[#1c9a6f]/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  <div className="flex items-start justify-between gap-6">
                    {/* Left Section: Location & Time */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-[#1c9a6f]/10 flex items-center justify-center flex-shrink-0">
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
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-[#0b3d2e] text-lg">
                              {log.country || "غير محدد"}
                            </p>
                            {log.pageVisits && log.pageVisits.length > 0 && (
                              <div className="flex gap-1">
                                {log.pageVisits.map((visit, idx) => (
                                  <span
                                    key={idx}
                                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                      visit.pageName === "landing"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-purple-100 text-purple-700"
                                    }`}
                                  >
                                    {visit.pageName === "landing"
                                      ? "رئيسية"
                                      : "تسجيل"}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-[#0b3d2e]/60">
                            {log.ip || "IP غير متاح"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#0b3d2e]/70 mr-13">
                        <span className="flex items-center gap-1">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {formatDate(log.ts)}
                        </span>
                        <span className="flex items-center gap-1">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {formatDuration(
                            log.totalSecondsOnSite || log.secondsOnPage || 0
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Right Section: Sections & Stats */}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0b3d2e]/60 mb-2">
                        الأقسام المشاهدة ({log.sectionsViewed.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {log.sectionsViewed.slice(0, 4).map((section) => (
                          <span
                            key={section}
                            className="px-3 py-1 bg-[#1c9a6f]/10 text-[#1c9a6f] text-sm rounded-lg font-medium"
                          >
                            {section}
                          </span>
                        ))}
                        {log.sectionsViewed.length > 4 && (
                          <span className="px-3 py-1 bg-[#0b3d2e]/5 text-[#0b3d2e]/60 text-sm rounded-lg font-medium">
                            +{log.sectionsViewed.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center">
                      <button className="p-2 rounded-lg hover:bg-[#1c9a6f]/10 transition-colors">
                        <svg
                          className="w-5 h-5 text-[#0b3d2e]/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for detailed view */}
        {selectedLog && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedLog(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-[#1c9a6f]/20 bg-[#1c9a6f]/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0b3d2e] mb-1">
                      تفاصيل الزيارة
                    </h2>
                    <p className="text-sm text-[#0b3d2e]/60">
                      {selectedLog.country} • {formatDate(selectedLog.ts)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="w-10 h-10 rounded-lg hover:bg-white transition-colors flex items-center justify-center text-[#0b3d2e]/60 hover:text-[#0b3d2e]"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Visitor Information */}
                  <div>
                    <div className="bg-[#1c9a6f]/5 rounded-xl p-6 border border-[#1c9a6f]/20">
                      <h3 className="font-bold text-[#0b3d2e] mb-4 flex items-center gap-2">
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
                        معلومات الزائر
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-[#1c9a6f]/10">
                          <span className="text-sm text-[#0b3d2e]/60">
                            البلد
                          </span>
                          <span className="font-semibold text-[#0b3d2e]">
                            {selectedLog.country || "غير محدد"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#1c9a6f]/10">
                          <span className="text-sm text-[#0b3d2e]/60">
                            عنوان IP
                          </span>
                          <span className="font-mono text-sm text-[#0b3d2e]">
                            {selectedLog.ip || "غير متاح"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#1c9a6f]/10">
                          <span className="text-sm text-[#0b3d2e]/60">
                            الوقت على الصفحة
                          </span>
                          <span className="font-semibold text-[#1c9a6f]">
                            {formatDuration(selectedLog.secondsOnPage)}
                          </span>
                        </div>
                        {selectedLog.activeSecondsOnPage !== undefined && (
                          <div className="flex justify-between items-center py-2 border-b border-[#1c9a6f]/10">
                            <span className="text-sm text-[#0b3d2e]/60">
                              الوقت النشط
                            </span>
                            <span className="font-semibold text-[#1c9a6f]">
                              {formatDuration(selectedLog.activeSecondsOnPage)}
                            </span>
                          </div>
                        )}
                        {selectedLog.pageName && (
                          <div className="flex justify-between items-center py-2 border-b border-[#1c9a6f]/10">
                            <span className="text-sm text-[#0b3d2e]/60">
                              الصفحة
                            </span>
                            <span className="font-semibold text-[#0b3d2e]">
                              {selectedLog.pageName === "landing"
                                ? "الصفحة الرئيسية"
                                : "صفحة التسجيل"}
                            </span>
                          </div>
                        )}
                        {selectedLog.lang && (
                          <div className="flex justify-between items-center py-2 border-b border-[#1c9a6f]/10">
                            <span className="text-sm text-[#0b3d2e]/60">
                              اللغة
                            </span>
                            <span className="font-semibold text-[#0b3d2e]">
                              {selectedLog.lang === "ar"
                                ? "العربية"
                                : "English"}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center py-2 border-b border-[#1c9a6f]/10">
                          <span className="text-sm text-[#0b3d2e]/60">
                            المتصفح
                          </span>
                          <span className="text-sm text-[#0b3d2e]">
                            {selectedLog.ua.split(" ")[0]}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#1c9a6f]/10">
                          <span className="text-sm text-[#0b3d2e]/60">
                            التاريخ والوقت
                          </span>
                          <span className="text-sm text-[#0b3d2e]">
                            {formatDate(selectedLog.ts)}
                          </span>
                        </div>
                        {selectedLog.exitedAt && (
                          <div className="flex justify-between items-center py-2 border-b border-[#1c9a6f]/10">
                            <span className="text-sm text-[#0b3d2e]/60">
                              وقت المغادرة
                            </span>
                            <span className="text-sm text-[#0b3d2e]">
                              {formatDate(selectedLog.exitedAt)}
                            </span>
                          </div>
                        )}
                        {selectedLog.sessionEnded !== undefined && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-[#0b3d2e]/60">
                              حالة الجلسة
                            </span>
                            <span
                              className={`text-sm font-semibold px-2 py-1 rounded ${
                                selectedLog.sessionEnded
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {selectedLog.sessionEnded ? "منتهية" : "نشطة"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Session IDs */}
                    {/* <div className="mt-6 bg-white rounded-xl p-6 border border-[#1c9a6f]/20">
                      <h3 className="font-bold text-[#0b3d2e] mb-4 text-sm">
                        معرفات الجلسة
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-[#0b3d2e]/50 mb-1">GUID</p>
                          <p className="font-mono text-xs text-[#0b3d2e] bg-[#f8faf9] px-3 py-2 rounded">
                            {selectedLog.guid}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#0b3d2e]/50 mb-1">
                            Session ID
                          </p>
                          <p className="font-mono text-xs text-[#0b3d2e] bg-[#f8faf9] px-3 py-2 rounded">
                            {selectedLog.sessionId}
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  {/* Activity Information */}
                  <div className="space-y-6">
                    {/* Sections Viewed */}
                    <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20">
                      <h3 className="font-bold text-[#0b3d2e] mb-4 flex items-center gap-2">
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        الأقسام المشاهدة ({selectedLog.sectionsViewed.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedLog.sectionsViewed.map((section) => (
                          <span
                            key={section}
                            className="px-3 py-2 bg-[#1c9a6f]/10 text-[#1c9a6f] text-sm rounded-lg font-medium"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Navigation Clicks */}
                    {selectedLog.navClicks &&
                      selectedLog.navClicks.length > 0 && (
                        <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20">
                          <h3 className="font-bold text-[#0b3d2e] mb-4 flex items-center gap-2">
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
                                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            نقرات التنقل ({selectedLog.navClicks.length})
                          </h3>
                          <div className="space-y-2">
                            {selectedLog.navClicks.map((click, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between py-2 px-3 bg-[#f8faf9] rounded-lg"
                              >
                                <span className="font-medium text-[#0b3d2e]">
                                  {click.label}
                                </span>
                                <span className="text-xs text-[#0b3d2e]/50">
                                  {new Date(click.t).toLocaleTimeString(
                                    "ar-SA"
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Menu Clicks */}
                    <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20">
                      <h3 className="font-bold text-[#0b3d2e] mb-4 flex items-center gap-2">
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
                            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                          />
                        </svg>
                        نقرات القائمة ({selectedLog.menuClicks.length})
                      </h3>
                      {selectedLog.menuClicks.length > 0 ? (
                        <div className="space-y-2">
                          {selectedLog.menuClicks.map((click, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between py-2 px-3 bg-[#f8faf9] rounded-lg"
                            >
                              <span className="font-medium text-[#0b3d2e]">
                                {click.label}
                              </span>
                              <span className="text-xs text-[#0b3d2e]/50">
                                {new Date(click.t).toLocaleTimeString("ar-SA")}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[#0b3d2e]/50">
                          لا توجد نقرات
                        </p>
                      )}
                    </div>

                    {/* FAQ Opened */}
                    <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20">
                      <h3 className="font-bold text-[#0b3d2e] mb-4 flex items-center gap-2">
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
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        الأسئلة المفتوحة ({selectedLog.faqOpened.length})
                      </h3>
                      {selectedLog.faqOpened.length > 0 ? (
                        <div className="space-y-2">
                          {selectedLog.faqOpened.map((faq, i) => (
                            <div
                              key={i}
                              className="py-2 px-3 bg-[#f8faf9] rounded-lg text-sm text-[#0b3d2e]"
                            >
                              {faq}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[#0b3d2e]/50">
                          لا توجد أسئلة مفتوحة
                        </p>
                      )}
                    </div>

                    {/* Interest Source */}
                    {selectedLog.interestSource && (
                      <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20">
                        <h3 className="font-bold text-[#0b3d2e] mb-4 flex items-center gap-2">
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
                          مصدر الوصول لصفحة التسجيل
                        </h3>
                        <div className="py-3 px-4 bg-[#1c9a6f]/10 rounded-lg">
                          <p className="font-semibold text-[#1c9a6f]">
                            {selectedLog.interestSource}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Selected Properties */}
                    {selectedLog.selectedJiwar1?.length ||
                    selectedLog.selectedJiwar2?.length ? (
                      <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20">
                        <h3 className="font-bold text-[#0b3d2e] mb-4 flex items-center gap-2">
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
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          العقارات المحددة
                        </h3>
                        <div className="space-y-3">
                          {selectedLog.selectedJiwar1 &&
                            selectedLog.selectedJiwar1.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-[#1c9a6f] mb-2">
                                  جِوار ١:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {selectedLog.selectedJiwar1.map((id) => (
                                    <span
                                      key={id}
                                      className="px-3 py-1 bg-[#1c9a6f]/10 text-[#1c9a6f] text-xs rounded-lg"
                                    >
                                      {id}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          {selectedLog.selectedJiwar2 &&
                            selectedLog.selectedJiwar2.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-[#0b3d2e] mb-2">
                                  جِوار ٢:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {selectedLog.selectedJiwar2.map((id) => (
                                    <span
                                      key={id}
                                      className="px-3 py-1 bg-[#0b3d2e]/10 text-[#0b3d2e] text-xs rounded-lg"
                                    >
                                      {id}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    ) : null}

                    {/* Form Data */}
                    {selectedLog.form && selectedLog.formHasData && (
                      <div className="bg-white rounded-xl p-6 border border-[#1c9a6f]/20">
                        <h3 className="font-bold text-[#0b3d2e] mb-4 flex items-center gap-2">
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
                          بيانات النموذج
                          {selectedLog.submitted && (
                            <span className="mr-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              مُرسل
                            </span>
                          )}
                          {!selectedLog.submitted && (
                            <span className="mr-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                              غير مكتمل
                            </span>
                          )}
                        </h3>
                        <div className="space-y-2">
                          {selectedLog.form.name && (
                            <div className="flex justify-between py-2 border-b border-[#1c9a6f]/10">
                              <span className="text-sm text-[#0b3d2e]/60">
                                الاسم:
                              </span>
                              <span className="text-sm font-semibold text-[#0b3d2e]">
                                {selectedLog.form.name}
                              </span>
                            </div>
                          )}
                          {selectedLog.form.email && (
                            <div className="flex justify-between py-2 border-b border-[#1c9a6f]/10">
                              <span className="text-sm text-[#0b3d2e]/60">
                                البريد:
                              </span>
                              <span className="text-sm font-semibold text-[#0b3d2e]">
                                {selectedLog.form.email}
                              </span>
                            </div>
                          )}
                          {selectedLog.form.country && (
                            <div className="flex justify-between py-2 border-b border-[#1c9a6f]/10">
                              <span className="text-sm text-[#0b3d2e]/60">
                                الدولة:
                              </span>
                              <span className="text-sm font-semibold text-[#0b3d2e]">
                                {selectedLog.form.country}
                              </span>
                            </div>
                          )}
                          {selectedLog.form.phone && (
                            <div className="flex justify-between py-2 border-b border-[#1c9a6f]/10">
                              <span className="text-sm text-[#0b3d2e]/60">
                                الهاتف:
                              </span>
                              <span className="text-sm font-semibold text-[#0b3d2e]">
                                {selectedLog.form.phone}
                              </span>
                            </div>
                          )}
                          {selectedLog.form.notes && (
                            <div className="py-2">
                              <p className="text-sm text-[#0b3d2e]/60 mb-1">
                                ملاحظات:
                              </p>
                              <p className="text-sm text-[#0b3d2e] bg-[#f8faf9] p-3 rounded-lg">
                                {selectedLog.form.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Events Section */}
                {/* <div className="mt-8 bg-[#f8faf9] rounded-xl p-6 border border-[#1c9a6f]/20">
                  <h3 className="font-bold text-[#0b3d2e] mb-4 flex items-center gap-2">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    سجل الأحداث
                  </h3>
                  <div className="bg-white rounded-lg p-4 max-h-60 overflow-y-auto">
                    <pre className="text-xs text-[#0b3d2e]/80 whitespace-pre-wrap font-mono">
                      {JSON.stringify(selectedLog.events, null, 2)}
                    </pre>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        )}
      </main>
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
