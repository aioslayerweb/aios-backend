"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

export function AIOSMeshGradient() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -left-24 -top-20 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,#1976FF33,transparent_72%)] blur-3xl" />
      <div className="absolute right-[-120px] top-[320px] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,#49A7FF24,transparent_72%)] blur-3xl" />
    </div>
  )
}

export function AIOSGridBackground() {
  return <div className="pointer-events-none absolute inset-0 -z-[5] opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(8,36,102,0.15) 1px, transparent 0)", backgroundSize: "18px 18px" }} />
}

export function AIOSBlurLayer({ children }: { children?: ReactNode }) {
  return <div className="pointer-events-none absolute inset-0 -z-[4] backdrop-blur-[2px]">{children}</div>
}

export function AIOSNoiseTexture() {
  return <div className="pointer-events-none absolute inset-0 -z-[6] opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\" viewBox=\"0 0 80 80\"%3E%3Cg fill=\"%2307133D\" fill-opacity=\"1\"%3E%3Ccircle cx=\"4\" cy=\"4\" r=\"1\"/%3E%3C/g%3E%3C/svg%3E')" }} />
}

export function AIOSFloatingParticles({ count = 14 }: { count?: number }) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) {
    return null
  }

  const particles = Array.from({ length: count }, (_, id) => ({
    id,
    left: `${8 + (id * 6.1) % 84}%`,
    delay: id * 0.2,
    duration: 7 + (id % 4),
  }))

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          style={{ left: particle.left }}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 0.8, 0] }}
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "linear" }}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#5AA8FF] shadow-[0_0_14px_rgba(85,167,255,0.65)] will-change-transform"
        />
      ))}
    </div>
  )
}

export function AIOSLightBackground({ children }: { children?: ReactNode }) {
  return (
    <>
      <AIOSMeshGradient />
      <AIOSGridBackground />
      <AIOSNoiseTexture />
      {children}
    </>
  )
}
