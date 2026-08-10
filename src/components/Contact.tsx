"use client";

import { useState } from "react";
import { motion } from "motion/react";

const KONULAR = [
  "UI/UX Tasarım",
  "Full-Stack Geliştirme",
  "Backend & API",
  "Bug Fix / Bakım",
  "Diğer",
];

const BUTCELER = ["250–600$", "600–1.200$", "1.200–2.500$", "2.500$+"];

const PHONE = "905442373323";
const MAIL = "kt@kaantanis.com";

function compose(
  isim: string,
  eposta: string,
  konular: string[],
  butce: string,
  mesaj: string
) {
  return [
    `Merhaba, ben ${isim}.`,
    `Konu: ${konular.length ? konular.join(", ") : "—"}`,
    `Bütçe: ${butce || "—"}`,
    "",
    mesaj,
    "",
    eposta ? `(e-posta: ${eposta})` : "",
  ]
    .join("\n")
    .trim();
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function Contact() {
  const [isim, setIsim] = useState("");
  const [eposta, setEposta] = useState("");
  const [konular, setKonular] = useState<string[]>([]);
  const [butce, setButce] = useState("");
  const [mesaj, setMesaj] = useState("");

  const toggleKonu = (k: string) =>
    setKonular((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );

  const text = compose(isim, eposta, konular, butce, mesaj);
  const waHref = `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
  const mailHref = `mailto:${MAIL}?subject=${encodeURIComponent(
    `Proje talebi — ${isim || "yeni"}`
  )}&body=${encodeURIComponent(text)}`;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    window.open(waHref, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="iletisim" className="relative bg-bone text-ink">
      {/* marquee bandı */}
      <div className="marquee overflow-hidden border-y border-ink/15 py-5" aria-hidden>
        <div className="marquee-track items-baseline gap-8 pr-8">
          {Array.from({ length: 2 }).map((_, half) => (
            <div key={half} className="flex shrink-0 items-baseline gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className="flex shrink-0 items-baseline gap-8 font-display text-[clamp(2rem,4.6vw,4.2rem)] font-extrabold uppercase leading-none tracking-[-0.02em]"
                >
                  <span>Bir projen mi var?</span>
                  <em className="font-serifit italic tracking-normal text-ultra">
                    ✳
                  </em>
                  <span className="stroke-ink">Konuşalım</span>
                  <em className="font-serifit italic tracking-normal text-ultra">
                    ✳
                  </em>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-24 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          {/* sol: başlık + sla + doğrudan kanallar */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.09 }}
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.03em]"
            >
              Projeni{" "}
              <em className="font-serifit font-normal italic tracking-normal text-ultra">
                konuşalım.
              </em>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink/70"
            >
              Fikir aşamasında olsa bile yaz. Netleştirmek benim işim —{" "}
              <strong className="font-semibold text-ink">
                24 saat içinde dönerim.
              </strong>
            </motion.p>

            <motion.dl variants={fadeUp} className="mt-12">
              {[
                ["ilk dönüş", "24 saat"],
                ["yanıt oranı", "%100"],
                ["değerlendirme", "5.0 ★"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="mono-label flex items-center justify-between border-t border-ink/15 py-4"
                >
                  <dt className="text-ink/50">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </motion.dl>

            <motion.ul variants={fadeUp} className="mt-10 space-y-3">
              {[
                ["e-posta", `mailto:${MAIL}`, MAIL],
                ["whatsapp", `https://wa.me/${PHONE}`, "+90 544 237 3323"],
                ["github", "https://github.com/KaanTanis", "@KaanTanis"],
              ].map(([label, href, value]) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    data-cursor="AÇ"
                    className="group mono-label inline-flex items-baseline gap-3 text-ink/70 transition-colors hover:text-ultra"
                  >
                    <span className="text-ink/40">{label}</span>
                    <span className="font-mono text-sm normal-case tracking-normal">
                      {value}
                    </span>
                    <span
                      aria-hidden
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* sağ: cli-form */}
          <motion.form
            onSubmit={onSubmit}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.07, delayChildren: 0.15 }}
            className="space-y-9"
          >
            <motion.div variants={fadeUp} className="grid gap-9 sm:grid-cols-2">
              <div>
                <label htmlFor="f-isim" className="mono-label text-ultra">
                  --isim <span className="text-ink/40">*</span>
                </label>
                <input
                  id="f-isim"
                  required
                  value={isim}
                  onChange={(e) => setIsim(e.target.value)}
                  placeholder="Adınız"
                  className="field mt-2.5"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="f-eposta" className="mono-label text-ultra">
                  --eposta
                </label>
                <input
                  id="f-eposta"
                  type="email"
                  value={eposta}
                  onChange={(e) => setEposta(e.target.value)}
                  placeholder="ornek@mail.com"
                  className="field mt-2.5"
                  autoComplete="email"
                />
              </div>
            </motion.div>

            <motion.fieldset variants={fadeUp}>
              <legend className="mono-label text-ultra">--konu[]</legend>
              <div className="mt-3.5 flex flex-wrap gap-2.5">
                {KONULAR.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => toggleKonu(k)}
                    aria-pressed={konular.includes(k)}
                    data-on={konular.includes(k)}
                    className="chip"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </motion.fieldset>

            <motion.fieldset variants={fadeUp}>
              <legend className="mono-label text-ultra">--butce</legend>
              <div className="mt-3.5 flex flex-wrap gap-2.5">
                {BUTCELER.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setButce(butce === b ? "" : b)}
                    aria-pressed={butce === b}
                    data-on={butce === b}
                    className="chip"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </motion.fieldset>

            <motion.div variants={fadeUp}>
              <label htmlFor="f-mesaj" className="mono-label text-ultra">
                --mesaj <span className="text-ink/40">*</span>
              </label>
              <textarea
                id="f-mesaj"
                required
                rows={4}
                value={mesaj}
                onChange={(e) => setMesaj(e.target.value)}
                placeholder="Projenden bahset: ne yapıyoruz, kimin için, ne zamana?"
                className="field mt-2.5 resize-none"
              />
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4">
              <motion.button
                type="submit"
                data-cursor="GÖNDER"
                whileTap={{ scale: 0.97 }}
                className="mono-label w-full border border-ink bg-ink px-6 py-5 text-bone transition-colors duration-200 hover:bg-transparent hover:text-ink sm:w-auto"
              >
                [ gönder → whatsapp ⏎ ]
              </motion.button>
              <p className="mono-label text-ink/40">
                mesaj whatsapp&apos;ta açılır · istersen{" "}
                <a
                  href={mailHref}
                  className="text-ink/70 underline underline-offset-4 hover:text-ultra"
                >
                  e-posta ile gönder
                </a>
              </p>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
