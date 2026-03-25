import { Api, TimeEntry } from './types';

export const fromApiTimeEntry = (
  api: Api.TimeEntry
): TimeEntry => ({
  id: api.id,
  userId: api.user_id,
  organizationId: api.organization_id,
  clockIn: api.clock_in,
  clockOut: api.clock_out,
  durationMinutes: api.duration_minutes,
  timezone: api.timezone,
  createdAt: api.created_at,
  updatedAt: api.updated_at,
  serverUpdatedAt: api.server_updated_at,
});
