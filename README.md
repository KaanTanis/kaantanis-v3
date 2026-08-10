# kaantanis.com — v3

Kişisel site, üçüncü baskı. Konsept: **"Aynı içerik, iki dil"** — tasarımcı ve
developer kimliği, hero'daki canlı diyagonal dikişle (seam) ayrılan iki dünya
olarak aynı sayfada yaşar. Ayrıntılı tasarım brief'i için: [`DESIGN.md`](./DESIGN.md)

## Stack

- **Next.js 16** (App Router, statik çıktı) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (`@theme` tokenları) + el yazımı CSS (dikiş, grain, marquee)
- **GSAP 3.15** — dikiş inertia (`quickTo`), SplitText reveal, ScrollTrigger yatay pin
- **Motion (Framer Motion) 13** — mikro etkileşimler, form/terminal geçişleri, custom cursor
- **Lenis** — smooth scroll (GSAP ticker'a bağlı)

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # üretim derlemesi (tamamen statik)
```

## Mimari notlar

- `src/components/Hero.tsx` — imza öğe: iki katman + `--seam` CSS değişkeniyle
  kırpılan clip-path. Fare X'i, dokunmatik sürükleme ve ok tuşları aynı
  `quickTo` hedefini besler; mobilde dikiş sürekli salınır. Preloader da bu
  bileşende yaşar (oturum başına bir kez, `sessionStorage`). Çıkışta `&`
  harfinin kendisi büyür: glif Instrument Serif Italic'ten SVG path'e
  çıkarıldı (`src/lib/amp-glyph.ts`), tam ekran SVG'nin `viewBox`'ı satır
  içindeki yuvadan glifin kalın gövdesinin içine geometrik interpolasyonla
  tween'lenir — vektör her karede yeniden çizildiği için harf her ölçekte
  keskindir. Mürekkep ekranı kaplayınca beyaz `DESIGNER` belirir ve ultra
  zeminli manifestoya kesintisiz bağlanır.
- `src/components/Stack.tsx` — sahte terminal; kategori komutları `ls ~/stack/...`
  yazıp listeyi basar. İlk komut ScrollTrigger ile görünür olunca çalışır.
- `src/components/Process.tsx` — masaüstünde ScrollTrigger pinli yatay şerit,
  mobilde yapışkan kart destesi: sonraki panel üstüne kayarken alttaki küçülüp
  kararır, numaralar paralaks yapar (`gsap.matchMedia`).
- `src/components/Contact.tsx` — form backend'siz çalışır: mesajı derleyip
  `wa.me` (WhatsApp) veya `mailto:` derin bağlantısına dönüştürür.
  İleride gerçek endpoint istenirse `onSubmit` içindeki `window.open`
  bir `fetch("/api/contact")` ile değiştirilebilir.
- Efektler `prefers-reduced-motion` dahil her tercihte aktiftir (bilinçli
  tercih — hareket deneyimin kendisi).

## Erişilebilirlik

- Dikiş tutamacı gerçek bir `role="slider"` — ok tuşlarıyla kullanılabilir.
- Çift katmanlı hero'nun kopya katmanı `aria-hidden`; ekran okuyucu tek içerik duyar.
- Fokus halkaları: bone zeminde ultramarin, karbon zeminde amber.
