"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const minimumVisibleMs = 400;
const maximumVisibleMs = 10000;

export function NavigationLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const startedAtRef = useRef(0);
  const startedPathRef = useRef("");

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;

      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname
      ) {
        return;
      }

      startedAtRef.current = Date.now();
      startedPathRef.current = window.location.pathname;
      setIsLoading(true);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    if (!isLoading || pathname === startedPathRef.current) return;

    const elapsed = Date.now() - startedAtRef.current;
    const hideDelay = Math.max(0, minimumVisibleMs - elapsed);
    const hideTimer = window.setTimeout(() => {
      setIsLoading(false);
    }, hideDelay);

    return () => window.clearTimeout(hideTimer);
  }, [pathname, isLoading]);

  useEffect(() => {
    if (!isLoading) return;

    const maximumTimer = window.setTimeout(
      () => setIsLoading(false),
      maximumVisibleMs
    );

    return () => window.clearTimeout(maximumTimer);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-white"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <Image
        src="/images/logo.png"
        alt="JBC Solar Energy"
        width={180}
        height={60}
        priority
        className="h-14 w-auto animate-pulse object-contain motion-reduce:animate-none"
      />
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#f36a26] motion-reduce:animate-none"
      />
      <span className="sr-only">Loading page</span>
    </div>
  );
}
