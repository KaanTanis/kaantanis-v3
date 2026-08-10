"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

type Cat = {
  id: string;
  label: string;
  path: string;
  items: string[];
};

const CATS: Cat[] = [
  {
    id: "frontend",
    label: "frontend",
    path: "~/stack/frontend",
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "Astro",
      "Vue",
      "Svelte",
      "Alpine.js",
      "Tailwind CSS",
      "Figma",
    ],
  },
  {
    id: "backend",
    label: "backend",
    path: "~/stack/backend",
    items: [
      "Laravel",
      "Livewire",
      "Node.js",
      "PHP",
      "Go",
      "REST API",
      "WebSocket",
    ],
  },
  {
    id: "veritabani",
    label: "veritabanı",
    path: "~/stack/veritabani",
    items: ["MySQL", "PostgreSQL", "SQLite", "Redis", "Elasticsearch"],
  },
  {
    id: "devops",
    label: "devops",
    path: "~/stack/devops",
    items: ["Linux", "Nginx", "Docker", "Supervisor", "Bash", "Git", "CI/CD"],
  },
  {
    id: "ops",
    label: "operasyon",
    path: "~/stack/operasyon",
    items: [
      "Sunucu yönetimi",
      "Deployment süreçleri",
      "Performans optimizasyonu",
      "Socket sistemleri",
      "DDoS koruması",
      "Rate limiting",
    ],
  },
];

export default function Stack() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<Cat | null>(null);
  const [cmd, setCmd] = useState("");
  const [listing, setListing] = useState<Cat | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const run = useCallback(
    (cat: Cat) => {
      clearTimers();
      setActive(cat);
      setListing(null);

      const full = `ls ${cat.path}`;

      setCmd("");
      for (let i = 1; i <= full.length; i++) {
        timers.current.push(
          setTimeout(() => setCmd(full.slice(0, i)), 16 * i)
        );
      }
      timers.current.push(
        setTimeout(() => setListing(cat), 16 * full.length + 180)
      );
    },
    [clearTimers]
  );

  useEffect(() => clearTimers, [clearTimers]);

  /* görünür olunca ilk komut kendiliğinden çalışır */
  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: "top 62%",
        once: true,
        onEnter: () => run(CATS[0]),
      });
      return () => st.kill();
    },
    { scope: ref, dependencies: [run] }
  );

  return (
    <section
      id="stack"
      ref={ref}
      className="zone-dark diag-top relative bg-carbon px-5 py-28 text-bone md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-[clamp(2.5rem,7vw,5.8rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
          Ne{" "}
          <em className="font-serifit font-normal italic tracking-normal text-amber">
            kullanıyorum.
          </em>
        </h2>

        {/* kategori komutları */}
        <div
          role="tablist"
          aria-label="Stack kategorileri"
          className="mt-10 flex flex-wrap gap-2.5"
        >
          {CATS.map((c) => {
            const on = active?.id === c.id;
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={on}
                data-cursor="ÇALIŞTIR"
                onClick={() => run(c)}
                className={`mono-label border px-4 py-2.5 transition-colors duration-200 ${
                  on
                    ? "border-amber bg-amber text-carbon"
                    : "border-bone/25 text-bone/70 hover:border-bone/60 hover:text-bone"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* terminal */}
        <div className="mt-6 border border-bone/15 bg-carbon-2">
          {/* başlık çubuğu */}
          <div className="flex items-center justify-between border-b border-bone/15 px-4 py-3">
            <div className="flex gap-1.5" aria-hidden>
              <span className="h-2 w-2 bg-bone/25" />
              <span className="h-2 w-2 bg-amber" />
              <span className="h-2 w-2 bg-ultra" />
            </div>
            <span className="mono-label text-bone/50">
              kaan@ktv3 — ~/stack
            </span>
            <span className="mono-label text-bone/25" aria-hidden>
              bash
            </span>
          </div>

          {/* gövde */}
          <div className="min-h-[320px] p-5 font-mono text-sm md:p-7">
            <p className="text-bone/85">
              <span className="text-amber">$</span>{" "}
              <span className={listing ? "" : "caret"}>{cmd}</span>
            </p>

            <AnimatePresence mode="wait">
              {listing && (
                <motion.div
                  key={listing.id}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{
                    show: { transition: { staggerChildren: 0.035 } },
                    hidden: {},
                  }}
                  className="mt-5"
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 md:grid-cols-3">
                    {listing.items.map((item, i) => (
                      <motion.p
                        key={item}
                        variants={{
                          hidden: { opacity: 0, y: 8 },
                          show: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="text-bone/85"
                      >
                        <span className="mr-2 text-amber/60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item}
                      </motion.p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
