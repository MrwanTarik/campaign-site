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
      heroTitleC: " — ملكية تدوم 20 سنة في ",
      towersName: "أبراج جِوار",
      heroDesc:
        " الآن فرصتك لحجز اسبوع سنوي في اطهر بقاع الارض استمتع بالاختيار بين وحداتنا الفاخرة المطلة على المسجد الحرام والكعبة المشرفة او استكشف الخيارات الاخرى التي تبعد دقائق عن الحرم المكي بالحافلات الترددية ، امتياز ان تكون جارًا لبيت الله الحرام اصبح في متناول الجميع لتستمتع وعائلتك بأثمن اللحظات الروحانية بشكل سنوي واسعار لا تصدق !",
      badge1: "ملكية مضمونة 20 سنة",
      badge2: "أسبوع ثابت كل عام",
      badge3: "أسعار تبدأ من 25,000 ريال",
      ctaPrimary: "الحجز المبكر",
      ctaSecondary: "اكتشف التفاصيل",
      cardTitle: "سكينة الروح وضمان الاستثمار",
      cardText:
        "امتلك وحدتك الخاصة بجوار الحرم المكي واستمتع بأسبوعك المميز سنويًا ، مع خيارات مرنة للحجز و تعديله او اعادة بيعه وصكوك ايجارية معتمدة",
      featuresTitle: "خدمات ومزايا الإقامة",
      features: [
        "تجربة فندقية استثنائية باعلى المعايير مع شركائنا من فنادق الخمس نجوم",
        "خدمة على مدار الساعة ",
        "مرونة الاختيار والتعديل واعادة التأجير",
        "باقات كبار الشخصيات للاستقبال والتوصيل من المطار لمحل الاقامة",
        "خدمات نقل ترددية من وإلى الحرم المكي",
        "خيارات متنوعة للوحدات تناسب جميع النزلاء وبأسعار تنافسية",
        "إدارة الحجز والخدمات الكترونيًا بكل يسر وسهولة",
      ],
      towersTitle: "أبراج جِوار والمواقع",
      tower1: {
        title: "برج جِوار 1",
        desc: "على بُعد ٤٠ متر فقط من الحرم المكي ، اطلالات مميزة على الكعبة المشرفة والحرم المكي في ارقى مناطق مكة المكرمة واكثرها تميزًا ",
        chip: "اطلالة مباشرة على الكعبة المشرفة",
      },
      tower2: {
        title: "برج جِوار 2",
        desc: "يبعد 10 دقائق فقط عن الحرم مع باصات ترددية مكيّفة على مدار الساعة.",
      },
      investTitle: "سكينة الروح وضمان الاستثمار",
      investBullets: [
        "اسبوعك المميز في اطهر بقاع الارض سنويًا ولمدة عشرة او عشرين سنة بأسعار تبدأ من ٢٥،٠٠٠ ريال فقط! ",
        "تجربة روحانية متكاملة مع خيارات حجز متنوعة تناسب الجميع ",
        "مرونة إعادة البيع وتغيير المستفيد لتوائم تطلعاتك",
      ],
      faqTitle: "الأسئلة الشائعة",
      faqs: [
        {
          q: "ما المقصود بأسبوع ثابت؟",
          a: "هو أسبوع محدد سنويًا ضمن عقد الملكية لمدة 20 سنة، مع إمكانية التبديل وفق سياسة الإدارة (إن توفرت).",
        },
        {
          q: "هل يمكنني تأجير حصتي إذا لم أكن أنوي الزيارة؟",
          a: "نعم، يمكنك تأجير وحدتك لشخص آخر أو طلب من إدارة جِوار تأجيرها نيابةً عنك، وذلك وفق الشروط والأحكام.",
        },
        {
          q: "ما هو نظام التايم شير (الملكية المشتركة بالوقت)؟",
          a: "هو نظام يتيح للمستخدم امتلاك حق استخدام وحدة سكنية لفترة محددة كل عام (عادة أسبوعًا) ضمن عقد يمتد لعدة سنوات، ما يجمع بين التملك والمرونة في الاستخدام والاستثمار.",
        },
        {
          q: "أين يقع كل برج؟",
          a: "برج جِوار 1 ملاصق لصحن الحرم، وبرج جِوار 2 على بُعد 10 دقائق مع باصات ترددية على مدار الساعة.",
        },
      ],
      footer:
        "© " +
        new Date().getFullYear() +
        " جِوار تايم شير — جميع الحقوق محفوظة.",
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
        "Invest in cherished spiritual moments with a Kaaba-facing view or just minutes away via shuttle. Living next to the Haram is the true privilege under a shared-benefit model.",
      badge1: "20-year guaranteed ownership",
      badge2: "One fixed week yearly",
      badge3: "Prices from SAR 25,000",
      ctaPrimary: "Early Booking",
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
      ],
      footer:
        "© " +
        new Date().getFullYear() +
        " Jiwar Timeshare — All rights reserved.",
    },
  } as const;
  const t = tr[lang];

  // ---- Analytics (client-side) ----
  const DEBUG =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debug") === "1";
  React.useEffect(() => {
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

    const ctx: any = {
      guid,
      sessionId,
      ip: null,
      country: null,
      startedAt: Date.now(),
      secondsOnPage: 0,
      sectionsViewed: new Set<string>(),
      menuClicks: [],
      faqOpened: [],
      events: [],
      path:
        typeof location !== "undefined"
          ? location.pathname + location.search
          : "",
      ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
      lang: isAR ? "ar" : "en",
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

    const secIds = ["features", "jiwar", "investment", "faq"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).id;
            if (id && !ctx.sectionsViewed.has(id)) {
              ctx.sectionsViewed.add(id);
              ctx.events.push({ t: Date.now(), type: "section_view", id });
            }
          }
        });
      },
      { threshold: 0.4 }
    );
    secIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const menu = document.querySelector("nav");
    const onMenuClick = (e: any) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const label = a.textContent?.trim() || a.getAttribute("href");
      ctx.menuClicks.push({
        t: Date.now(),
        label,
        href: a.getAttribute("href"),
      });
      ctx.events.push({ t: Date.now(), type: "menu_click", label });
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
      }
    };
    faqDetails.forEach((d) => d.addEventListener("toggle", onToggle));

    const flush = (final = false) => {
      ctx.secondsOnPage = Math.round((Date.now() - ctx.startedAt) / 1000);

      // Send analytics every 60 seconds or on final flush to reduce blob operations
      const shouldSend = final || ctx.secondsOnPage >= 60;

      if (!shouldSend) {
        return; // Skip sending if not enough time has passed
      }

      const payload = {
        guid: ctx.guid,
        sessionId: ctx.sessionId,
        ip: ctx.ip,
        country: ctx.country,
        secondsOnPage: ctx.secondsOnPage,
        sectionsViewed: Array.from(ctx.sectionsViewed as Set<string>),
        menuClicks: ctx.menuClicks,
        faqOpened: ctx.faqOpened,
        events: ctx.events,
        path: ctx.path,
        ua: ctx.ua,
        lang: ctx.lang,
        ts: new Date().toISOString(),
      };

      // Debug: Log the payload being sent
      console.log("Sending analytics payload:", payload);

      try {
        const blob = new Blob([JSON.stringify(payload)], {
          type: "application/json",
        });
        const ok =
          navigator.sendBeacon && navigator.sendBeacon("/api/track", blob);
        if (!ok && DEBUG) {
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

    const onBeforeUnload = () => flush(true);
    window.addEventListener("beforeunload", onBeforeUnload);
    const interval = setInterval(() => flush(false), 60000); // Every 60 seconds
    ctx.events.push({ t: Date.now(), type: "page_view" });

    // Add manual trigger for testing
    (window as any).triggerAnalytics = () => {
      console.log("Manually triggering analytics...");
      flush(true);
    };

    // Send initial analytics after 30 seconds to avoid immediate operations
    setTimeout(() => flush(false), 30000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", onBeforeUnload);
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
              href="/interest"
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
              <p className="mt-4 text-lg text-[white]/85 max-w-2xl">
                {t.heroDesc}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge>{t.badge1}</Badge>
                <Badge>{t.badge2}</Badge>
                <Badge>{t.badge3}</Badge>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <a
                  href="/interest"
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
              <li key={i}>{f}</li>
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
            <div className="rounded-3xl overflow-hidden border border-[#1c9a6f]/20 bg-white">
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url(/jw-1.jpg)`,
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0b3d2e]">
                  {t.tower1.title}
                </h3>
                <p className="text-[#0b3d2e]/80 my-3">{t.tower1.desc}</p>
                {t.tower1.chip && (
                  <span className="inline-flex items-center rounded-full bg-[#1c9a6f]/10 text-[#1c9a6f] px-3 py-1 text-xs font-bold">
                    {t.tower1.chip}
                  </span>
                )}
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden border border-[#1c9a6f]/20 bg-white">
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url(/jw-2.jpeg)`,
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0b3d2e]">
                  {t.tower2.title}
                </h3>
                <p className="text-[#0b3d2e]/80 my-3">{t.tower2.desc}</p>
              </div>
            </div>
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
            href="/interest"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-[#0b3d2e]/60">
          {t.footer}
          {typeof window !== "undefined" &&
            new URLSearchParams(window.location.search).get("debug") ===
              "1" && (
              <div className="mt-4">
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
