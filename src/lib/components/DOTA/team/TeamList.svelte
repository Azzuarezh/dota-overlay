<script>
    import { applyAction,deserialize,enhance } from "$app/forms";
    import { invalidateAll } from '$app/navigation';
     import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
    import DotaConfigModal from "../DotaConfigModal.svelte";
    import { asset } from "$app/paths";

    let data = $props();
    let teamCreated = $state(false)
    let createTeamError =$state(false)
    let teamDeleted = $state(false);
    let deleteTeamError = $state(false);
    let errorMsg = $state("")

    let showExplanationModal =$state(false)
    async function handleSubmitNewTeam(event){
        event.preventDefault();
        teamCreated = false
        const data = new FormData(event.currentTarget, event.submitter);
        console.log(event.currentTarget.action)
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
            teamCreated = true
            createTeamError = false;
            errorMsg =''
            setTimeout(()=> teamCreated = false,3000)
        }
        else if(result.type ==='failure'){
            //await invalidateAll()
            createTeamError = true
            errorMsg = result.data.message?result.data.message:''
            setTimeout(()=> {
                createTeamError = false;
                errorMsg='';
            },3000)
        }
        applyAction(result);
    } 
        
    async function handleDeleteTeam(teamId, teamName){
        teamDeleted = false
        if(confirm(`Are you sure you want to delete the team ${teamName} ? This action cannot be undone.`)){
            const response = await fetch(`/dashboard/dota-config/team`, {
                method: 'DELETE',
                headers: {'content-type': 'application/json'},
                body:JSON.stringify({teamId:teamId})
            });

            if (response.status == 200) {
            // rerun all `load` functions, following the successful update
                await invalidateAll();
                teamDeleted = true
                deleteTeamError = false;
                errorMsg =''
                setTimeout(()=> teamDeleted = false,3000)
                return true
            }
            else{
                deleteTeamError = true
                errorMsg = result.data.message?result.data.message:''
                setTimeout(()=> {
                    deleteTeamError = false;
                    errorMsg='';
                },3000)
                return false
            }
        }
    }
</script>

{#if teamCreated}
 <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Team added successfuly</p>
                <p class="text-lg">Team has been added.</p>
                </div>
            </div>
</div>
{/if}

{#if teamDeleted}
 <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Team deleted Successfuly</p>
                <p class="text-lg">Team has been removed.</p>
                </div>
            </div>
</div>
{/if}


{#if createTeamError}
<div class="bg-red-100 border-t-4 border-red-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Failed to add new team</p>
                <p class="text-lg">{errorMsg}</p>
                </div>
            </div>
        </div>
{/if}

{#if deleteTeamError}
<div class="bg-red-100 border-t-4 border-red-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Failed to delete team</p>
                <p class="text-lg">{errorMsg}</p>
                </div>
            </div>
        </div>
{/if}

   <div class="mb-5 place-content-center place-items-center">
       <form name="create-new-team" method="POST" action="/dashboard/dota-config/team" onsubmit={handleSubmitNewTeam}>
            <div class="container px-10 py-2 border-1 rounded-xl mb-3">
                <h1 class="text-lg font-[radiance] my-2 text-center">Add new team </h1>
                <hr>
                <label for="team-id" class="text-lg font-[radiance] mt-2"><b>Team ID</b> <button class="ml-5" 
                    onclick={(e) => {e.preventDefault();showExplanationModal= true}}
                ><FontAwesomeIcon icon={faCircleQuestion} size="1x"  class="text-blue-500"/></button> </label>
                <input type="number" placeholder="Enter team ID" name="team-id" id="team-name" required class="w-md content-center bg-gray-100" minlength={7} maxlength={7}>
                <label for="team-name" class="text-lg font-[radiance] mt-2"><b>Team Name</b></label>
                <input type="text" placeholder="Enter team name" name="team-name" id="team-name" required class="w-md content-center bg-gray-100">

                <label for="team-tag" class="text-lg font-[radiance] mt-2"><b>Team Tag</b></label>
                <input type="text" placeholder="Enter team tag (usually 3 letters of the team name)" name="team-tag" id="team-tag" required class="w-md bg-gray-100">
                <br/>
                <button type="submit" class="button-create-player ml-4">Create new team</button>
            </div>
        </form>
         <p class="font-extrabold text-xl font-[radiance]">To see detail of team and do some actions <span class="text-red-900 underline font-[radiance_bold]">(e.g upload team logo)</span>, please click the team name below in team list.</p>

        <h1 class="font-extrabold text-xl font-[radiance] text-center mt-10">Team lists</h1>
        <div class="container block h-72 overflow-y-auto my-6">
            <table class="w-full border-collapse text-sm ">
                    <thead>
                        <tr>
                            <th class="px-4 py-2 text-left border-1 bg-gray-200 sticky z-1 top-0.5">Team Name</th>
                            <th class="px-4 py-2 text-left border-1 bg-gray-200 sticky z-1 top-0.5">Team Tag</th>
                            <th class="px-4 py-2 text-left border-1 bg-gray-200 sticky z-1 top-0.5">Action</th>	
                        </tr>
                    </thead>
                <tbody>
                    {#if data.records && data.records.length != 0}
                    {#each data.records as row}
                        <tr>
                            <td class="px-4 text-left py-2 border-1 font-bold"><a href={`/dashboard/dota-config/team/${row.teamId}`}>{row.name}</a> </td>
                            <td class="px-4 text-left py-2 border-1 font-bold">{row.tag}</td>
                            <td class="px-4 text-left py-2 border-1 font-bold">
                                <button class="text-white bg-red-500  hover:bg-red-700 inline-block" onclick={() =>handleDeleteTeam(row.teamId,row.name)}>Delete</button>
                            </td>	
                        </tr>
                    {/each}
                    {:else}
                    <tr>
                        <td colspan="3" class="px-4 py-2 border-1 text-2xl text-center">There is no record for players yet. </td>
                    </tr>
                    {/if}
                </tbody>
        </table>
        </div>       
   </div>
   <DotaConfigModal bind:open={showExplanationModal} title="About Team ID">
    <div> 
        <h1 class="text-4xl mb-4">Why we need Team ID?</h1>
        <p class="text-lg">
            We collect the id for mapping the data from DOTA2 client to the application. Thus, we know which team play and the detail of match (if any tournaments/league).
        </p>
    </div>
    <div class="grid overflow-y-auto h-[70%]">
        <h1 class="text-2xl mb-4">How to get Team ID</h1>
        <p class="text-lg mb-2">
            Team ID is an id from dota application to identify Registered team. The purpose is for getting information from dota client to map in application. <br/>
            Team ID consist 7 digits and you can see your Team ID in Dota application, go to settings and go to account
        </p>
        <img src={asset('/resources/image_style/manage_official_info_and_teams.png')} alt="settings"  class="w-80 h-60"/>
         <p class="text-lg my-3">you can create new team or click manage official info and teams (if you have already created one)</p>
        <img src={asset('/resources/image_style/edit_team.png')} alt="settings"  class="w-80 h-60" />
        <p class="text-lg my-3">
            Team ID will appear on the right side of the box
        </p>
        <img src={asset('/resources/image_style/getting_team_id.png')} alt="settings"  class="w-80 h-60" />
    </div>
</DotaConfigModal>	