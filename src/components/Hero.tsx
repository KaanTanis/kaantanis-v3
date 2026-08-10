"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { introAlreadySeen, markIntroDone, rememberIntro } from "@/lib/intro";
import { AMP, AMP_W, AMP_H } from "@/lib/amp-glyph";

const SEAM_MIN = 14;
const SEAM_MAX = 86;
const SEAM_REST = 56;

/* Derin zoom hedefi: & glifinin alt kasesinin kalın sol gövdesi.
   fx/fy glif bbox'ı içinde kesir; size = bitiş penceresinin glif
   genişliğine oranı (ne kadar küçükse o kadar derine dalınır). */
const TARGET = { fx: 0.0635, fy: 0.731, size: 0.02 };

/* Büyüme sırasında harfin kazandığı ek kalınlık (glif birimi):
   aynı renkli stroke konturu şişirir, harf git gide koyulaşıp dolgunlaşır */
const AMP_BOLD = 80;

/* Satır içi &: metin glifiyle birebir aynı path — font yüklenme
   farkları olmadan her ölçekte keskin, katman rengini class'tan alır. */
function AmpGlyph({ dev }: { dev: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox={`${AMP.bbox.x1} ${AMP.bbox.y1} ${AMP_W} ${AMP_H}`}
      className={`hero-amp inline-block ${dev ? "fill-amber" : "fill-ultra"}`}
      style={{
        height: `${AMP_H / AMP.upem}em`,
        width: `${AMP_W / AMP.upem}em`,
        verticalAlign: `${-AMP.bbox.y2 / AMP.upem}em`,
      }}
    >
      <path d={AMP.path} />
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* İki katmanda da aynı geometriyle duran içerik. H1 metni birebir   */
/* aynı olmak zorunda — dikiş üzerinden geçerken ses değiştirir.     */
/* ---------------------------------------------------------------- */
function HeroInner({ variant }: { variant: "design" | "dev" }) {
  const dev = variant === "dev";

  return (
    <div className="hero-par relative flex h-full flex-col justify-between px-5 pb-7 pt-24 md:px-10">
      <div aria-hidden className="h-4" />

      {/* merkez */}
      <div className="flex flex-col items-center text-center">
        <h1
          lang="en"
          className="relative font-display text-[clamp(3rem,12vw,11.5rem)] font-extrabold leading-[0.88] tracking-[-0.035em]"
        >
          <span className="block overflow-hidden pb-[0.05em]">
            <span className={`hero-l block ${dev ? "stroke-amber" : "text-ink"}`}>
              SOFTWARE
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.05em]">
            <span className={`hero-l block ${dev ? "stroke-amber" : "text-ink"}`}>
              DEVELOPER <AmpGlyph dev={dev} />
            </span>
          </span>
          <span className="sr-only">&amp; Designer</span>
        </h1>
      </div>

      {/* alt satır */}
      <div
        className={`mono-label flex items-center justify-between ${
          dev ? "text-amber/80" : "text-ink/60"
        }`}
      >
        <a href="#hakkimda" className="hero-sub transition-opacity hover:opacity-50">
          [ kaydır ↓ ]
        </a>
        <a
          href="mailto:kt@kaantanis.com"
          className="hero-sub transition-opacity hover:opacity-50"
        >
          kt@kaantanis.com
        </a>
      </div>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const devLayerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ampSvgRef = useRef<SVGSVGElement>(null);
  const designerRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const hero = heroRef.current!;
      const overlay = overlayRef.current!;
      const seenBefore = introAlreadySeen();

      /* ---------- seam motoru ---------- */
      const proxy = { v: 100 };
      const apply = () => {
        hero.style.setProperty("--seam", proxy.v + "%");
        handleRef.current?.setAttribute(
          "aria-valuenow",
          String(Math.round(proxy.v))
        );
      };
      const seamTo = gsap.quickTo(proxy, "v", {
        duration: 1.05,
        ease: "power3.out",
        onUpdate: apply,
      });
      const clamp = gsap.utils.clamp(SEAM_MIN, SEAM_MAX);

      /* ---------- dikiş çizgisinin eğimi ---------- */
      const setSkew = () => {
        if (!lineRef.current) return;
        const tiltPx = window.innerWidth * 0.04;
        const deg =
          (Math.atan((2 * tiltPx) / hero.clientHeight) * 180) / Math.PI;
        lineRef.current.style.transform = `translateX(-50%) skewX(${-deg}deg)`;
      };
      setSkew();
      window.addEventListener("resize", setSkew);

      /* ---------- boşta salınım (mobilde ana hareket kaynağı) ---------- */
      let drift: gsap.core.Timeline | null = null;
      const startDrift = () => {
        drift = gsap
          .timeline({ repeat: -1, yoyo: true })
          .to(proxy, {
            v: 42,
            duration: 4.5,
            ease: "sine.inOut",
            onUpdate: apply,
          })
          .to(proxy, {
            v: 64,
            duration: 4.5,
            ease: "sine.inOut",
            onUpdate: apply,
          });
      };
      const stopDrift = () => {
        drift?.kill();
        drift = null;
      };
      const idle = gsap.delayedCall(2, startDrift).pause();

      const wake = () => {
        stopDrift();
        idle.restart(true);
      };

      /* ---------- handle: sürükleme + klavye ---------- */
      const handle = handleRef.current!;
      let dragging = false;
      const onDown = (e: PointerEvent) => {
        dragging = true;
        try {
          handle.setPointerCapture(e.pointerId);
        } catch {
          /* sentetik pointer olayları capture desteklemeyebilir */
        }
        stopDrift();
      };
      const onDrag = (e: PointerEvent) => {
        if (!dragging) return;
        seamTo(clamp((e.clientX / window.innerWidth) * 100));
      };
      const onUp = () => {
        dragging = false;
        wake();
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        wake();
        seamTo(clamp(proxy.v + (e.key === "ArrowLeft" ? -5 : 5)));
      };
      handle.addEventListener("pointerdown", onDown);
      handle.addEventListener("pointermove", onDrag);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
      handle.addEventListener("keydown", onKey);

      /* ---------- giriş durumları ---------- */
      gsap.set(".hero-l", { yPercent: 112 });
      gsap.set(".hero-sub", { autoAlpha: 0, y: 12 });
      gsap.set([lineRef.current, handleRef.current], { autoAlpha: 0 });
      gsap.set([ampSvgRef.current, designerRef.current], { autoAlpha: 0 });

      const introTl = gsap.timeline({ paused: true });
      introTl
        .to(proxy, {
          v: SEAM_REST,
          duration: 1.5,
          ease: "expo.inOut",
          onUpdate: apply,
        })
        .to(
          ".hero-l",
          { yPercent: 0, duration: 1.15, ease: "expo.out", stagger: 0.09 },
          "-=0.9"
        )
        .to(
          [lineRef.current, handleRef.current],
          { autoAlpha: 1, duration: 0.5 },
          "-=0.8"
        )
        .to(
          ".hero-sub",
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.05 },
          "-=0.7"
        )
        .add(() => idle.restart(true));

      /* ---------- preloader ---------- */
      const finish = () => {
        overlay.style.display = "none";
        document.documentElement.style.overflow = "";
        /* bayrak ancak intro tamamlanınca yazılır; StrictMode'un çift
           effect çalıştırması preloader'ı yanlışlıkla atlatamaz */
        rememberIntro();
        markIntroDone();
        introTl.play();
      };

      if (seenBefore) {
        overlay.style.display = "none";
        markIntroDone();
        introTl.progress(0).play();
      } else {
        document.documentElement.style.overflow = "hidden";

        const cmdEl = overlay.querySelector<HTMLElement>(".pre-cmd")!;
        const cmd = "kaan run --identity";
        const typeProxy = { i: 0 };

        gsap
          .timeline({ delay: 0.25 })
          .to(typeProxy, {
            i: cmd.length,
            duration: 0.8,
            ease: "none",
            onUpdate: () => {
              cmdEl.textContent = cmd.slice(0, Math.round(typeProxy.i));
            },
          })
          .to(
            overlay.querySelectorAll(".pre-line"),
            { autoAlpha: 1, duration: 0.01, stagger: 0.16 },
            "+=0.15"
          )
          .to(overlay, {
            "--wipe": "124%",
            duration: 1,
            ease: "expo.inOut",
            delay: 0.4,
            onComplete: finish,
          } as gsap.TweenVars);
      }

      /* ---------- pointer etkileşimi ---------- */
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        seamTo(clamp((e.clientX / window.innerWidth) * 100));
        wake();
      };
      hero.addEventListener("pointermove", onMove, { passive: true });

      /* ---------- çıkış: & harfinin kendisi büyür ----------
         Tam ekran SVG'nin viewBox'ı, satır içindeki & yuvasından glifin
         kalın gövdesinin içine tween'lenir. Vektör her karede yeniden
         çizildiği için harf her ölçekte keskin kalır; mürekkep ekranı
         kapladığında beyaz DESIGNER belirir. Metinler kaymaz. */
      const cam = { p: 0 };
      const view = {
        x0: 0,
        y0: 0,
        vw: 1000,
        vh: 1000,
        tx: 0,
        ty: 0,
        fxv: 0.5,
        fyv: 0.5,
        endW: AMP_W * TARGET.size,
      };
      const ampPath = ampSvgRef.current?.querySelector("path") ?? null;

      const applyCam = () => {
        const svgEl = ampSvgRef.current;
        if (!svgEl) return;
        /* geometrik interpolasyon: 800x'lik zoom boyunca sabit hız hissi */
        const ratio = view.endW / view.vw;
        const w = view.vw * Math.pow(ratio, cam.p);
        const h = w * (view.vh / view.vw);
        const x = view.tx - view.fxv * w;
        const y = view.ty - view.fyv * h;
        svgEl.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
        /* harf büyürken gerçekten kalınlaşır: aynı renk stroke, konturu
           her iki yöne şişirir — büyümenin ilk %60'ında tam kalınlığa ulaşır */
        if (ampPath) {
          const bold = AMP_BOLD * Math.min(1, cam.p * 1.6);
          ampPath.setAttribute("stroke-width", String(bold));
        }
      };

      const measure = () => {
        const svgEl = ampSvgRef.current;
        const inline = hero.querySelector<SVGSVGElement>("svg.hero-amp");
        if (!svgEl || !inline) return;
        const hr = hero.getBoundingClientRect();
        const r = inline.getBoundingClientRect();
        /* intro sırasında satırlar maske içinde kaydırılmış olabilir
           (yPercent); yuvanın yerleşik konumu için maske-içi fark düşülür */
        const innerEl = inline.closest<HTMLElement>(".hero-l");
        const maskEl = innerEl?.parentElement;
        let dx = 0;
        let dy = 0;
        if (innerEl && maskEl) {
          const ir = innerEl.getBoundingClientRect();
          const mr = maskEl.getBoundingClientRect();
          dx = ir.left - mr.left;
          dy = ir.top - mr.top;
        }
        const left = r.left - hr.left - dx;
        const top = r.top - hr.top - dy;
        const s = r.width / AMP_W; /* px / glif birimi */
        view.vw = hr.width / s;
        view.vh = hr.height / s;
        view.x0 = AMP.bbox.x1 - left / s;
        view.y0 = AMP.bbox.y1 - top / s;
        view.tx = AMP.bbox.x1 + AMP_W * TARGET.fx;
        view.ty = AMP.bbox.y1 + AMP_H * TARGET.fy;
        /* hedef nokta, zoom boyunca ekrandaki konumunu korur */
        view.fxv = (view.tx - view.x0) / view.vw;
        view.fyv = (view.ty - view.y0) / view.vh;
        view.endW = AMP_W * TARGET.size;
        applyCam();
      };

      const seq = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=130%",
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: measure,
          onUpdate: (self) => {
            /* intro sürerken scroll başlarsa intro anında tamamlanır;
               aksi halde iki timeline aynı öğelere yazıp çakışır */
            if (self.progress > 0.03 && introTl.progress() < 1) {
              introTl.progress(1);
            }
          },
        },
      });

      seq
        .to(
          [lineRef.current, handleRef.current],
          { autoAlpha: 0, duration: 0.1, ease: "none" },
          0
        )
        /* iki ses tek sese karışır */
        .to(
          devLayerRef.current,
          { autoAlpha: 0, duration: 0.28, ease: "none" },
          0.02
        )
        /* satır içi &'ler yerini tam ekran SVG'ye bırakır (aynı konum) */
        .to(".hero-amp", { autoAlpha: 0, duration: 0.04, ease: "none" }, 0.02)
        .to(
          ampSvgRef.current,
          { autoAlpha: 1, duration: 0.04, ease: "none" },
          0.02
        )
        /* & kalınlaşarak büyür, mürekkep ekranı kaplar */
        .to(
          cam,
          { p: 1, duration: 0.86, ease: "power1.in", onUpdate: applyCam },
          0.06
        )
        /* metinler yerinde durur, mürekkep yaklaşırken sessizce çekilir */
        .to(".hero-par", { autoAlpha: 0, duration: 0.2, ease: "none" }, 0.55)
        /* mavinin içinde beyaz DESIGNER — pin bitmeden tam görünür olur */
        .fromTo(
          designerRef.current,
          { autoAlpha: 0, scale: 0.97 },
          { autoAlpha: 1, scale: 1, duration: 0.12, ease: "none" },
          0.78
        );

      /* font yüklenince metin genişliği değişir; yuvayı yeniden ölç */
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        window.removeEventListener("resize", setSkew);
        hero.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerdown", onDown);
        handle.removeEventListener("pointermove", onDrag);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
        handle.removeEventListener("keydown", onKey);
        stopDrift();
        idle.kill();
        document.documentElement.style.overflow = "";
      };
    },
    { scope: heroRef }
  );

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative h-svh min-h-[620px] overflow-hidden bg-bone text-ink"
      style={{ "--seam": "100%", "--tilt": "4vw" } as React.CSSProperties}
    >
      {/* tasarım dünyası (taban katman) */}
      <div className="blueprint-grid absolute inset-0">
        <HeroInner variant="design" />
      </div>

      {/* kod dünyası (dikişle kırpılan katman) */}
      <div
        ref={devLayerRef}
        aria-hidden
        className="seam-clip dot-grid scanlines absolute inset-0 z-10 bg-carbon text-bone"
      >
        <HeroInner variant="dev" />
      </div>

      {/* dikiş çizgisi */}
      <div
        ref={lineRef}
        aria-hidden
        className="absolute top-0 z-20 h-full w-0.5 bg-white mix-blend-difference"
        style={{ left: "var(--seam)" }}
      />

      {/* dikiş tutamacı */}
      <button
        ref={handleRef}
        type="button"
        role="slider"
        aria-label="Tasarım / kod dengesi"
        aria-orientation="horizontal"
        aria-valuemin={SEAM_MIN}
        aria-valuemax={SEAM_MAX}
        aria-valuenow={SEAM_REST}
        data-cursor="SÜRÜKLE"
        className="absolute top-1/2 z-30 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center rounded-full bg-white font-mono text-sm text-black mix-blend-difference select-none"
        style={{ left: "var(--seam)" }}
      >
        ⇄
      </button>

      {/* & büyüme sahnesi — viewBox zoom, her karede vektör */}
      <svg
        ref={ampSvgRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-40 h-full w-full fill-ultra"
        viewBox={`${AMP.bbox.x1} ${AMP.bbox.y1} ${AMP_W} ${AMP_H}`}
        preserveAspectRatio="none"
      >
        <path
          d={AMP.path}
          className="stroke-ultra"
          strokeWidth="0"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      {/* mavinin içinde beliren kimlik — manifesto başlığının italik serif sesi */}
      <p
        ref={designerRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[45] flex items-center justify-center font-serifit text-[clamp(3.2rem,11vw,9.5rem)] italic leading-none text-bone"
      >
        designer.
      </p>

      {/* preloader */}
      <div
        ref={overlayRef}
        aria-hidden
        className="absolute inset-0 z-50 bg-carbon px-6 py-8 font-mono text-sm text-bone/80 md:px-12 md:py-12"
        style={{
          "--wipe": "0%",
          clipPath:
            "polygon(calc(var(--wipe) - 6vw) -2%, 102% -2%, 102% 102%, calc(var(--wipe) - 14vw) 102%)",
        } as React.CSSProperties}
      >
        <div className="space-y-1.5">
          <p>
            <span className="text-amber">$</span>{" "}
            <span className="pre-cmd caret"></span>
          </p>
          <p className="pre-line opacity-0">
            <span className="text-amber">✓</span> tasarımcı çekirdeği yüklendi
          </p>
          <p className="pre-line opacity-0">
            <span className="text-amber">✓</span> developer çekirdeği yüklendi
          </p>
          <p className="pre-line text-amber opacity-0">
            ! uyarı: ikisi aynı kişi
          </p>
          <p className="pre-line opacity-0">$ arayüz açılıyor…</p>
        </div>
      </div>
    </section>
  );
}
