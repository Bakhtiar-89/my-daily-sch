# Agentic Layer

No agentic actions in v1. Outlined for later.

## Draftable Actions (low risk, auto)
- Draft tomorrow's timetable from today's template (later).
- Tag / summarise remarks (later).

## Executable After Approval (medium)
- Auto-publish timetable after supervisor confirms.
- Auto-update task status to Completed when shift_end passes and remarks present.

## Human-Only (critical)
- Delete assignment.
- Change published timetable.

## Named Tools (future)
- `draft_from_template(date)`
- `detect_overlaps(date)`
- `flag_overdue(date)`

## Audit Log Fields (future table)
- id, actor_user_id, action, target_table, target_id, before jsonb, after jsonb, created_at.

## v1 vs Later
- v1: none. Status updates are direct user actions, not agent-driven.
- Later: drafting + monitoring agents with named tools + audit.