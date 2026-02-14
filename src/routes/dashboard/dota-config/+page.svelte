<script>
    import { asset } from "$app/paths";
    import { socket } from "$lib/const/const";
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import Accordion from "$lib/components/Accordion.svelte";
    import "$lib/assets/style/global.css";
    import "$lib/assets/style/dashboard.css";
    
    /** @type {import('./$types').PageProps} */
    let {data } = $props()
    import { page } from "$app/state";

    const players = [
		{ steamId:'12312',name: 'InyourDream', role: 2,team:'' },
		{ steamId:'12312',name: 'jikroy', role: 1,team:'' }
	];

    const teams = [
		{ name: 'Rekonix', tag: 'RKX', logo:'' }
	];

    const [PLAYERS,TEAMS] =["PLAYERS","TEAMS"]

</script>

{#snippet player_table_header()}
    <th class="px-4 py-2 text-left border-1 bg-gray-200">Player Name</th>
    <th class="px-4 py-2 text-left border-1 bg-gray-200">Steam ID</th>
    <th class="px-4 py-2 text-left border-1 bg-gray-200">Role</th>
{/snippet}

{#snippet team_table_header()}
    <th class="px-4 py-2 text-left border-1 bg-gray-200">Team Name</th>
    <th class="px-4 py-2 text-left border-1 bg-gray-200">Team Tag</th>
    <th class="px-4 py-2 text-left border-1 bg-gray-200">Team Logo</th>	
{/snippet}


{#snippet player_table_row(d)}
    <th class="px-4 text-left py-2 border-1">{d.name}</th>
    <th class="px-4 text-left py-2 border-1">{d.steamId}</th>
    <th class="px-4 text-left py-2 border-1">{d.role}</th>
{/snippet}

{#snippet team_table_row(d)}
    <th class="px-4 text-left py-2 border-1">{d.name}</th>
    <th class="px-4 text-left py-2 border-1">{d.tag}</th>
    <th class="px-4 text-left py-2 border-1">{d.logo}</th>	
{/snippet}

{#snippet player_content()}
   <div class="mb-5">
        <form name="create-new-player">
            <div class="container px-10 py-2 border-1 rounded-xl mb-3">
                <h1 class="text-lg font-[radiance] my-2 text-center">Add new player (this action would do nothing because it is under development)</h1>
                <hr>
                <label for="steamId" class="text-lg font-[radiance] mt-2"><b>Steam ID</b></label>
                <input type="text" placeholder="Enter Steam ID account, this is for tallying player to overlay" name="steamId" id="steamId" required class="w-md content-center">

                <label for="name" class="text-lg font-[radiance] mt-2"><b>Name</b></label>
                <input type="text" placeholder="Enter player name" name="name" id="name" required class="w-md">
                 <label for="role" class="text-lg font-[radiance] mt-2"><b>Role</b></label>
                <select
                    class="w-md mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline" name="role" id="role"
                    >
                    <option value="" disabled selected>
                        Choose between 1 to 5 (Safe lane to hard support)
                    </option>
                    <option value="1">1 (Safe Lane)</option>
                    <option value="2">2 (Mid Lane)</option>
                    <option value="3">3 (Off Lane)</option>
                    <option value="4">4 (Soft support)</option>
                    <option value="5">5 (Hard support)</option>
                    </select>
                                    <br/>
                <button type="submit" class="button-create-player ml-4">Create new Player</button>
            </div>
        </form>


        <h1 class="font-extrabold text-xl font-[radiance] text-center">Player lists</h1>
   </div>	
{/snippet}

{#snippet team_content()}
   <div class="mb-5">
        <form name="create-new-team">
            <div class="container px-10 py-2 border-1 rounded-xl mb-3">
                <h1 class="text-lg font-[radiance] my-2 text-center">Add new team (this action would do nothing because it is under development)</h1>
                <hr>
                <label for="team-name" class="text-lg font-[radiance] mt-2"><b>Team Name</b></label>
                <input type="text" placeholder="Enter team name" name="team-name" id="team-name" required class="w-md content-center">

                <label for="team-tag" class="text-lg font-[radiance] mt-2"><b>Team Tag</b></label>
                <input type="text" placeholder="Enter team tag (usually 3 letters of the team name)" name="team-tag" id="team-tag" required class="w-md">
                <label for="team-logo" class="text-lg font-[radiance] mt-2"><b>Team Logo</b></label>
                <input type="file" id="team-logo" name="team-logo" class="custom-file-input">
                <br/>
                <button type="submit" class="button-create-player ml-4">Create new team</button>
            </div>
        </form>


        <h1 class="font-extrabold text-xl font-[radiance] text-center">Player lists</h1>
   </div>		
{/snippet}


<!-- Chart or Table Placeholder -->
<div class="bg-white p-6 rounded-xl shadow min-h-[300px]">
    <h1 class="text-xl font-semibold mb-4 text-gray-700">Dota Configuration</h1>
    <h3 class="text-lg font-semibold mb-4 text-gray-700"> This page is under construction. There are still so many bugs </h3>
    <p class="text-gray-600 mb-6 text-wrap">This will be the Dota configuration page where user can update their Dota settings such as Players, teams, and other game-related configurations.</p>
    <Accordion title={"Players Configuration Tab"} {players} 
    accordion_content={player_content} 
    accordion_for={PLAYERS}
    {player_table_header}
    {player_table_row}
    />
    <Accordion title={"Teams Configuration Tab"} 
    accordion_content={team_content} 
    accordion_for={TEAMS}
    {team_table_header}
    {team_table_row}/>
</div>