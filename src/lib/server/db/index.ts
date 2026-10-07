import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client/web';
import * as schema from './schema';
import { DATABASE_URL, DATABASE_AUTH_TOKEN } from '$app/env/private';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!DATABASE_AUTH_TOKEN && !DATABASE_URL.startsWith('file:')) {
	throw new Error('DATABASE_AUTH_TOKEN is required for remote database connections');
}

const client = createClient({
	url: DATABASE_URL,
	authToken: DATABASE_AUTH_TOKEN || undefined
});

export const db = drizzle(client, { schema });
