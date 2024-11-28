import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tournaments, players, matches } from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';

export async function POST({ request }) {
  const { name, players: playerList, format } = await request.json();

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

  return json({ id: tournamentId });
}
