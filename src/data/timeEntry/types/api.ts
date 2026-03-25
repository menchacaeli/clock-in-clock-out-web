import { LocationSource } from '../../common/types';

export interface PunchLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  source: LocationSource;
}

export interface Punch {
  timestamp: string; // ISO (local time preserved)
  location?: PunchLocation;
  timezone?: string;
}

export interface TimeEntry {
  id: string; // UUID (client)
  user_id: string;
  organization_id: string;

  clock_in: Punch;
  clock_out?: Punch;

  duration_minutes?: number; // server-computed
  timezone: string;

  created_at: string;
  updated_at: string;
  server_updated_at?: string;
}