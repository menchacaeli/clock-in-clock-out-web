import React, { useState, useEffect } from 'react';
import { JobSite } from '@/data';

const TEMP_ORG_ID = 'your-org-id';

interface SitesFormProps {
    editingSite: JobSite.Types.JobSite | null;
    onSubmit: (site: JobSite.Types.JobSite) => Promise<void>;
    onCancel: () => void;
}

export default function SitesForm({
    editingSite,
    onSubmit,
    onCancel,
}: SitesFormProps) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');

    useEffect(() => {
        if (editingSite) {
            setName(editingSite.name);
            setAddress(editingSite.address);
            setStatus(editingSite.status);
        } else {
            setName('');
            setAddress('');
            setStatus('active');
        }
    }, [editingSite]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newSite: JobSite.Types.JobSite = {
            id: editingSite?.id || '', // Empty for new sites, page will set Firebase ID
            organizationId: TEMP_ORG_ID,
            name,
            address,
            status,
            createdAt: editingSite?.createdAt || ({} as any),
            updatedAt: ({} as any),
        };

        await onSubmit(newSite);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Site Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Main Office"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Address</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 123 Main St, City, State 12345"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                    {editingSite ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
}
