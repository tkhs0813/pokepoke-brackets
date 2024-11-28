import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tournaments } from '$lib/server/db/schema';

export async function load() {
  try {
    const tournamentList = await db.select().from(tournaments);
    return { tournamentList };
  } catch (err) {
    throw error(500, 'Failed to fetch tournament data');
  }
}
