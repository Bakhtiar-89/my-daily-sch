import { updateAssignmentStatus } from "@/lib/actions/assignments";
import type { Assignment } from "@/lib/types";
import { formatTime } from "@/lib/utils";

export function StaffAssignmentCard({ assignment, returnTo }: { assignment: Assignment; returnTo: string }) {
  const next = assignment.task_status === "Pending"
    ? { value: "In Progress", label: "Start this duty", icon: "▶" }
    : assignment.task_status === "In Progress"
      ? { value: "Completed", label: "Mark as complete", icon: "✓" }
      : null;

  return (
    <article className="staff-shift-card">
      <div className="staff-shift-time"><strong>{formatTime(assignment.shift_start)}</strong><span>to</span><strong>{formatTime(assignment.shift_end)}</strong></div>
      <div className="staff-shift-main">
        <div className="staff-shift-heading"><span className="eyebrow">YOUR DUTY</span><span className={`status-badge status-${assignment.task_status.toLowerCase().replaceAll(" ", "-")}`}><span className="status-dot" />{assignment.task_status}</span></div>
        <h2>{assignment.duties?.name ?? "Unassigned duty"}</h2>
        <div className="staff-shift-details"><span><i aria-hidden="true">⌖</i>{assignment.locations?.name ?? "No location"}</span><span><i aria-hidden="true">♙</i>{assignment.staff?.name ?? "Staff member"}</span></div>
        {assignment.remarks && <p className="staff-shift-remarks"><strong>Shift note</strong>{assignment.remarks}</p>}
      </div>
      <div className="staff-shift-action">
        {next ? <form action={updateAssignmentStatus}>
          <input type="hidden" name="id" value={assignment.id} />
          <input type="hidden" name="status" value={next.value} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <button className="button button-primary" type="submit"><span aria-hidden="true">{next.icon}</span>{next.label}</button>
        </form> : <span className="staff-complete"><span aria-hidden="true">✓</span> Duty completed</span>}
      </div>
    </article>
  );
}
