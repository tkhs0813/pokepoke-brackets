<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let tournamentName = '';
  let playerList = '';
  let matchFormat = 'single';
  let tournaments = writable([]);
  let matches = writable([]);
  let players = writable([]);
  let results = writable([]);

  function createTournament() {
    const playersArray = playerList.split(',').map((name) => name.trim());
    const newTournament = {
      id: Date.now(),
      name: tournamentName,
      players: playersArray,
      matchFormat,
    };
    tournaments.update((t) => [...t, newTournament]);
    generateMatches(newTournament);
  }

  function generateMatches(tournament) {
    const matchesArray = [];
    for (let i = 0; i < tournament.players.length; i++) {
      for (let j = i + 1; j < tournament.players.length; j++) {
        matchesArray.push({
          id: Date.now() + i + j,
          tournamentId: tournament.id,
          player1: tournament.players[i],
          player2: tournament.players[j],
          status: 'pending',
        });
      }
    }
    matches.update((m) => [...m, ...matchesArray]);
  }

  function recordResult(matchId, winner, score, notes) {
    matches.update((m) =>
      m.map((match) =>
        match.id === matchId
          ? { ...match, winner, score, notes, status: 'completed' }
          : match
      )
    );
    updateResults();
  }

  function updateResults() {
    const resultsArray = [];
    matches.subscribe((m) => {
      m.forEach((match) => {
        if (match.status === 'completed') {
          const player1 = resultsArray.find((p) => p.name === match.player1);
          const player2 = resultsArray.find((p) => p.name === match.player2);
          if (player1) {
            player1.matches++;
            if (match.winner === match.player1) {
              player1.wins++;
            }
          } else {
            resultsArray.push({
              name: match.player1,
              matches: 1,
              wins: match.winner === match.player1 ? 1 : 0,
            });
          }
          if (player2) {
            player2.matches++;
            if (match.winner === match.player2) {
              player2.wins++;
            }
          } else {
            resultsArray.push({
              name: match.player2,
              matches: 1,
              wins: match.winner === match.player2 ? 1 : 0,
            });
          }
        }
      });
    });
    results.set(resultsArray);
  }

  function printResults() {
    window.print();
  }

  function downloadResults(format) {
    const data = results.subscribe((r) => r);
    let content = '';
    if (format === 'csv') {
      content = 'Name,Matches,Wins\n';
      data.forEach((result) => {
        content += `${result.name},${result.matches},${result.wins}\n`;
      });
    } else if (format === 'pdf') {
      // Implement PDF download logic here
    }
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `results.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<h1>Create Round-Robin Tournament</h1>
<form on:submit|preventDefault={createTournament}>
  <label>
    Tournament Name:
    <input type="text" bind:value={tournamentName} />
  </label>
  <label>
    Player List (comma-separated):
    <input type="text" bind:value={playerList} />
  </label>
  <label>
    Match Format:
    <select bind:value={matchFormat}>
      <option value="single">Single Match</option>
      <option value="multiple">Multiple Matches</option>
    </select>
  </label>
  <button type="submit">Create Tournament</button>
</form>

<h2>Matches</h2>
<ul>
  {#each $matches as match}
    <li>
      {match.player1} vs {match.player2} - {match.status}
      {#if match.status === 'pending'}
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
    </li>
  {/each}
</ul>

<h2>Results</h2>
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Matches</th>
      <th>Wins</th>
    </tr>
  </thead>
  <tbody>
    {#each $results as result}
      <tr>
        <td>{result.name}</td>
        <td>{result.matches}</td>
        <td>{result.wins}</td>
      </tr>
    {/each}
  </tbody>
</table>
<button on:click={printResults}>Print Results</button>
<button on:click={() => downloadResults('csv')}>Download CSV</button>
<button on:click={() => downloadResults('pdf')}>Download PDF</button>
