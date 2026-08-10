"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { onIntroDone } from "@/lib/intro";

const links = [
  { href: "#hakkimda", label: "Hakkımda" },
  { href: "#stack", label: "Stack" },
  { href: "#surec", label: "Süreç" },
];

export default function Nav() {
  const [ready, setReady] = useState(false);

  useEffect(() => onIntroDone(() => setReady(true)), []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 mix-blend-difference text-white"
      initial={{ y: -36, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav
        aria-label="Ana menü"
        className="flex items-center justify-between px-5 py-5 md:px-10"
      >
        <a
          href="#top"
          className="font-mono text-base font-bold tracking-tighter"
          aria-label="Başa dön"
        >
          K/
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="mono-label uppercase transition-opacity duration-200 hover:opacity-50"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#iletisim"
          data-cursor="YAZ"
          className="mono-label border border-white px-4 py-2 transition-colors duration-200 hover:bg-white hover:text-black"
        >
          [ Teklif Al ]
        </a>
      </nav>
    </motion.header>
  );
}
