"use client";

import React from "react";

export default function InterestPage() {
  const DEBUG =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debug") === "1";

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
  }, []);

  type Option = {
    id: string;
    tower: "Jiwar 1" | "Jiwar 2";
    title: string;
    area: string;
    investment: string;
    period: string;
    img: string;
  };
  const jiwar1: Option[] = [
    {
      id: "j1-studio-city",
      tower: "Jiwar 1",
      title: "استوديو — إطلالة مدينة مكة",
      area: "المساحة: 46 م²",
      investment: "الاستثمار: يبدأ من 50,000 ريال",
      period: "المدة: 10 سنوات × 7 أيام سنويًا",
      img: "https://images.unsplash.com/photo-1505692794403-34d4982dc1ae?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "j1-1br-haram",
      tower: "Jiwar 1",
      title: "شقة غرفة واحدة — إطلالة الحرم",
      area: "المساحة: 113 م²",
      investment: "الاستثمار: يبدأ من 117,000 ريال",
      period: "المدة: 10 سنوات × 7 أيام سنويًا",
      img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "j1-2br-kaba",
      tower: "Jiwar 1",
      title: "شقة غرفتين — إطلالة الكعبة",
      area: "المساحة: 171 م²",
      investment: "الاستثمار: يبدأ من 170,000 ريال",
      period: "المدة: 10 سنوات × 7 أيام سنويًا",
      img: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    },
  ];
  const jiwar2: Option[] = [
    {
      id: "j2-double",
      tower: "Jiwar 2",
      title: "غرفة مزدوجة",
      area: "المساحة: 26 م²",
      investment: "الاستثمار: يبدأ من 25,000 ريال",
      period: "المدة: 20 سنة × 7 أيام سنويًا",
      img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "j2-three-twins",
      tower: "Jiwar 2",
      title: "غرفة بثلاثة أسِرّة منفصلة",
      area: "المساحة: 26 م²",
      investment: "الاستثمار: 30,000 ريال",
      period: "المدة: 20 سنة × 7 أيام سنويًا",
      img: "https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "j2-family-studio",
      tower: "Jiwar 2",
      title: "استوديو عائلي — غرفتان (5 أسِرّة)",
      area: "المساحة: 48 م²",
      investment: "الاستثمار: 46,000 ريال",
      period: "المدة: 20 سنة × 7 أيام سنويًا",
      img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200&auto=format&fit=crop",
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
        setError("يمكنك اختيار حتى 3 خيارات فقط.");
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
      "Saudi Arabia",
      "United Arab Emirates",
      "Qatar",
      "Kuwait",
      "Bahrain",
      "Oman",
      "Jordan",
      "Egypt",
      "Morocco",
      "Tunisia",
      "Algeria",
      "Lebanon",
      "Turkey",
      "Pakistan",
      "India",
      "Indonesia",
      "Malaysia",
      "Bangladesh",
      "Philippines",
      "United Kingdom",
      "United States",
      "France",
      "Germany",
      "Spain",
      "Italy",
      "Canada",
      "Australia",
    ],
    []
  );

  const sendRecord = (payload: any) => {
    try {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      const ok =
        (navigator as any).sendBeacon &&
        (navigator as any).sendBeacon("/api/track", blob);
      if (!ok && DEBUG) {
        const a = document.getElementById("rooms-debug-download");
        if (a) {
          const url = URL.createObjectURL(blob);
          a.setAttribute("href", url);
          a.setAttribute("download", `rooms-${payload.guid}.json`);
        }
      }
    } catch {}
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(null);
    if (!form.name.trim() || !form.email.trim()) {
      setSent({ ok: false, message: "الاسم والبريد الإلكتروني مطلوبان." });
      return;
    }
    const guid = getOrCreateGUID();
    const sessionId = getOrCreateSessionId();
    const secondsOnPage = Math.round(
      (Date.now() - startedAtRef.current) / 1000
    );
    const payload = {
      type: "rooms_submit",
      guid,
      sessionId,
      ts: new Date().toISOString(),
      ip: ipInfo.ip,
      country: ipInfo.country,
      secondsOnPage,
      selectedOptions: selected,
      form,
      submitted: true,
      path:
        typeof location !== "undefined"
          ? location.pathname + location.search
          : "",
      ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
    };
    sendRecord(payload);
    setSubmitted(true);
    setSent({ ok: true, message: "شكرًا لك! تم تسجيل اهتمامك." });
  };

  React.useEffect(() => {
    const guid = getOrCreateGUID();
    const sessionId = getOrCreateSessionId();
    const onBeforeUnload = () => {
      if (submitted) return;
      const secondsOnPage = Math.round(
        (Date.now() - startedAtRef.current) / 1000
      );
      const payload = {
        type: "rooms_visit",
        guid,
        sessionId,
        ts: new Date().toISOString(),
        ip: ipInfo.ip,
        country: ipInfo.country,
        secondsOnPage,
        selectedOptions: selected,
        form,
        submitted: false,
        path:
          typeof location !== "undefined"
            ? location.pathname + location.search
            : "",
        ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
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
  ]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-white text-[#0b3d2e] selection:bg-[#1c9a6f]/20"
    >
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-[#1c9a6f]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoJiwar className="w-9 h-9" />
            <div>
              <p className="font-semibold leading-tight">جِوار تايم شير</p>
              <p className="text-xs text-[#0b3d2e]/70 -mt-0.5">
                قربٌ يطمئن القلب
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-[#1c9a6f]/40 bg-[#1c9a6f]/10 px-4 py-2 text-sm font-semibold text-[#0b3d2e] hover:bg-[#1c9a6f]/20 transition shadow-sm"
            >
              العودة للصفحة الرئيسية
            </a>
          </div>
        </div>
      </header>

      <section className="relative bg-white border-b border-[#1c9a6f]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            خيارات الوحدات — جِوار 1 و جِوار 2
          </h1>
          <p className="mt-2 text-[#0b3d2e]/80">
            اختر حتى ثلاث وحدات تهمّك وأرسل بياناتك ليتواصل معك فريق جِوار.
          </p>
        </div>
      </section>

      <section className="relative py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-extrabold">جِوار 1</h2>
              <div className="mt-4 space-y-4">
                {jiwar1.map((opt) => (
                  <RoomCard
                    key={opt.id}
                    opt={opt}
                    selected={selected.includes(opt.id)}
                    disabled={
                      !selected.includes(opt.id) && selected.length >= 3
                    }
                    onToggle={() => toggleSelect(opt.id)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-extrabold">جِوار 2</h2>
              <div className="mt-4 space-y-4">
                {jiwar2.map((opt) => (
                  <RoomCard
                    key={opt.id}
                    opt={opt}
                    selected={selected.includes(opt.id)}
                    disabled={
                      !selected.includes(opt.id) && selected.length >= 3
                    }
                    onToggle={() => toggleSelect(opt.id)}
                  />
                ))}
              </div>
            </div>
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <p className="mt-2 text-xs text-[#0b3d2e]/60">
            يمكنك اختيار حتى 3 خيارات فقط.
          </p>
        </div>
      </section>

      <section className="relative py-8 bg-[#f9f9f9] border-t border-[#1c9a6f]/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold">سجّل اهتمامك</h3>
          <form className="mt-4 space-y-4" onSubmit={onSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  الاسم *
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
                  البريد الإلكتروني *
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
                  الدولة
                </label>
                <input
                  list="country-list"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  placeholder="ابدأ بالكتابة..."
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
                  الهاتف
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-[#1c9a6f]/30 p-2 outline-none focus:ring-2 focus:ring-[#1c9a6f]/40"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">
                  ملاحظات
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
                المحدّد الآن: <b>{selected.length}</b> / 3
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-[#1c9a6f] text-white px-6 py-2 font-bold hover:brightness-110 transition shadow-lg shadow-[#1c9a6f]/20"
              >
                إرسال
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
    </div>
  );
}

function RoomCard({
  opt,
  selected,
  disabled,
  onToggle,
}: {
  opt: {
    id: string;
    tower: string;
    title: string;
    area: string;
    investment: string;
    period: string;
    img: string;
  };
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-3xl overflow-hidden border ${
        selected ? "border-[#1c9a6f]" : "border-[#1c9a6f]/20"
      } bg-white shadow-sm`}
    >
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${opt.img})` }}
      />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0b3d2e]">{opt.title}</h3>
          <label
            className={`inline-flex items-center gap-2 text-sm ${
              disabled && !selected ? "opacity-50" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={selected}
              disabled={disabled && !selected}
              onChange={onToggle}
              className="accent-[#1c9a6f] w-4 h-4"
            />
            <span>{selected ? "محدد" : "تحديد"}</span>
          </label>
        </div>
        <p className="mt-2 text-[#0b3d2e]/80">{opt.area}</p>
        <p className="text-[#0b3d2e]/80">{opt.investment}</p>
        <p className="text-[#0b3d2e]/80">{opt.period}</p>
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
