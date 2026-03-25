'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { JobSite, TimeEntry, User } from '@/data';

interface Stats {
  totalWorkers: number;
  activeWorkers: number;
  todayEntries: number;
  activeSites: number;
}

function StatCard({
  label,
  value,
  icon,
  href,
  gradient,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  href: string;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/30 p-6 hover:shadow-lg hover:shadow-blue-900/5 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200"
    >
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center mb-4 shadow-sm`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </Link>
  );
}

function QuickLink({
  href,
  icon,
  label,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 rounded-xl bg-blue-50/50 dark:bg-slate-700/50 hover:bg-blue-100/60 dark:hover:bg-slate-700 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
    >
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-sky-400 text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</div>
      </div>
      <svg className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default function DashboardPage() {
  const { appUser, orgId } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalWorkers: 0, activeWorkers: 0, todayEntries: 0, activeSites: 0 });
  const [recentEntries, setRecentEntries] = useState<TimeEntry.Types.TimeEntry[]>([]);
  const [usersMap, setUsersMap] = useState<Map<string, User.Types.User>>(new Map());
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    if (!orgId) {
      setLoading(false);
      return;
    }

    try {
      const [workers, allEntries, sites] = await Promise.all([
        User.Services.getByOrganization(orgId),
        TimeEntry.Services.getAll(orgId),
        JobSite.Services.getAll(orgId),
      ]);

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEntries = allEntries.filter(e => new Date(e.clockIn.timestamp) >= todayStart);
      const activeEntries = allEntries.filter(e => !e.clockOut);
      const activeSites = sites.filter(s => s.status === 'active');

      const map = new Map<string, User.Types.User>();
      workers.forEach(w => map.set(w.id, w));
      setUsersMap(map);

      setStats({
        totalWorkers: workers.length,
        activeWorkers: activeEntries.length,
        todayEntries: todayEntries.length,
        activeSites: activeSites.length,
      });

      setRecentEntries(allEntries.slice(0, 5));
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatPunch = (punch: TimeEntry.Types.Punch) =>
    new Date(punch.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/60 to-white dark:from-slate-900 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {greeting()}{appUser?.displayName ? `, ${appUser.displayName.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Here&apos;s what&apos;s happening with your team today.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-blue-100/50 dark:bg-slate-800" />
            ))}
          </div>
        ) : (
          <>
            {/* ── Stats ───────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Workers"
                value={stats.totalWorkers}
                href="/workers"
                gradient="from-blue-500 to-sky-400"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20h12a6 6 0 016-6H0a6 6 0 016 6z" />
                  </svg>
                }
              />
              <StatCard
                label="Clocked In Now"
                value={stats.activeWorkers}
                href="/time-entries"
                gradient="from-sky-500 to-blue-400"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Today's Entries"
                value={stats.todayEntries}
                href="/time-entries"
                gradient="from-indigo-500 to-blue-500"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
              />
              <StatCard
                label="Active Job Sites"
                value={stats.activeSites}
                href="/sites"
                gradient="from-blue-600 to-indigo-500"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ── Recent Activity ─────────────────────── */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-blue-900/30 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-blue-50 dark:border-blue-900/20">
                  <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Recent Time Entries</h2>
                  <Link href="/time-entries" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    View all →
                  </Link>
                </div>

                {recentEntries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-700 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-blue-300 dark:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">No entries yet.</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Workers will appear here once they clock in.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-blue-50 dark:divide-blue-900/20">
                    {recentEntries.map((entry) => {
                      const worker = usersMap.get(entry.userId);
                      const initial = (worker?.displayName ?? worker?.email ?? '?')[0].toUpperCase();
                      return (
                        <div key={entry.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-blue-50/40 dark:hover:bg-slate-700/30 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-sky-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {initial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                              {worker?.displayName ?? worker?.email ?? entry.userId}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              In: {formatPunch(entry.clockIn)}
                              {entry.clockOut && <span> · Out: {formatPunch(entry.clockOut)}</span>}
                            </div>
                          </div>
                          {!entry.clockOut ? (
                            <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              Active
                            </span>
                          ) : (
                            <span className="flex-shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                              {entry.durationMinutes ? `${Math.floor(entry.durationMinutes / 60)}h ${entry.durationMinutes % 60}m` : 'Done'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Quick Links + Upgrade ────────────────── */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-blue-900/30 overflow-hidden">
                  <div className="px-5 py-4 border-b border-blue-50 dark:border-blue-900/20">
                    <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Quick Access</h2>
                  </div>
                  <div className="p-3 space-y-1">
                    <QuickLink
                      href="/time-entries"
                      label="Time Entries"
                      description="All clock-ins and clock-outs"
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                    />
                    <QuickLink
                      href="/workers"
                      label="Workers"
                      description="Manage your team"
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20h12a6 6 0 016-6H0a6 6 0 016 6z" />
                        </svg>
                      }
                    />
                    <QuickLink
                      href="/sites"
                      label="Job Sites"
                      description="Locations and assignments"
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      }
                    />
                  </div>
                </div>

                {/* Upgrade card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-indigo-800 p-5 text-white shadow-lg shadow-blue-500/20">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-sky-400/20 rounded-full blur-xl" />
                  <div className="absolute -bottom-6 -left-4 w-20 h-20 bg-indigo-400/20 rounded-full blur-xl" />
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-white mb-1 text-sm">Unlock Timesheets</h3>
                    <p className="text-blue-100 text-xs leading-relaxed mb-4">
                      Get bi-weekly timesheets, approval workflows, and payroll-ready reports with Pro.
                    </p>
                    <button className="w-full bg-white hover:bg-blue-50 text-blue-700 font-semibold text-xs py-2 rounded-lg transition-colors shadow-sm">
                      Upgrade to Pro →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
