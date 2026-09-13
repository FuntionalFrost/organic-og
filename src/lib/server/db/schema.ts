import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// --- Better-Auth Tables ---
export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
	image: text('image'),
	creditsRemaining: integer('credits_remaining').notNull().default(10),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`)
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const account = sqliteTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
	refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`)
});

export const verification = sqliteTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
});

// --- Engine Tables ---
export const apiKeys = sqliteTable('api_keys', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	keyHash: text('key_hash').notNull().unique(),
	prefix: text('prefix').notNull(),
	creditsRemaining: integer('credits_remaining').notNull().default(10),
	totalRenders: integer('total_renders').notNull().default(0),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

export const renderLogs = sqliteTable('render_logs', {
	id: text('id').primaryKey(),
	apiKeyId: text('api_key_id').references(() => apiKeys.id, { onDelete: 'cascade' }),
	template: text('template').notNull(),
	isCacheHit: integer('is_cache_hit', { mode: 'boolean' }).notNull(),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

export const purchases = sqliteTable('purchases', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
	apiKeyId: text('api_key_id').references(() => apiKeys.id, { onDelete: 'set null' }),
	polarOrderId: text('polar_order_id').notNull().unique(),
	creditsAdded: integer('credits_added').notNull(),
	amountCents: integer('amount_cents').notNull(),
	currency: text('currency').notNull().default('usd'),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;
export type RenderLog = typeof renderLogs.$inferSelect;
