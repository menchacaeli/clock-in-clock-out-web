import { Api, TimeEntry } from './types';

export const toApiTimeEntry = (
  entry: TimeEntry
): Api.TimeEntry => ({
  id: entry.id,
  user_id: entry.userId,
  organization_id: entry.organizationId,
  clock_in: entry.clockIn,
  clock_out: entry.clockOut,
  timezone: entry.timezone,
  created_at: entry.createdAt,
  updated_at: entry.updatedAt,
  server_updated_at: entry.serverUpdatedAt,
});
