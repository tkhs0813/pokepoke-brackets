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

<h1>Match Schedule and Results</h1>
{#if matches.length > 0}
  <ul>
    {#each matches as match}
      <li>
        <div>
          <strong>{match.player1} vs {match.player2}</strong>
          {#if results[match.id]}
            <p>Winner: {results[match.id].winner}</p>
            <p>Score: {results[match.id].score}</p>
            <p>Notes: {results[match.id].notes}</p>
          {:else}
            <form on:submit|preventDefault={() => recordResult(match.id, winner, score, notes)}>
              <label>
                Winner:
                <input type="text" bind:value={winner} />
              </label>
              <label>
                Score:
                <input type="text" bind:value={score} />
              </label>
              <label>
                Notes:
                <input type="text" bind:value={notes} />
              </label>
              <button type="submit">Record Result</button>
            </form>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
{:else}
  <p>No matches scheduled.</p>
{/if}
