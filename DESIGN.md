# kaantanis.com v3 — Tasarım Promptu

> Bu doküman, v2 analizinden çıkan ve v3'ü inşa eden tasarım brief'idir.
> Tek cümlelik özet: **"Aynı içerik, iki dil"** — tasarımcı ve developer kimliği
> aynı sayfada, canlı bir dikişle (seam) ayrılan iki dünya olarak yaşar.

---

## 1. Mevcut site (v2) analizi

**Güçlü yanlar — korunacak:**
- "Designer / Developer" ikiliği doğru marka tezi; v3'te statik değil, *interaktif* olacak.
- "Simple outside. Powerful inside." satırı marka manifestosu; aynen kalıyor.
- Chat-form fikri samimi; v3'te CLI-form olarak yeniden yorumlanıyor.
- İçerik envanteri sağlam: stack kategorileri, 3 aşamalı süreç, SLA (24s dönüş, %100 yanıt).

**Zayıf yanlar — çözülecek:**
- AI-stok görseller (renkli göz, yeşil laptop) marka değeri taşımıyor → v3 **tamamen tipografik**, sıfır stok görsel.
- Pill/rounded her yerde; kimliksiz "temiz template" hissi → keskin, editoryal, köşeli sistem.
- Duality (iki kimlik) sadece iki kelime olarak duruyor; siteye yayılmıyor → v3'te sistemin kendisi.
- Motion yüzeysel (fade/slide) → orkestre edilmiş, tez anlatan animasyon.

## 2. Konsept: "İki dil, tek kişi"

Site iki dünyadan oluşur ve ikisi aynı anda ekrandadır:

| | TASARIM dünyası | KOD dünyası |
|---|---|---|
| Zemin | Kemik beyazı `#F0EDE6` | Karbon `#101014` |
| Vurgu | Ultramarin `#2418EE` (Klein mavisi, blueprint) | Amber `#FFB300` (CRT fosforu) |
| Ses | Editoryal, geniş, yumuşak ritim | Mono, ölçülü, teknik anotasyon |

**İmza öğe (signature):** Hero'da tüm ekranı kesen **diyagonal canlı dikiş**.
Fare X'ini atalletli (inertia) takip eder; solunda tasarım dünyası, sağında kod dünyası.
Aynı başlık iki katmanda da aynı geometriyle durur — dikiş üzerinden geçerken
*aynı cümle ses değiştirir* (dolgu ↔ kontur, mürekkep ↔ amber). Tez budur:
içerik aynı, dil farklı, kişi tek.

**İkincil imza:** Site kendi blueprint'ini gösterir — bölüm kenarlarında mono
redline anotasyonları (`h1 / Bricolage 800 / 12vw`, hex değerleri, ölçü çizgileri).
Tasarımcı gösterir, developer belgeler.

## 3. Tipografi

| Rol | Yazıtipi | Kullanım |
|---|---|---|
| Display | **Bricolage Grotesque** (variable; optik boyut + genişlik + 200–800) | Başlıklar, dev hero kelimeleri, gövde |
| Vurgu | **Instrument Serif Italic** | Başlık içinde "tasarımcının el yazısı" anları — cümle başına en fazla 1 kelime |
| Utility | **JetBrains Mono** | Terminal, anotasyon, eyebrow, buton, form |

Tümü Google Fonts, `latin-ext` (ş ğ ı İ ç ö ü tam destek). Radius: 0 (dikiş tutamacı hariç).

## 4. Sayfa akışı

1. **Preloader** (~1.5s, oturum başına bir kez): karbon zemin, `$ kaan run --identity` boot satırları, amber imleç; dikiş süpürmesiyle açılır.
2. **Hero — dikiş + büyüyen &**: `SOFTWARE DEVELOPER &` (Bricolage, dev boyut; `&` Instrument italic glifinden çıkarılmış gerçek SVG). İki katman, fare dikişi sürükler; mobilde dikiş sürekli salınır + dokunmatik sürüklenir. Çıkış sihri: scroll hero'yu pinler, kod katmanı tek sese karışır ve `&` harfinin kendisi viewBox zoom'la kalınlaşarak büyür — mürekkebi ekranı kapladığında mavinin içinde beyaz `DESIGNER` belirir; pin çözülünce aynı maviye boyanmış manifestoya kesintisiz düşülür (scrub — geri sarınca harf yuvasına geri çekilir). Metinler scroll sırasında kaymaz.
3. **Manifesto**: "Simple outside. Powerful inside." SplitText kelime kelime scroll-reveal. Zemin ultramarin (portalın devamı): kemik metin, amber italik vurgular, amber marker'lar, kemik çizgili blueprint dokusu.
4. **Stack — terminal**: karbon zemin, gerçek görünümlü sahte terminal. Scroll'a girince `ls ~/stack` otomatik yazılır; kategori sekmeleri komut olarak tıklanır (`cd frontend`), çıktı listelenir.
5. **Süreç**: "Üç katman, tek akış." Masaüstünde 3 panel (Keşif / Tasarım / Lansman) ScrollTrigger ile pinlenip yatay kayar; mobilde yapışkan kart destesi — sonraki panel üstüne kayarken alttaki küçülüp kararır, kontur rakamlar paralaks yapar.
6. **İletişim — CLI form**: marquee CTA bandı (`BİR PROJEN Mİ VAR? — KONUŞALIM`) + form alanları CLI bayrağı gibi etiketli (`--isim`, `--eposta`, `--butce`). Gönder → WhatsApp/mailto derin bağlantısı (backend'siz çalışır). SLA satırı mono tablo: `24s ilk dönüş · %100 yanıt · 5.0 puan`.
7. **Footer**: canlı İstanbul saati, `v3.0.0`, sosyal linkler ve mütevazı kapanış: *"designed & developed by kaantanis"*. Konsola ASCII selam (kaynak koda bakanlara).

## 5. Motion görev dağılımı

- **GSAP**: preloader timeline, dikiş `quickTo` inertia, SplitText reveal'lar, süreç yatay pin (ScrollTrigger), terminal typing, magnetic butonlar.
- **Framer Motion (`motion/react`)**: nav reveal, hover mikro-etkileşimler, form focus, menü/modal `AnimatePresence`, custom cursor spring.
- **Lenis**: smooth scroll (ScrollTrigger ile senkron).
- **Kurallar**: Efektler her kullanıcı tercihinde aktif (bilinçli tercih — deneyim sitenin kendisi). Dokunmatikte custom cursor yok; hareket dikiş salınımı, portal zoom ve kart destesiyle sağlanır. Animasyon yalnızca transform/opacity/clip-path.

## 6. Kalite tabanı

Semantik HTML + klavye focus görünür (amber outline) + kontrast AA
(amber↔karbon 10.9:1, ultramarin↔kemik 7.4:1, mürekkep↔kemik 15+:1) +
sıfır harici görsel (LCP = tipografi) + tek sayfa, anchor navigasyon.
