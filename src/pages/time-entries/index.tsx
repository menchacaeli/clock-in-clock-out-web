'use client';

import { useState, useEffect } from 'react';
import { TimeEntry, User } from '../../data';
import { Table, TableColumn } from '../../components/Table';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { useAuth } from '@/context/AuthContext';

export default function TimeEntriesPage() {
    const [timeEntries, setTimeEntries] = useState<TimeEntry.Types.TimeEntry[]>([]);
    const [users, setUsers] = useState<Map<string, User.Types.User>>(new Map());
    const [loading, setLoading] = useState(true);

    const { orgId } = useAuth();

    // guard against it being undefined
    if (!orgId) return null;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            await Promise.all([loadUsers(), loadTimeEntries()]);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const usersData = await User.Services.getByOrganization(orgId);
            const usersMap = new Map<string, User.Types.User>();
            usersData.forEach((user) => {
                usersMap.set(user.id, user);
            });
            setUsers(usersMap);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const loadTimeEntries = async () => {
        try {
            const entriesData = await TimeEntry.Services.getAll(orgId);
            setTimeEntries(entriesData);
        } catch (error) {
            console.error('Error loading time entries:', error);
        }
    };

    const tableColumns: TableColumn<TimeEntry.Types.TimeEntry>[] = [
        {
            key: 'userId',
            label: 'User',
            render: (value) => {
                const user = users.get(value);
                return <div className="text-gray-600 dark:text-gray-300">{user?.displayName || value}</div>;
            },
        },
        {
            key: 'clockIn',
            label: 'Clock In',
            render: (value: any) => {
                const date = new Date(value.timestamp);
                return <div className="text-gray-600 dark:text-gray-300">{date.toLocaleString()}</div>;
            },
        },
        {
            key: 'clockOut',
            label: 'Clock Out',
            render: (value: any) => {
                if (!value) {
                    return <span className="text-yellow-600 dark:text-yellow-400">In Progress</span>;
                }
                const date = new Date(value.timestamp);
                return <div className="text-gray-600 dark:text-gray-300">{date.toLocaleString()}</div>;
            },
        },
        {
            key: 'durationMinutes',
            label: 'Duration',
            render: (value) => {
                if (!value) return <span className="text-yellow-600 dark:text-yellow-400">—</span>;
                const hours = Math.floor(value / 60);
                const minutes = value % 60;
                return <div className="text-gray-600 dark:text-gray-300">{hours}h {minutes}m</div>;
            },
        },
        {
            key: 'jobSiteId',
            label: 'Job Site',
            render: (value) => <div className="text-gray-600 dark:text-gray-300">{value || '—'}</div>,
        },
    ];

    const emptyIcon = (
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-gray-600 dark:text-gray-300">Loading time entries...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="mb-6">
                    <Breadcrumbs items={[{ label: 'Time Entries' }]} />
                </div>

                {/* Table */}
                <Table<TimeEntry.Types.TimeEntry>
                    columns={tableColumns}
                    data={timeEntries}
                    rowKey="id"
                    emptyMessage="No time entries yet. Workers will appear here once they clock in."
                    emptyIcon={emptyIcon}
                />
            </div>
        </div>
    );
}
