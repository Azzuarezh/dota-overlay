<script>
    import '$lib/assets/style/team_card.css'
    import { asset } from '$app/paths';
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faSave, faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
    import {deserialize} from '$app/forms';
    import {invalidate} from '$app/navigation'
    let {data, params} = $props()
    let teamLogoFileElement = $state();
    let teamLogoFiles = $state();

    let teamUpdated = $state(false);
    let teamLogoUploaded = $state(false)
    let updateTeamError = $state(false)
    let uploadLogoError = $state(false)
    let errorMsg =$state('')

    const teamLogo = $derived("data:image/png;base64," + data.team.logo)
    
    let playersInTeam = $derived(data.playersInTeam)


    function passDownClick(e) {
		teamLogoFileElement.click()
	}


    let requestUpdatetTeam = $state({
        name:data.team.name,
        tag:data.team.tag
    })
 


    async function handleUploadTeamLogo(e){
        e.preventDefault();
        const data = new FormData();
        data.append('teamLogo',teamLogoFiles[0])
        
        const response = await fetch(`/dashboard/dota-config/team/${params.teamId}/upload_logo`, {
            method: 'PATCH',
            body: data
        });

		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = deserialize(await response.text());
		if (result.type === 'success') {
            console.log(result.type)
			// rerun all `load` functions, following the successful update
			await invalidate('team:detail');
            teamLogoUploaded = true
            setTimeout(()=> teamLogoUploaded = false,3000)
		}
        else if(result.type ==='failure'){
            uploadLogoError = true
            teamLogoUploaded = false
            errorMsg = result.data.message?result.data.message:''
            setTimeout(()=> uploadLogoError = false,3000)
        }
    }
    
    async function handleUpdateTeam(e){
        e.preventDefault();
		const response = await fetch(`/dashboard/dota-config/team/${params.teamId}`, {
			method: 'PATCH',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(requestUpdatetTeam)
        });

		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = deserialize(await response.text());
		if (result.type === 'success') {
            console.log(result.type)
			// rerun all `load` functions, following the successful update
			await invalidate('team:detail');
            teamUpdated = true

            setTimeout(()=> teamUpdated = false,3000)
		}
        else if(result.type ==='failure'){
            //await invalidateAll()
            updateTeamError = true
            errorMsg = result.data.message?result.data.message:''
            setTimeout(()=> {
                teamUpdated = false;
                updateTeamError = false;
                errorMsg =''
            },5000)
        }
    }

    
</script>
{#if teamUpdated}
 <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Update Successfuly</p>
                <p class="text-lg">Team has been updated.</p>
                </div>
            </div>
</div>
{/if}

{#if teamLogoUploaded}
  <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Upload Team logo Successfuly</p>
                <p class="text-lg">Team logo has been updated.</p>
                </div>
            </div>  
    </div>
{/if}

{#if updateTeamError}
<div class="bg-red-100 border-t-4 border-red-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Update Error</p>
                <p class="text-lg">{errorMsg}</p>
                </div>
            </div>
        </div>
{/if}


{#if uploadLogoError}
<div class="bg-red-100 border-t-4 border-red-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Upload Team logo Error</p>
                <p class="text-lg">{errorMsg}</p>
                </div>
            </div>
        </div>
{/if}



<div class="grid grid-cols-2 gap-10 place-items-start w-6xl place-content-center justify-start items-start">
    <div class="items-start justify-start">
        <div class="team-card">
            <img src={teamLogo} 
                alt={data.team.name}
                class={['team-logo','p-5']}
                onerror={(e) => e.target.src = asset(`/resources/image_style/default_team_logo.png`)}
            />
            <div class="name">{data.team.name}</div>
            <div class="role">{data.team.tag}</div>  
            <input accept="image/png, image/jpeg" bind:this={teamLogoFileElement} id="avatar" name="team-logo" type="file" class="hidden" bind:files={teamLogoFiles}/>
            <button class="upload-team-logo" onclick={passDownClick}>Change logo <FontAwesomeIcon icon={faArrowAltCircleUp} size="1x" class="ml-1"/></button>
            {#if teamLogoFiles}
                {#if teamLogoFiles.length > 0}
                    <h2 class="team-logo-file-name">file name:</h2>
                    {#each Array.from(teamLogoFiles) as file}
                        <p class="text-white font-[radiance]">{file.name}</p>
                    {/each}
                    <button class="upload-team-logo" onclick={handleUploadTeamLogo} type="button">Save <FontAwesomeIcon icon={faSave} size="1x" class="ml-1" /></button>
                {/if}            
            {/if}
        </div>
    </div> 
     <div class="form-player w-4xl items-start justify-center content-center place-content-center pl-10 rounded-lg shadow-2xl shadow-blue-400 outline-1">
        <div class="grid grid-rows-1 space-y-0 p-20 h-[10%]">
            <div class="grid grid-cols-2">
                <div class="space-y-10">
                    <h1 class="font-[reaver] text-2xl font-extrabold">Team ID</h1>
                    <h1 class="font-[reaver] text-2xl font-extrabold">Team Name</h1>
                    <h1 class="font-[reaver] text-2xl font-extrabold">Team Tag</h1>
                    <h1 class="font-[reaver] text-2xl font-extrabold">Players</h1>
                </div>
                <div class="space-y-10">
                    <h1 class="font-[reaver] text-2xl font-extrabold before:content-[':'] before:mr-3">{data.team.teamId}</h1>
                    <h1 class="font-[reaver] text-2xl font-extrabold before:content-[':'] before:mr-3">{data.team.name}</h1>
                    <h1 class="font-[reaver] text-2xl font-extrabold before:content-[':'] before:mr-3">{data.team.tag}</h1>
                    <div class="relative border-2 rounded-2xl border-radiant p-5  space-y-2 place-content-center-safe place-items-center-safe">                        
                        {#if playersInTeam.length > 0}
                         {#each playersInTeam as player}
                                <h1 class="font-[reaver] text-2xl font-extrabold"><a href={`/dashboard/dota-config/player/${player.id}`}>{player.name}</a></h1>                               
                            {/each}
                        {:else}
                           <h1 class="font-[reaver] text-2xl font-extrabold">No player assigned to this team</h1>
                        {/if}
                    </div>
                    
                </div>
            </div>
             <h1 class="text-2xl font-[grenze] mb-4">Edit Team Data</h1>
        <hr>
         <div class="py-6">
            <div class="justify-between flex flex-row place-content-between gap-2">
                <label for="input-team-name" class="font-[reaver]">Team Name</label>
                <input type="text" placeholder="Team Name" bind:value={requestUpdatetTeam.name} class="bg-gray-100/20 rounded-lg w-lg font-[radiance]" name="input-team-name"/>
            </div>
           <div class="justify-between flex flex-row place-content-between gap-2">
                <label for="input-team-tag" class="font-[reaver]">Team Tag</label>
                <input type="text" placeholder="Player Account ID" bind:value={requestUpdatetTeam.tag} class="bg-gray-100/20 rounded-lg w-lg font-[radiance]" name="input-team-tag"/>
            </div>
             <button class="update-team bg-blue-500 w-sm justify-self-center" onclick={handleUpdateTeam}>Update Team <FontAwesomeIcon icon={faSave} size="1x" class="ml-1"/></button>
        </div>
        </div>
       
    </div>
</div>

