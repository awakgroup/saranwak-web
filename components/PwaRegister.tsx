"use client";

import { useEffect, useState } from "react";
import { Download, Share2, PlusSquare, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Register Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .catch((err) => {
            console.warn("Saranwak SW registration failed:", err);
          });
      });
    }

    // 2. Check if already installed as standalone PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return;
    }

    // Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    const isSafari = ua.includes("safari") && !ua.includes("chrome") && !ua.includes("crios");
    if (isIosDevice && isSafari) {
      setIsIos(true);
    }

    // 3. Android / Chromium beforeinstallprompt handler
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // 4. Listen for manual trigger (e.g. from Footer / Menu)
    const handleManualTrigger = () => {
      if (isIosDevice && isSafari) {
        setShowIosGuide(true);
      }
      setShowInstallBanner(true);
    };

    window.addEventListener("saranwak:install-pwa", handleManualTrigger);

    // 5. Smart non-intrusive auto-prompt display rules:
    // - Never show on Desktop (screen width >= 768px)
    // - Never show if previously dismissed within 30 days
    // - Never show more than ONCE per browser session
    // - Only show after user has viewed at least 3 pages (engaged visitor)
    // - Only show after spending 12 seconds on that page
    const dismissedUntil = localStorage.getItem("saranwak_pwa_dismissed");
    const isDismissed = dismissedUntil && Number(dismissedUntil) > Date.now();
    const sessionSeen = sessionStorage.getItem("saranwak_pwa_session_seen");
    const isMobile = window.innerWidth < 768;

    // Track page views in current session
    const pageViews = Number(sessionStorage.getItem("saranwak_session_views") || "0") + 1;
    sessionStorage.setItem("saranwak_session_views", String(pageViews));

    let timer: NodeJS.Timeout | null = null;

    if (isMobile && !isDismissed && !sessionSeen && pageViews >= 3) {
      timer = setTimeout(() => {
        setShowInstallBanner(true);
        // Mark session as seen so it never pops up again in this session
        sessionStorage.setItem("saranwak_pwa_session_seen", "true");
      }, 12000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("saranwak:install-pwa", handleManualTrigger);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide((prev) => !prev);
      return;
    }

    if (!deferredPrompt) {
      // If prompt not available (e.g. dismissed by browser), dismiss gracefully
      handleDismiss();
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    setShowIosGuide(false);
    // Mark session as seen
    sessionStorage.setItem("saranwak_pwa_session_seen", "true");
    // Suppress for 30 days in localStorage
    localStorage.setItem(
      "saranwak_pwa_dismissed",
      String(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );
  };

  if (!showInstallBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-22 inset-x-4 z-40 mx-auto max-w-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 md:bottom-6 md:right-6 md:left-auto">
      <div className="relative overflow-hidden rounded-[24px] border border-[#E7D8C8] bg-[#FFFDF8]/98 p-4 shadow-[0_20px_50px_rgba(32,24,19,0.22)] backdrop-blur-xl">
        {/* Dismiss button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full text-[#756A60] hover:bg-[#F4F1EA] hover:text-[#201813]"
          aria-label="Tutup saran install"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-3.5 pr-5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#201813] text-white shadow-md">
            <span className="text-lg">☕</span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-serif text-sm font-bold text-[#201813]">
              Pasang Saranwak di HP
            </p>
            <p className="mt-0.5 text-xs text-[#756A60] leading-snug">
              Akses cepat tanpa download di Play Store.
            </p>

            {/* iOS instructions tooltip */}
            {showIosGuide && (
              <div className="mt-3 rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8] p-3 text-xs text-[#201813] space-y-1.5 animate-in fade-in">
                <p className="flex items-center gap-1.5 font-bold">
                  <Share2 className="h-3.5 w-3.5 text-[#C8784A]" />
                  <span>1. Tekan tombol Share di Safari</span>
                </p>
                <p className="flex items-center gap-1.5 font-bold">
                  <PlusSquare className="h-3.5 w-3.5 text-[#1F5A4A]" />
                  <span>2. Pilih "Add to Home Screen"</span>
                </p>
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1F5A4A] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#184639] active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isIos ? (showIosGuide ? "Tutup Panduan" : "Panduan iPhone") : "Pasang Sekarang"}</span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#756A60] hover:text-[#201813]"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
