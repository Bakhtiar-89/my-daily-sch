# Security

## Secret Handling
- Supabase URL + anon key in `NEXT_PUBLIC_` env (safe for browser).
- Service role key server-side only, never in frontend bundle.
- No secrets committed to repo.

## Permission Model
- v1: permissive RLS (demo-first, no login wall). Reads and writes open.
- Lock-down sprint: replace permissive policies with `auth.uid() = user_id` on every table.
- Supervisors and staff distinguished by role (future `profiles.role`).

## Approved-Tools Rule
- No agentic tools in v1.
- Later: agent may only call named tools in an allowlist; never raw SQL execution or arbitrary HTTP.

## Audit Principle
- Every meaningful write (create/publish/status change) logged via Supabase or future audit table.
- Agent (later) inherits the acting user's permissions — cannot exceed.

## Honest Note
Per-user RLS + role-based access is genuinely important. If the lock-down sprint feels uncertain, stop and get a human before real staff data goes in.