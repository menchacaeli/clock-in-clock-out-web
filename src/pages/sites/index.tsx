'use client';

import { useCallback, useEffect, useState } from 'react';
import { JobSite } from '../../data';
import { Table, TableColumn } from '../../components/Table';
import Modal from '../../components/Modal';
import SitesForm from '../../components/pages/sites/form/SitesForm';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { PencilIcon, CheckIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function JobSitesPage() {
  const [sites, setSites] = useState<JobSite.Types.JobSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSite, setEditingSite] = useState<JobSite.Types.JobSite | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<JobSite.Types.JobSite | null>(null);

  const { orgId } = useAuth();

  const loadSites = useCallback(async () => {
    if (!orgId) { setSites([]); setLoading(false); return; }
    try {
      setLoading(true);
      setSites(await JobSite.Services.getAll(orgId));
    } catch (error) {
      console.error('Error loading sites:', error);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => { void loadSites(); }, [loadSites]);

  const handleSubmit = async (site: JobSite.Types.JobSite) => {
    try {
      if (editingSite) {
        await JobSite.Services.update(editingSite.id, { name: site.name, address: site.address, status: site.status });
      } else {
        if (!orgId) throw new Error('Organization is required to create a job site');
        await JobSite.Services.create(orgId, { name: site.name, address: site.address, status: site.status });
      }
      resetForm();
      await loadSites();
    } catch (error) {
      alert(`Failed to save job site: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (siteId: string) => {
    try {
      await JobSite.Services.remove(siteId);
      setSites(sites.filter(s => s.id !== siteId));
      setShowDeleteModal(false);
      setSiteToDelete(null);
    } catch (error) {
      console.error('Error deleting site:', error);
      alert('Failed to delete job site');
    }
  };

  const toggleStatus = async (site: JobSite.Types.JobSite) => {
    try {
      const newStatus = site.status === 'active' ? 'inactive' : 'active';
      await JobSite.Services.update(site.id, { status: newStatus });
      setSites(sites.map(s => s.id === site.id ? { ...s, status: newStatus } : s));
    } catch (error) {
      console.error('Error updating site status:', error);
      alert('Failed to update site status');
    }
  };

  const resetForm = () => { setEditingSite(null); setShowForm(false); };

  const tableColumns: TableColumn<JobSite.Types.JobSite>[] = [
    {
      key: 'name',
      label: 'Site Name',
      render: (value) => <span className="font-medium text-slate-800 dark:text-slate-100">{String(value)}</span>,
    },
    {
      key: 'address',
      label: 'Address',
      render: (value) => <span className="text-slate-500 dark:text-slate-400">{String(value)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const active = value === 'active';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${active
            ? 'bg-green-500/10 dark:bg-green-500/15 text-green-700 dark:text-green-400 border border-green-200/60 dark:border-green-500/20'
            : 'bg-slate-100/80 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-600/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-slate-400'}`} />
            {active ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => {
        const d = value instanceof Timestamp ? value.toDate() : new Date(value as string | number ?? Date.now());
        return <span className="text-slate-400 dark:text-slate-500 text-xs">{d.toLocaleDateString()}</span>;
      },
    },
  ];

  if (!orgId) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/60 to-white dark:from-slate-900 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Job Sites</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage locations and worker assignments</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Job Site
          </button>
        </div>

        {loading ? (
          <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/40 h-48 animate-pulse" />
        ) : (
          <Table<JobSite.Types.JobSite>
            columns={tableColumns}
            data={sites}
            rowKey="id"
            emptyMessage="Create your first job site to get started"
            actions={(site) => (
              <div className="flex justify-end gap-1.5">
                <Button variant="primary" size="sm" icon={<PencilIcon className="w-3.5 h-3.5" />} onClick={() => { setEditingSite(site); setShowForm(true); }} title="Edit" />
                <Button variant="secondary" size="sm" icon={site.status === 'active' ? <CheckIcon className="w-3.5 h-3.5" /> : <XMarkIcon className="w-3.5 h-3.5" />} onClick={() => toggleStatus(site)} title={site.status === 'active' ? 'Deactivate' : 'Activate'} />
                <Button variant="danger" size="sm" icon={<TrashIcon className="w-3.5 h-3.5" />} onClick={() => { setSiteToDelete(site); setShowDeleteModal(true); }} title="Delete" />
              </div>
            )}
          />
        )}

        {/* Form modal */}
        <Modal isOpen={showForm} title={editingSite ? 'Edit Job Site' : 'New Job Site'} onClose={resetForm}>
          <SitesForm editingSite={editingSite} onSubmit={handleSubmit} onCancel={resetForm} />
        </Modal>

        {/* Delete confirmation modal */}
        <Modal isOpen={showDeleteModal} title="Delete Job Site?" onClose={() => { setShowDeleteModal(false); setSiteToDelete(null); }} size="sm">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">{siteToDelete?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => { setShowDeleteModal(false); setSiteToDelete(null); }}>Cancel</Button>
            <button
              onClick={() => siteToDelete && handleDelete(siteToDelete.id)}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
            >
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
