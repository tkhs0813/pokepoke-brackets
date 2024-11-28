import { dev } from '$app/environment';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import { tournaments, players, matches } from './schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!dev && !env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');

const client = createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });
export const db = drizzle(client);

export async function createTournament(name, playerList, format) {
  const tournamentId = uuidv4();

  await db.insert(tournaments).values({
    id: tournamentId,
    name,
    format
  });

  for (const player of playerList) {
    await db.insert(players).values({
      id: uuidv4(),
      tournamentId,
      name: player
    });
  }

  // Generate matches for round-robin format
  const matchesToInsert = [];
  for (let i = 0; i < playerList.length; i++) {
    for (let j = i + 1; j < playerList.length; j++) {
      matchesToInsert.push({
        id: uuidv4(),
        tournamentId,
        player1: playerList[i],
        player2: playerList[j],
        status: 'pending'
      });
    }
  }

  await db.insert(matches).values(matchesToInsert);

  return tournamentId;
}

export async function getMatchSchedule(bracketId) {
  return await db
    .select()
    .from(matches)
    .where({ tournamentId: bracketId });
}

export async function getResults(bracketId) {
  return await db
    .select()
    .from(matches)
    .where({ tournamentId: bracketId, status: 'completed' });
}

export async function recordResult(matchId, winner, score, notes) {
  await db.update(matches)
    .set({
      winner,
      score,
      notes,
      status: 'completed'
    })
    .where({ id: matchId });
}
