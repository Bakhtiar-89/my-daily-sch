import { AssignmentCard } from "@/app/components/assignment-card";
import { AssignmentForm } from "@/app/components/assignment-form";
import { PublishButton } from "@/app/components/publish-button";
import { findOverlaps, getAssignmentOptions, listAssignments } from "@/lib/data/assignments";
import { getErrorMessage, formatDate, isDateValue, todayInKualaLumpur } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ date?: string; error?: string; success?: string }>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const date = isDateValue(params.date) ? params.date : todayInKualaLumpur();
  let assignments = [] as Awaited<ReturnType<typeof listAssignments>>;
  let options = { staff: [], locations: [], duties: [] } as Awaited<ReturnType<typeof getAssignmentOptions>>;
  let databaseError = "";

  try {
    [assignments, options] = await Promise.all([listAssignments(date), getAssignmentOptions()]);
  } catch (error) {
    databaseError = getErrorMessage(error);
  }

  const completed = assignments.filter((item) => item.task_status === "Completed").length;
  const inProgress = assignments.filter((item) => item.task_status === "In Progress").length;
  const pending = assignments.length - completed - inProgress;
  const overlaps = findOverlaps(assignments);
  const published = assignments.length > 0 && assignments.every((item) => item.published);
  const returnTo = `/?date=${date}`;

  return (
    <main className="app-main">
      <header className="page-header">
        <div>
          <p className="eyebrow">OPERATIONS / DAILY PLAN</p>
          <h1>Daily timetable</h1>
          <p className="page-subtitle">A clear plan for every person, place, and shift.</p>
        </div>
        <form className="date-picker" action="/">
          <label htmlFor="dashboard-date">Planning for</label>
          <input id="dashboard-date" type="date" name="date" defaultValue={date} />
          <button className="button button-light" type="submit">View day</button>
        </form>
      </header>

      {databaseError && (
        <section className="notice notice-error" role="alert">
          <span className="notice-icon" aria-hidden="true">!</span>
          <div><strong>Couldn’t load the timetable</strong><p>{databaseError}</p></div>
        </section>
      )}
      {params.error && <p className="notice notice-error" role="alert">{params.error}</p>}
      {params.success && <p className="notice notice-success" role="status">✓ {params.success}</p>}

      <section className="summary-grid" aria-label="Daily progress">
        <div className="summary-card summary-total"><span className="summary-label">Assignments</span><strong>{assignments.length}</strong><span className="summary-foot">Scheduled for this day</span></div>
        <div className="summary-card"><span className="summary-label">In progress</span><strong>{inProgress}</strong><span className="summary-foot"><i className="summary-dot dot-blue" />Work underway</span></div>
        <div className="summary-card"><span className="summary-label">Completed</span><strong>{completed}<small> / {assignments.length}</small></strong><span className="summary-foot"><i className="summary-dot dot-green" />Tasks finished</span></div>
        <div className="summary-card"><span className="summary-label">Still to do</span><strong>{pending}</strong><span className="summary-foot"><i className="summary-dot dot-amber" />Pending tasks</span></div>
      </section>

      <section className="date-banner">
        <div className="date-banner-copy"><span className="date-icon" aria-hidden="true">▦</span><div><span className="eyebrow">YOUR PLAN</span><h2>{formatDate(date)}</h2></div></div>
        <div className="date-banner-actions"><span className={`publish-label ${published ? "is-published" : ""}`}><i />{published ? "Published to staff" : "Draft timetable"}</span><PublishButton date={date} published={published} disabled={!assignments.length || Boolean(databaseError)} /></div>
      </section>

      {overlaps.length > 0 && (
        <section className="overlap-alert" role="status">
          <span className="overlap-icon" aria-hidden="true">!</span>
          <div><strong>{overlaps.length === 1 ? "Scheduling overlap" : `${overlaps.length} scheduling overlaps`}</strong><p>{overlaps.map(({ staff, first, second }, index) => <span key={`${first.id}-${second.id}`}>{index > 0 ? " · " : ""}{staff}: {first.shift_start.slice(0, 5)}–{first.shift_end.slice(0, 5)} overlaps {second.shift_start.slice(0, 5)}–{second.shift_end.slice(0, 5)}</span>)}</p></div>
        </section>
      )}

      <div className="dashboard-columns">
        <section className="panel assignment-panel">
          <div className="panel-heading"><div><p className="eyebrow">SHIFT ROSTER</p><h2>Assignments for this day <span className="count-pill">{assignments.length}</span></h2></div><span className="sort-label">Sorted by start time</span></div>
          {assignments.length ? (
            <div className="assignment-list">{assignments.map((assignment) => <AssignmentCard key={assignment.id} assignment={assignment} returnTo={returnTo} options={options} />)}</div>
          ) : (
            <div className="empty-state"><span className="empty-icon" aria-hidden="true">▤</span><h3>No assignments yet</h3><p>Add the first shift for {formatDate(date, { weekday: undefined })} to build the day’s plan.</p></div>
          )}
        </section>

        <aside className="panel create-panel">
          <div className="panel-heading"><div><p className="eyebrow">BUILD THE DAY</p><h2>Add assignment</h2></div><span className="plus-mark" aria-hidden="true">＋</span></div>
          <p className="panel-intro">Choose who is working, where they’ll be, and what needs doing.</p>
          <AssignmentForm date={date} options={options} />
          <div className="form-footer"><span className="secure-mark" aria-hidden="true">◈</span>Changes save directly to the timetable</div>
        </aside>
      </div>
    </main>
  );
}
