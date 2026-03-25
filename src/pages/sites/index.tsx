'use client';

import { useState, useEffect } from 'react';
import { JobSite } from '../../data';
import { Table, TableColumn } from '../../components/Table';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
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

  // guard against it being undefined
  if (!orgId) return null;

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      setLoading(true);
      const sitesData = await JobSite.Services.getAll(orgId);

      setSites(sitesData);
    } catch (error) {
      console.error('Error loading sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (site: JobSite.Types.JobSite) => {
    try {
      if (editingSite) {
        await JobSite.Services.update(editingSite.id, {
          name: site.name,
          address: site.address,
          status: site.status,
        });
      } else {
        await JobSite.Services.create(orgId, {
          name: site.name,
          address: site.address,
          status: site.status,
        });
      }
      resetForm();
      await loadSites();
    } catch (error: any) {
      console.error('Error saving site:', error);
      alert(`Failed to save job site: ${error.message}`);
    }
  };

  const handleEdit = (site: JobSite.Types.JobSite) => {
    setEditingSite(site);
    setShowForm(true);
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
      setSites(sites.map(s =>
        s.id === site.id
          ? { ...s, status: newStatus }
          : s
      ));
    } catch (error) {
      console.error('Error updating site status:', error);
      alert('Failed to update site status');
    }
  };

  const resetForm = () => {
    setEditingSite(null);
    setShowForm(false);
  };

  const tableColumns: TableColumn<JobSite.Types.JobSite>[] = [
    {
      key: 'name',
      label: 'Site Name',
      render: (value) => <div className="font-medium text-gray-900 dark:text-gray-100">{value}</div>,
    },
    {
      key: 'address',
      label: 'Address',
      render: (value) => <div className="text-gray-600 dark:text-gray-300">{value}</div>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${value === 'active'
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
          <span className={`mr-2 h-2 w-2 rounded-full ${value === 'active' ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-500'
            }`}></span>
          {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => {
        const date = value instanceof Timestamp ? value.toDate() : new Date(value);
        return <div className="text-gray-600 dark:text-gray-300">{date.toLocaleDateString()}</div>;
      },
    },
  ];

  const emptyIcon = (
    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-300">Loading job sites...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'Job Sites' }]} />
        </div>

        {/* Form Modal */}
        <Modal
          isOpen={showForm}
          title={editingSite ? 'Edit Job Site' : 'New Job Site'}
          onClose={resetForm}
        >
          <SitesForm
            editingSite={editingSite}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          title="Delete Job Site?"
          onClose={() => {
            setShowDeleteModal(false);
            setSiteToDelete(null);
          }}
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete <strong>{siteToDelete?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSiteToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => siteToDelete && handleDelete(siteToDelete.id)}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            + New Job Site
          </button>
        </div>

        {/* Table */}
        <Table<JobSite.Types.JobSite>
          columns={tableColumns}
          data={sites}
          rowKey="id"
          emptyMessage="Create your first job site to get started"
          emptyIcon={emptyIcon}
          actions={(site) => (
            <div className="flex justify-end gap-2">
              <Button
                variant="primary"
                size="sm"
                icon={<PencilIcon className="w-4 h-4" />}
                onClick={() => handleEdit(site)}
                title="Edit"
              />
              <Button
                variant="secondary"
                size="sm"
                icon={site.status === 'active' ? <CheckIcon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />}
                onClick={() => toggleStatus(site)}
                title={site.status === 'active' ? 'Deactivate' : 'Activate'}
              />
              <Button
                variant="danger"
                size="sm"
                icon={<TrashIcon className="w-4 h-4" />}
                onClick={() => {
                  setSiteToDelete(site);
                  setShowDeleteModal(true);
                }}
                title="Delete"
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}

