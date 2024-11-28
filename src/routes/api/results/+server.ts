import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { matches } from '$lib/server/db/schema';

export async function POST({ request }) {
  const { matchId, winner, score, notes } = await request.json();

  await db.update(matches)
    .set({
      winner,
      score,
      notes,
      status: 'completed'
    })
    .where({ id: matchId });

  return json({ success: true });
}

export async function GET({ params }) {
  const { bracketId } = params;

  const results = await db
    .select()
    .from(matches)
    .where({ tournamentId: bracketId, status: 'completed' });

  return json(results);
}
