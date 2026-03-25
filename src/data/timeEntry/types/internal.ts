import { LocationSource, SyncStatus } from '../../common/types';

export interface PunchLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  source: LocationSource;
}

export interface SyncMeta {
  syncStatus: SyncStatus;
  lastSyncAttempt?: string; // ISO
  errorMessage?: string;
  deviceId?: string;
}

export interface Punch {
  timestamp: string; // ISO (local time preserved)
  location?: PunchLocation;
  timezone?: string;
}

export interface TimeEntry {
  id: string; // UUID (client)
  userId: string;
  organizationId: string;

  clockIn: Punch;
  clockOut?: Punch;

  durationMinutes?: number; // server-computed
  timezone: string;

  createdAt: string;
  updatedAt: string;
  serverUpdatedAt?: string;

  jobSiteId?: string;
  timesheetId?: string; // links to approved timesheet

  sync?: SyncMeta;
}