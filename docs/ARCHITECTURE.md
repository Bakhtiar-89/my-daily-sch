# Architecture

## Stack
Next.js (App Router) + Supabase (Postgres + RLS) + Vercel.

## Build Now vs Later
**Now (v1):** staff/location/duty CRUD, assignment creation, publish, staff view, status update, supervisor dashboard with overlap detection.
**Later:** auth + per-user RLS, recurring schedules, notifications, conflict auto-resolver, export.

## Key User Action Flow (Supervisor creates assignment)
1. Supervisor picks a date on the dashboard.
2. Clicks "Add assignment" → selects staff, location, shift start/end, duty, types remarks.
3. Form validates no time inversion; overlap warning shown if staff is double-booked.
4. Save → row inserted → assignment appears in day grid.
5. Supervisor clicks "Publish" → timetable marked published.
6. Staff opens `/my-schedule?date=` → sees own assignments.
7. Staff taps status → updates to In Progress / Completed → supervisor dashboard refreshes.

## Responsive Nav Shell
Persistent left sidebar on desktop (Dashboard, Staff, Locations, Duties, My Schedule). Collapses to hamburger menu on mobile. Current section highlighted.

## Layer Plan
1. **Data layer** — Supabase tables, RLS (permissive v1), seed rows.
2. **App logic** — `lib/data/` for all DB access; server actions for create/publish/status-update.
3. **Smart features** — none in v1; later: conflict suggestions, duty templates.

## Why Core Runs Without AI
Core engine is manual CRUD + status flow. No AI fields in v1. Intelligence layer is additive, never required.

## Repo Structure
```
src/
  app/
    (dashboard)/page.tsx
    staff/page.tsx
    locations/page.tsx
    duties/page.tsx
    my-schedule/page.tsx
    components/  (layout, sidebar, forms, grids)
  lib/
    data/        (staff.ts, locations.ts, duties.ts, assignments.ts)
    actions/     (createAssignment.ts, publishTimetable.ts, updateStatus.ts)
    ai/          (empty in v1)
  tests/
```

## Module Map
| Module | Responsibility | Owns | Build Order |
|---|---|---|---|
| assignments | Core engine: create/list/update assignments, publish, overlap detect | assignments table | 1st |
| staff | Staff CRUD | staff table | 2nd |
| locations | Location CRUD | locations table | 2nd |
| duties | Duty CRUD | duties table | 2nd |
| schedule-view | Staff-facing read-only schedule by date | assignments (read) | 3rd |
| dashboard | Supervisor overview, status counts, warnings | assignments + staff (read) | 3rd |