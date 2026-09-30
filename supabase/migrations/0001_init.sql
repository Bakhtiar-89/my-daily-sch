create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table staff enable row level security;
drop policy if exists "staff_v1_read" on staff;
create policy "staff_v1_read" on staff for select using (true);
drop policy if exists "staff_v1_write" on staff;
create policy "staff_v1_write" on staff for all using (true) with check (true);

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  notes text,
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table locations enable row level security;
drop policy if exists "locations_v1_read" on locations;
create policy "locations_v1_read" on locations for select using (true);
drop policy if exists "locations_v1_write" on locations;
create policy "locations_v1_write" on locations for all using (true) with check (true);

create table if not exists duties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table duties enable row level security;
drop policy if exists "duties_v1_read" on duties;
create policy "duties_v1_read" on duties for select using (true);
drop policy if exists "duties_v1_write" on duties;
create policy "duties_v1_write" on duties for all using (true) with check (true);

create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references staff(id) on delete cascade,
  location_id uuid references locations(id) on delete cascade,
  duty_id uuid references duties(id) on delete cascade,
  date date not null,
  shift_start time not null,
  shift_end time not null,
  task_status text not null default 'Pending' check (task_status in ('Pending','In Progress','Completed')),
  remarks text,
  published boolean not null default false,
  user_id uuid,
  created_at timestamptz not null default now()
);
alter table assignments enable row level security;
drop policy if exists "assignments_v1_read" on assignments;
create policy "assignments_v1_read" on assignments for select using (true);
drop policy if exists "assignments_v1_write" on assignments;
create policy "assignments_v1_write" on assignments for all using (true) with check (true);

insert into staff (name, role) select 'Ali Hassan', 'Security' where not exists (select 1 from staff where name = 'Ali Hassan');
insert into staff (name, role) select 'Sara Lee', 'Operations' where not exists (select 1 from staff where name = 'Sara Lee');
insert into staff (name, role) select 'John Tan', 'Logistics' where not exists (select 1 from staff where name = 'John Tan');

insert into locations (name, notes) select 'Gate 1', 'Main entrance' where not exists (select 1 from locations where name = 'Gate 1');
insert into locations (name, notes) select 'Warehouse A', 'Loading bay' where not exists (select 1 from locations where name = 'Warehouse A');
insert into locations (name, notes) select 'Control Room', 'Level 2' where not exists (select 1 from locations where name = 'Control Room');

insert into duties (name, description) select 'Baggage check', 'Screen all incoming baggage' where not exists (select 1 from duties where name = 'Baggage check');
insert into duties (name, description) select 'Perimeter patrol', 'Hourly perimeter walk' where not exists (select 1 from duties where name = 'Perimeter patrol');
insert into duties (name, description) select 'Loading supervision', 'Oversee loading operations' where not exists (select 1 from duties where name = 'Loading supervision');

insert into assignments (staff_id, location_id, duty_id, date, shift_start, shift_end, task_status, remarks, published)
select s.id, l.id, d.id, current_date, '08:00', '16:00', 'Completed', 'All clear', true
from staff s, locations l, duties d
where s.name = 'Ali Hassan' and l.name = 'Gate 1' and d.name = 'Baggage check'
and not exists (select 1 from assignments where staff_id = s.id and date = current_date and shift_start = '08:00');

insert into assignments (staff_id, location_id, duty_id, date, shift_start, shift_end, task_status, remarks, published)
select s.id, l.id, d.id, current_date, '09:00', '17:00', 'In Progress', 'Hourly logs required', true
from staff s, locations l, duties d
where s.name = 'Sara Lee' and l.name = 'Control Room' and d.name = 'Perimeter patrol'
and not exists (select 1 from assignments where staff_id = s.id and date = current_date and shift_start = '09:00');

insert into assignments (staff_id, location_id, duty_id, date, shift_start, shift_end, task_status, remarks, published)
select s.id, l.id, d.id, current_date, '14:00', '22:00', 'Pending', 'Check pallet counts', true
from staff s, locations l, duties d
where s.name = 'John Tan' and l.name = 'Warehouse A' and d.name = 'Loading supervision'
and not exists (select 1 from assignments where staff_id = s.id and date = current_date and shift_start = '14:00');

insert into assignments (staff_id, location_id, duty_id, date, shift_start, shift_end, task_status, remarks, published)
select s.id, l.id, d.id, current_date + 1, '08:00', '16:00', 'Pending', 'Bring radio', false
from staff s, locations l, duties d
where s.name = 'Ali Hassan' and l.name = 'Gate 1' and d.name = 'Baggage check'
and not exists (select 1 from assignments where staff_id = s.id and date = current_date + 1 and shift_start = '08:00');

insert into assignments (staff_id, location_id, duty_id, date, shift_start, shift_end, task_status, remarks, published)
select s.id, l.id, d.id, current_date + 1, '12:00', '20:00', 'Pending', '', false
from staff s, locations l, duties d
where s.name = 'Ali Hassan' and l.name = 'Control Room' and d.name = 'Perimeter patrol'
and not exists (select 1 from assignments where staff_id = s.id and date = current_date + 1 and shift_start = '12:00');
