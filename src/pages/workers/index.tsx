'use client';

import { useState, useEffect } from 'react';
import { deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { User, JobSite } from '../../data';
import { Table, TableColumn } from '../../components/Table';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
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

    console.log('Organization ID in WorkersPage:', orgId); // Debug log to check orgId value

    // guard against it being undefined
    if (!orgId) return null;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            await Promise.all([loadWorkers(), loadJobSites()]);
        } finally {
            setLoading(false);
        }
    };

    const loadWorkers = async () => {
        try {
            const workersData = await User.Services.getByOrganization(orgId);
            setWorkers(workersData);
        } catch (error) {
            console.error('Error loading workers:', error);
        }
    };

    const loadJobSites = async () => {
        try {
            const sitesData = await JobSite.Services.getAll(orgId);
            setJobSites(sitesData);
        } catch (error) {
            console.error('Error loading job sites:', error);
        }
    };

    const handleEditWorker = (worker: User.Types.User) => {
        setEditingWorker(worker);
        setShowEditModal(true);
    };

    const handleSaveWorker = async (data: { status: User.Types.UserStatus; jobSiteIds: string[] }) => {
        if (!editingWorker) return;

        try {
            await User.Services.update(editingWorker.id, {
                status: data.status,
                jobSiteIds: data.jobSiteIds,
            });
            setWorkers(workers.map(w =>
                w.id === editingWorker.id
                    ? { ...w, status: data.status, jobSiteIds: data.jobSiteIds }
                    : w
            ));
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
            render: (value) => <div className="font-medium text-gray-900 dark:text-gray-100">{value || '-'}</div>,
        },
        {
            key: 'email',
            label: 'Email',
            render: (value) => <div className="text-gray-600 dark:text-gray-300">{value || '-'}</div>,
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${value === 'admin'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                    : value === 'manager'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                    {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${value === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
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
        {
            key: 'jobSiteIds',
            label: 'Assigned Sites',
            render: (value: string[] | undefined) => {
                if (!value || value.length === 0) {
                    return <span className="text-gray-600 dark:text-gray-300">None</span>;
                }
                const siteNames = value.map(siteId => {
                    const site = jobSites.find(s => s.id === siteId);
                    return site ? site.name : siteId;
                });
                return <div className="text-gray-600 dark:text-gray-300">{siteNames.join(', ')}</div>;
            },
        }
    ];

    const emptyIcon = (
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20h12a6 6 0 016-6H0a6 6 0 016 6z" />
        </svg>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-gray-600 dark:text-gray-300">Loading workers...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="mb-6">
                    <Breadcrumbs items={[{ label: 'Workers' }]} />
                </div>

                {/* Edit Worker Modal */}
                <Modal
                    isOpen={showEditModal}
                    title={`Edit Worker: ${editingWorker?.displayName}`}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingWorker(null);
                    }}
                >
                    {editingWorker && (
                        <WorkerEditForm
                            worker={editingWorker}
                            jobSites={jobSites}
                            onSubmit={handleSaveWorker}
                            onCancel={() => {
                                setShowEditModal(false);
                                setEditingWorker(null);
                            }}
                        />
                    )}
                </Modal>

                {/* Table */}
                <Table<User.Types.User>
                    columns={tableColumns}
                    data={workers}
                    rowKey="id"
                    emptyMessage="No workers yet. They will appear here once they sign up."
                    emptyIcon={emptyIcon}
                    actions={(worker) => (
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="primary"
                                size="sm"
                                icon={<PencilIcon className="w-4 h-4" />}
                                onClick={() => handleEditWorker(worker)}
                                title="Edit Worker"
                            />
                            <Button
                                variant="danger"
                                size="sm"
                                icon={<TrashIcon className="w-4 h-4" />}
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this worker?')) {
                                        const workerRef = doc(db, 'users', worker.id);
                                        deleteDoc(workerRef).then(() => {
                                            setWorkers(workers.filter(w => w.id !== worker.id));
                                        }).catch(error => {
                                            console.error('Error deleting worker:', error);
                                            alert('Failed to delete worker');
                                        });
                                    }
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