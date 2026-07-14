"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

const DISMISS_KEY = "aios_demo_platform_banner_dismissed";

export function DemoPlatformBanner() {
  const shouldReduceMotion = useReducedMotion();
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
    setIsVisible(!dismissed);
    setIsReady(true);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setIsVisible(false);
  };

  if (!isReady) {
    return null;
  }

  return (
    <AnimatePresence initial={false}>
      {isVisible ? (
        <motion.section
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.24 }}
          className="mx-auto w-full max-w-[1400px] rounded-2xl border border-brand-primary/25 bg-brand-subtle/70 px-4 py-3 shadow-sm backdrop-blur-sm md:px-5"
          aria-label="AIOS demo platform preview notice"
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-brand-navy">AIOS Demo Platform • Preview Version</p>
                <span className="inline-flex items-center rounded-full border border-brand-primary/30 bg-white/75 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-primary">
                  Preview
                </span>
              </div>
              <p className="mt-1 text-xs text-brand-navy/80 md:text-sm">
                This interactive preview demonstrates the AIOS Operating System. Some functionality uses simulated enterprise data.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-primary/20 bg-white/75 text-brand-navy transition hover:border-brand-primary/35 hover:text-brand-primary"
              aria-label="Dismiss demo preview banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}