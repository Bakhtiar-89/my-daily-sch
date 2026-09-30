# Sprints

## Sprint 1 — Core Engine: Assignments
**Goal:** Create, list, update assignments against the DB, end-to-end.
- [ ] Supabase schema + seed (staff, locations, duties, assignments).
- [ ] `lib/data/` for all tables.
- [ ] Assignment create form (date, staff, location, shift start/end, duty, remarks).
- [ ] Day grid listing assignments for a selected date.
- [ ] Status update (Pending → In Progress → Completed).
- [ ] Publish toggle.
**DoD:** Supervisor can create 4 assignments for a date, publish, and change a status — all persisted, visible after refresh. No login wall.

## Sprint 2 — Setup Data + Dashboard
**Goal:** Manage staff/locations/duties; supervisor overview.
- [ ] Staff CRUD page.
- [ ] Locations CRUD page.
- [ ] Duties CRUD page.
- [ ] Dashboard: status counts, overlap warnings.
- [ ] Responsive sidebar shell.
**DoD:** All CRUD persists; dashboard shows counts + overlap warning for a double-booked staff member.

## Sprint 3 — Staff Schedule View (v1 FUNCTIONAL)
**Goal:** Staff-facing mobile view; success scenario usable.
- [ ] `/my-schedule` page filtered by date + staff (demo picker).
- [ ] Mobile-friendly layout, status tap-to-update.
- [ ] Empty/loading/error states for all pages.
**DoD (v1 milestone):** Success scenario from PRD runs end-to-end live — supervisor builds + publishes, staff views + updates, supervisor sees progress. This is the first handoff pass completion.

## Sprint 4 — Lock It Down
**Goal:** Auth + per-user RLS.
- [ ] Supabase auth (signup/login).
- [ ] Replace permissive policies with owner-scoped RLS.
- [ ] Role field (supervisor/staff); gate create/publish to supervisor.
- [ ] Remove demo seed from prod flow.
**DoD:** Logged-out user cannot write; only owner rows visible. Get human review on RLS before real data.

## Text Gantt
| Task | S1 | S2 | S3 | S4 |
|---|---|---|---|---|
| Schema + seed | x | | | |
| Assignment CRUD + status + publish | x | | | |
| Staff/Locations/Duties CRUD | | x | | |
| Dashboard + overlaps | | x | | |
| Staff schedule view | | | x | |
| Empty/error/loading states | | | x | |
| Auth + RLS lock-down | | | | x |