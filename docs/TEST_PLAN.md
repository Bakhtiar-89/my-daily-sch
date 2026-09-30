# Test Plan

## v1 Success Scenario
1. Open app (no login) → dashboard loads with seeded assignments.
2. Go to Staff → add "Ali". Go to Locations → add "Gate 1". Go to Duties → add "Baggage check".
3. Dashboard → pick tomorrow → "Add assignment": Ali, Gate 1, 08:00–16:00, Baggage check, remarks "bring radio". Save.
4. Add a second assignment: Ali, Gate 1, 12:00–20:00 → overlap warning shown (08:00–16:00 vs 12:00–20:00).
5. Click Publish. Badge/status shows Published.
6. Open `/my-schedule`, pick Ali + tomorrow → sees both assignments with location, hours, duties.
7. Tap first assignment status → In Progress → Completed.
8. Dashboard refresh → 1 Completed, 1 Pending, overlap warning visible.

## Empty State
- New date with no assignments → "No assignments yet. Add the first one."
- No staff/locations/duties yet → assignment form shows prompt to create them first.

## Error State
- Save assignment with shift_end before shift_start → validation error, no insert.
- Network failure on status update → toast "Couldn't update. Retry."

## Loading State
- Day grid shows skeleton rows while fetching.

## Refresh Truth
- After any create/update, page reload shows the persisted change (server-derived, not localStorage).