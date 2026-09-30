# Daily Schedule — PRD

## Problem
Daily staff assignment is done via WhatsApp, Excel, or paper. Staff don't know where to go, when, or what to do. Supervisors can't see unfinished tasks or overlapping assignments.

## Target User
- **Supervisor**: creates and publishes the daily timetable, monitors progress.
- **Staff**: views own assignments, updates task status.

## Core Objects
- **Staff** — name, role.
- **Location** — name, notes.
- **Duty** — name, description.
- **Assignment** — date, staff_id, location_id, shift_start, shift_end, duty_id, task_status (Pending/In Progress/Completed), remarks.

## MVP (v1) Checklist
- [ ] Supervisor can create staff, locations, duties.
- [ ] Supervisor can create assignments for a date with location, shift times, duty, remarks.
- [ ] Supervisor can publish the daily timetable.
- [ ] Staff can view their assignments filtered by date.
- [ ] Staff can update task status (Pending → In Progress → Completed).
- [ ] Supervisor dashboard: all assignments for a date, status counts, overlap warnings.
- [ ] Mobile-friendly web app, no login wall (demo-first).

## Non-Goals (v1)
No payroll, biometric attendance, GPS tracking, leave management, AI features, native mobile app, multi-tenant orgs.

## Success Criteria
A supervisor builds tomorrow's timetable (3 staff, 2 locations, 4 assignments) and publishes it. Each staff member opens the app on their phone, sees their location, shift hours, and duties. One staff member marks a duty In Progress then Completed. The supervisor sees 3 of 4 completed and one remaining Pending, with an overlap warning on a double-booked staff member. All within the live app, no seed-only screens.