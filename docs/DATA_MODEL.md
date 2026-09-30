# Data Model

## staff
- id uuid pk
- name text not null
- role text
- created_at timestamptz default now()
- user_id uuid nullable (future owner scope)

## locations
- id uuid pk
- name text not null
- notes text
- created_at timestamptz default now()
- user_id uuid nullable

## duties
- id uuid pk
- name text not null
- description text
- created_at timestamptz default now()
- user_id uuid nullable

## assignments
- id uuid pk
- staff_id uuid → staff.id
- location_id uuid → locations.id
- duty_id uuid → duties.id
- date date not null
- shift_start time not null
- shift_end time not null
- task_status text not null default 'Pending' check (Pending/In Progress/Completed)
- remarks text
- published boolean default false
- created_at timestamptz default now()
- user_id uuid nullable

## Relationships
- assignment → staff, location, duty (many-to-one each).
- One staff can have multiple assignments per date (overlap flagged in app, not blocked).

## RLS / Permissions
- v1: permissive read/write (demo-first, no login wall).
- Lock-down: owner-scoped `auth.uid() = user_id` on all tables.

## AI Fields
None in v1.