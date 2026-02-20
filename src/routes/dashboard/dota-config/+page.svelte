<script>
    import Accordion from "$lib/components/Accordion.svelte";
    import "$lib/assets/style/global.css";
    import "$lib/assets/style/dashboard.css";
    
    /** @type {import('./$types').PageProps} */
    let {data } = $props()
    import PlayerList from "$lib/components/DOTA/player/PlayerList.svelte";
    import TeamList from "$lib/components/DOTA/team/TeamList.svelte";

    const players = $derived(data.players);
    const teams = $derived(data.teams);

</script>

{#snippet player_content(data)}
    <PlayerList records={data}/>
{/snippet}

{#snippet team_content(data)}
    <TeamList records={data}/>
{/snippet}



<!-- Chart or Table Placeholder -->
<div class="bg-white p-6 rounded-xl shadow min-h-[300px]">
    <h1 class="text-xl font-semibold mb-4 text-gray-700">Dota Configuration</h1>
    <h3 class="text-lg font-semibold mb-4 text-gray-700"> This page is under construction. There are still so many bugs </h3>
    <p class="text-gray-600 mb-6 text-wrap">This will be the Dota configuration page where user can update their Dota settings such as Players, teams, and other game-related configurations.</p>
    <Accordion title={"Players Configuration Tab"}  accordion_content={player_content} records={players} />
    <Accordion title={"Teams Configuration Tab"}  accordion_content={team_content} records={teams} />

</div>