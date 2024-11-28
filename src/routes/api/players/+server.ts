import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { players } from '$lib/server/db/schema';

export async function GET({ params }) {
  const { id } = params;
  const player = await db.select().from(players).where(players.id.eq(id)).first();

  return json({ player });
}
