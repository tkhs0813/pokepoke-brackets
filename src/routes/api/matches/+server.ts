import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { matches } from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';

export async function POST({ request }) {
  const { tournamentId, player1Id, player2Id, winnerId, score, notes } = await request.json();
  const matchId = uuidv4();

  await db.insert(matches).values({
    id: matchId,
    tournamentId,
    player1Id,
    player2Id,
    winnerId,
    score,
    notes
  });

  return json({ matchId });
}

export async function GET({ params }) {
  const { id } = params;
  const match = await db.select().from(matches).where(matches.id.eq(id)).first();

  return json({ match });
}
