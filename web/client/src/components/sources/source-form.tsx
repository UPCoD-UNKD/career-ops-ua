import { useState } from "react";
import { SOURCE_TYPES } from "@/lib/constants";

export function SourceForm({ onSubmit, onCancel }: {
  onSubmit: (data: { name: string; type: string; config: Record<string, unknown> }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<string>("greenhouse");
  const [careersUrl, setCareersUrl] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, type, config: careersUrl ? { careers_url: careersUrl } : {} });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border rounded-lg">
      <input placeholder="Company name" value={name} onChange={(e) => setName(e.target.value)} required
        className="rounded-md border bg-background px-3 py-2 text-sm" />
      <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
        {SOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <input placeholder="Careers URL (e.g. https://jobs.ashbyhq.com/company)" value={careersUrl} onChange={(e) => setCareersUrl(e.target.value)}
        className="rounded-md border bg-background px-3 py-2 text-sm" />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-sm hover:bg-accent">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90">Add Source</button>
      </div>
    </form>
  );
}
