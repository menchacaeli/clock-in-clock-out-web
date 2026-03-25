export type UserRole = 'admin' | 'manager' | 'worker';
export type PunchType = 'in' | 'out';
export type LocationSource = 'gps' | 'network' | 'passive' | 'fused';
export type SyncStatus = 'local' | 'pending' | 'synced' | 'error';
export type JobSiteStatus = 'active' | 'inactive';
export type TimesheetStatus = 'pending' | 'approved' | 'rejected';