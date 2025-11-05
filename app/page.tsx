"use client";

import React from "react";

// Jiwar Timeshare — Bilingual Landing Page (Arabic/English) with Enhanced Analytics
export default function LandingJiwarTimeshare() {
  // Language state
  const [lang, setLang] = React.useState<"ar" | "en">(() => {
    if (typeof window === "undefined") return "ar";
    return (localStorage.getItem("jiwar_lang") as "ar" | "en") || "ar";
  });
  React.useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("jiwar_lang", lang);
  }, [lang]);

  const isAR = lang === "ar";
  const dir = isAR ? "rtl" : "ltr";

  // Build interest page href preserving source/location params (from URL or storage)
  const interestHref = React.useMemo(() => {
    if (typeof window === "undefined") return "/interest";
    const params = new URLSearchParams(window.location.search);

    // Fallback to stored values if params are missing
    if (!params.get("source")) {
      const storedSource = localStorage.getItem("jiwar_source");
      if (storedSource) params.set("source", storedSource);
    }
    if (!params.get("location")) {
      const storedLocation = localStorage.getItem("jiwar_location");
      if (storedLocation) params.set("location", storedLocation);
    }

    const qs = params.toString();
    return qs ? `/interest?${qs}` : "/interest";
  }, [isAR]);
  const align = isAR ? "text-right" : "text-left";

  // Translations
  const tr = {
    ar: {
      brand: "جِوار تايم شير",
      tagline: "قربٌ يطمئن القلب",
      nav: {
        features: "المزايا",
        jiwar: "جِوار",
        investment: "الاستثمار",
        faq: "الأسئلة",
      },
      heroTitleA: "أسبوعك الخاص ",
      heroTitleB: "بجوار الحرم",
      heroTitleC: " — ملكية تدوم ٢٠ سنة في ",
      towersName: "أبراج جِوار",
      heroDesc:
        "الآن فرصتك لحجز أسبوع سنوي في أطهر بقاع الأرض، استمتع بالاختيار بين وحداتنا الفاخرة المطلة على المسجد الحرام والكعبة المشرفة أو استكشف الخيارات الأخرى التي تبعد دقائق عن الحرم المكي بالحافلات الترددية. امتياز أن تكون جارًا لبيت الله الحرام أصبح في متناول الجميع لتستمتع وعائلتك بأثمن اللحظات الروحانية بشكل سنوي وبأسعار لا تصدق مع خيارات تقسيط ميسرة!",
      badge1: "ملكية مضمونة ٢٠ سنة",
      badge2: "أسبوع ثابت كل عام",
      badge3: "أسعار تبدأ من ٢٥,٠٠٠ ريال",
      badge4: "خطط دفع مرنة",
      ctaPrimary: "تسجيل الإهتمام",
      ctaSecondary: "اكتشف التفاصيل",
      cardTitle: "سكينة الروح وضمان الاستثمار",
      cardText:
        "امتلك وحدتك الخاصة بجوار الحرم المكي واستمتع بأسبوعك المميز سنويًا، مع خيارات مرنة للحجز وتعديله أو إعادة بيعه وصكوك إيجارية معتمدة",
      featuresTitle: "خدمات ومزايا الإقامة",
      features: [
        "تجربة فندقية استثنائية بأعلى المعايير مع شركائنا من فنادق الخمس نجوم",
        "خدمة على مدار الساعة",
        "مرونة الاختيار والتعديل وإعادة التأجير",
        "باقات كبار الشخصيات للاستقبال والتوصيل من المطار إلى محل الإقامة",
        "خدمات نقل ترددية من وإلى الحرم المكي",
        "خيارات متنوعة للوحدات تناسب جميع النزلاء وبأسعار تنافسية",
        "إدارة الحجز والخدمات إلكترونيًا بكل يسر وسهولة",
        "تطبيق جوال لإدارة الحجوزات والخدمات بكل سهولة",
        "خيارات تقسيط مدفوعات ميسرة تناسب جميع الميزانيات مع شركائنا من البنوك وجهات التمويل السعودية",
        "وحدتك مضمونة سنويًا بأسبوع ثابت حسب اختيارك",
      ],
      towersTitle: "أبراج جِوار والمواقع",
      tower1: {
        title: "برج جِوار ١",
        desc: "على بُعد ٤٠ متراً فقط من الحرم المكي، إطلالات مميزة على الكعبة المشرفة والحرم المكي في أرقى مناطق مكة المكرمة وأكثرها تميزًا",
        chip: "إطلالة مباشرة على الكعبة المشرفة",
      },
      tower2: {
        title: "برج جِوار ٢",
        desc: "يبعد ١٠ دقائق فقط عن الحرم مع باصات ترددية مكيّفة على مدار الساعة.",
      },
      investTitle: "سكينة الروح وضمان الاستثمار",
      investBullets: [
        "أسبوعك المميز في أطهر بقاع الأرض سنويًا ولمدة عشرة أو عشرين سنة بأسعار تبدأ من ٢٥,٠٠٠ ريال فقط!",
        "تجربة روحانية متكاملة مع خيارات حجز متنوعة تناسب الجميع",
        "مرونة إعادة البيع وتغيير المستفيد لتوائم تطلعاتك",
      ],
      faqTitle: "الأسئلة الشائعة",
      faqs: [
        {
          q: "ما المقصود بأسبوع ثابت؟",
          a: "هو أسبوع محدد سنويًا ضمن عقد الملكية لمدة ٢٠ سنة، مع إمكانية التبديل وفق سياسة الإدارة (إن توفرت).",
        },
        {
          q: "هل يمكنني تأجير حصتي إذا لم أكن أنوي الزيارة؟",
          a: "نعم، يمكنك تأجير وحدتك لشخص آخر أو طلب من إدارة جِوار تأجيرها نيابةً عنك، وذلك وفق الشروط والأحكام.",
        },
        {
          q: "ما هو نظام التايم شير (الملكية المشتركة بالوقت)؟",
          a: "هو نظام يتيح للمستخدم امتلاك حق استخدام وحدة سكنية لفترة محددة كل عام (عادةً أسبوعًا) ضمن عقد يمتد لعدة سنوات، ما يجمع بين التملك والمرونة في الاستخدام والاستثمار.",
        },
        {
          q: "أين يقع كل برج؟",
          a: "برج جِوار ١ ملاصق لصحن الحرم، وبرج جِوار ٢ على بُعد ١٠ دقائق مع باصات ترددية على مدار الساعة.",
        },
        {
          q: "هل يترتب عليَّ أية التزامات مادية في حال تسجيل الاهتمام؟",
          a: "لا، لن يترتب عليكم أية التزامات. تسجيل الاهتمام فقط لضمان التواصل معكم عند الحجز المبكر حيث إن عدد الوحدات المتاحة سيكون محدودًا",
        },
        {
          q: "هل يمكنني تسجيل الاهتمام في أي وقت؟",
          a: "نعم يمكنكم، سيكون التسجيل متاحًا لغاية ١٥ نوفمبر ٢٠٢٥ علمًا بأن الأولوية ستكون للحجوزات الأسبق",
        },
      ],
      footer:
        "© " +
        new Date().getFullYear() +
        " جِوار تايم شير — جميع الحقوق محفوظة.",
      contactTitle: "تواصل معنا",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
    },
    en: {
      brand: "Jiwar Timeshare",
      tagline: "Peace of heart, steps from the Haram",
      nav: {
        features: "Features",
        jiwar: "Jiwar",
        investment: "Investment",
        faq: "FAQ",
      },
      heroTitleA: "Your dedicated week ",
      heroTitleB: "by the Haram",
      heroTitleC: " — 20-year ownership at ",
      towersName: "Jiwar Towers",
      heroDesc:
        "Invest in cherished spiritual moments with a Kaaba-facing view or just minutes away via shuttle. Living next to the Haram is the true privilege under a shared-benefit model with flexible installment payment options.",
      badge1: "20-year guaranteed ownership",
      badge2: "One fixed week yearly",
      badge3: "Prices from SAR 25,000",
      badge4: "Flexible payment plans",
      ctaPrimary: "Register Interest",
      ctaSecondary: "Explore details",
      cardTitle: "Tranquility & Investment Assurance",
      cardText:
        "Guaranteed 20-year ownership with a fixed week, plus full management & maintenance. Owners may resell their share themselves or via Jiwar under fair, transparent terms.",
      featuresTitle: "Stay Services & Benefits",
      features: [
        "Daily housekeeping and 5-star hotel standards.",
        "24/7 unit management and maintenance.",
        "Flexibility to choose or swap your week subject to availability.",
        "Option to rent out your unit in years you do not visit.",
        "Reception & guest assistance from arrival.",
        "Comfortable, air-conditioned shuttles to/from the Haram 24/7.",
        "Variety of rooms and premium suites for every need.",
        "Mobile app to manage bookings and services with ease.",
        "Flexible installment payment options to suit all budgets with our banking and Saudi financing partners",
        "Your unit guaranteed annually with a fixed week of your choice",
      ],
      towersTitle: "Jiwar Towers & Locations",
      tower1: {
        title: "Jiwar Tower 1",
        desc: "Directly on the Mataf, beside the Clock Tower.",
        chip: "On the Mataf",
      },
      tower2: {
        title: "Jiwar Tower 2",
        desc: "Only 10 minutes to the Haram with fast, air‑conditioned shuttles around the clock.",
      },
      investTitle: "Spiritual Calm & Secure Investment",
      investBullets: [
        "Guaranteed 20-year ownership with a fixed week.",
        "Prices from SAR 25,000.",
        "A balanced investment — closeness to the Haram with spiritual and living value under a shared‑benefit model.",
        "Resale option under defined conditions for added flexibility.",
      ],
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          q: "What does a fixed week mean?",
          a: "A specific week each year within a 20‑year ownership contract; swapping may be allowed per management policy.",
        },
        {
          q: "Can I rent my slot if I am not planning to visit?",
          a: "Yes. You can rent your apartment to someone else or request Jiwar to rent it for you, subject to terms and conditions.",
        },
        {
          q: "What is timeshare?",
          a: "A model granting the right to use a unit for a defined period (usually a week) each year under a multi‑year contract — combining ownership with usage flexibility and investment.",
        },
        {
          q: "Where are the towers located?",
          a: "Jiwar 1 is directly on the Mataf; Jiwar 2 is ~10 minutes away with round‑the‑clock shuttles.",
        },
        {
          q: "Are there any financial obligations when registering interest?",
          a: "No, there are no obligations. Registering interest is only to ensure we contact you during early booking, as the number of available units will be limited.",
        },
        {
          q: "Can I register interest at any time?",
          a: "Yes, you can. Registration will be available until November 15, 2025, with priority given to earlier registrations.",
        },
      ],
      footer:
        "© " +
        new Date().getFullYear() +
        " Jiwar Timeshare — All rights reserved.",
      contactTitle: "Contact Us",
      phone: "Phone",
      email: "Email",
    },
  } as const;
  const t = tr[lang];

  // ---- Analytics (client-side) ----
  const DEBUG =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debug") === "1";
  React.useEffect(() => {
    // Skip tracking if this is the logs page or tracking is disabled
    if (
      typeof window !== "undefined" &&
      (window as any).__JIWAR_NO_TRACKING__
    ) {
      console.log("Tracking disabled for this page");
      return;
    }

    // Capture and store source and location parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const sourceParam = urlParams.get("source");
    const locationParam = urlParams.get("location");

    // Always clear old source and location first to prevent stale data
    localStorage.removeItem("jiwar_source");
    localStorage.removeItem("jiwar_source_timestamp");
    localStorage.removeItem("jiwar_location");
    localStorage.removeItem("jiwar_location_timestamp");

    if (sourceParam) {
      // Map short codes to full platform names
      const sourceMapping: { [key: string]: string } = {
        f: "facebook",
        i: "instagram",
        s: "snapchat",
        t: "tiktok",
      };

      const fullSource =
        sourceMapping[sourceParam.toLowerCase()] || sourceParam;

      // Store in localStorage for this session only
      localStorage.setItem("jiwar_source", fullSource);
      localStorage.setItem("jiwar_source_timestamp", Date.now().toString());
      console.log("Source parameter captured:", sourceParam, "→", fullSource);
    } else {
      // No source parameter - check document.referrer for actual referrer
      const referrer = document.referrer;
      console.log("No source parameter. Referrer:", referrer);

      // Don't set any source - let it be null for direct visits
      // This way visits from jiwarproperties.com without ?source will be "مباشر"
    }

    // Capture location parameter if present
    if (locationParam) {
      localStorage.setItem("jiwar_location", locationParam);
      localStorage.setItem("jiwar_location_timestamp", Date.now().toString());
      console.log("Location parameter captured:", locationParam);
    }

    // Flag to prevent sending data twice
    let dataSent = false;

    const getOrCreateGUID = () => {
      const k = "jiwar_guid";
      let id = localStorage.getItem(k);
      if (!id) {
        id = crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        localStorage.setItem(k, id);
      }
      return id;
    };
    const getOrCreateSessionId = () => {
      const k = "jiwar_session_id";
      let id = sessionStorage.getItem(k);
      if (!id) {
        id = crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        sessionStorage.setItem(k, id);
      }
      return id;
    };

    const guid = getOrCreateGUID();
    const sessionId = getOrCreateSessionId();

    // Track active time only (when tab is visible)
    let activeTimeStart = Date.now();
    let totalActiveTime = 0;
    let isTabActive = !document.hidden;

    // Get stored source and location parameters
    const storedSource = localStorage.getItem("jiwar_source");
    const sourceTimestamp = localStorage.getItem("jiwar_source_timestamp");
    const storedLocation = localStorage.getItem("jiwar_location");
    const locationTimestamp = localStorage.getItem("jiwar_location_timestamp");

    const ctx: any = {
      guid,
      sessionId,
      ip: null,
      country: null,
      startedAt: Date.now(),
      secondsOnPage: 0,
      activeSecondsOnPage: 0,
      sectionsViewed: new Set<string>(),
      navClicks: [],
      menuClicks: [],
      faqOpened: [],
      jiwarCardClicks: [],
      ctaClicks: [],
      events: [],
      path:
        typeof location !== "undefined"
          ? location.pathname + location.search
          : "",
      ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
      lang: isAR ? "ar" : "en",
      pageName: "landing",
      source: storedSource || null,
      sourceTimestamp: sourceTimestamp || null,
      location: storedLocation || null,
      locationTimestamp: locationTimestamp || null,
    };

    fetch("https://ipapi.co/json/")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          ctx.ip = d.ip || null;
          ctx.country = d.country_name || d.country || null;
        }
      })
      .catch(() => {});

    // Track tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab became inactive
        if (isTabActive) {
          totalActiveTime += Date.now() - activeTimeStart;
          isTabActive = false;
        }
      } else {
        // Tab became active
        if (!isTabActive) {
          activeTimeStart = Date.now();
          isTabActive = true;
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const secIds = ["features", "jiwar", "investment", "faq"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).id;
            if (id && !ctx.sectionsViewed.has(id)) {
              ctx.sectionsViewed.add(id);
              ctx.events.push({ t: Date.now(), type: "section_view", id });
              console.log("Section viewed:", id);
            }
          }
        });
      },
      { threshold: 0.4 }
    );
    secIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        console.log("Observing section:", id);
      }
    });

    const menu = document.querySelector("nav");
    const onMenuClick = (e: any) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const label = a.textContent?.trim() || a.getAttribute("href");
      const href = a.getAttribute("href") || "";

      // Add to navClicks for navigation items
      ctx.navClicks.push({
        t: Date.now(),
        label,
        href: href,
      });

      // Also add to menuClicks for backward compatibility
      ctx.menuClicks.push({
        t: Date.now(),
        label,
        href: href,
      });

      ctx.events.push({ t: Date.now(), type: "nav_click", label, href });
      console.log("Navigation clicked:", label, href);
    };
    if (menu) menu.addEventListener("click", onMenuClick);

    const faqRoot = document.getElementById("faq");
    const faqDetails = faqRoot ? faqRoot.querySelectorAll("details") : [];
    const onToggle = (ev: any) => {
      const sum = ev.currentTarget.querySelector("summary");
      const q = sum ? sum.textContent.trim() : "faq";
      if (ev.currentTarget.open) {
        ctx.faqOpened.push(q);
        ctx.events.push({ t: Date.now(), type: "faq_open", q });
        console.log("FAQ opened:", q);
      }
    };
    faqDetails.forEach((d) => d.addEventListener("toggle", onToggle));
    console.log(
      "FAQ tracking initialized, found",
      faqDetails.length,
      "FAQ items"
    );

    const flush = (final = false) => {
      // Only send data when user is leaving (final = true) and not already sent
      if (!final || dataSent) {
        return;
      }

      // Mark as sent to prevent duplicates
      dataSent = true;

      ctx.secondsOnPage = Math.round((Date.now() - ctx.startedAt) / 1000);

      // Calculate active time
      let currentActiveTime = totalActiveTime;
      if (isTabActive) {
        currentActiveTime += Date.now() - activeTimeStart;
      }
      ctx.activeSecondsOnPage = Math.round(currentActiveTime / 1000);

      const payload = {
        guid: ctx.guid,
        sessionId: ctx.sessionId,
        ip: ctx.ip,
        country: ctx.country,
        secondsOnPage: ctx.secondsOnPage,
        activeSecondsOnPage: ctx.activeSecondsOnPage,
        sectionsViewed: Array.from(ctx.sectionsViewed as Set<string>),
        navClicks: ctx.navClicks,
        menuClicks: ctx.menuClicks,
        faqOpened: ctx.faqOpened,
        jiwarCardClicks: ctx.jiwarCardClicks,
        ctaClicks: ctx.ctaClicks,
        events: ctx.events,
        path: ctx.path,
        ua: ctx.ua,
        lang: ctx.lang,
        pageName: ctx.pageName,
        source: ctx.source,
        sourceTimestamp: ctx.sourceTimestamp,
        ts: new Date().toISOString(),
        exitedAt: final ? new Date().toISOString() : undefined,
        sessionEnded: final,
      };

      // Debug: Log the payload being sent
      console.log("=== SENDING ANALYTICS PAYLOAD ===");
      console.log("Sections viewed:", payload.sectionsViewed);
      console.log("Nav clicks:", payload.navClicks);
      console.log("Menu clicks:", payload.menuClicks);
      console.log("FAQ opened:", payload.faqOpened);
      console.log("Full payload:", payload);

      try {
        const blob = new Blob([JSON.stringify(payload)], {
          type: "application/json",
        });

        // Try sendBeacon first (works best for page unload)
        let sent = false;
        if (navigator.sendBeacon) {
          sent = navigator.sendBeacon("/api/track", blob);
          console.log("SendBeacon result:", sent);
        }

        // If sendBeacon failed or unavailable, use fetch with keepalive
        if (!sent) {
          console.log("SendBeacon failed, using fetch with keepalive");
          fetch("/api/track", {
            method: "POST",
            body: blob,
            headers: {
              "Content-Type": "application/json",
            },
            keepalive: true, // Important: keeps request alive even after page unload
          })
            .then((res) => console.log("Fetch result:", res.ok))
            .catch((err) => console.error("Fetch error:", err));
        }

        if (DEBUG && !sent) {
          const a = document.getElementById("debug-download");
          if (a) {
            const url = URL.createObjectURL(blob);
            a.setAttribute("href", url);
            a.setAttribute("download", `analytics-${ctx.guid}.json`);
          }
        }
      } catch (error) {
        console.error("Error sending analytics:", error);
      }
    };

    const onBeforeUnload = () => {
      console.log("User is leaving - sending final analytics");
      flush(true);
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    ctx.events.push({ t: Date.now(), type: "page_view" });

    // Add manual trigger for testing and debugging
    (window as any).triggerAnalytics = () => {
      console.log("=== MANUALLY TRIGGERING ANALYTICS ===");
      console.log("Current data:");
      console.log("- Sections viewed:", Array.from(ctx.sectionsViewed));
      console.log("- Nav clicks:", ctx.navClicks);
      console.log("- Menu clicks:", ctx.menuClicks);
      console.log("- FAQ opened:", ctx.faqOpened);
      console.log("- Events:", ctx.events);
      // Reset flag for manual testing
      dataSent = false;
      flush(true);
    };

    // Add debug info display
    (window as any).showTrackingData = () => {
      console.log("=== CURRENT TRACKING DATA ===");
      console.log("Sections viewed:", Array.from(ctx.sectionsViewed));
      console.log("Nav clicks:", ctx.navClicks);
      console.log("Menu clicks:", ctx.menuClicks);
      console.log("FAQ opened:", ctx.faqOpened);
      console.log("Events:", ctx.events);
      console.log(
        "Seconds on page:",
        Math.round((Date.now() - ctx.startedAt) / 1000)
      );
    };

    return () => {
      // Send final data when component unmounts (navigation away)
      console.log("Component unmounting - sending final analytics");
      flush(true);
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (menu) menu.removeEventListener("click", onMenuClick);
      faqDetails.forEach((d) => d.removeEventListener("toggle", onToggle));
      observer.disconnect();
    };
  }, [isAR]);

  return (
    <div
      dir={dir}
      className={`min-h-screen bg-white text-[#0b3d2e] selection:bg-[#1c9a6f]/20 ${align}`}
    >
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-[#1c9a6f]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoJiwar className="w-9 h-9" />
            <div>
              <p className="font-semibold leading-tight">{t.brand}</p>
              <p className="text-xs text-[#0b3d2e]/70 -mt-0.5">{t.tagline}</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#0b3d2e]/80">
            <a href="#features" className="hover:text-[#1c9a6f]">
              {t.nav.features}
            </a>
            <a href="#jiwar" className="hover:text-[#1c9a6f]">
              {t.nav.jiwar}
            </a>
            <a href="#investment" className="hover:text-[#1c9a6f]">
              {t.nav.investment}
            </a>
            <a href="#faq" className="hover:text-[#1c9a6f]">
              {t.nav.faq}
            </a>
            <div className="ml-2 pl-2 border-s border-[#1c9a6f]/20 flex items-center gap-1">
              <button
                onClick={() => setLang("ar")}
                className={`px-2 py-1 rounded-lg ${
                  isAR ? "bg-[#1c9a6f] text-white" : "hover:bg-[#1c9a6f]/10"
                }`}
              >
                ع
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-lg ${
                  !isAR ? "bg-[#1c9a6f] text-white" : "hover:bg-[#1c9a6f]/10"
                }`}
              >
                EN
              </button>
            </div>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={interestHref}
              onClick={() => {
                sessionStorage.setItem("jiwar_interest_source", "header_cta");
                sessionStorage.setItem(
                  "jiwar_interest_source_timestamp",
                  Date.now().toString()
                );
              }}
              className="inline-flex items-center justify-center rounded-2xl border border-[#1c9a6f]/40 bg-[#1c9a6f]/10 px-4 py-2 text-sm font-semibold text-[#0b3d2e] hover:bg-[#1c9a6f]/20 transition shadow-sm"
            >
              {t.ctaPrimary}
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          backgroundImage: `url(/hero-bg.png)`,
          backgroundSize: "cover",
          backgroundPosition: "50% 83%",
        }}
        className="relative bg-white"
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] text-[white]">
                {t.heroTitleA}
                <span className="text-[#1c9a6f]">{t.heroTitleB}</span>
                {t.heroTitleC}
                <span className="text-[#1c9a6f]">{t.towersName}</span>
              </h1>
              <p className="mt-4 text-lg text-[white]/85 max-w-2xl text-justify">
                {t.heroDesc}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge>{t.badge1}</Badge>
                <Badge>{t.badge2}</Badge>
                <Badge>{t.badge3}</Badge>
                <Badge>{t.badge4}</Badge>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <a
                  href={interestHref}
                  onClick={() => {
                    sessionStorage.setItem(
                      "jiwar_interest_source",
                      "hero_cta_primary"
                    );
                    sessionStorage.setItem(
                      "jiwar_interest_source_timestamp",
                      Date.now().toString()
                    );
                  }}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#1c9a6f] text-white px-6 py-3 font-bold hover:brightness-110 transition shadow-lg shadow-[#1c9a6f]/20"
                >
                  {t.ctaPrimary}
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-2xl border border-[white] px-6 py-3 font-semibold transition text-[white]"
                >
                  {t.ctaSecondary}
                </a>
              </div>
            </div>
            <div className="md:col-span-5">
              <div
                style={{ background: "rgb(255 255 255 / 16%)" }}
                className="rounded-3xl border border-none  p-6 backdrop-blur"
              >
                <p className="font-semibold mb-2 text-[white]">{t.cardTitle}</p>
                <p className="text-[white]/75 text-sm">{t.cardText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-14 bg-[#f9f9f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b3d2e]">
            {t.featuresTitle}
          </h2>
          <ul className="mt-6 grid md:grid-cols-2 gap-4 text-[#0b3d2e]/85">
            {t.features.map((f, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#1c9a6f] text-white text-sm font-bold">
                  {isAR
                    ? ["١٠", "٩", "٨", "٧", "٦", "٥", "٤", "٣", "٢", "١"][
                        t.features.length - 1 - i
                      ]
                    : i + 1}
                </span>
                <span className="flex-1">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Towers */}
      <section id="jiwar" className="relative py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b3d2e]">
            {t.towersTitle}
          </h2>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <TowerCard
              images={[
                "page-1-jw-1.jpeg",
                "page-1-jw-2.jpeg",
                "page-1-jw-3.jpeg",
                "page-1-jw-4.jpeg",
              ]}
              title={t.tower1.title}
              desc={t.tower1.desc}
              chip={t.tower1.chip}
              isAR={isAR}
            />
            <TowerCard
              images={[
                "page-1-jw-2.3.jpeg",
                "page-1-jw-2-1.jpeg",
                "page-1-jw-2.2.jpeg",
                "page-1-jw-2.4.jpeg",
              ]}
              title={t.tower2.title}
              desc={t.tower2.desc}
              isAR={isAR}
            />
          </div>
        </div>
      </section>

      {/* Investment */}
      <section id="investment" className="relative py-14 bg-[#f9f9f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b3d2e]">
            {t.investTitle}
          </h2>
          <ul className="mt-4 space-y-3 text-[#0b3d2e]/85">
            {t.investBullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <a
            href={interestHref}
            onClick={() => {
              sessionStorage.setItem(
                "jiwar_interest_source",
                "investment_section_cta"
              );
              sessionStorage.setItem(
                "jiwar_interest_source_timestamp",
                Date.now().toString()
              );
            }}
            className="inline-flex items-center justify-center mt-6 rounded-2xl bg-[#1c9a6f] text-white px-6 py-3 font-bold hover:brightness-110 transition shadow-lg shadow-[#1c9a6f]/20"
          >
            {t.ctaPrimary}
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b3d2e]">
            {t.faqTitle}
          </h2>
          <div className="mt-6 divide-y divide-[#1c9a6f]/20 border border-[#1c9a6f]/20 rounded-2xl">
            {t.faqs.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1c9a6f]/20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Contact Info */}
            <div className={`${isAR ? "text-right" : "text-left"}`}>
              <h3 className="text-lg font-bold text-[#0b3d2e] mb-3">
                {t.contactTitle}
              </h3>
              <div className="space-y-2 text-sm text-[#0b3d2e]/80">
                {/* <p className="flex items-center gap-2">
                  <span className="text-[#1c9a6f]">📞</span>
                  <span>
                    {t.phone}:{" "}
                    <a
                      href="tel:+966920000123"
                      className="hover:text-[#1c9a6f]"
                    >
                      +966 920 000 123
                    </a>
                  </span>
                </p> */}
                <p className="flex items-center gap-2">
                  <span className="text-[#1c9a6f]">✉️</span>
                  <span>
                    {t.email}:{" "}
                    <a
                      href="mailto:info@jiwarproperties.com"
                      className="hover:text-[#1c9a6f]"
                    >
                      info@jiwarproperties.com
                    </a>
                  </span>
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className={`${isAR ? "text-right" : "text-left"}`}>
              <h3 className="text-lg font-bold text-[#0b3d2e] mb-3">
                {isAR ? "تابعنا" : "Follow Us"}
              </h3>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1c9a6f]/10 hover:bg-[#1c9a6f]/20 flex items-center justify-center transition"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5 text-[#1c9a6f]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1c9a6f]/10 hover:bg-[#1c9a6f]/20 flex items-center justify-center transition"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5 text-[#1c9a6f]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1c9a6f]/10 hover:bg-[#1c9a6f]/20 flex items-center justify-center transition"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-7 h-7 text-[#1c9a6f]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988H7.898v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1c9a6f]/10 hover:bg-[#1c9a6f]/20 flex items-center justify-center transition"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5 text-[#1c9a6f]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Logo & Tagline */}
            <div
              className={`${
                isAR ? "text-right" : "text-left"
              } flex flex-col items-${isAR ? "end" : "start"}`}
            >
              <div className="flex items-center gap-3">
                <LogoJiwar className="w-12 h-12" />
                <div>
                  <p className="font-bold text-[#0b3d2e]">{t.brand}</p>
                  <p className="text-xs text-[#0b3d2e]/70">{t.tagline}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1c9a6f]/20 pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[#0b3d2e]/70">
                <a href="/terms" className="hover:text-[#1c9a6f] transition">
                  {isAR ? "الشروط والأحكام" : "Terms & Conditions"}
                </a>
                <span className="text-[#0b3d2e]/30">|</span>
                <a href="/privacy" className="hover:text-[#1c9a6f] transition">
                  {isAR ? "سياسة الخصوصية" : "Privacy Policy"}
                </a>
              </div>
              <p className="text-xs text-[#0b3d2e]/60 text-center">
                {t.footer}
              </p>
            </div>
          </div>
          {typeof window !== "undefined" &&
            new URLSearchParams(window.location.search).get("debug") ===
              "1" && (
              <div className="mt-4 text-center space-x-2">
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      (window as any).showTrackingData();
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-50 px-4 py-2 text-sm text-blue-700 shadow hover:bg-blue-100"
                >
                  عرض البيانات المتتبعة
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      (window as any).triggerAnalytics();
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-50 px-4 py-2 text-sm text-green-700 shadow hover:bg-green-100"
                >
                  إرسال البيانات الآن
                </button>
                <a
                  id="debug-download"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#1c9a6f]/30 bg-white px-4 py-2 text-sm text-[#0b3d2e] shadow hover:bg-[#1c9a6f]/5"
                  href="#"
                >
                  Download JSON
                </a>
              </div>
            )}
        </div>
      </footer>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group open:bg-[#f9f9f9]">
      <summary className="cursor-pointer list-none p-5 font-semibold hover:bg-[#1c9a6f]/5 flex items-center justify-between text-[#0b3d2e]">
        <span>{q}</span>
        <span className="transition group-open:rotate-180">⌄</span>
      </summary>
      <div className="px-5 pb-5 pt-0 text-[#0b3d2e]/80 text-sm">{a}</div>
    </details>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#1c9a6f]/5 px-3 py-1 text-xs border border-[white] text-[white]">
      {children}
    </span>
  );
}

function TowerCard({
  images,
  title,
  desc,
  chip,
  isAR,
}: {
  images: string[];
  title: string;
  desc: string;
  chip?: string;
  isAR: boolean;
}) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // In RTL (Arabic), reverse both arrows and navigation direction
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      isAR
        ? (prev - 1 + images.length) % images.length
        : (prev + 1) % images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      isAR
        ? (prev + 1) % images.length
        : (prev - 1 + images.length) % images.length
    );
  };

  // Autoplay: advance slides every 4 seconds
  React.useEffect(() => {
    if (!images || images.length <= 1) return;
    const id = setInterval(() => {
      setCurrentImageIndex((prev) =>
        isAR ? (prev + 1) % images.length : (prev + 1) % images.length
      );
    }, 4000);
    return () => clearInterval(id);
  }, [images, isAR]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Store the click source in sessionStorage
    sessionStorage.setItem("jiwar_interest_source", `jiwar_card_${title}`);
    sessionStorage.setItem(
      "jiwar_interest_source_timestamp",
      Date.now().toString()
    );
  };

  return (
    <a
      href={interestHref}
      onClick={handleCardClick}
      className="block rounded-3xl overflow-hidden border border-[#1c9a6f]/20 bg-white shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="relative h-48 bg-cover bg-center group">
        <div
          className="h-full bg-cover bg-center transition-all duration-300"
          style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#0b3d2e] rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xl"
              type="button"
              aria-label={isAR ? "الصورة السابقة" : "Previous image"}
            >
              {isAR ? "›" : "‹"}
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#0b3d2e] rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xl"
              type="button"
              aria-label={isAR ? "الصورة التالية" : "Next image"}
            >
              {isAR ? "‹" : "›"}
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex ? "bg-white w-4" : "bg-white/60"
                  }`}
                  type="button"
                  aria-label={`${isAR ? "صورة" : "Image"} ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#0b3d2e]">{title}</h3>
        <p className="text-[#0b3d2e]/80 my-3">{desc}</p>
        {chip && (
          <span className="inline-flex items-center rounded-full bg-[#1c9a6f]/10 text-[#1c9a6f] px-3 py-1 text-xs font-bold">
            {chip}
          </span>
        )}
      </div>
    </a>
  );
}

function LogoJiwar({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="Jiwar Logo">
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
