'use client';

import { useCallback, useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { TimeEntry, User, JobSite } from '../../data';
import { Table, TableColumn } from '../../components/Table';
import Modal from '../../components/Modal';
import TimeEntryEditForm from '../../components/pages/time-entries/TimeEntryEditForm';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../../components/Button';
import { PencilIcon } from '@heroicons/react/24/outline';

export default function TimeEntriesPage() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry.Types.TimeEntry[]>([]);
  const [users, setUsers] = useState<Map<string, User.Types.User>>(new Map());
  const [jobSites, setJobSites] = useState<JobSite.Types.JobSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<TimeEntry.Types.TimeEntry | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const { orgId } = useAuth();

  const loadUsers = useCallback(async () => {
    if (!orgId) { setUsers(new Map()); return; }
    try {
      const data = await User.Services.getByOrganization(orgId);
      const map = new Map<string, User.Types.User>();
      data.forEach(u => map.set(u.id, u));
      setUsers(map);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, [orgId]);

  const loadJobSites = useCallback(async () => {
    if (!orgId) { setJobSites([]); return; }
    try {
      setJobSites(await JobSite.Services.getAll(orgId));
    } catch (error) {
      console.error('Error loading job sites:', error);
    }
  }, [orgId]);

  const loadTimeEntries = useCallback(async () => {
    if (!orgId) { setTimeEntries([]); return; }
    try {
      setTimeEntries(await TimeEntry.Services.getAll(orgId));
    } catch (error) {
      console.error('Error loading time entries:', error);
    }
  }, [orgId]);

  const loadData = useCallback(async () => {
    if (!orgId) { setLoading(false); return; }
    try {
      setLoading(true);
      await Promise.all([loadUsers(), loadTimeEntries(), loadJobSites()]);
    } finally {
      setLoading(false);
    }
  }, [loadTimeEntries, loadUsers, loadJobSites, orgId]);

  useEffect(() => { void loadData(); }, [loadData]);

  const handleSaveEntry = async (data: {
    clockInTimestamp: string;
    clockOutTimestamp: string | null;
    jobSiteId: string | null;
  }) => {
    if (!editingEntry) return;
    try {
      const clockInMs = new Date(data.clockInTimestamp).getTime();
      const clockOutMs = data.clockOutTimestamp ? new Date(data.clockOutTimestamp).getTime() : null;
      const durationMinutes = clockOutMs ? Math.round((clockOutMs - clockInMs) / 60000) : undefined;

      const updates: Record<string, unknown> = {
        'clockIn.timestamp': data.clockInTimestamp,
        clockOut: data.clockOutTimestamp
          ? { ...(editingEntry.clockOut ?? {}), timestamp: data.clockOutTimestamp }
          : null,
        jobSiteId: data.jobSiteId ?? null,
        ...(durationMinutes !== undefined && { durationMinutes }),
      };

      await updateDoc(doc(db, 'timeEntries', editingEntry.id), updates);

      setTimeEntries(prev => prev.map(e => e.id === editingEntry.id ? {
        ...e,
        clockIn: { ...e.clockIn, timestamp: data.clockInTimestamp },
        clockOut: data.clockOutTimestamp ? { ...(e.clockOut ?? e.clockIn), timestamp: data.clockOutTimestamp } : undefined,
        jobSiteId: data.jobSiteId ?? undefined,
        durationMinutes,
      } : e));

      setShowEditModal(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error saving time entry:', error);
      alert('Failed to save changes.');
    }
  };

  const tableColumns: TableColumn<TimeEntry.Types.TimeEntry>[] = [
    {
      key: 'userId',
      label: 'Worker',
      render: (value) => {
        const user = users.get(String(value));
        const name = user?.displayName ?? user?.email ?? String(value);
        const initial = name[0].toUpperCase();
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-sky-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {initial}
            </div>
            <span className="font-medium text-slate-800 dark:text-slate-100">{name}</span>
          </div>
        );
      },
    },
    {
      key: 'clockIn',
      label: 'Clock In',
      render: (value) => {
        const punch = value as TimeEntry.Types.Punch;
        return <span className="text-slate-600 dark:text-slate-300">{new Date(punch.timestamp).toLocaleString()}</span>;
      },
    },
    {
      key: 'clockOut',
      label: 'Clock Out',
      render: (value) => {
        const punch = value as TimeEntry.Types.Punch | undefined;
        if (!punch) {
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Active
            </span>
          );
        }
        return <span className="text-slate-600 dark:text-slate-300">{new Date(punch.timestamp).toLocaleString()}</span>;
      },
    },
    {
      key: 'durationMinutes',
      label: 'Duration',
      render: (value) => {
        const mins = typeof value === 'number' ? value : undefined;
        if (!mins) return <span className="text-slate-400 dark:text-slate-500">—</span>;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return <span className="text-slate-600 dark:text-slate-300 tabular-nums">{h}h {m}m</span>;
      },
    },
    {
      key: 'jobSiteId',
      label: 'Job Site',
      render: (value) => {
        const site = value ? jobSites.find(s => s.id === String(value)) : null;
        return <span className="text-slate-500 dark:text-slate-400">{site ? site.name : value ? String(value) : '—'}</span>;
      },
    },
  ];

  if (!orgId) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/60 to-white dark:from-slate-900 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Time Entries</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All clock-ins and clock-outs across your organization</p>
        </div>

        {loading ? (
          <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/40 h-48 animate-pulse" />
        ) : (
          <Table<TimeEntry.Types.TimeEntry>
            columns={tableColumns}
            data={timeEntries}
            rowKey="id"
            emptyMessage="No time entries yet. Workers will appear here once they clock in."
            actions={(entry) => (
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<PencilIcon className="w-3.5 h-3.5" />}
                  onClick={() => { setEditingEntry(entry); setShowEditModal(true); }}
                  title="Edit Entry"
                />
              </div>
            )}
          />
        )}

        <Modal
          isOpen={showEditModal}
          title="Edit Time Entry"
          onClose={() => { setShowEditModal(false); setEditingEntry(null); }}
        >
          {editingEntry && (
            <TimeEntryEditForm
              entry={editingEntry}
              jobSites={jobSites}
              onSubmit={handleSaveEntry}
              onCancel={() => { setShowEditModal(false); setEditingEntry(null); }}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
