<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let tournamentName = '';
  let playerList = '';
  let matchFormat = 'single';

  async function createTournament() {
    const response = await fetch('/api/tournament', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: tournamentName,
        players: playerList.split(',').map(player => player.trim()),
        format: matchFormat
      })
    });

    if (response.ok) {
      const { id } = await response.json();
      goto(`/bracket/${id}`);
    } else {
      console.error('Failed to create tournament');
    }
  }
</script>

<h1>Create a Tournament</h1>
<form on:submit|preventDefault={createTournament}>
  <label>
    Tournament Name:
    <input type="text" bind:value={tournamentName} />
  </label>
  <label>
    Player List (comma separated):
    <input type="text" bind:value={playerList} />
  </label>
  <label>
    Match Format:
    <select bind:value={matchFormat}>
      <option value="single">Single Match</option>
      <option value="multiple">Multiple Matches</option>
    </select>
  </label>
  <button type="submit">Create</button>
</form>
