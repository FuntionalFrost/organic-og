import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// --- Engine Tables ---
export const apiKeys = sqliteTable('api_keys', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	keyHash: text('key_hash').notNull().unique(),
	prefix: text('prefix').notNull(),
	creditsRemaining: integer('credits_remaining').notNull().default(999999),
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

export type ApiKey = typeof apiKeys.$inferSelect;
export type RenderLog = typeof renderLogs.$inferSelect;
