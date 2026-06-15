import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Adjacent Atlas — an observatory for the adjacent possible";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Kind colours mirror packages/ui tokens and apps/web/lib/format.ts.
const KIND_COLORS = ["#5eead4", "#7aa2f7", "#f5a97f", "#c3a6ff", "#9ece6a", "#f7768e"];

export default function OpengraphImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0b0f14",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "22px", height: "22px", borderRadius: "5px", backgroundColor: "#5eead4", display: "flex" }} />
          <div style={{ display: "flex", color: "#e6edf3", fontSize: "30px", fontWeight: 600 }}>Adjacent Atlas</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", color: "#e6edf3", fontSize: "60px", fontWeight: 700, lineHeight: 1.05, maxWidth: "900px" }}>
            The frontier, and what sits one step beyond it.
          </div>
          <div style={{ display: "flex", color: "#8b98a9", fontSize: "26px" }}>
            An observatory for the adjacent possible.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            {KIND_COLORS.map((c, i) => (
              <div key={i} style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: c, display: "flex" }} />
            ))}
          </div>
          <div style={{ display: "flex", color: "#2c7a73", fontSize: "22px" }}>
            extreme-precision radial velocity instrumentation
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
