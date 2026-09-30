import { createAssignment } from "@/lib/actions/assignments";
import type { Assignment, AssignmentOptions } from "@/lib/types";

export function AssignmentForm({
  date,
  options,
  assignment,
}: {
  date: string;
  options: AssignmentOptions;
  assignment?: Assignment;
}) {
  const ready = options.staff.length > 0 && options.locations.length > 0 && options.duties.length > 0;

  return (
    <form action={createAssignment} className="assignment-form">
      <input type="hidden" name="date" value={date} />
      {assignment && <input type="hidden" name="id" value={assignment.id} />}
      <label>
        Staff member
        <select name="staffId" required defaultValue={assignment?.staff_id ?? ""}>
          <option value="" disabled>Select staff</option>
          {options.staff.map((person) => (
            <option key={person.id} value={person.id}>{person.name}{person.role ? ` · ${person.role}` : ""}</option>
          ))}
        </select>
      </label>
      <div className="form-two-columns">
        <label>
          Work location
          <select name="locationId" required defaultValue={assignment?.location_id ?? ""}>
            <option value="" disabled>Select location</option>
            {options.locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
          </select>
        </label>
        <label>
          Duty
          <select name="dutyId" required defaultValue={assignment?.duty_id ?? ""}>
            <option value="" disabled>Select duty</option>
            {options.duties.map((duty) => <option key={duty.id} value={duty.id}>{duty.name}</option>)}
          </select>
        </label>
      </div>
      <div className="form-two-columns">
        <label>
          Start time
          <input name="shiftStart" type="time" required defaultValue={assignment?.shift_start.slice(0, 5) ?? "08:00"} />
        </label>
        <label>
          End time
          <input name="shiftEnd" type="time" required defaultValue={assignment?.shift_end.slice(0, 5) ?? "16:00"} />
        </label>
      </div>
      <label>
        Notes for the shift <span className="label-optional">Optional</span>
        <textarea name="remarks" rows={3} defaultValue={assignment?.remarks ?? ""} placeholder="Anything the team should know?" />
      </label>
      {!ready && <p className="form-hint">Add at least one staff member, location, and duty before creating an assignment.</p>}
      <button className="button button-primary button-full" type="submit" disabled={!ready}>
        {assignment ? "Save assignment" : "＋ Add assignment"}
      </button>
    </form>
  );
}
