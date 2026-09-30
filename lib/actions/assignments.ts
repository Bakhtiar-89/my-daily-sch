"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/data/client";
import type { TaskStatus } from "@/lib/types";
import { addNotice, safeLocalPath, isDateValue } from "@/lib/utils";

const validStatuses: TaskStatus[] = ["Pending", "In Progress", "Completed"];

export async function createAssignment(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const date = String(formData.get("date") ?? "");
  const staffId = String(formData.get("staffId") ?? "");
  const locationId = String(formData.get("locationId") ?? "");
  const dutyId = String(formData.get("dutyId") ?? "");
  const shiftStart = String(formData.get("shiftStart") ?? "");
  const shiftEnd = String(formData.get("shiftEnd") ?? "");
  const remarks = String(formData.get("remarks") ?? "").trim();

  if (!isDateValue(date) || !staffId || !locationId || !dutyId || !shiftStart || !shiftEnd) {
    redirect(addNotice(`/?date=${encodeURIComponent(date)}`, "error", "Complete every required field."));
  }
  if (shiftEnd <= shiftStart) {
    redirect(addNotice(`/?date=${encodeURIComponent(date)}`, "error", "End time must be later than start time."));
  }

  const supabase = await getDatabase();
  const values = {
    date,
    staff_id: staffId,
    location_id: locationId,
    duty_id: dutyId,
    shift_start: shiftStart,
    shift_end: shiftEnd,
    remarks: remarks || null,
  };
  const { error } = id
    ? await supabase.from("assignments").update(values).eq("id", id).select("id").single()
    : await supabase.from("assignments").insert(values);
  if (error) redirect(addNotice(`/?date=${encodeURIComponent(date)}`, "error", error.message));

  revalidatePath("/");
  revalidatePath("/my-schedule");
  redirect(addNotice(`/?date=${encodeURIComponent(date)}`, "success", id ? "Assignment changes saved." : "Assignment added to the timetable."));
}

export async function deleteAssignment(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const returnTo = safeLocalPath(String(formData.get("returnTo") ?? ""), "/");
  if (!id) redirect(addNotice(returnTo, "error", "Choose an assignment to remove."));
  const supabase = await getDatabase();
  const { error } = await supabase.from("assignments").delete().eq("id", id).select("id").single();
  if (error) redirect(addNotice(returnTo, "error", error.message));
  revalidatePath("/");
  revalidatePath("/my-schedule");
  redirect(addNotice(returnTo, "success", "Assignment removed."));
}

export async function updateAssignmentStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const returnTo = safeLocalPath(String(formData.get("returnTo") ?? ""), "/");
  if (!id || !validStatuses.includes(status as TaskStatus)) {
    redirect(addNotice(returnTo, "error", "Choose a valid task status."));
  }

  const supabase = await getDatabase();
  const { error } = await supabase.from("assignments").update({ task_status: status }).eq("id", id);
  if (error) redirect(addNotice(returnTo, "error", error.message));
  revalidatePath("/");
  revalidatePath("/my-schedule");
  redirect(addNotice(returnTo, "success", "Task status updated."));
}

export async function publishTimetable(formData: FormData) {
  const date = String(formData.get("date") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    redirect(addNotice("/", "error", "Choose a valid timetable date."));
  }
  const supabase = await getDatabase();
  const { error } = await supabase.from("assignments").update({ published: true }).eq("date", date);
  if (error) redirect(addNotice(`/?date=${encodeURIComponent(date)}`, "error", error.message));
  revalidatePath("/");
  revalidatePath("/my-schedule");
  redirect(addNotice(`/?date=${encodeURIComponent(date)}`, "success", "Timetable published for staff."));
}
