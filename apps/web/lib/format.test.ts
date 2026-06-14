import { describe, expect, it } from "vitest";
import { FALLBACK_KIND_VISUAL, formatDate, formatMonth, formatPercent, formatScore, kindVisual } from "./format";

describe("number formatting", () => {
  it("formats a score to one decimal", () => {
    expect(formatScore(73.456)).toBe("73.5");
    expect(formatScore(60)).toBe("60.0");
  });

  it("formats a weight as a percentage", () => {
    expect(formatPercent(0.3)).toBe("30%");
    expect(formatPercent(0.155)).toBe("16%");
  });
});

describe("date formatting", () => {
  it("trims an ISO timestamp to a date", () => {
    expect(formatDate("2026-02-20T10:00:00.000Z")).toBe("2026-02-20");
  });

  it("renders a YYYY-MM period as a short month", () => {
    expect(formatMonth("2026-02")).toBe("Feb 2026");
    expect(formatMonth("2025-11")).toBe("Nov 2025");
  });
});

describe("kindVisual", () => {
  it("returns the visual for a known kind", () => {
    expect(kindVisual("instrument").label).toBe("Instrument");
    expect(kindVisual("repo").label).toBe("Implementation");
  });

  it("exposes a usable fallback", () => {
    expect(FALLBACK_KIND_VISUAL.label).toBe("Node");
  });
});
