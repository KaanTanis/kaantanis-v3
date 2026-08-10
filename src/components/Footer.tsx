"use client";

import { useEffect } from "react";

const LINKS = [
  { label: "hakkımda", href: "#hakkimda" },
  { label: "stack", href: "#stack" },
  { label: "süreç", href: "#surec" },
  { label: "iletişim", href: "#iletisim" },
];

const SOCIAL = [
  { label: "github", href: "https://github.com/KaanTanis" },
  { label: "whatsapp", href: "https://wa.me/905442373323" },
  { label: "e-posta", href: "mailto:kt@kaantanis.com" },
];

export default function Footer() {
  /* kaynak koda bakanlara selam */
  useEffect(() => {
    console.log(
      "%cK/ — kaantanis.com v3",
      "color:#ffb300;font-family:monospace;font-size:14px;font-weight:bold"
    );
    console.log(
      "%cKaynak koda bakıyorsun demek. Sevdim seni.\nBir projen varsa: kt@kaantanis.com",
      "color:#8a8a92;font-family:monospace"
    );
  }, []);

  return (
    <footer className="zone-dark diag-top relative bg-carbon px-5 pb-8 pt-24 text-bone md:px-10 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-mono text-3xl font-bold tracking-tighter">K/</p>
            <p className="mono-label mt-3 text-bone/50">
              Kaan Tanış — Designer &amp; Developer
            </p>
          </div>

          <nav aria-label="Alt menü" className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="mono-label w-fit text-bone/60 transition-colors hover:text-bone"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 md:items-end">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                data-cursor="AÇ"
                className="mono-label w-fit text-amber/80 transition-colors hover:text-amber"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>

        {/* kapanış */}
        <div className="py-14 text-center md:py-20">
          <p className="font-serifit text-[clamp(1.25rem,2.6vw,1.9rem)] italic text-bone/75">
            designed <span className="text-amber">&amp;</span> developed by{" "}
            <span className="text-amber">kaantanis</span>
          </p>
        </div>

        <div className="mono-label border-t border-bone/10 pt-6 text-center text-bone/40 sm:text-left">
          <span>© 2026 Kaan Tanış</span>
        </div>
      </div>
    </footer>
  );
}
