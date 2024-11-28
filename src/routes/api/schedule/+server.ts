import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { matches } from '$lib/server/db/schema';

export async function GET({ params }) {
  const { bracketId } = params;

  const matchSchedule = await db
    .select()
    .from(matches)
    .where({ tournamentId: bracketId });

  return json(matchSchedule);
}
