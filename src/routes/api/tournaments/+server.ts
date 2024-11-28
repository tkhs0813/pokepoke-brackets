import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tournaments, players, matches } from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';

export async function POST({ request }) {
  const { name, playerList, matchFormat } = await request.json();
  const tournamentId = uuidv4();

  await db.insert(tournaments).values({
    id: tournamentId,
    name,
    matchFormat
  });

  const playerIds = [];
  for (const playerName of playerList) {
    const playerId = uuidv4();
    playerIds.push(playerId);
    await db.insert(players).values({
      id: playerId,
      tournamentId,
      name: playerName
    });
  }

  const matchPairs = [];
  for (let i = 0; i < playerIds.length; i++) {
    for (let j = i + 1; j < playerIds.length; j++) {
      matchPairs.push({
        id: uuidv4(),
        tournamentId,
        player1Id: playerIds[i],
        player2Id: playerIds[j],
        status: 'pending'
      });
    }
  }

  await db.insert(matches).values(matchPairs);

  return json({ tournamentId });
}

export async function GET({ params }) {
  const { id } = params;
  const tournament = await db.select().from(tournaments).where(tournaments.id.eq(id)).first();
  const playerList = await db.select().from(players).where(players.tournamentId.eq(id));
  const matchList = await db.select().from(matches).where(matches.tournamentId.eq(id));

  return json({ tournament, playerList, matchList });
}
