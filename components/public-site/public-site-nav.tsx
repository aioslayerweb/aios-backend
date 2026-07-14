"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/branding";

type PublicSiteNavProps = {
  activeHref?: string;
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "Universe", href: "/universe" },
  { label: "Platform", href: "/#platform" },
  { label: "Architecture", href: "/architecture" },
  { label: "Modules", href: "/modules" },
  { label: "Products", href: "/products" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const mobileNavItems = [...navItems, { label: "Book Demo", href: "/contact" }] as const;

function isActive(pathname: string, href: string, activeHref?: string) {
  if (activeHref) {
    return activeHref === href;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href;
}

export function PublicSiteNav({ activeHref }: PublicSiteNavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-header border-b border-[#E6ECF7]/80 bg-white/75 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10" aria-label="Global navigation">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D7DEED] bg-white text-[#07133D] transition hover:border-[#1976FF]/50 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0" aria-label="AIOS home">
            <BrandLogo width={132} height={31} priority />
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href, activeHref);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    active
                      ? "text-sm font-semibold text-[#1976FF]"
                      : "text-sm font-medium text-[#2D3A68] transition hover:text-[#1976FF]"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#07133D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B1D56] sm:px-5">
            <span className="hidden sm:inline">Book Demo</span>
            <span className="sm:hidden">Demo</span>
            <ArrowRight size={15} />
          </Link>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-[120] bg-[#07133D]/26 backdrop-blur-sm lg:hidden"
          >
            <motion.div
              initial={{ x: "-100%", opacity: 0.7 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0.7 }}
              drag="x"
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70 || info.velocity.x < -500) {
                  setMenuOpen(false);
                }
              }}
              onClick={(event) => event.stopPropagation()}
              transition={{ duration: 0.34, ease: [0.22, 0.61, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="h-full w-full bg-white/95 p-6"
            >
              <div className="flex items-center justify-between">
                <BrandLogo width={128} height={30} priority />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D7DEED] text-[#07133D]"
                  aria-label="Close navigation menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-8 grid gap-2">
                {mobileNavItems.map((item, index) => {
                  const active = isActive(pathname, item.href, activeHref);

                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={
                          active
                            ? "block rounded-2xl border border-[#CFE0FF] bg-[#EDF4FF] px-4 py-3 text-base font-semibold text-[#1976FF]"
                            : "block rounded-2xl border border-[#E2E9F8] bg-white px-4 py-3 text-base font-medium text-[#1B2D63]"
                        }
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#07133D] px-6 py-3 text-sm font-semibold text-white"
              >
                Book Demo
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
