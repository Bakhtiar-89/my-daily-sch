import { deleteResource, saveResource } from "@/lib/actions/resources";
import type { ResourceKind, ResourceRecord } from "@/lib/data/resources";
import { ConfirmButton } from "@/app/components/confirm-button";

const copy: Record<ResourceKind, { title: string; eyebrow: string; noun: string; detailLabel: string; detailPlaceholder: string; intro: string; empty: string; icon: string }> = {
  staff: { title: "Staff", eyebrow: "TEAM DIRECTORY", noun: "staff member", detailLabel: "Role or team", detailPlaceholder: "e.g. Operations", intro: "Keep names and roles ready for the daily roster.", empty: "Add the first person to your operations team.", icon: "♙" },
  locations: { title: "Locations", eyebrow: "WORK SITES", noun: "location", detailLabel: "Location notes", detailPlaceholder: "e.g. Main entrance", intro: "List the places your team covers each day.", empty: "Add the first place where work happens.", icon: "⌖" },
  duties: { title: "Duties", eyebrow: "TASK LIBRARY", noun: "duty", detailLabel: "Description", detailPlaceholder: "What does this duty involve?", intro: "Define the work staff can be assigned to do.", empty: "Add the first duty for your operations team.", icon: "☷" },
};

export function ResourceDirectory({
  kind,
  records,
  error,
  success,
}: {
  kind: ResourceKind;
  records: ResourceRecord[];
  error?: string;
  success?: string;
}) {
  const labels = copy[kind];
  return (
    <main className="app-main">
      <header className="page-header directory-page-header">
        <div><p className="eyebrow">{labels.eyebrow}</p><h1>{labels.title}</h1><p className="page-subtitle">{labels.intro}</p></div>
        <span className="directory-count"><strong>{records.length}</strong> {records.length === 1 ? labels.noun : `${labels.noun}s`}</span>
      </header>
      {error && <p className="notice notice-error" role="alert">{error}</p>}
      {success && <p className="notice notice-success" role="status">✓ {success}</p>}
      <div className="directory-layout">
        <section className="panel directory-panel">
          <div className="panel-heading"><div><p className="eyebrow">AVAILABLE FOR SCHEDULING</p><h2>{labels.title} <span className="count-pill">{records.length}</span></h2></div></div>
          {records.length ? (
            <div className="resource-list">
              {records.map((record) => (
                <div className="resource-row" key={record.id}>
                  <div className="resource-avatar" aria-hidden="true">{record.name.slice(0, 1).toUpperCase()}</div>
                  <form action={saveResource} className="resource-edit-form">
                    <input type="hidden" name="resource" value={kind} />
                    <input type="hidden" name="id" value={record.id} />
                    <label className="sr-only" htmlFor={`${record.id}-name`}>{labels.noun} name</label>
                    <input id={`${record.id}-name`} name="name" required defaultValue={record.name} aria-label={`${labels.noun} name`} />
                    <label className="sr-only" htmlFor={`${record.id}-detail`}>{labels.detailLabel}</label>
                    <input id={`${record.id}-detail`} name="detail" defaultValue={record.detail ?? ""} placeholder={labels.detailPlaceholder} aria-label={labels.detailLabel} />
                    <button className="button button-light save-resource" type="submit">Save</button>
                  </form>
                  <form action={deleteResource} className="resource-delete-form">
                    <input type="hidden" name="resource" value={kind} />
                    <input type="hidden" name="id" value={record.id} />
                    <ConfirmButton label="Remove" message={`Remove ${record.name} from this directory? Records used by assignments cannot be removed.`} />
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state directory-empty"><span className="empty-icon" aria-hidden="true">{labels.icon}</span><h3>No {labels.title.toLowerCase()} yet</h3><p>{labels.empty}</p></div>
          )}
        </section>
        <aside className="panel add-resource-panel">
          <div className="panel-heading"><div><p className="eyebrow">GROW YOUR DIRECTORY</p><h2>Add {labels.noun}</h2></div><span className="plus-mark" aria-hidden="true">＋</span></div>
          <form action={saveResource} className="assignment-form">
            <input type="hidden" name="resource" value={kind} />
            <label>{labels.noun.charAt(0).toUpperCase() + labels.noun.slice(1)} name<input name="name" required placeholder={kind === "staff" ? "e.g. Aina Rahman" : kind === "locations" ? "e.g. North Entrance" : "e.g. Equipment check"} /></label>
            <label>{labels.detailLabel}<span className="label-optional">Optional</span><input name="detail" placeholder={labels.detailPlaceholder} /></label>
            <button className="button button-primary button-full" type="submit"><span aria-hidden="true">＋</span> Add {labels.noun}</button>
          </form>
          <div className="form-footer"><span className="secure-mark" aria-hidden="true">◈</span>Available in the assignment form right away</div>
        </aside>
      </div>
    </main>
  );
}
