import { error } from '@sveltejs/kit';
import { getMatchSchedule, getResults } from '$lib/server/db';

export async function load({ params }) {
  const { bracketId } = params;

  if (!bracketId) {
    throw error(400, 'Bracket ID is required');
  }

  const matchSchedule = await getMatchSchedule(bracketId);
  const results = await getResults(bracketId);

  return {
    matchSchedule,
    results
  };
}
