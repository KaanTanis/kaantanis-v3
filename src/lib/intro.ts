/**
 * Preloader ile hero/nav girişini senkronlayan minik yayın mekanizması.
 * Preloader bitince `markIntroDone` çağrılır; geç mount olan bileşenler
 * bayrağı kontrol ettiği için event kaçırma riski yok.
 */

declare global {
  interface Window {
    __ktIntroDone?: boolean;
  }
}

export const INTRO_EVENT = "kt:intro-done";

export function markIntroDone() {
  if (typeof window === "undefined") return;
  window.__ktIntroDone = true;
  window.dispatchEvent(new CustomEvent(INTRO_EVENT));
}

export function onIntroDone(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.__ktIntroDone) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(INTRO_EVENT, handler, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, handler);
}

export function introAlreadySeen(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem("kt-intro-seen") === "1";
  } catch {
    return true;
  }
}

export function rememberIntro() {
  try {
    sessionStorage.setItem("kt-intro-seen", "1");
  } catch {
    /* sessionStorage kapalıysa sorun değil */
  }
}
