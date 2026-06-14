import type { Metadata } from "next";
import { ABOUT, SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "What Adjacent Atlas is, who builds it, the reference domain it ships with, and how the data should be read.",
};

export default function AboutPage(): JSX.Element {
  return (
    <section className="page container">
      <header className="page-header">
        <h1 className="page-title">About</h1>
        <p className="page-intro">{ABOUT.paragraphs[0]}</p>
      </header>

      <div className="prose">
        {ABOUT.paragraphs.slice(1).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}

        <h2>Project and ownership</h2>
        <p>
          Adjacent Atlas is built and maintained by <strong>{SITE.author.name}</strong> (
          <a href={SITE.author.url}>@{SITE.author.handle}</a>), and the reference graph is initially
          seeded around <strong>{SITE.domain}</strong>. Released under the MIT License. Source,
          issues, and the methodology write-ups live in the{" "}
          <a href={SITE.repoUrl}>repository</a>.
        </p>
      </div>
    </section>
  );
}
