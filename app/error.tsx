"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="app-main">
      <section className="panel fatal-error-panel" role="alert">
        <span className="notice-icon" aria-hidden="true">!</span>
        <div><p className="eyebrow">SOMETHING WENT WRONG</p><h1>We couldn’t open this page.</h1><p>Please try again. Your saved timetable data is unchanged.</p><button className="button button-primary" onClick={() => reset()}>Try again</button></div>
      </section>
    </main>
  );
}
