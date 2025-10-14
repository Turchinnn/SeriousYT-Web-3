// src/components/ScrollToTop.tsx
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop: svaki put kad se pathname promijeni,
 * resetira scroll na vrh.
 *
 * Koristimo useLayoutEffect da se scroll dogodi prije paint-a,
 * čime izbjegavamo "flash" stare pozicije.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Za većinu slučajeva:
    if (typeof window !== "undefined") {
      // documentElement je pouzdaniji od window.scrollTo u nekim browserima
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      // fallback:
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
