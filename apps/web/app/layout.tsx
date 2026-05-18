import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RecruitExe",
  description: "RecruitExe",
  generator: "RecruitExe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/vector.svg" type="image/svg+xml" />
        <meta
          name="google-site-verification"
          content="bqce1aPhxB1H1kmBzQoL673dL2axAJNiAxb4JYP6ytw"
        />

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PKNTS6FK');`,
          }}
        />

        {/* Google Analytics */}
        <script
          defer
          src="https://www.googletagmanager.com/gtag/js?id=G-WKLKKRECNK"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WKLKKRECNK');
            `,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PKNTS6FK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {children}
      </body>
    </html>
  );
}
