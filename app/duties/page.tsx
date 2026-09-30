import { ResourceDirectory } from "@/app/components/resource-directory";
import { listResources } from "@/lib/data/resources";
import { getErrorMessage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DutiesPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const params = await searchParams;
  let records = [] as Awaited<ReturnType<typeof listResources>>;
  let error = params.error ?? "";
  try { records = await listResources("duties"); } catch (problem) { error ||= getErrorMessage(problem); }
  return <ResourceDirectory kind="duties" records={records} error={error} success={params.success} />;
}
