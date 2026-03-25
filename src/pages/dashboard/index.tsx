'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Job Sites Card */}
          <Link href="/sites">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Job Sites</h2>
                <div className="text-2xl">📍</div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Manage and view all job sites for your organization.
              </p>
              <div className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium">
                View Sites →
              </div>
            </div>
          </Link>

          {/* Timesheets Card */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 opacity-75 cursor-not-allowed">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Timesheets</h2>
              <div className="text-2xl">📋</div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Track and manage timesheets.
            </p>
            <div className="mt-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
              Coming Soon
            </div>
          </div>

          {/* Time Entries Card */}
          <Link href="/time-entries">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Time Entries</h2>
                <div className="text-2xl">⏱️</div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Log and review time entries.
              </p>
              <div className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium">
                View Entries →
              </div>
            </div>
          </Link>

          {/* Workers Card */}
          <Link href="/workers">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Workers</h2>
                <div className="text-2xl">👥</div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Manage worker profiles and team members.
              </p>
              <div className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium">
                View Workers →
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
