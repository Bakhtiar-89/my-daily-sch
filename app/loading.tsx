export default function Loading() {
  return (
    <main className="app-main" aria-label="Loading timetable">
      <div className="skeleton-block skeleton-title" />
      <div className="skeleton-grid"><i /><i /><i /><i /></div>
      <div className="skeleton-block skeleton-banner" />
      <div className="skeleton-grid skeleton-lower"><i /><i /></div>
    </main>
  );
}
