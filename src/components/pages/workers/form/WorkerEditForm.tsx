import React, { useState } from 'react';
import { User, JobSite } from '@/data';

interface WorkerEditFormProps {
    worker: User.Types.User;
    jobSites: JobSite.Types.JobSite[];
    onSubmit: (data: { status: User.Types.UserStatus; jobSiteIds: string[] }) => Promise<void>;
    onCancel: () => void;
}

export default function WorkerEditForm({
    worker,
    jobSites,
    onSubmit,
    onCancel,
}: WorkerEditFormProps) {
    const [status, setStatus] = useState<User.Types.UserStatus>(worker.status || 'pending');
    const [selectedSites, setSelectedSites] = useState<string[]>(worker.jobSiteIds || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit({
                status,
                jobSiteIds: selectedSites,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSite = (siteId: string) => {
        setSelectedSites((prev) =>
            prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Section */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Status
                </h3>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="pending"
                            checked={status === 'pending'}
                            onChange={(e) => setStatus(e.target.value as User.Types.UserStatus)}
                            className="rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Pending</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="active"
                            checked={status === 'active'}
                            onChange={(e) => setStatus(e.target.value as User.Types.UserStatus)}
                            className="rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                </div>
            </div>

            {/* Job Sites Section */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Assign Job Sites
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {jobSites.length === 0 ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400">No job sites available</p>
                    ) : (
                        jobSites.map((site) => (
                            <label key={site.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                <input
                                    type="checkbox"
                                    checked={selectedSites.includes(site.id)}
                                    onChange={() => toggleSite(site.id)}
                                    className="rounded"
                                />
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{site.name}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">{site.address}</div>
                                </div>
                            </label>
                        ))
                    )}
                </div>
            </div>

            {/* Actions */}
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
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
