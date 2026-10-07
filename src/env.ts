import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	ORIGIN: { schema: (input) => input ?? '' },
	PUBLIC_APP_URL: { schema: (input) => input ?? '' },
	PUBLIC_BASE_URL: { schema: (input) => input ?? '' },
	OG_SIGNING_SECRET: { schema: (input) => input ?? '' },
	UPSTASH_REDIS_REST_URL: { schema: (input) => input ?? '' },
	UPSTASH_REDIS_REST_TOKEN: { schema: (input) => input ?? '' },
	DATABASE_URL: { schema: (input) => input ?? '' },
	DATABASE_AUTH_TOKEN: { schema: (input) => input ?? '' }
});
