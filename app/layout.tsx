import type { Metadata } from "next";
import { Navigation } from "@/app/components/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Operations | Timetable",
  description: "Plan daily operations, publish staff assignments, and track work as it gets done.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="app-frame">
          <header className="topbar">
            <a className="brand" href="/" aria-label="Daily Operations home">
              <span className="brand-mark" aria-hidden="true">D</span>
              <span><strong>daybook</strong><small>OPERATIONS</small></span>
            </a>
            <span className="workspace-chip"><i />Team workspace</span>
          </header>
          <div className="workspace-layout">
            <Navigation />
            <div className="main-column">
              {children}
              <footer className="app-footer"><span>DAYBOOK <i>·</i> DAILY OPERATIONS</span><span>One clear plan for every shift.</span></footer>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
