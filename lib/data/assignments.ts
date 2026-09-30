import { getDatabase } from "@/lib/data/client";
import type { Assignment, AssignmentOptions, Duty, Location, Staff } from "@/lib/types";

const assignmentSelect = `
  id, date, staff_id, location_id, duty_id, shift_start, shift_end,
  task_status, remarks, published,
  staff (name, role), locations (name), duties (name)
`;

export async function listAssignments(date: string): Promise<Assignment[]> {
  const supabase = await getDatabase();
  const { data, error } = await supabase
    .from("assignments")
    .select(assignmentSelect)
    .eq("date", date)
    .order("shift_start", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Assignment[];
}

export async function listStaff(): Promise<Staff[]> {
  const supabase = await getDatabase();
  const { data, error } = await supabase.from("staff").select("id, name, role").order("name");
  if (error) throw error;
  return (data ?? []) as Staff[];
}

export async function listPublishedAssignmentsForStaff(date: string, staffId: string): Promise<Assignment[]> {
  const supabase = await getDatabase();
  const { data, error } = await supabase
    .from("assignments")
    .select(assignmentSelect)
    .eq("date", date)
    .eq("staff_id", staffId)
    .eq("published", true)
    .order("shift_start", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Assignment[];
}

export async function getAssignmentOptions(): Promise<AssignmentOptions> {
  const supabase = await getDatabase();
  const [staffResult, locationResult, dutyResult] = await Promise.all([
    supabase.from("staff").select("id, name, role").order("name"),
    supabase.from("locations").select("id, name, notes").order("name"),
    supabase.from("duties").select("id, name, description").order("name"),
  ]);
  if (staffResult.error) throw staffResult.error;
  if (locationResult.error) throw locationResult.error;
  if (dutyResult.error) throw dutyResult.error;
  return {
    staff: (staffResult.data ?? []) as Staff[],
    locations: (locationResult.data ?? []) as Location[],
    duties: (dutyResult.data ?? []) as Duty[],
  };
}

export function findOverlaps(assignments: Assignment[]) {
  const overlaps: { staff: string; first: Assignment; second: Assignment }[] = [];
  for (let left = 0; left < assignments.length; left += 1) {
    for (let right = left + 1; right < assignments.length; right += 1) {
      const first = assignments[left];
      const second = assignments[right];
      if (
        first.staff_id === second.staff_id &&
        first.shift_start < second.shift_end &&
        second.shift_start < first.shift_end
      ) {
        overlaps.push({ staff: first.staff?.name ?? "A staff member", first, second });
      }
    }
  }
  return overlaps;
}
