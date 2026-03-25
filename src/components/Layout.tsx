import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useTheme } from '@/context/ThemeContext';
import { User } from '@/data';

interface LayoutProps {
    children: React.ReactNode;
    user: User.Types.User | null;
}

export default function Layout({ children, user }: LayoutProps) {
    const router = useRouter();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/auth');
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    const isActive = (href: string) => router.pathname === href;

    const getLogo = () => {
        const initial = user?.email?.[0]?.toUpperCase() || 'U';
        return (
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {initial}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center gap-4 md:gap-8">
                            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">
                                {getLogo()}
                                <span className="hidden sm:inline">TimeTracker</span>
                            </Link>

                            {/* Desktop Navigation Links */}
                            <div className="hidden md:flex items-center gap-1">
                                <Link
                                    href="/dashboard"
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/dashboard')
                                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/sites"
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/sites')
                                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    Job Sites
                                </Link>
                                <Link
                                    href="/workers"
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/workers')
                                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    Workers
                                </Link>
                                <Link
                                    href="/timesheets"
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60"
                                >
                                    Timesheets
                                </Link>
                                <Link
                                    href="/time-entries"
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/time-entries')
                                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    Time Entries
                                </Link>
                            </div>
                        </div>

                        {/* Right side: Theme toggle, Mobile Menu, and User menu */}
                        <div className="flex items-center gap-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                                aria-label="Toggle theme"
                            >
                                {isDarkMode ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.828a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 7a3 3 0 110 6 3 3 0 010-6zm-4.22-1.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414L5.78 5.22a1 1 0 010-1.414zM3 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm0 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm11 0a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm2.828-2.828a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 18a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                                aria-label="Toggle mobile menu"
                            >
                                {isMobileMenuOpen ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                        {user?.email?.[0]?.toUpperCase()}
                                    </div>
                                </button>

                                {/* User Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {user?.displayName || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                handleSignOut();
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu - Overlay */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute left-4 right-4 top-18 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-40 rounded-xl">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link
                                href="/dashboard"
                                className={`block px-3 py-2 rounded-lg text-base font-medium transition ${isActive('/dashboard')
                                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/sites"
                                className={`block px-3 py-2 rounded-lg text-base font-medium transition ${isActive('/sites')
                                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Job Sites
                            </Link>
                            <Link
                                href="/workers"
                                className={`block px-3 py-2 rounded-lg text-base font-medium transition ${isActive('/workers')
                                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Workers
                            </Link>
                            <Link
                                href="/timesheets"
                                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60"
                            >
                                Timesheets
                            </Link>
                            <Link
                                href="/time-entries"
                                className={`block px-3 py-2 rounded-lg text-base font-medium transition ${isActive('/time-entries')
                                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Time Entries
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}
