"use client";

import Script from "next/script";

// Le Measurement ID GA4 est public (exposé côté client via NEXT_PUBLIC_*).
// On garde l'override par variable d'env, avec une valeur par défaut pour
// que le tag fonctionne même si l'env n'est pas configuré sur l'hébergeur.
const DEFAULT_GA_ID = "G-M5GRTWK53E";

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || DEFAULT_GA_ID;

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
