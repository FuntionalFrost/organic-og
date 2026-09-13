import { auth } from '$lib/server/auth';
import { toSvelteKitHandler } from 'better-auth/svelte-kit';

export const fallback = toSvelteKitHandler(auth);
