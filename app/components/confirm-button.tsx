"use client";

export function ConfirmButton({ label, message }: { label: string; message: string }) {
  return <button className="button button-danger-quiet" type="submit" onClick={(event) => { if (!window.confirm(message)) event.preventDefault(); }}>{label}</button>;
}
