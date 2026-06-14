"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

const NAV: ReadonlyArray<{ href: Route; label: string }> = [
  { href: "/atlas", label: "Atlas" },
  { href: "/briefs", label: "Briefs" },
  { href: "/method", label: "Method" },
  { href: "/about", label: "About" },
];

export function SiteHeader(): JSX.Element {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href={"/" as Route} className="wordmark">
          <span className="wordmark__mark" aria-hidden="true" />
          Adjacent Atlas
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "site-nav__link is-active" : "site-nav__link"}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
