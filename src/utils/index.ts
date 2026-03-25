import { TimeEntry } from '../data';

/**
 * Format minutes to hours and minutes display
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Format minutes to decimal hours (e.g., 90 minutes = 1.5 hours)
 */
export function formatDecimalHours(minutes: number): string {
  return (minutes / 60).toFixed(2);
}

/**
 * Format ISO timestamp to readable date and time
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format ISO timestamp to date only
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format ISO timestamp to time only
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get date range for a bi-weekly pay period starting on Monday
 */
export function getPayPeriodDates(weeksAgo: number = 0): { start: Date; end: Date } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Find the most recent Monday
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const mostRecentMonday = new Date(now);
  mostRecentMonday.setDate(now.getDate() - daysToMonday);
  
  // Determine which bi-weekly period we're in
  const weeksSinceEpoch = Math.floor(mostRecentMonday.getTime() / (7 * 24 * 60 * 60 * 1000));
  const isFirstWeek = weeksSinceEpoch % 2 === 0;
  
  let periodStart: Date;
  if (isFirstWeek) {
    periodStart = mostRecentMonday;
  } else {
    periodStart = new Date(mostRecentMonday);
    periodStart.setDate(periodStart.getDate() - 7);
  }
  
  // Go back additional periods if requested
  periodStart.setDate(periodStart.getDate() - (weeksAgo * 14));
  
  const periodEnd = new Date(periodStart);
  periodEnd.setDate(periodStart.getDate() + 13); // 2 weeks - 1 day
  
  // Set to start/end of day
  periodStart.setHours(0, 0, 0, 0);
  periodEnd.setHours(23, 59, 59, 999);
  
  return { start: periodStart, end: periodEnd };
}

/**
 * Format pay period range for display
 */
export function formatPayPeriod(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  
  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
  }
  
  return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
}

/**
 * Check if a time entry falls within a date range
 */
export function isInDateRange(entry: TimeEntry.Types.TimeEntry, startDate: string, endDate: string): boolean {
  const entryDate = new Date(entry.clockIn.timestamp);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return entryDate >= start && entryDate <= end;
}

/**
 * Calculate total minutes from an array of time entries
 */
export function calculateTotalMinutes(entries: TimeEntry.Types.TimeEntry[]): number {
  return entries.reduce((total, entry) => total + (entry.durationMinutes || 0), 0);
}

/**
 * Get the status badge color for timesheet status
 */
export function getStatusColor(status: 'pending' | 'approved' | 'rejected'): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}