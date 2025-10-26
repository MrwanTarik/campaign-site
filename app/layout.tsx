import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "جِوار تايم شير - قربٌ يطمئن القلب",
  description:
    "استثمر في أجمل اللحظات الروحانية، حيث الإطلالة على صحن الكعبة أو دقائق قليلة فقط بالحافلة الترددية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          src="https://chat.javna.com/chat-widget/EEv2Kj3NZ4NK071815007614Y4JGXzQb.js"
          defer
        ></script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
