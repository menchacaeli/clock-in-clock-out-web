import { Api, User } from './types';

export const toApiUser = (user: User): Api.User => ({
    id: user.id,
    email: user.email ?? undefined,
    first_name: user.firstName,
    last_name: user.lastName,
    display_name: user.displayName,
    photo_url: user.photoURL,
    organization_id: user.organizationId,
    role: user.role,
    created_at: user.createdAt.toDate().toISOString(),
    updated_at: user.updatedAt ? user.updatedAt.toDate().toISOString() : user.createdAt.toDate().toISOString(),
});

