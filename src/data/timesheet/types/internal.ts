import { User } from '../../user/types/internal';
import { TimeEntry } from '../../timeEntry/types/internal';
import { TimesheetStatus } from '../../common/types';

export interface Timesheet {
  id: string;
  organizationId: string;
  userId: string; // worker

  periodStart: string; // "2025-02-10" (Monday)
  periodEnd: string;   // "2025-02-23" (Sunday)

  totalMinutes: number; // calculated from entries
  entryCount: number; // number of time entries
  status: TimesheetStatus;

  approvedBy?: string; // admin userId
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  notes?: string; // optional admin notes

  createdAt: string;
  updatedAt: string;
}

// Helper type for UI
export interface TimesheetWithWorker extends Timesheet {
  worker: User;
  entries: TimeEntry[];
}