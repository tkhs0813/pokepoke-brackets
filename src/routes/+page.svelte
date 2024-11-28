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

<h1 class="text-2xl font-bold mb-4">Create a Tournament</h1>
<form on:submit|preventDefault={createTournament} class="space-y-4">
  <div>
    <label class="block text-sm font-medium text-gray-700">
      Tournament Name:
    </label>
    <input type="text" bind:value={tournamentName} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
  </div>
  <div>
    <label class="block text-sm font-medium text-gray-700">
      Player List (comma separated):
    </label>
    <input type="text" bind:value={playerList} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
  </div>
  <div>
    <label class="block text-sm font-medium text-gray-700">
      Match Format:
    </label>
    <select bind:value={matchFormat} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      <option value="single">Single Match</option>
      <option value="multiple">Multiple Matches</option>
    </select>
  </div>
  <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
    Create
  </button>
</form>
