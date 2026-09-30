# Intelligence Layer

No AI in v1. This doc describes the additive layer planned for later.

## Messy Inputs (future)
- Free-text duty descriptions, informal staff names from WhatsApp messages.
- Supervisor's rough shift notes pasted as a block.

## Auto-Structure Schema (future)
```json
{
  "parsed_assignments": [
    {"staff": "Ali", "location": "Gate 1", "start": "08:00", "end": "16:00", "duty": "Security check", "remarks": "bring radio"}
  ],
  "warnings": ["Ali double-booked 08:00-12:00"],
  "confidence": 0.88
}
```

## Events to Track (future)
- assignment_created, assignment_published, status_changed, overlap_detected.

## Scoring Rules (future, rule-based first)
- Overlap score = count of assignments where same staff + overlapping time range on same date.
- Completion rate = completed / total for a date.
- At-risk flag = date is today AND pending count > 0 AND current time > shift_start.

## What Gets Ranked (future)
- Assignments needing attention (overdue first, then in-progress, then pending).

## v1 vs Later
- v1: pure manual CRUD + status flow.
- Later: paste-to-structu re, conflict suggestions, smart ranking.