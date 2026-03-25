import { UserRole } from './shared';

export interface User {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  photo_url?: string;

  organization_id: string;
  role: UserRole;

  created_at: string;
  updated_at: string;
}
