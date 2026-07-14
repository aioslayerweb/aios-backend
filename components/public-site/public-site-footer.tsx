import Link from "next/link";
import { Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/branding";

export function PublicSiteFooter() {
  return (
    <footer className="border-t border-[#E3EAF8] bg-white px-6 py-10 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo width={118} height={28} />
          <span className="text-sm text-[#5D6C95]">Operating system for autonomous businesses</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#4A5A88]">
          <Link href="/universe" className="transition hover:text-[#1976FF]">
            Universe
          </Link>
          <Link href="/about" className="transition hover:text-[#1976FF]">
            About
          </Link>
          <Link href="/products" className="transition hover:text-[#1976FF]">
            Products
          </Link>
          <Link href="/contact" className="transition hover:text-[#1976FF]">
            Contact
          </Link>
          <Link href="/legal" className="transition hover:text-[#1976FF]">
            Legal
          </Link>
          <Link href="/app" className="inline-flex items-center gap-1 font-semibold text-[#1976FF]">
            Launch AIOS
            <Sparkles size={14} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
