import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Adjacent Atlas",
    template: "%s · Adjacent Atlas",
  },
  description:
    "An observatory for the adjacent possible: methods, instruments, and concepts close to the frontier of a research field, ranked from public code and literature signals.",
  metadataBase: new URL("https://adjacent-atlas.dev"),
  alternates: { canonical: "https://adjacent-atlas.dev/" },
  keywords: ["research frontier mapping", "research landscape", "literature signals", "open-source research", "scientific knowledge graph"],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    title: "Adjacent Atlas",
    description:
      "Methods, instruments, and concepts close to the frontier of a research field, ranked from public signals.",
    type: "website",
    url: "https://adjacent-atlas.dev/",
  },
  authors: [{ name: "Biswajit Jana", url: "https://github.com/Biswajit1999" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <SkipLink />
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
