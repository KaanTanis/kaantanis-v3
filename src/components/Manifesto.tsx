"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".mani-title", {
        type: "lines,words",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => {
          return gsap.from(self.words, {
            yPercent: 115,
            duration: 1.05,
            ease: "expo.out",
            stagger: 0.045,
            scrollTrigger: {
              trigger: ".mani-title",
              start: "top 80%",
              once: true,
            },
          });
        },
      });

      gsap.from(".mani-p", {
        autoAlpha: 0,
        y: 28,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: ".mani-body",
          start: "top 82%",
          once: true,
        },
      });

      return () => split.revert();
    },
    { scope: ref }
  );

  return (
    <section
      id="hakkimda"
      ref={ref}
      className="zone-dark blueprint-grid-bone relative bg-ultra px-5 pb-28 pt-20 text-bone md:px-10 md:pb-44 md:pt-32"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mani-title font-display text-[clamp(2.5rem,7vw,5.8rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
          Simple{" "}
          <em className="font-serifit font-normal italic tracking-normal text-amber">
            outside.
          </em>
          <br />
          Powerful{" "}
          <em className="font-serifit font-normal italic tracking-normal text-amber">
            inside.
          </em>
        </h2>

        <div className="mani-body mt-14 grid gap-10 md:mt-20 md:grid-cols-2 md:gap-14">
          <div className="space-y-7 text-lg leading-relaxed text-bone/85 md:text-xl">
            <p className="mani-p">
              Modern teknolojilerle <span className="mark-amber">uçtan uca</span>{" "}
              ürün geliştiren bir full-stack geliştiriciyim — fikirden yayına,
              tasarımdan sunucuya. Web sitesi ve mobil uygulama; ikisinde de
              aynı özen.
            </p>
            <p className="mani-p">
              Görünüm sade, işleyiş net. Kullanıcı ekranda rahat eder; siz arka
              planda <span className="mark-amber">sürprizlerle uğraşmazsınız</span>.
              Karmaşıklık değil, anlaşılır deneyim.
            </p>
          </div>

          <div>
            <p className="mani-p text-lg leading-relaxed text-bone/85 md:text-xl">
              Fikirden yayına tek elden ilerlerim; ekiple çalışırken iletişim
              kısa ve nettir. Ölçüt hep aynı: işinize değer katan,{" "}
              <span className="mark-amber">uzun ömürlü</span> dijital ürünler.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
