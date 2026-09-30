import { publishTimetable } from "@/lib/actions/assignments";

export function PublishButton({ date, published, disabled }: { date: string; published: boolean; disabled: boolean }) {
  if (published) {
    return <span className="published-state"><span aria-hidden="true">✓</span> Published</span>;
  }
  return (
    <form action={publishTimetable}>
      <input type="hidden" name="date" value={date} />
      <button type="submit" className="button button-primary" disabled={disabled}>
        <span aria-hidden="true">↗</span> Publish timetable
      </button>
    </form>
  );
}
