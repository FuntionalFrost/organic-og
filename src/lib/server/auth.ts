import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL || env.ORIGIN || 'http://localhost:5173',
	secret:
		env.BETTER_AUTH_SECRET ||
		env.OG_SIGNING_SECRET ||
		'better-auth-secret-key-at-least-32-chars-long',
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema: {
			...schema
		}
	}),
	trustedOrigins: [
		'http://localhost:5173',
		'http://127.0.0.1:5173',
		'https://dynamic-og-engine.netlify.app',
		'https://*.netlify.app',
		...(env.ORIGIN ? [env.ORIGIN] : []),
		...(env.PUBLIC_BASE_URL ? [env.PUBLIC_BASE_URL] : [])
	],
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID || '',
			clientSecret: env.GITHUB_CLIENT_SECRET || ''
		}
	},
	user: {
		additionalFields: {
			creditsRemaining: {
				type: 'number',
				defaultValue: 10,
				input: false
			}
		}
	},
	plugins: [
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
