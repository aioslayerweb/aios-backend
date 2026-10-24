import { ImageResponse } from "next/og"

export const alt = "AIOS Pilot — business intelligence, memory, and decision support"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 76px",
          background:
            "radial-gradient(circle at 82% 18%, rgba(25,118,255,0.18), transparent 34%), linear-gradient(135deg, #f8f9ff 0%, #eef2f9 100%)",
          color: "#02154a",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 5,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#1c82f2",
            }}
          />
          AIOS PILOT
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
          <div
            style={{
              color: "#536482",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 4,
              marginBottom: 18,
              textTransform: "uppercase",
            }}
          >
            Business intelligence operating layer
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 66,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.08,
            }}
          >
            <div>One intelligence layer.</div>
            <div>One business memory.</div>
          </div>
          <div style={{ color: "#1976ff", fontSize: 66, fontWeight: 700, letterSpacing: -3, lineHeight: 1.08 }}>
            One operating system.
          </div>
        </div>
        <div style={{ color: "#536482", fontSize: 18 }}>
          Signals · Context · Explainable decisions · Governed workflows
        </div>
      </div>
    ),
    size,
  )
}
