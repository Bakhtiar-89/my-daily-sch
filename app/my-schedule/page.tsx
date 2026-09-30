import { StaffAssignmentCard } from "@/app/components/staff-assignment-card";
import { listPublishedAssignmentsForStaff, listStaff } from "@/lib/data/assignments";
import { getErrorMessage, formatDate, isDateValue, todayInKualaLumpur } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ date?: string; staffId?: string; error?: string; success?: string }>;

export default async function MySchedulePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const date = isDateValue(params.date) ? params.date : todayInKualaLumpur();
  let staff = [] as Awaited<ReturnType<typeof listStaff>>;
  let assignments = [] as Awaited<ReturnType<typeof listPublishedAssignmentsForStaff>>;
  let error = params.error ?? "";
  try {
    staff = await listStaff();
    const selectedStaff = staff.find((person) => person.id === params.staffId) ?? staff[0];
    if (selectedStaff) assignments = await listPublishedAssignmentsForStaff(date, selectedStaff.id);
  } catch (problem) {
    error ||= getErrorMessage(problem);
  }
  const selectedStaff = staff.find((person) => person.id === params.staffId) ?? staff[0];
  const returnTo = `/my-schedule?date=${encodeURIComponent(date)}&staffId=${encodeURIComponent(selectedStaff?.id ?? "")}`;

  return (
    <main className="app-main staff-schedule-page">
      <header className="page-header">
        <div><p className="eyebrow">OPERATIONS / STAFF VIEW</p><h1>My schedule</h1><p className="page-subtitle">Your shifts, locations, and duties for the day.</p></div>
      </header>
      {error && <section className="notice notice-error" role="alert"><span className="notice-icon" aria-hidden="true">!</span><div><strong>Couldn’t load your schedule</strong><p>{error}</p></div></section>}
      {params.success && <p className="notice notice-success" role="status">✓ {params.success}</p>}
      <section className="schedule-controls panel">
        <div><p className="eyebrow">VIEW YOUR SHIFTS</p><h2>Choose your name and date</h2></div>
        {staff.length ? <form action="/my-schedule" className="schedule-filter">
          <label>Staff member<select name="staffId" defaultValue={selectedStaff?.id ?? ""}>{staff.map((person) => <option key={person.id} value={person.id}>{person.name}{person.role ? ` · ${person.role}` : ""}</option>)}</select></label>
          <label>Date<input type="date" name="date" defaultValue={date} /></label>
          <button className="button button-primary" type="submit">Show schedule</button>
        </form> : <p className="schedule-empty-copy">Add your team on the Staff page first.</p>}
      </section>

      {selectedStaff && (
        <section className="staff-day-section">
          <div className="staff-day-heading"><div><p className="eyebrow">{formatDate(date, { weekday: undefined })}</p><h2>{selectedStaff.name}<span>’s shifts</span></h2></div><span className="count-pill">{assignments.length} {assignments.length === 1 ? "shift" : "shifts"}</span></div>
          {assignments.length ? <div className="staff-shift-list">{assignments.map((assignment) => <StaffAssignmentCard key={assignment.id} assignment={assignment} returnTo={returnTo} />)}</div> : (
            <div className="empty-state staff-empty-state"><span className="empty-icon" aria-hidden="true">◷</span><h3>No published shifts for this date</h3><p>Your supervisor’s plan for {formatDate(date, { weekday: undefined })} hasn’t been published yet, or you have no shifts scheduled.</p></div>
          )}
        </section>
      )}
      {!selectedStaff && !error && <div className="empty-state staff-empty-state"><span className="empty-icon" aria-hidden="true">♙</span><h3>No staff to show yet</h3><p>Once your supervisor adds staff members, choose your name here to see your day’s plan.</p></div>}
    </main>
  );
}
