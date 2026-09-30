"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard", icon: "▦" },
  { href: "/staff", label: "Staff", icon: "♙" },
  { href: "/locations", label: "Locations", icon: "⌖" },
  { href: "/duties", label: "Duties", icon: "☷" },
  { href: "/my-schedule", label: "My Schedule", icon: "◷" },
];

export function Navigation() {
  const pathname = usePathname();
  return (
    <>
      <aside className="sidebar" aria-label="Main navigation">
        <p className="nav-caption">WORKSPACE</p>
        <nav className="side-links">
          {links.map(({ href, label, icon }) => {
            const active = pathname === href;
            return <Link key={href} href={href} className={`side-link${active ? " active" : ""}`} aria-current={active ? "page" : undefined}><span className="nav-icon" aria-hidden="true">{icon}</span>{label}{active && <span className="active-indicator" />}</Link>;
          })}
        </nav>
        <div className="sidebar-note"><span className="sidebar-note-icon" aria-hidden="true">✳</span><strong>Keep the day moving</strong><p>One place for the whole team’s plan and progress.</p></div>
        <div className="sidebar-bottom">Daily operations workspace</div>
      </aside>
      <details className="mobile-nav">
        <summary><span aria-hidden="true">☰</span> Menu</summary>
        <nav className="mobile-nav-links">
          {links.map(({ href, label, icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}><span aria-hidden="true">{icon}</span>{label}</Link>)}
        </nav>
      </details>
    </>
  );
}
