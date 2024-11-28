import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const tournaments = sqliteTable('tournaments', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	format: text('format').notNull()
});

export const players = sqliteTable('players', {
	id: text('id').primaryKey(),
	tournamentId: text('tournament_id')
		.notNull()
		.references(() => tournaments.id),
	name: text('name').notNull()
});

export const matches = sqliteTable('matches', {
	id: text('id').primaryKey(),
	tournamentId: text('tournament_id')
		.notNull()
		.references(() => tournaments.id),
	player1: text('player1').notNull(),
	player2: text('player2').notNull(),
	status: text('status').notNull(),
	winner: text('winner'),
	score: text('score'),
	notes: text('notes')
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Tournament = typeof tournaments.$inferSelect;

export type Player = typeof players.$inferSelect;

export type Match = typeof matches.$inferSelect;
