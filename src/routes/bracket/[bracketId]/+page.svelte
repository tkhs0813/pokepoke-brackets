<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let bracketId: string;
  let matches = [];
  let results = {};

  $: bracketId = $page.params.bracketId;

  async function recordResult(matchId, winner, score, notes) {
    const response = await fetch(`/api/results/${bracketId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        matchId,
        winner,
        score,
        notes
      })
    });

    if (response.ok) {
      await fetchResults();
    } else {
      console.error('Failed to record result');
    }
  }
</script>

<h1 class="text-2xl font-bold mb-4">Match Schedule and Results</h1>
{#if matches.length > 0}
  <ul class="space-y-4">
    {#each matches as match}
      <li class="border border-gray-300 rounded-md p-4 shadow-sm">
        <div>
          <strong>{match.player1} vs {match.player2}</strong>
          {#if results[match.id]}
            <p>Winner: {results[match.id].winner}</p>
            <p>Score: {results[match.id].score}</p>
            <p>Notes: {results[match.id].notes}</p>
          {:else}
            <form on:submit|preventDefault={() => recordResult(match.id, winner, score, notes)} class="space-y-2">
              <label class="block">
                Winner:
                <input type="text" bind:value={winner} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </label>
              <label class="block">
                Score:
                <input type="text" bind:value={score} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </label>
              <label class="block">
                Notes:
                <input type="text" bind:value={notes} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </label>
              <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Record Result
              </button>
            </form>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
{:else}
  <p>No matches scheduled.</p>
{/if}
