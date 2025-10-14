"use client";

import React from "react";

export default function InterestPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-white text-[#0b3d2e]">
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0b3d2e] mb-4">
            الحجز المبكر
          </h1>
          <p className="text-lg text-[#0b3d2e]/80">
            احجز مكانك الآن في أبراج جِوار واستثمر في أجمل اللحظات الروحانية
          </p>
        </div>

        <div className="bg-[#f9f9f9] rounded-3xl p-8 border border-[#1c9a6f]/20">
          <h2 className="text-2xl font-bold text-[#0b3d2e] mb-6 text-center">
            نموذج التعبير عن الاهتمام
          </h2>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#0b3d2e] mb-2">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-[#1c9a6f]/20 rounded-lg focus:ring-2 focus:ring-[#1c9a6f] focus:border-transparent"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0b3d2e] mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-[#1c9a6f]/20 rounded-lg focus:ring-2 focus:ring-[#1c9a6f] focus:border-transparent"
                  placeholder="+966 50 123 4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0b3d2e] mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-[#1c9a6f]/20 rounded-lg focus:ring-2 focus:ring-[#1c9a6f] focus:border-transparent"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0b3d2e] mb-2">
                البرج المفضل
              </label>
              <select className="w-full px-4 py-3 border border-[#1c9a6f]/20 rounded-lg focus:ring-2 focus:ring-[#1c9a6f] focus:border-transparent">
                <option value="">اختر البرج</option>
                <option value="jiwar1">برج جِوار 1 (على الصحن)</option>
                <option value="jiwar2">برج جِوار 2 (10 دقائق من الحرم)</option>
                <option value="both">كلا البرجين</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0b3d2e] mb-2">
                الميزانية المتوقعة (ريال سعودي)
              </label>
              <select className="w-full px-4 py-3 border border-[#1c9a6f]/20 rounded-lg focus:ring-2 focus:ring-[#1c9a6f] focus:border-transparent">
                <option value="">اختر الميزانية</option>
                <option value="25000-50000">25,000 - 50,000 ريال</option>
                <option value="50000-100000">50,000 - 100,000 ريال</option>
                <option value="100000-200000">100,000 - 200,000 ريال</option>
                <option value="200000+">أكثر من 200,000 ريال</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0b3d2e] mb-2">
                ملاحظات إضافية
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-[#1c9a6f]/20 rounded-lg focus:ring-2 focus:ring-[#1c9a6f] focus:border-transparent"
                placeholder="أي أسئلة أو ملاحظات إضافية..."
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-[#1c9a6f] text-white px-8 py-4 font-bold hover:brightness-110 transition shadow-lg shadow-[#1c9a6f]/20"
              >
                إرسال طلب الحجز المبكر
              </button>
            </div>
          </form>

          <div className="mt-8 p-6 bg-[#1c9a6f]/5 rounded-2xl border border-[#1c9a6f]/20">
            <h3 className="font-semibold text-[#0b3d2e] mb-3">معلومات مهمة:</h3>
            <ul className="space-y-2 text-sm text-[#0b3d2e]/80">
              <li>• سيتم التواصل معك خلال 24 ساعة لتأكيد التفاصيل</li>
              <li>• الأسعار المذكورة قابلة للتغيير حسب التوفر والموقع</li>
              <li>• يمكنك إلغاء الحجز المبكر في أي وقت قبل التوقيع النهائي</li>
              <li>• جميع العقود تخضع للشروط والأحكام المعتمدة</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

function LogoJiwar({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="شعار جِوار">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#1c9a6f" />
          <stop offset="100%" stopColor="#0b3d2e" />
        </radialGradient>
      </defs>
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
