"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/data/client";
import type { ResourceKind } from "@/lib/data/resources";
import { addNotice } from "@/lib/utils";

const paths: Record<ResourceKind, string> = {
  staff: "/staff",
  locations: "/locations",
  duties: "/duties",
};

function isResourceKind(value: string): value is ResourceKind {
  return value === "staff" || value === "locations" || value === "duties";
}

export async function saveResource(formData: FormData) {
  const kindValue = String(formData.get("resource") ?? "");
  if (!isResourceKind(kindValue)) redirect("/?error=Unknown+directory");
  const kind = kindValue;
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const detail = String(formData.get("detail") ?? "").trim() || null;
  const path = paths[kind];
  if (!name) redirect(addNotice(path, "error", "Enter a name before saving."));

  const supabase = await getDatabase();
  let error: { message: string } | null = null;
  if (kind === "staff") {
    const result = id
      ? await supabase.from("staff").update({ name, role: detail }).eq("id", id)
      : await supabase.from("staff").insert({ name, role: detail });
    error = result.error;
  } else if (kind === "locations") {
    const result = id
      ? await supabase.from("locations").update({ name, notes: detail }).eq("id", id)
      : await supabase.from("locations").insert({ name, notes: detail });
    error = result.error;
  } else {
    const result = id
      ? await supabase.from("duties").update({ name, description: detail }).eq("id", id)
      : await supabase.from("duties").insert({ name, description: detail });
    error = result.error;
  }
  if (error) redirect(addNotice(path, "error", error.message));
  revalidatePath(path);
  revalidatePath("/");
  revalidatePath("/my-schedule");
  redirect(addNotice(path, "success", id ? "Changes saved." : "Added to the directory."));
}

export async function deleteResource(formData: FormData) {
  const kindValue = String(formData.get("resource") ?? "");
  if (!isResourceKind(kindValue)) redirect("/?error=Unknown+directory");
  const kind = kindValue;
  const id = String(formData.get("id") ?? "");
  const path = paths[kind];
  if (!id) redirect(addNotice(path, "error", "Choose a record to remove."));

  const supabase = await getDatabase();
  const relationColumn = kind === "staff" ? "staff_id" : kind === "locations" ? "location_id" : "duty_id";
  const { count, error: assignmentError } = await supabase
    .from("assignments")
    .select("id", { count: "exact", head: true })
    .eq(relationColumn, id);
  if (assignmentError) redirect(addNotice(path, "error", assignmentError.message));
  if ((count ?? 0) > 0) {
    redirect(addNotice(path, "error", "This record is used by an assignment. Update or remove its assignments first."));
  }

  const { error } = await supabase.from(kind).delete().eq("id", id);
  if (error) redirect(addNotice(path, "error", error.message));
  revalidatePath(path);
  revalidatePath("/");
  redirect(addNotice(path, "success", "Removed from the directory."));
}
