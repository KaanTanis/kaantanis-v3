"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.115,
      /* menü tıklamaları hedefe yavaşça süzülür; yol üstündeki
         pinli sahneler (dikiş, & büyümesi, süreç) izlenebilir kalır */
      anchors: {
        duration: 2,
        easing: (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      },
      autoRaf: false,
    });
    // konsoldan erişim (debug + meraklısı için)
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
