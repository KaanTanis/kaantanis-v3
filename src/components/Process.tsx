"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Stage = {
  n: string;
  title: string;
  desc: string;
  panel: string;
  num: string;
  body: string;
};

const STAGES: Stage[] = [
  {
    n: "01",
    title: "Strateji & Yol Haritası",
    desc: "Rakip analizi, pazar araştırması, hedef kitle. Projenin kapsamı ve stratejik yol haritası bu katmanda netleşir — tahmin değil, plan.",
    panel: "bg-bone-dim text-ink",
    num: "stroke-ink opacity-25",
    body: "text-ink/70",
  },
  {
    n: "02",
    title: "Taslak & Prototip",
    desc: "Wireframe'den etkileşimli prototipe. Görsel dil, design system ve onay turları.",
    panel: "bg-carbon text-bone dot-grid",
    num: "stroke-amber opacity-40",
    body: "text-bone/70",
  },
  {
    n: "03",
    title: "Geliştirme & Teslim",
    desc: "Kod, test, canlıya alma. Sonrası da bende: izleme, bakım, destek.",
    panel: "bg-ultra text-bone",
    num: "stroke-bone opacity-30",
    body: "text-bone/80",
  },
];

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* masaüstü: pinli yatay şerit */
      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current!;
        const distance = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: () => "+=" + distance(),
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (barRef.current) {
                barRef.current.style.transform = `scaleX(${self.progress})`;
              }
              if (counterRef.current) {
                const i = Math.min(
                  2,
                  Math.floor(self.progress * STAGES.length)
                );
                counterRef.current.textContent = `0${i + 1} / 03`;
              }
            },
          },
        });
      });

      /* mobil: yapışkan kart destesi — sonraki panel üstüne kayarken
         alttaki küçülüp kararır, numara hafif paralaks yapar */
      mm.add("(max-width: 1023px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(
          ".proc-panel",
          ref.current
        );

        panels.forEach((panel, i) => {
          const inner = panel.querySelector(".proc-inner");
          if (inner) {
            gsap.from(inner, {
              autoAlpha: 0,
              y: 44,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: panel,
                start: "top 72%",
                once: true,
              },
            });
          }

          const num = panel.querySelector(".proc-num");
          if (num) {
            gsap.fromTo(
              num,
              { yPercent: 16 },
              {
                yPercent: -8,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  start: "top bottom",
                  end: "top top",
                  scrub: true,
                },
              }
            );
          }

          if (i < panels.length - 1) {
            gsap.to(panel, {
              scale: 0.92,
              autoAlpha: 0.45,
              ease: "none",
              scrollTrigger: {
                trigger: panels[i + 1],
                start: "top bottom",
                end: "top top",
                scrub: true,
              },
            });
          }
        });
      });
    },
    { scope: ref }
  );

  return (
    <section id="surec" ref={ref} className="relative bg-bone text-ink">
      {/* başlık */}
      <div className="relative px-5 pb-16 pt-28 md:px-10 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-[clamp(2.5rem,7vw,5.8rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
            Üç katman,{" "}
            <em className="font-serifit font-normal italic tracking-normal text-ultra">
              tek akış.
            </em>
          </h2>
        </div>
      </div>

      {/* masaüstü: yatay pinlenen şerit · mobil: yapışkan kart destesi */}
      <div ref={pinRef} className="relative lg:overflow-hidden">
        {/* ilerleme çubuğu — difference sayesinde her panel zemininde okunur */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden mix-blend-difference lg:block">
          <div className="h-0.5 w-full bg-white/25">
            <div
              ref={barRef}
              className="h-full w-full origin-left scale-x-0 bg-white"
            />
          </div>
          <span
            ref={counterRef}
            className="mono-label absolute right-10 top-4 text-white"
          >
            01 / 03
          </span>
        </div>

        <div
          ref={trackRef}
          className="flex flex-col lg:h-svh lg:w-max lg:flex-row"
        >
          {STAGES.map((s) => (
            <article
              key={s.n}
              className={`proc-panel sticky top-0 flex min-h-svh w-full flex-col justify-center overflow-hidden px-6 py-20 lg:relative lg:top-auto lg:h-full lg:min-h-0 lg:w-[74vw] lg:px-[6vw] ${s.panel}`}
            >
              <span
                aria-hidden
                className={`proc-num pointer-events-none absolute right-[5vw] top-[10vh] z-0 font-display text-[34vw] font-extrabold leading-none lg:text-[17vw] ${s.num}`}
              >
                {s.n}
              </span>

              <div className="proc-inner relative z-10 max-w-2xl">
                <h3 className="font-display text-[clamp(2.2rem,5vw,4.8rem)] font-extrabold leading-[1.02] tracking-[-0.02em]">
                  {s.title}
                </h3>
                <p
                  className={`mt-7 max-w-[48ch] text-base leading-relaxed md:text-lg ${s.body}`}
                >
                  {s.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
