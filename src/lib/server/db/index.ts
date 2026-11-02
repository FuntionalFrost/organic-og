import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { DATABASE_URL, DATABASE_AUTH_TOKEN } from '$app/env/private';

const url = DATABASE_URL || 'file:local.db';
const authToken = DATABASE_AUTH_TOKEN || undefined;

if (!authToken && !url.startsWith('file:') && !url.startsWith(':memory:')) {
	throw new Error('DATABASE_AUTH_TOKEN is required for remote database connections');
}

const client = createClient({
	url,
	authToken
});

export const db = drizzle(client, { schema });
