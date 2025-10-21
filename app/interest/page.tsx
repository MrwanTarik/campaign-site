"use client";

import React from "react";

export default function InterestPage() {
  const DEBUG =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debug") === "1";

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

  // Translations
  const tr = {
    ar: {
      brand: "جِوار تايم شير",
      tagline: "قربٌ يطمئن القلب",
      backHome: "العودة للصفحة الرئيسية",
      pageTitle: "تسجيل الإهتمام",
      subtitle1: "أسرع بالتسجيل الآن ليتواصل معك فريق جوار الإستشاري",
      subtitle2:
        "سيتم التواصل معكم لتأكيد الاهتمام وإدراج معلوماتكم في قائمة الحجز المبكر",
      selectUp:
        "اختر حتى ثلاث وحدات تهمّك وأرسل بياناتك ليتواصل معك فريق جِوار.",
      jiwar1Title: "جِوار ١",
      jiwar1Desc: "إطلالات مباشرة على الحرم والكعبة المشرفة",
      jiwar2Title: "جِوار ٢",
      jiwar2Desc: "على بُعد ١٠ دقائق من الحرم مع باصات ترددية",
      maxError: "يمكنك اختيار حتى ٣ خيارات فقط.",
      maxNote: "يمكنك اختيار حتى ٣ خيارات فقط.",
      registerTitle: "سجّل اهتمامك",
      nameLabel: "الاسم *",
      emailLabel: "البريد الإلكتروني *",
      countryLabel: "الدولة",
      phoneLabel: "الهاتف",
      notesLabel: "ملاحظات",
      countryPlaceholder: "ابدأ بالكتابة...",
      selectedCount: "المحدّد الآن:",
      submitBtn: "إرسال",
      successMsg: "شكرًا لك! تم تسجيل اهتمامك.",
      errorMsg: "الاسم والبريد الإلكتروني مطلوبان.",
      selected: "محدد",
      select: "تحديد",
    },
    en: {
      brand: "Jiwar Timeshare",
      tagline: "Peace of heart, steps from the Haram",
      backHome: "Back to Home",
      pageTitle: "Register Interest",
      subtitle1: "Register now to be contacted by the Jiwar advisory team",
      subtitle2:
        "We will contact you to confirm your interest and add your information to the early booking list",
      selectUp:
        "Choose up to three units that interest you and send your details for the Jiwar team to contact you.",
      jiwar1Title: "Jiwar 1",
      jiwar1Desc: "Direct views of the Haram and Kaaba",
      jiwar2Title: "Jiwar 2",
      jiwar2Desc: "10 minutes from the Haram with shuttle buses",
      maxError: "You can select up to 3 options only.",
      maxNote: "You can select up to 3 options only.",
      registerTitle: "Register Your Interest",
      nameLabel: "Name *",
      emailLabel: "Email *",
      countryLabel: "Country",
      phoneLabel: "Phone",
      notesLabel: "Notes",
      countryPlaceholder: "Start typing...",
      selectedCount: "Currently selected:",
      submitBtn: "Submit",
      successMsg: "Thank you! Your interest has been registered.",
      errorMsg: "Name and email are required.",
      selected: "Selected",
      select: "Select",
    },
  } as const;
  const t = tr[lang];

  const getOrCreateGUID = React.useCallback(() => {
    const key = "jiwar_guid";
    let id = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (typeof window !== "undefined" && !id) {
      id = (crypto as any).randomUUID
        ? (crypto as any).randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(key, id!);
    }
    return id;
  }, []);

  const getOrCreateSessionId = React.useCallback(() => {
    const key = "jiwar_session_id";
    let id = typeof window !== "undefined" ? sessionStorage.getItem(key) : null;
    if (typeof window !== "undefined" && !id) {
      id = (crypto as any).randomUUID
        ? (crypto as any).randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      sessionStorage.setItem(key, id!);
    }
    return id;
  }, []);

  const startedAtRef = React.useRef<number>(Date.now());
  const [submitted, setSubmitted] = React.useState(false);

  // Track active time only
  const activeTimeStartRef = React.useRef<number>(Date.now());
  const totalActiveTimeRef = React.useRef<number>(0);
  const isTabActiveRef = React.useRef<boolean>(true);

  const [ipInfo, setIpInfo] = React.useState<{
    ip: string | null;
    country: string | null;
  }>({ ip: null, country: null });

  React.useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d)
          setIpInfo({
            ip: d.ip || null,
            country: d.country_name || d.country || null,
          });
      })
      .catch(() => {});

    // Track tab visibility for active time
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isTabActiveRef.current) {
          totalActiveTimeRef.current += Date.now() - activeTimeStartRef.current;
          isTabActiveRef.current = false;
        }
      } else {
        if (!isTabActiveRef.current) {
          activeTimeStartRef.current = Date.now();
          isTabActiveRef.current = true;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  type Option = {
    id: string;
    tower: "Jiwar 1" | "Jiwar 2";
    title_ar: string;
    title_en: string;
    area_ar: string;
    area_en: string;
    investment_ar: string;
    investment_en: string;
    period_ar: string;
    period_en: string;
    images: string[];
  };
  const jiwar1: Option[] = [
    {
      id: "j1-studio-city",
      tower: "Jiwar 1",
      title_ar: "استوديو — إطلالة مدينة مكة",
      title_en: "Studio — Makkah City View",
      area_ar: "المساحة: ٤٦ م²",
      area_en: "Area: 46 m²",
      investment_ar: "الاستثمار: يبدأ من ٥٠,٠٠٠ ريال",
      investment_en: "Investment: Starting from SAR 50,000",
      period_ar: "المدة: ١٠ سنوات × ٧ أيام سنويًا",
      period_en: "Period: 10 years × 7 days annually",
      images: ["page-2-jw-1-r1.jpeg", "page-2-jw-1-r1-2.jpeg"],
    },
    {
      id: "j1-1br-haram",
      tower: "Jiwar 1",
      title_ar: "شقة غرفة واحدة — إطلالة الحرم",
      title_en: "One Bedroom — Haram View",
      area_ar: "المساحة: ١١٣ م²",
      area_en: "Area: 113 m²",
      investment_ar: "الاستثمار: يبدأ من ١١٧,٠٠٠ ريال",
      investment_en: "Investment: Starting from SAR 117,000",
      period_ar: "المدة: ١٠ سنوات × ٧ أيام سنويًا",
      period_en: "Period: 10 years × 7 days annually",
      images: [
        "page-2-jw-1-r2.jpeg",
        "page-2-jw-1-r2-2.jpeg",
        "page-2-jw-1-r2-3.jpeg",
      ],
    },
    {
      id: "j1-2br-kaba",
      tower: "Jiwar 1",
      title_ar: "شقة غرفتين — إطلالة الكعبة",
      title_en: "Two Bedrooms — Kaaba View",
      area_ar: "المساحة: ١٧١ م²",
      area_en: "Area: 171 m²",
      investment_ar: "الاستثمار: يبدأ من ١٧٠,٠٠٠ ريال",
      investment_en: "Investment: Starting from SAR 170,000",
      period_ar: "المدة: ١٠ سنوات × ٧ أيام سنويًا",
      period_en: "Period: 10 years × 7 days annually",
      images: [
        "page-2-jw-1-r3-2.jpeg",
        "page-2-jw-1-r3.jpeg",
        "page-2-jw-1-r3-3.jpeg",
        "page-2-jw-1-r3-4.jpeg",
        "page-2-jw-1-r3-5.jpeg",
      ],
    },
  ];
  const jiwar2: Option[] = [
    {
      id: "j2-double",
      tower: "Jiwar 2",
      title_ar: "غرفة مزدوجة",
      title_en: "Double Room",
      area_ar: "المساحة: ٢٦ م²",
      area_en: "Area: 26 m²",
      investment_ar: "الاستثمار: يبدأ من ٢٥,٠٠٠ ريال",
      investment_en: "Investment: Starting from SAR 25,000",
      period_ar: "المدة: ٢٠ سنة × ٧ أيام سنويًا",
      period_en: "Period: 20 years × 7 days annually",
      images: [
        "page-2-jw-2-r1-2.jpeg",
        "page-2-jw-2-r1.jpeg",
        "page-2-jw-2-r1-3.jpeg",
      ],
    },
    {
      id: "j2-three-twins",
      tower: "Jiwar 2",
      title_ar: "غرفة بثلاثة أسِرّة منفصلة",
      title_en: "Three Twin Beds Room",
      area_ar: "المساحة: ٢٦ م²",
      area_en: "Area: 26 m²",
      investment_ar: "الاستثمار: ٣٠,٠٠٠ ريال",
      investment_en: "Investment: SAR 30,000",
      period_ar: "المدة: ٢٠ سنة × ٧ أيام سنويًا",
      period_en: "Period: 20 years × 7 days annually",
      images: ["page-2-jw-2-r2-2.jpeg", "page-2-jw-2-r2.jpeg"],
    },
    {
      id: "j2-family-studio",
      tower: "Jiwar 2",
      title_ar: "استوديو عائلي — غرفتان (٥ أسِرّة)",
      title_en: "Family Studio — Two Rooms (5 Beds)",
      area_ar: "المساحة: ٤٨ م²",
      area_en: "Area: 48 m²",
      investment_ar: "الاستثمار: ٤٦,٠٠٠ ريال",
      investment_en: "Investment: SAR 46,000",
      period_ar: "المدة: ٢٠ سنة × ٧ أيام سنويًا",
      period_en: "Period: 20 years × 7 days annually",
      images: [
        "page-2-jw-2-r3-2.jpeg",
        "page-2-jw-2-r3.jpeg",
        "page-2-jw-2-r3-3.jpeg",
        "page-2-jw-2-r3-4.jpeg",
      ],
    },
  ];

  const [selected, setSelected] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string>("");
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        setError("");
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) {
        setError(t.maxError);
        return prev;
      }
      setError("");
      return [...prev, id];
    });
  };

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    country: "",
    phone: "",
    notes: "",
  });
  const [sent, setSent] = React.useState<null | {
    ok: boolean;
    message: string;
  }>(null);

  const countries = React.useMemo(
    () => [
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bhutan",
      "Bolivia",
      "Bosnia and Herzegovina",
      "Botswana",
      "Brazil",
      "Brunei",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Cape Verde",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czech Republic",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "East Timor",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Ethiopia",
      "Fiji",
      "Finland",
      "France",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Greece",
      "Grenada",
      "Guatemala",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Honduras",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland",
      "Italy",
      "Ivory Coast",
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Macedonia",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Micronesia",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Morocco",
      "Mozambique",
      "Myanmar",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "North Korea",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestine",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Romania",
      "Russia",
      "Rwanda",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Korea",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Swaziland",
      "Sweden",
      "Switzerland",
      "Syria",
      "Taiwan",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Togo",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Vatican City",
      "Venezuela",
      "Vietnam",
      "Yemen",
      "Zambia",
      "Zimbabwe",
    ],
    []
  );

  const sendRecord = (payload: any) => {
    try {
      console.log("=== SENDING INTEREST PAGE ANALYTICS ===");
      console.log("Selected options:", payload.selectedOptions);
      console.log("Selected Jiwar 1:", payload.selectedJiwar1);
      console.log("Selected Jiwar 2:", payload.selectedJiwar2);
      console.log("Form data:", payload.form);
      console.log("Form has data:", payload.formHasData);
      console.log("Full payload:", payload);

      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      const ok =
        (navigator as any).sendBeacon &&
        (navigator as any).sendBeacon("/api/track", blob);

      console.log("Send beacon result:", ok);

      if (!ok && DEBUG) {
        const a = document.getElementById("rooms-debug-download");
        if (a) {
          const url = URL.createObjectURL(blob);
          a.setAttribute("href", url);
          a.setAttribute("download", `rooms-${payload.guid}.json`);
        }
      }
    } catch (error) {
      console.error("Error sending analytics:", error);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(null);
    if (!form.name.trim() || !form.email.trim()) {
      setSent({ ok: false, message: t.errorMsg });
      return;
    }
    const guid = getOrCreateGUID();
    const sessionId = getOrCreateSessionId();
    const secondsOnPage = Math.round(
      (Date.now() - startedAtRef.current) / 1000
    );

    // Calculate active time
    let currentActiveTime = totalActiveTimeRef.current;
    if (isTabActiveRef.current) {
      currentActiveTime += Date.now() - activeTimeStartRef.current;
    }
    const activeSecondsOnPage = Math.round(currentActiveTime / 1000);

    // Get interest source
    const interestSource =
      sessionStorage.getItem("jiwar_interest_source") || "direct";
    const sourceTimestamp = sessionStorage.getItem(
      "jiwar_interest_source_timestamp"
    );

    const payload = {
      type: "rooms_submit",
      guid,
      sessionId,
      ts: new Date().toISOString(),
      ip: ipInfo.ip,
      country: ipInfo.country,
      secondsOnPage,
      activeSecondsOnPage,
      selectedOptions: selected,
      selectedJiwar1: selected.filter((id) => id.startsWith("j1-")),
      selectedJiwar2: selected.filter((id) => id.startsWith("j2-")),
      form,
      submitted: true,
      interestSource,
      sourceTimestamp,
      pageName: "interest",
      path:
        typeof location !== "undefined"
          ? location.pathname + location.search
          : "",
      ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
      lang: isAR ? "ar" : "en",
      sessionEnded: false,
    };
    sendRecord(payload);
    setSubmitted(true);
    setSent({ ok: true, message: t.successMsg });
  };

  React.useEffect(() => {
    const guid = getOrCreateGUID();
    const sessionId = getOrCreateSessionId();
    const onBeforeUnload = () => {
      if (submitted) return;
      const secondsOnPage = Math.round(
        (Date.now() - startedAtRef.current) / 1000
      );

      // Calculate active time
      let currentActiveTime = totalActiveTimeRef.current;
      if (isTabActiveRef.current) {
        currentActiveTime += Date.now() - activeTimeStartRef.current;
      }
      const activeSecondsOnPage = Math.round(currentActiveTime / 1000);

      // Get interest source
      const interestSource =
        sessionStorage.getItem("jiwar_interest_source") || "direct";
      const sourceTimestamp = sessionStorage.getItem(
        "jiwar_interest_source_timestamp"
      );

      // Check if form has any data
      const formHasData =
        form.name || form.email || form.country || form.phone || form.notes;

      const payload = {
        type: "rooms_visit",
        guid,
        sessionId,
        ts: new Date().toISOString(),
        exitedAt: new Date().toISOString(),
        ip: ipInfo.ip,
        country: ipInfo.country,
        secondsOnPage,
        activeSecondsOnPage,
        selectedOptions: selected,
        selectedJiwar1: selected.filter((id) => id.startsWith("j1-")),
        selectedJiwar2: selected.filter((id) => id.startsWith("j2-")),
        form,
        formHasData,
        submitted: false,
        interestSource,
        sourceTimestamp,
        pageName: "interest",
        path:
          typeof location !== "undefined"
            ? location.pathname + location.search
            : "",
        ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
        lang: isAR ? "ar" : "en",
        sessionEnded: true,
      };
      sendRecord(payload);
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      onBeforeUnload();
      window.removeEventListener("beforeunload", onBeforeUnload as any);
    };
  }, [
    submitted,
    selected,
    form,
    ipInfo,
    getOrCreateGUID,
    getOrCreateSessionId,
    isAR,
  ]);

  return (
    <div
      dir={dir}
      className="min-h-screen bg-white text-[#0b3d2e] selection:bg-[#1c9a6f]/20"
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
          <div className="flex items-center gap-2">
            <div
              className={`${isAR ? "ml-2" : "mr-2"} flex items-center gap-1`}
            >
              <button
                onClick={() => setLang("ar")}
                className={`px-2 py-1 rounded-lg text-sm ${
                  isAR ? "bg-[#1c9a6f] text-white" : "hover:bg-[#1c9a6f]/10"
                }`}
              >
                ع
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-lg text-sm ${
                  !isAR ? "bg-[#1c9a6f] text-white" : "hover:bg-[#1c9a6f]/10"
                }`}
              >
                EN
              </button>
            </div>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-[#1c9a6f]/40 bg-[#1c9a6f]/10 px-4 py-2 text-sm font-semibold text-[#0b3d2e] hover:bg-[#1c9a6f]/20 transition shadow-sm"
            >
              {t.backHome}
            </a>
          </div>
        </div>
      </header>

      <section className="relative bg-white border-b border-[#1c9a6f]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold">{t.pageTitle}</h1>
          <p className="mt-3 text-lg text-[#1c9a6f] font-semibold">
            {t.subtitle1}
          </p>
          <p className="mt-2 text-[#0b3d2e]/80">{t.subtitle2}</p>
          <p className="mt-4 text-sm text-[#0b3d2e]/70">{t.selectUp}</p>
        </div>
      </section>

      <section className="relative py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Jiwar 1 Section */}
            <div className="bg-gradient-to-br from-[#1c9a6f]/5 to-[#1c9a6f]/10 rounded-3xl border-2 border-[#1c9a6f]/30 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#1c9a6f] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1c9a6f]">
                    {t.jiwar1Title}
                  </h2>
                  <p className="text-sm text-[#0b3d2e]/70">{t.jiwar1Desc}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jiwar1.map((opt) => (
                  <RoomCard
                    key={opt.id}
                    opt={opt}
                    lang={lang}
                    selected={selected.includes(opt.id)}
                    disabled={
                      !selected.includes(opt.id) && selected.length >= 3
                    }
                    onToggle={() => toggleSelect(opt.id)}
                    t={t}
                  />
                ))}
              </div>
            </div>

            {/* Jiwar 2 Section */}
            <div className="bg-gradient-to-br from-[#0b3d2e]/5 to-[#0b3d2e]/10 rounded-3xl border-2 border-[#0b3d2e]/30 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#0b3d2e] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0b3d2e]">
                    {t.jiwar2Title}
                  </h2>
                  <p className="text-sm text-[#0b3d2e]/70">{t.jiwar2Desc}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jiwar2.map((opt) => (
                  <RoomCard
                    key={opt.id}
                    opt={opt}
                    lang={lang}
                    selected={selected.includes(opt.id)}
                    disabled={
                      !selected.includes(opt.id) && selected.length >= 3
                    }
                    onToggle={() => toggleSelect(opt.id)}
                    t={t}
                  />
                ))}
              </div>
            </div>
          </div>
          {error && (
            <p className="mt-6 text-center text-sm text-red-600 font-semibold">
              {error}
            </p>
          )}
          <p className="mt-4 text-center text-sm text-[#0b3d2e]/70 bg-[#1c9a6f]/5 rounded-xl p-3 border border-[#1c9a6f]/20">
            {t.maxNote}
          </p>
        </div>
      </section>

      <section className="relative py-8 bg-[#f9f9f9] border-t border-[#1c9a6f]/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold">{t.registerTitle}</h3>
          <form className="mt-4 space-y-4" onSubmit={onSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {t.nameLabel}
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full rounded-xl border border-[#1c9a6f]/30 p-2 outline-none focus:ring-2 focus:ring-[#1c9a6f]/40"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full rounded-xl border border-[#1c9a6f]/30 p-2 outline-none focus:ring-2 focus:ring-[#1c9a6f]/40"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {t.countryLabel}
                </label>
                <input
                  list="country-list"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  placeholder={t.countryPlaceholder}
                  className="w-full rounded-xl border border-[#1c9a6f]/30 p-2 outline-none focus:ring-2 focus:ring-[#1c9a6f]/40"
                />
                <datalist id="country-list">
                  {countries.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {t.phoneLabel}
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-[#1c9a6f]/30 p-2 outline-none focus:ring-2 focus:ring-[#1c9a6f]/40"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">
                  {t.notesLabel}
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border border-[#1c9a6f]/30 p-2 outline-none focus:ring-2 focus:ring-[#1c9a6f]/40"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#0b3d2e]/70">
                {t.selectedCount}{" "}
                <b>
                  {isAR
                    ? ["٠", "١", "٢", "٣"][selected.length]
                    : selected.length}
                </b>{" "}
                / {isAR ? "٣" : "3"}
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-[#1c9a6f] text-white px-6 py-2 font-bold hover:brightness-110 transition shadow-lg shadow-[#1c9a6f]/20"
              >
                {t.submitBtn}
              </button>
            </div>
            {sent && (
              <p
                className={`text-sm ${
                  sent.ok ? "text-green-700" : "text-red-600"
                }`}
              >
                {sent.message}
              </p>
            )}
          </form>
          {DEBUG && (
            <div className="mt-4">
              <a
                id="rooms-debug-download"
                className="inline-flex items-center gap-2 rounded-xl border border-[#1c9a6f]/30 bg-white px-4 py-2 text-sm text-[#0b3d2e] shadow hover:bg-[#1c9a6f]/5"
                href="#"
              >
                تنزيل JSON الزيارة
              </a>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-[#1c9a6f]/20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              © {new Date().getFullYear()}{" "}
              {isAR
                ? "جِوار تايم شير — جميع الحقوق محفوظة."
                : "Jiwar Timeshare — All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RoomCard({
  opt,
  lang,
  selected,
  disabled,
  onToggle,
  t,
}: {
  opt: {
    id: string;
    tower: string;
    title_ar: string;
    title_en: string;
    area_ar: string;
    area_en: string;
    investment_ar: string;
    investment_en: string;
    period_ar: string;
    period_en: string;
    images: string[];
  };
  lang: "ar" | "en";
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
  t: any;
}) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const isAR = lang === "ar";
  const title = isAR ? opt.title_ar : opt.title_en;
  const area = isAR ? opt.area_ar : opt.area_en;
  const investment = isAR ? opt.investment_ar : opt.investment_en;
  const period = isAR ? opt.period_ar : opt.period_en;

  // In RTL (Arabic), reverse both arrows and navigation direction
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      isAR
        ? (prev - 1 + opt.images.length) % opt.images.length
        : (prev + 1) % opt.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      isAR
        ? (prev + 1) % opt.images.length
        : (prev - 1 + opt.images.length) % opt.images.length
    );
  };

  // Autoplay: advance slides every 4 seconds
  React.useEffect(() => {
    if (!opt.images || opt.images.length <= 1) return;
    const id = setInterval(() => {
      setCurrentImageIndex((prev) =>
        isAR ? (prev + 1) % opt.images.length : (prev + 1) % opt.images.length
      );
    }, 4000);
    return () => clearInterval(id);
  }, [opt.images, isAR]);

  return (
    <div
      onClick={() => !disabled && onToggle()}
      className={`rounded-3xl overflow-hidden border cursor-pointer transition-all ${
        selected
          ? "border-[#1c9a6f] border-2 bg-[#1c9a6f]/5 shadow-lg shadow-[#1c9a6f]/20"
          : "border-[#1c9a6f]/20 bg-white shadow-sm hover:shadow-md hover:border-[#1c9a6f]/40"
      } ${disabled && !selected ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="relative h-50 bg-cover bg-center group">
        <div
          className="h-full bg-cover bg-center transition-all duration-300"
          style={{ backgroundImage: `url(${opt.images[currentImageIndex]})` }}
        />
        {opt.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#0b3d2e] rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xl"
              type="button"
              aria-label={isAR ? "الصورة السابقة" : "Previous image"}
            >
              {isAR ? "›" : "‹"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#0b3d2e] rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xl"
              type="button"
              aria-label={isAR ? "الصورة التالية" : "Next image"}
            >
              {isAR ? "‹" : "›"}
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {opt.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
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
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0b3d2e]">{title}</h3>
          <div
            className={`inline-flex items-center gap-2 text-sm font-semibold ${
              selected
                ? "text-[#1c9a6f]"
                : disabled
                ? "text-[#0b3d2e]/40"
                : "text-[#0b3d2e]/60"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selected
                  ? "border-[#1c9a6f] bg-[#1c9a6f]"
                  : "border-[#0b3d2e]/30"
              }`}
            >
              {selected && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
            <span>{selected ? t.selected : t.select}</span>
          </div>
        </div>
        <p className="mt-2 text-[#0b3d2e]/80">{area}</p>
        <p className="text-[#0b3d2e]/80">{investment}</p>
        <p className="text-[#0b3d2e]/80">{period}</p>
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
