import React, { useState } from 'react';
import { TimeEntry, JobSite } from '@/data';

interface TimeEntryEditFormProps {
  entry: TimeEntry.Types.TimeEntry;
  jobSites: JobSite.Types.JobSite[];
  onSubmit: (data: { clockInTimestamp: string; clockOutTimestamp: string | null; jobSiteId: string | null }) => Promise<void>;
  onCancel: () => void;
}

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TimeEntryEditForm({ entry, jobSites, onSubmit, onCancel }: TimeEntryEditFormProps) {
  const [clockIn, setClockIn] = useState(toDatetimeLocal(entry.clockIn.timestamp));
  const [clockOut, setClockOut] = useState(entry.clockOut ? toDatetimeLocal(entry.clockOut.timestamp) : '');
  const [jobSiteId, setJobSiteId] = useState(entry.jobSiteId ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (clockOut && new Date(clockOut) <= new Date(clockIn)) {
      setError('Clock out must be after clock in.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        clockInTimestamp: new Date(clockIn).toISOString(),
        clockOutTimestamp: clockOut ? new Date(clockOut).toISOString() : null,
        jobSiteId: jobSiteId || null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Clock In
        </label>
        <input
          type="datetime-local"
          value={clockIn}
          onChange={(e) => setClockIn(e.target.value)}
          required
          className="w-full border border-blue-200 dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 dark:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Clock Out <span className="font-normal text-slate-400">(leave blank if still active)</span>
        </label>
        <input
          type="datetime-local"
          value={clockOut}
          onChange={(e) => setClockOut(e.target.value)}
          className="w-full border border-blue-200 dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 dark:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Job Site
        </label>
        <select
          value={jobSiteId}
          onChange={(e) => setJobSiteId(e.target.value)}
          className="w-full border border-blue-200 dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 dark:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
        >
          <option value="">— None —</option>
          {jobSites.map((site) => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-sm transition"
        >
          {isSubmitting ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
