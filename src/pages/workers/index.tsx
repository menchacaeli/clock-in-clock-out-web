'use client';

import { useCallback, useEffect, useState } from 'react';
import { deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { User, JobSite } from '../../data';
import { Table, TableColumn } from '../../components/Table';
import Modal from '../../components/Modal';
import WorkerEditForm from '../../components/pages/workers/form/WorkerEditForm';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../../components/Button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function WorkersPage() {
  const [workers, setWorkers] = useState<User.Types.User[]>([]);
  const [jobSites, setJobSites] = useState<JobSite.Types.JobSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWorker, setEditingWorker] = useState<User.Types.User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const { orgId } = useAuth();

  const loadWorkers = useCallback(async () => {
    if (!orgId) { setWorkers([]); return; }
    try {
      setWorkers(await User.Services.getByOrganization(orgId));
    } catch (error) {
      console.error('Error loading workers:', error);
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

  const loadData = useCallback(async () => {
    if (!orgId) { setLoading(false); return; }
    try {
      setLoading(true);
      await Promise.all([loadWorkers(), loadJobSites()]);
    } finally {
      setLoading(false);
    }
  }, [loadJobSites, loadWorkers, orgId]);

  useEffect(() => { void loadData(); }, [loadData]);

  const handleSaveWorker = async (data: { status: User.Types.UserStatus; jobSiteIds: string[] }) => {
    if (!editingWorker) return;
    try {
      await User.Services.update(editingWorker.id, { status: data.status, jobSiteIds: data.jobSiteIds });
      setWorkers(workers.map(w => w.id === editingWorker.id ? { ...w, ...data } : w));
      setShowEditModal(false);
      setEditingWorker(null);
    } catch (error) {
      console.error('Error saving worker:', error);
      alert('Failed to save worker changes');
    }
  };

  const tableColumns: TableColumn<User.Types.User>[] = [
    {
      key: 'displayName',
      label: 'Name',
      render: (value) => <span className="font-medium text-slate-800 dark:text-slate-100">{value ? String(value) : '—'}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => <span className="text-slate-500 dark:text-slate-400">{value ? String(value) : '—'}</span>,
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => {
        const role = String(value);
        const styles: Record<string, string> = {
          admin: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200/60 dark:border-purple-500/20',
          manager: 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/25 dark:text-blue-300 border-blue-300/50 dark:border-blue-400/30',
          worker: 'bg-sky-500/10 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300 border-sky-300/50 dark:border-sky-400/30',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[role] ?? styles.worker}`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const active = value === 'active';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${active
            ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200/60 dark:border-green-500/20'
            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-amber-400'}`} />
            {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value) => {
        const d = value instanceof Timestamp ? value.toDate() : new Date(value as string | number ?? Date.now());
        return <span className="text-slate-400 dark:text-slate-500 text-xs">{d.toLocaleDateString()}</span>;
      },
    },
    {
      key: 'jobSiteIds',
      label: 'Sites',
      render: (value) => {
        const ids = value as string[] | undefined;
        if (!ids || ids.length === 0) return <span className="text-slate-400 dark:text-slate-500 text-xs">None</span>;
        const names = ids.map(id => jobSites.find(s => s.id === id)?.name ?? id);
        return <span className="text-slate-500 dark:text-slate-400 text-xs">{names.join(', ')}</span>;
      },
    },
  ];

  if (!orgId) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/60 to-white dark:from-slate-900 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Workers</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your team members and their assignments</p>
        </div>

        {loading ? (
          <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/40 h-48 animate-pulse" />
        ) : (
          <Table<User.Types.User>
            columns={tableColumns}
            data={workers}
            rowKey="id"
            emptyMessage="No workers yet. They will appear here once they sign up."
            actions={(worker) => (
              <div className="flex justify-end gap-1.5">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<PencilIcon className="w-3.5 h-3.5" />}
                  onClick={() => { setEditingWorker(worker); setShowEditModal(true); }}
                  title="Edit Worker"
                />
                <Button
                  variant="danger"
                  size="sm"
                  icon={<TrashIcon className="w-3.5 h-3.5" />}
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this worker?')) {
                      deleteDoc(doc(db, 'users', worker.id))
                        .then(() => setWorkers(workers.filter(w => w.id !== worker.id)))
                        .catch(() => alert('Failed to delete worker'));
                    }
                  }}
                  title="Delete"
                />
              </div>
            )}
          />
        )}

        <Modal
          isOpen={showEditModal}
          title={`Edit: ${editingWorker?.displayName ?? editingWorker?.email}`}
          onClose={() => { setShowEditModal(false); setEditingWorker(null); }}
        >
          {editingWorker && (
            <WorkerEditForm
              worker={editingWorker}
              jobSites={jobSites}
              onSubmit={handleSaveWorker}
              onCancel={() => { setShowEditModal(false); setEditingWorker(null); }}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
