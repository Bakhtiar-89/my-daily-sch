import { updateAssignmentStatus } from "@/lib/actions/assignments";
import type { Assignment } from "@/lib/types";
import { formatTime } from "@/lib/utils";

const nextStatus = {
  Pending: { value: "In Progress", label: "Start task", icon: "▶" },
  "In Progress": { value: "Completed", label: "Mark complete", icon: "✓" },
} as const;

export function AssignmentCard({ assignment, returnTo }: { assignment: Assignment; returnTo: string }) {
  const next = assignment.task_status === "Completed" ? null : nextStatus[assignment.task_status];
  return (
    <article className="assignment-card">
      <div className="assignment-time">
        <strong>{formatTime(assignment.shift_start)}</strong>
        <span>{formatTime(assignment.shift_end)}</span>
      </div>
      <div className="assignment-main">
        <div className="assignment-title-row">
          <h3>{assignment.duties?.name ?? "Unassigned duty"}</h3>
          <span className={`status-badge status-${assignment.task_status.toLowerCase().replaceAll(" ", "-")}`}>
            <span className="status-dot" />{assignment.task_status}
          </span>
        </div>
        <p className="assignment-location"><span aria-hidden="true">⌖</span>{assignment.locations?.name ?? "No location"}<span className="assignment-divider">·</span>{assignment.staff?.name ?? "Unassigned staff"}</p>
        {assignment.remarks && <p className="assignment-remarks">“{assignment.remarks}”</p>}
      </div>
      <div className="assignment-actions">
        {next ? (
          <form action={updateAssignmentStatus}>
            <input type="hidden" name="id" value={assignment.id} />
            <input type="hidden" name="status" value={next.value} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <button className="button button-subtle" type="submit"><span aria-hidden="true">{next.icon}</span>{next.label}</button>
          </form>
        ) : <span className="completed-mark"><span aria-hidden="true">✓</span> All done</span>}
      </div>
    </article>
  );
}
