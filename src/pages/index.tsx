import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
];

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Clock In / Clock Out',
    description: 'Workers clock in and out directly from their phone. GPS location is captured automatically with every punch.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Job Site Management',
    description: 'Create and manage job sites. Assign workers to specific locations and track attendance per site.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20h12a6 6 0 016-6H0a6 6 0 016 6z" />
      </svg>
    ),
    title: 'Team Management',
    description: 'Onboard workers with an invite code. Manage roles, statuses, and site assignments from one place.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Time Entry Reports',
    description: 'Browse every clock-in and clock-out across your entire organization, filterable by worker and date.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Mobile-First Workers',
    description: 'The worker app is built for iOS and Android. No training needed — just tap to clock in.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Real-Time Sync',
    description: 'All data syncs instantly via Firebase. Offline entries are queued and uploaded automatically.',
  },
];

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Everything you need to get your team tracking time.',
    cta: 'Get started free',
    ctaHref: '/auth',
    highlight: false,
    features: [
      'Unlimited clock in / clock out',
      'Up to 10 workers',
      'Job site management',
      'Time entry reports',
      'Mobile app for workers',
      'GPS location capture',
    ],
    locked: [],
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'Advanced tools for growing teams and payroll workflows.',
    cta: 'Upgrade to Pro',
    ctaHref: '#',
    highlight: true,
    features: [
      'Everything in Free',
      'Unlimited workers',
      'Bi-weekly timesheets',
      'Approve & reject timesheets',
      'Payroll period reports',
      'Priority support',
    ],
    locked: [],
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-blue-100 dark:border-blue-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              T
            </div>
            TimeTracker
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/auth"
              className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Get started free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800"
            onClick={() => setMobileMenuOpen(v => !v)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-blue-100 dark:border-blue-950 bg-white dark:bg-slate-950 px-4 py-4 space-y-3">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-slate-600 dark:text-slate-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/auth" className="text-sm font-medium text-center text-slate-700 dark:text-slate-200 border border-blue-200 dark:border-blue-800 rounded-lg py-2">Sign in</Link>
              <Link href="/auth" className="text-sm font-medium text-center bg-blue-600 text-white rounded-lg py-2">Get started free</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden bg-gradient-to-b from-sky-50 via-blue-50/60 to-white dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950">
        {/* Decorative orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-blue-200/50 to-transparent dark:from-blue-800/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-sky-200/40 dark:bg-sky-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-0 w-64 h-64 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Free to start — no credit card required
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
            Time tracking built{' '}
            <span className="bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">
              for field teams
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Workers clock in from their phone. You see everything from the dashboard. No timesheets to chase, no spreadsheets to wrangle.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              Get started free
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl border border-blue-200 dark:border-slate-600 transition-all hover:-translate-y-0.5"
            >
              See how it works
            </a>
          </div>

          {/* Hero visual */}
          <div className="mt-16 relative mx-auto max-w-3xl">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-blue-100 dark:border-blue-900/50 shadow-2xl shadow-blue-900/10 p-6">
              {/* Mock dashboard preview */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 mx-4 bg-blue-50 dark:bg-slate-700 rounded-md h-5" />
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Active Workers', value: '12', color: 'from-blue-500 to-sky-400' },
                  { label: "Today's Entries", value: '28', color: 'from-sky-500 to-blue-400' },
                  { label: 'Job Sites', value: '5', color: 'from-indigo-500 to-blue-500' },
                ].map(stat => (
                  <div key={stat.label} className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-slate-700 dark:to-slate-700/50 rounded-xl p-4 border border-blue-100 dark:border-slate-600">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {['Maria G. — Clocked in at 8:02 AM', 'James R. — Clocked out at 4:45 PM', 'Sara T. — Clocked in at 9:15 AM'].map((entry, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50/50 dark:bg-slate-700/50">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-sky-400 flex items-center justify-center text-white text-xs font-semibold">
                      {entry[0]}
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">{entry}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Glow under card */}
            <div className="absolute -bottom-4 inset-x-8 h-8 bg-blue-400/20 dark:bg-blue-600/20 blur-xl rounded-full" />
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything your team needs
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Built for construction crews, cleaning teams, and any field-based workforce that can&apos;t be tied to a desk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 to-sky-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-sky-50/60 to-white dark:from-blue-950/20 dark:to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Start free and upgrade when you need payroll-ready timesheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col ${plan.highlight
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white shadow-2xl shadow-blue-500/25'
                  : 'bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/30 shadow-sm'
                  }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-400 to-blue-400 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-lg font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${plan.highlight ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.highlight ? 'text-blue-100' : 'text-slate-400'}`}>
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <svg className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-sky-300' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={plan.highlight ? 'text-blue-50' : 'text-slate-600 dark:text-slate-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 ${plan.highlight
                    ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-lg'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-blue-100 dark:border-blue-950 bg-white dark:bg-slate-950 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
              T
            </div>
            TimeTracker
          </Link>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} TimeTracker. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
            <a href="#pricing" className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a>
            <Link href="/auth" className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
