import { Timestamp } from 'firebase/firestore';
import { Api, User } from './types';

export const fromApiUser = (api: Api.User): User => ({
    id: api.id,
    email: api.email ?? null,
    firstName: api.first_name || '',
    lastName: api.last_name || '',
    displayName: api.display_name,
    photoURL: api.photo_url,
    organizationId: api.organization_id,
    role: api.role,
    createdAt: Timestamp.fromDate(new Date(api.created_at)),
    updatedAt: api.updated_at ? Timestamp.fromDate(new Date(api.updated_at)) : undefined,
});
