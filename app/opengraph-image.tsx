import { ImageResponse } from "next/og";

export const alt = "Sushmita Kc — Digital Marketing Specialist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#FAF7F2",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#0D7377",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "linear-gradient(120deg,#0D7377,#8B5CF6)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            SK
          </div>
          Sushmita Kc
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 76,
            fontWeight: 800,
            color: "#1A1A1A",
            lineHeight: 1.05,
            maxWidth: 980,
          }}
        >
          Driving Growth Through Digital Excellence
        </div>
        <div style={{ marginTop: 24, fontSize: 32, color: "#555" }}>
          Data-driven Digital Marketing Specialist · SEO · PPC · Analytics
        </div>
      </div>
    ),
    { ...size }
  );
}
