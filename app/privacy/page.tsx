"use client";

import React from "react";

export default function PrivacyPolicyPage() {
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
              <p className="font-semibold leading-tight">
                {isAR ? "جِوار تايم شير" : "Jiwar Timeshare"}
              </p>
              <p className="text-xs text-[#0b3d2e]/70 -mt-0.5">
                {isAR
                  ? "قربٌ يطمئن القلب"
                  : "Peace of heart, steps from the Haram"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-2">
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
              {isAR ? "العودة للصفحة الرئيسية" : "Back to Home"}
            </a>
          </div>
        </div>
      </header>

      <section className="relative py-12 bg-gradient-to-br from-[#1c9a6f]/5 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b3d2e]">
            {isAR ? "سياسة الخصوصية" : "Privacy Policy"}
          </h1>
          <p className="mt-3 text-[#0b3d2e]/70">
            {isAR
              ? "آخر تحديث: ٢٠ أكتوبر ٢٠٢٥"
              : "Last updated: October 20, 2025"}
          </p>
        </div>
      </section>

      <section className="relative py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {isAR ? <ArabicPrivacyContent /> : <EnglishPrivacyContent />}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1c9a6f]/20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Contact Info */}
            <div className={`${isAR ? "text-right" : "text-left"}`}>
              <h3 className="text-lg font-bold text-[#0b3d2e] mb-3">
                {isAR ? "تواصل معنا" : "Contact Us"}
              </h3>
              <div className="space-y-2 text-sm text-[#0b3d2e]/80">
                <p className="flex items-center gap-2">
                  <span className="text-[#1c9a6f]">📞</span>
                  <span>
                    {isAR ? "الهاتف" : "Phone"}:{" "}
                    <a
                      href="tel:+966920000123"
                      className="hover:text-[#1c9a6f]"
                    >
                      +966 920 000 123
                    </a>
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#1c9a6f]">✉️</span>
                  <span>
                    {isAR ? "البريد الإلكتروني" : "Email"}:{" "}
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
                  href="https://twitter.com/jiwarproperties"
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
                  href="https://instagram.com/jiwarproperties"
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
                  href="https://linkedin.com/company/jiwarproperties"
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
                  <p className="font-bold text-[#0b3d2e]">
                    {isAR ? "جِوار تايم شير" : "Jiwar Timeshare"}
                  </p>
                  <p className="text-xs text-[#0b3d2e]/70">
                    {isAR
                      ? "قربٌ يطمئن القلب"
                      : "Peace of heart, steps from the Haram"}
                  </p>
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
                © {new Date().getFullYear()}{" "}
                {isAR
                  ? "جِوار تايم شير — جميع الحقوق محفوظة."
                  : "Jiwar Timeshare — All rights reserved."}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EnglishPrivacyContent() {
  return (
    <div className="space-y-8 text-[#0b3d2e]">
      <section>
        <p className="text-lg leading-relaxed">
          This Privacy Policy describes Our policies and procedures on the
          collection, use and disclosure of Your information when You use the
          Service and tells You about Your privacy rights and how the law
          protects You.
        </p>
        <p className="mt-4 leading-relaxed">
          We use Your Personal data to provide and improve the Service. By using
          the Service, You agree to the collection and use of information in
          accordance with this Privacy Policy.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#1c9a6f] mb-4">
          Interpretation and Definitions
        </h2>
        <h3 className="text-xl font-semibold mb-3">Interpretation</h3>
        <p className="leading-relaxed">
          The words whose initial letters are capitalized have meanings defined
          under the following conditions. The following definitions shall have
          the same meaning regardless of whether they appear in singular or in
          plural.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Definitions</h3>
        <p className="mb-3">For the purposes of this Privacy Policy:</p>
        <ul className="space-y-3 list-none">
          <li className="pl-6 border-l-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">Account</strong> means a unique
            account created for You to access our Service or parts of our
            Service.
          </li>
          <li className="pl-6 border-l-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">Affiliate</strong> means an
            entity that controls, is controlled by, or is under common control
            with a party, where "control" means ownership of 50% or more of the
            shares, equity interest or other securities entitled to vote for
            election of directors or other managing authority.
          </li>
          <li className="pl-6 border-l-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">Company</strong> (referred to as
            either "the Company", "We", "Us" or "Our" in this Agreement) refers
            to Jiwar Properties SA, Makkah, Saudi Arabia.
          </li>
          <li className="pl-6 border-l-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">Cookies</strong> are small files
            that are placed on Your computer, mobile device or any other device
            by a website, containing the details of Your browsing history on
            that website among its many uses.
          </li>
          <li className="pl-6 border-l-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">Country</strong> refers to: Saudi
            Arabia
          </li>
          <li className="pl-6 border-l-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">Device</strong> means any device
            that can access the Service such as a computer, a cell phone or a
            digital tablet.
          </li>
          <li className="pl-6 border-l-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">Personal Data</strong> is any
            information that relates to an identified or identifiable
            individual.
          </li>
          <li className="pl-6 border-l-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">Service</strong> refers to the
            Website.
          </li>
          <li className="pl-6 border-l-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">Website</strong> refers to Jiwar
            Properties, accessible from jiwarproperties.com
          </li>
          <li className="pl-6 border-l-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">You</strong> means the individual
            accessing or using the Service, or the company, or other legal
            entity on behalf of which such individual is accessing or using the
            Service, as applicable.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#1c9a6f] mb-4">
          Collecting and Using Your Personal Data
        </h2>
        <h3 className="text-xl font-semibold mb-3">Types of Data Collected</h3>

        <h4 className="text-lg font-semibold text-[#0b3d2e] mb-2 mt-4">
          Personal Data
        </h4>
        <p className="leading-relaxed mb-3">
          While using Our Service, We may ask You to provide Us with certain
          personally identifiable information that can be used to contact or
          identify You. Personally identifiable information may include, but is
          not limited to:
        </p>
        <ul className="space-y-2 list-disc list-inside">
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Address, State, Province, ZIP/Postal code, City</li>
          <li>Usage Data</li>
        </ul>

        <h4 className="text-lg font-semibold text-[#0b3d2e] mb-2 mt-6">
          Usage Data
        </h4>
        <p className="leading-relaxed">
          Usage Data is collected automatically when using the Service. Usage
          Data may include information such as Your Device's Internet Protocol
          address (e.g. IP address), browser type, browser version, the pages of
          our Service that You visit, the time and date of Your visit, the time
          spent on those pages, unique device identifiers and other diagnostic
          data.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">
          Use of Your Personal Data
        </h3>
        <p className="mb-3">
          The Company may use Personal Data for the following purposes:
        </p>
        <ul className="space-y-3 list-none">
          <li className="pl-6 border-l-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">
              To provide and maintain our Service
            </strong>
            , including to monitor the usage of our Service.
          </li>
          <li className="pl-6 border-l-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">To manage Your Account</strong>:
            to manage Your registration as a user of the Service.
          </li>
          <li className="pl-6 border-l-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">To contact You</strong>: To
            contact You by email, telephone calls, SMS, or other equivalent
            forms of electronic communication.
          </li>
          <li className="pl-6 border-l-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">To provide You</strong> with
            news, special offers, and general information about other goods,
            services and events.
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">
          Retention of Your Personal Data
        </h3>
        <p className="leading-relaxed">
          The Company will retain Your Personal Data only for as long as is
          necessary for the purposes set out in this Privacy Policy. We will
          retain and use Your Personal Data to the extent necessary to comply
          with our legal obligations, resolve disputes, and enforce our legal
          agreements and policies.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">
          Security of Your Personal Data
        </h3>
        <p className="leading-relaxed">
          The security of Your Personal Data is important to Us, but remember
          that no method of transmission over the Internet, or method of
          electronic storage is 100% secure. While We strive to use commercially
          reasonable means to protect Your Personal Data, We cannot guarantee
          its absolute security.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#1c9a6f] mb-4">Contact Us</h2>
        <p className="leading-relaxed mb-3">
          If you have any questions about this Privacy Policy, You can contact
          us:
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-[#1c9a6f]">✉️</span>
            <span>
              By email:{" "}
              <a
                href="mailto:info@jiwarproperties.com"
                className="text-[#1c9a6f] hover:underline"
              >
                info@jiwarproperties.com
              </a>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#1c9a6f]">📞</span>
            <span>
              By phone:{" "}
              <a
                href="tel:+966920000123"
                className="text-[#1c9a6f] hover:underline"
              >
                +966 920 000 123
              </a>
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function ArabicPrivacyContent() {
  return (
    <div className="space-y-8 text-[#0b3d2e] text-right" dir="rtl">
      <section>
        <p className="text-lg leading-loose">
          تصف سياسة الخصوصية هذه سياساتنا وإجراءاتنا المتعلقة بجمع معلوماتك
          واستخدامها والكشف عنها عند استخدامك للخدمة، وتخبرك عن حقوق الخصوصية
          الخاصة بك وكيف يحميك القانون.
        </p>
        <p className="mt-4 leading-loose">
          نحن نستخدم بياناتك الشخصية لتوفير الخدمة وتحسينها. باستخدام الخدمة،
          فإنك توافق على جمع واستخدام المعلومات وفقًا لسياسة الخصوصية هذه.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#1c9a6f] mb-4">
          التفسير والتعاريف
        </h2>
        <h3 className="text-xl font-semibold mb-3">التفسير</h3>
        <p className="leading-loose">
          الكلمات التي تبدأ حروفها بأحرف كبيرة لها معانٍ محددة بموجب الشروط
          التالية. يكون للتعريفات التالية نفس المعنى بغض النظر عما إذا ظهرت
          بصيغة المفرد أو الجمع.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">التعاريف</h3>
        <p className="mb-3">لأغراض سياسة الخصوصية هذه:</p>
        <ul className="space-y-3 list-none">
          <li className="pr-6 border-r-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">الحساب</strong> يعني حسابًا
            فريدًا تم إنشاؤه لك للوصول إلى خدمتنا أو أجزاء من خدمتنا.
          </li>
          <li className="pr-6 border-r-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">الشركة</strong> (يشار إليها بـ
            "الشركة" أو "نحن" أو "لنا" في هذا الاتفاق) تشير إلى شركة جِوار
            للعقارات، مكة المكرمة، المملكة العربية السعودية.
          </li>
          <li className="pr-6 border-r-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">
              ملفات تعريف الارتباط (Cookies)
            </strong>{" "}
            هي ملفات صغيرة يتم وضعها على جهاز الكمبيوتر أو الجهاز المحمول الخاص
            بك من قبل موقع ويب، وتحتوي على تفاصيل سجل التصفح الخاص بك على هذا
            الموقع.
          </li>
          <li className="pr-6 border-r-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">الدولة</strong> تشير إلى: المملكة
            العربية السعودية
          </li>
          <li className="pr-6 border-r-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">الجهاز</strong> يعني أي جهاز
            يمكنه الوصول إلى الخدمة مثل جهاز كمبيوتر أو هاتف محمول أو جهاز لوحي
            رقمي.
          </li>
          <li className="pr-6 border-r-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">البيانات الشخصية</strong> هي أي
            معلومات تتعلق بفرد محدد أو يمكن التعرف عليه.
          </li>
          <li className="pr-6 border-r-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">الخدمة</strong> تشير إلى الموقع
            الإلكتروني.
          </li>
          <li className="pr-6 border-r-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">الموقع الإلكتروني</strong> يشير
            إلى جِوار للعقارات، ويمكن الوصول إليه من jiwarproperties.com
          </li>
          <li className="pr-6 border-r-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">أنت</strong> يعني الفرد الذي يصل
            إلى الخدمة أو يستخدمها، أو الشركة أو الكيان القانوني الآخر الذي يصل
            هذا الفرد إلى الخدمة أو يستخدمها نيابة عنه.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#1c9a6f] mb-4">
          جمع واستخدام بياناتك الشخصية
        </h2>
        <h3 className="text-xl font-semibold mb-3">أنواع البيانات المجمعة</h3>

        <h4 className="text-lg font-semibold text-[#0b3d2e] mb-2 mt-4">
          البيانات الشخصية
        </h4>
        <p className="leading-loose mb-3">
          أثناء استخدام خدمتنا، قد نطلب منك تزويدنا بمعلومات شخصية معينة يمكن
          استخدامها للاتصال بك أو التعرف عليك. قد تتضمن المعلومات الشخصية، على
          سبيل المثال لا الحصر:
        </p>
        <ul className="space-y-2 list-disc list-inside">
          <li>عنوان البريد الإلكتروني</li>
          <li>الاسم الأول والأخير</li>
          <li>رقم الهاتف</li>
          <li>العنوان، الولاية، المقاطعة، الرمز البريدي، المدينة</li>
          <li>بيانات الاستخدام</li>
        </ul>

        <h4 className="text-lg font-semibold text-[#0b3d2e] mb-2 mt-6">
          بيانات الاستخدام
        </h4>
        <p className="leading-loose">
          يتم جمع بيانات الاستخدام تلقائيًا عند استخدام الخدمة. قد تتضمن بيانات
          الاستخدام معلومات مثل عنوان بروتوكول الإنترنت لجهازك (على سبيل المثال
          عنوان IP)، ونوع المتصفح، وإصدار المتصفح، وصفحات خدمتنا التي تزورها،
          ووقت وتاريخ زيارتك، والوقت الذي تقضيه على تلك الصفحات، ومعرّفات
          الأجهزة الفريدة وبيانات التشخيص الأخرى.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">استخدام بياناتك الشخصية</h3>
        <p className="mb-3">
          قد تستخدم الشركة البيانات الشخصية للأغراض التالية:
        </p>
        <ul className="space-y-3 list-none">
          <li className="pr-6 border-r-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">
              لتوفير خدمتنا والحفاظ عليها
            </strong>
            ، بما في ذلك مراقبة استخدام خدمتنا.
          </li>
          <li className="pr-6 border-r-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">لإدارة حسابك</strong>: لإدارة
            تسجيلك كمستخدم للخدمة.
          </li>
          <li className="pr-6 border-r-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">للاتصال بك</strong>: للاتصال بك
            عبر البريد الإلكتروني أو المكالمات الهاتفية أو الرسائل النصية
            القصيرة أو أشكال الاتصال الإلكتروني المماثلة الأخرى.
          </li>
          <li className="pr-6 border-r-2 border-[#1c9a6f]/30">
            <strong className="text-[#1c9a6f]">لتزويدك</strong> بالأخبار والعروض
            الخاصة والمعلومات العامة حول السلع والخدمات والفعاليات الأخرى.
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">
          الاحتفاظ ببياناتك الشخصية
        </h3>
        <p className="leading-loose">
          ستحتفظ الشركة ببياناتك الشخصية فقط طالما كان ذلك ضروريًا للأغراض
          المنصوص عليها في سياسة الخصوصية هذه. سنحتفظ ببياناتك الشخصية ونستخدمها
          بالقدر اللازم للامتثال لالتزاماتنا القانونية، وحل النزاعات، وإنفاذ
          اتفاقياتنا وسياساتنا القانونية.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">أمن بياناتك الشخصية</h3>
        <p className="leading-loose">
          أمن بياناتك الشخصية مهم بالنسبة لنا، ولكن تذكر أنه لا توجد طريقة نقل
          عبر الإنترنت أو طريقة تخزين إلكتروني آمنة بنسبة ١٠٠٪. بينما نسعى
          جاهدين لاستخدام وسائل مقبولة تجاريًا لحماية بياناتك الشخصية، لا يمكننا
          ضمان أمنها المطلق.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#1c9a6f] mb-4">اتصل بنا</h2>
        <p className="leading-loose mb-3">
          إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يمكنك الاتصال بنا:
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-[#1c9a6f]">✉️</span>
            <span>
              عبر البريد الإلكتروني:{" "}
              <a
                href="mailto:info@jiwarproperties.com"
                className="text-[#1c9a6f] hover:underline"
              >
                info@jiwarproperties.com
              </a>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#1c9a6f]">📞</span>
            <span>
              عبر الهاتف:{" "}
              <a
                href="tel:+966920000123"
                className="text-[#1c9a6f] hover:underline"
              >
                ٩٢٠ ٠٠٠ ١٢٣ ٩٦٦+
              </a>
            </span>
          </li>
        </ul>
      </section>
    </div>
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
