import { getDatabase } from "@/lib/data/client";

export type ResourceKind = "staff" | "locations" | "duties";
export type ResourceRecord = { id: string; name: string; detail: string | null };

export async function listResources(kind: ResourceKind): Promise<ResourceRecord[]> {
  const supabase = await getDatabase();
  if (kind === "staff") {
    const { data, error } = await supabase.from("staff").select("id, name, role").order("name");
    if (error) throw error;
    return (data ?? []).map((row) => ({ id: row.id, name: row.name, detail: row.role }));
  }
  if (kind === "locations") {
    const { data, error } = await supabase.from("locations").select("id, name, notes").order("name");
    if (error) throw error;
    return (data ?? []).map((row) => ({ id: row.id, name: row.name, detail: row.notes }));
  }
  const { data, error } = await supabase.from("duties").select("id, name, description").order("name");
  if (error) throw error;
  return (data ?? []).map((row) => ({ id: row.id, name: row.name, detail: row.description }));
}
