<script>
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
    import DotaConfigModal from "../DotaConfigModal.svelte";
    import { mapRoleToString } from '$lib/const/const';
    import { invalidateAll } from '$app/navigation';
    import { applyAction,deserialize, enhance } from '$app/forms';
    let data = $props();
    let showExplanationModal =$state(false)
    let playerCreated = $state(false)
    let createPlayerError =$state(false)
    let playerDeleted = $state(false);
    let deletePlayerError = $state(false);
    let errorMsg = $state("")



    async function handleSubmitNewPlayer(event){
        event.preventDefault();
        playerCreated = false
        createPlayerError= false
		const data = new FormData(event.currentTarget, event.submitter);
		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
            headers: {
                'x-sveltekit-action': 'true',

            },
                body: data
            });

		const result = deserialize(await response.text());
		if (result.type === 'success') {
			// rerun all `load` functions, following the successful update
			await invalidateAll();
            playerCreated = true
            createPlayerError = false;
            errorMsg =''
            setTimeout(()=> playerCreated = false,3000)
		}
        else if(result.type ==='failure'){
            //await invalidateAll()
            createPlayerError = true
            errorMsg = result.data.message?result.data.message:''
            setTimeout(()=> {
                createPlayerError = false;
                errorMsg='';
            },3000)
        }

		applyAction(result);
    }
    

    async function handleDeletePlayer(playerId,steamId){
        playerDeleted = false
        if(confirm(`Are you sure you want to delete the player with Steam ID: ${steamId} ? This action cannot be undone.`)){
            const response = await fetch(`/dashboard/dota-config/player`, {
                method: 'DELETE',
                headers: {'content-type': 'application/json'},
                body:JSON.stringify({playerId:playerId,steamId:steamId})
            });

            if (response.status == 200) {
            // rerun all `load` functions, following the successful update
                await invalidateAll();
                playerDeleted = true
                deletePlayerError = false;
                errorMsg =''
                setTimeout(()=> playerDeleted = false,3000)
                return true
            }
            else{
                deletePlayerError = true
                errorMsg = result.data.message?result.data.message:''
                setTimeout(()=> {
                    deletePlayerError = false;
                    errorMsg='';
                },3000)
                return false
            }
        }
    }
</script>

{#if playerCreated}
 <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Player added successfuly</p>
                <p class="text-lg">Player has been added.</p>
                </div>
            </div>
</div>
{/if}

{#if playerDeleted}
 <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Player deleted Successfuly</p>
                <p class="text-lg">Player has been removed.</p>
                </div>
            </div>
</div>
{/if}


{#if createPlayerError}
<div class="bg-red-100 border-t-4 border-red-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Failed to add new player</p>
                <p class="text-lg">{errorMsg}</p>
                </div>
            </div>
        </div>
{/if}

{#if deletePlayerError}
<div class="bg-red-100 border-t-4 border-red-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Failed to delete player</p>
                <p class="text-lg">{errorMsg}</p>
                </div>
            </div>
        </div>
{/if}
<div class="mb-5 place-content-center place-items-center">
    <form name="create-new-player" method="POST" action="/dashboard/dota-config/player" use:enhance onsubmit={handleSubmitNewPlayer}>
        <div class="container px-10 py-2 border-1 rounded-xl mb-3">
            <h1 class="text-lg font-[radiance] my-2 text-center">Add new player</h1>
            <hr>
            <label for="steamId" class="text-lg font-[radiance] mt-2">Steam ID <button class="ml-5"
                onclick={(e) => {e.preventDefault();showExplanationModal= true}}><FontAwesomeIcon icon={faCircleQuestion} size="1x"  class="text-blue-500"/></button> 
            </label>
            <input type="text" placeholder="Enter Steam ID" name="steamId" id="steamId" required class="w-md content-center bg-gray-100" maxlength="17" minlength="17">
            
            <label for="steamId" class="text-lg font-[radiance] mt-2">Account ID <button class="ml-2"
                onclick={(e) => {e.preventDefault();showExplanationModal= true}}><FontAwesomeIcon icon={faCircleQuestion} size="1x"  class="text-blue-500"/></button> </label>
            <input type="text" placeholder="Enter account ID, this is for tallying player to overlay" name="accountId" id="accountId" required class="w-md content-center bg-gray-100" minlength="8" max="9">

            <label for="name" class="text-lg font-[radiance] mt-2"><b>Name</b></label>
            <input type="text" placeholder="Enter player name" name="name" id="name" required class="w-md bg-gray-100">
                <label for="role" class="text-lg font-[radiance] mt-2"><b>Role</b></label>
            <select
                class="w-md mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline bg-gray-100" name="rolePosition" id="role"
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

    <p class="font-extrabold text-xl font-[radiance]">To see detail of players and do some actions <span class="text-red-900 underline font-[radiance_bold]">(e.g upload avatar photo or assign to team)</span>, please click the player name below in player list.</p>
    <h1 class="font-extrabold text-xl font-[radiance] text-center mt-10">Player lists</h1>
    <div class="container block h-72 overflow-y-auto my-6">
        <table class="w-full border-collapse text-sm ">
                <thead>
                    <tr>
                        <th class="px-4 py-2 text-left border-1 bg-gray-200 sticky z-1 top-0.5">Steam ID</th>
                        <th class="px-4 py-2 text-left border-1 bg-gray-200 sticky z-1 top-0.5">Account ID</th>
                        <th class="px-4 py-2 text-left border-1 bg-gray-200 sticky z-1 top-0.5">Player Name</th>
                        <th class="px-4 py-2 text-left border-1 bg-gray-200 sticky z-1 top-0.5">Role</th>
                        <th class="px-4 py-2 text-left border-1 bg-gray-200 sticky z-1 top-0.5">Action</th>
                    </tr>
                </thead>
            <tbody>
                {#if data.records && data.records.length != 0}
                {#each data.records as row}
                    <tr>
                        <td class="px-4 text-left py-2 border-1 font-bold">{row.steamId}</td>
                        <td class="px-4 text-left py-2 border-1 font-bold">{row.accountId}</td>
                        <td class="px-4 text-left py-2 border-1 font-bold"><a href={`/dashboard/dota-config/player/${row.id}`}>{row.name}</a> </td>
                        <td class="px-4 text-left py-2 border-1 font-bold">{mapRoleToString(row.rolePosition)}</td>	
                        <td class="px-4 text-left py-2 border-1 font-bold">
                            <button class="text-white text-md rounded-sm p-2 bg-red-600  hover:bg-red-700" onclick={() => handleDeletePlayer(row.id)}>Delete</button>
                        </td>	
                    </tr>
                {/each}
                {:else}
                <tr>
                    <td colspan="5" class="px-4 py-2 border-1 text-2xl text-center">There is no record for teams yet. </td>
                </tr>
                {/if}
            </tbody>
    </table>
    </div>      
</div>	

<DotaConfigModal bind:open={showExplanationModal} title="About Steam ID and Account ID">
    <div class="mb-10"> 
        <h1 class="text-4xl mb-4">Why we need Steam ID and Account ID?</h1>
        <p class="text-lg">
            We collect the id for mapping the data from DOTA2 client to the application. Thus, we know which player play which hero and the detail of match (if any tournaments/league).
        </p>
    </div>
    <div>
        <h1 class="text-2xl mb-4">About Steam ID</h1>
        <p class="text-lg">
            SteamID is an id from steam application to identify Steam user. The purpose is for getting information from Steam Profile. <br/>
            Steam ID consist 17 digits and you can see your ID in Steam application in your profile for example: <strong>76561198000000000</strong>
        </p>
        <h1 class="text-2xl my-4">About Account ID</h1>
        <p class="text-lg">
            Account is an id from Dota 2 application to identify Dota 2 user. The purpose is for getting information from Dota Client to be tally in the application <br/>
            Account ID consist 8-9 digits and you can see your ID in Dota 2 Gasme Dashboard, go to your profile and it named <span class="italic underline">"FRIEND ID"</span>. For example :<strong>12345678</strong>
        </p>
    </div>
</DotaConfigModal>