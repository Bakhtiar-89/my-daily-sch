import { createAssignment } from "@/lib/actions/assignments";
import type { AssignmentOptions } from "@/lib/types";

export function AssignmentForm({
  date,
  options,
}: {
  date: string;
  options: AssignmentOptions;
}) {
  const ready = options.staff.length > 0 && options.locations.length > 0 && options.duties.length > 0;

  return (
    <form action={createAssignment} className="assignment-form">
      <input type="hidden" name="date" value={date} />
      <label>
        Staff member
        <select name="staffId" required defaultValue="">
          <option value="" disabled>Select staff</option>
          {options.staff.map((person) => (
            <option key={person.id} value={person.id}>{person.name}{person.role ? ` · ${person.role}` : ""}</option>
          ))}
        </select>
      </label>
      <div className="form-two-columns">
        <label>
          Work location
          <select name="locationId" required defaultValue="">
            <option value="" disabled>Select location</option>
            {options.locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
          </select>
        </label>
        <label>
          Duty
          <select name="dutyId" required defaultValue="">
            <option value="" disabled>Select duty</option>
            {options.duties.map((duty) => <option key={duty.id} value={duty.id}>{duty.name}</option>)}
          </select>
        </label>
      </div>
      <div className="form-two-columns">
        <label>
          Start time
          <input name="shiftStart" type="time" required defaultValue="08:00" />
        </label>
        <label>
          End time
          <input name="shiftEnd" type="time" required defaultValue="16:00" />
        </label>
      </div>
      <label>
        Notes for the shift <span className="label-optional">Optional</span>
        <textarea name="remarks" rows={3} placeholder="Anything the team should know?" />
      </label>
      {!ready && <p className="form-hint">Add at least one staff member, location, and duty before creating an assignment.</p>}
      <button className="button button-primary button-full" type="submit" disabled={!ready}>
        <span aria-hidden="true">＋</span> Add assignment
      </button>
    </form>
  );
}
