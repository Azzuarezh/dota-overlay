<script>
    import '$lib/assets/style/player_card.css'
    import { asset } from '$app/paths';
    import { mapRoleToString } from '$lib/const/const';
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faSave, faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
    import {deserialize} from '$app/forms';
    import {invalidate} from '$app/navigation'
    let {data, params} = $props()
    let avatarFileElement = $state();
    let avatarFiles = $state();

    let playerUpdated = $state(false);
    let avatarUploaded = $state(false)
    let updatePlayerError = $state(false)
    let uploadAvatarError = $state(false)
    let errorMsg =$state('')

    const avatarUrl = $derived("data:image/png;base64," + data.player.avatarPicture)
    
    const teamLogo = $derived((data.player && data.player.team && data.player.team.logo)?"data:image/png;base64," + data.player.team.logo:null)

    function passDownClick(e) {
		avatarFileElement.click()
	}


    let requestUpdatePlayer = $state({
        steamId:data.player.steamId,
        accountId: data.player.accountId,
        name:data.player.name,
        rolePosition: data.player.rolePosition,
        teamId: (data.player.team && data.player.teamId)?data.player.team.teamId:null
    })

    let roleDescription =[
        {pos:1, name:"Safe Lane"},
        {pos:2, name:"Mid Lane"},
        {pos:3, name:"Off Lane"},
        {pos:4, name:"Soft Support"},
        {pos:5, name:"Hard Support"},
    ]

    async function handleUploadAvatar(e){
        e.preventDefault();
        const data = new FormData();
        data.append('avatar',avatarFiles[0])
        
        const response = await fetch(`/dashboard/dota-config/player/${params.playerId}/upload_avatar`, {
            method: 'PATCH',
            body: data
        });

		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = deserialize(await response.text());
		if (result.type === 'success') {
            console.log(result.type)
			// rerun all `load` functions, following the successful update
			await invalidate('player:detail');
            avatarUploaded = true
            setTimeout(()=> avatarUploaded = false,3000)
		}
        else if(result.type ==='failure'){
            await invalidate('player:detail');
            uploadAvatarError = true
            avatarUploaded = false
            errorMsg = result.data.message?result.data.message:''
            setTimeout(()=> {
                playerUpdated = false;
                uploadAvatarError = false
                errorMsg = ''
            },5000)
        }
    }
    
    async function handleUpdatePlayer(e){
        e.preventDefault();
        if(requestUpdatePlayer.teamId =="") requestUpdatePlayer.teamId = null; // force empty string to null because on db it only for integer
		const response = await fetch(`/dashboard/dota-config/player/${params.playerId}`, {
			method: 'PATCH',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(requestUpdatePlayer)
        });

		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = deserialize(await response.text());
		if (result.type === 'success') {
            console.log(result.type)
			// rerun all `load` functions, following the successful update
			await invalidate('player:detail');
            playerUpdated = true

            setTimeout(()=> playerUpdated = false,3000)
		}
        else if(result.type ==='failure'){
            //await invalidateAll()
            updatePlayerError = true
            errorMsg = result.data.message?result.data.message:''
        }
    }

    
</script>
{#if playerUpdated}
 <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Update Successfuly</p>
                <p class="text-lg">Player has been updated.</p>
                </div>
            </div>
</div>
{/if}

{#if avatarUploaded}
  <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Upload avatar Successfuly</p>
                <p class="text-lg">Player avatar has been updated.</p>
                </div>
            </div>  
    </div>
{/if}

{#if updatePlayerError}
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

{#if uploadAvatarError}
<div class="bg-red-100 border-t-4 border-red-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold text-3xl">Upload Avatar Error</p>
                <p class="text-lg">{errorMsg}</p>
                </div>
            </div>
        </div>
{/if}



<div class="grid grid-cols-2 gap-5 place-items-start w-6xl place-content-center justify-start items-start">
    <div class="items-start justify-start">
        <div class="profile-card">
        <img src={avatarUrl} 
            alt={data.player.name}
            class={['avatar']}
            onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}
        />
        <div class="name">{data.player.name}</div>
        <div class="role">{mapRoleToString(data.player.rolePosition)}</div>
        <div class="team">{(data.player.team)?data.player.team.name:'No Team'}</div>
           
            <input accept="image/png, image/jpeg" bind:this={avatarFileElement} id="avatar" name="avatar" type="file" class="hidden" bind:files={avatarFiles}/>
            <button class="upload-avatar" onclick={passDownClick}>Change avatar <FontAwesomeIcon icon={faArrowAltCircleUp} size="1x" class="ml-1"/></button>
            {#if avatarFiles}
                {#if avatarFiles.length > 0}
                    <h2 class="avatar-file-name">file name:</h2>
                    {#each Array.from(avatarFiles) as file}
                        <p class="text-white font-[radiance]">{file.name}</p>
                    {/each}
                    <button class="upload-avatar" onclick={handleUploadAvatar} type="button">Save <FontAwesomeIcon icon={faSave} size="1x" class="ml-1" /></button>
                {/if}            
            {/if}
    </div>
    </div> 
     <div class="form-player w-4xl items-start justify-center content-center place-content-center pl-10 rounded-lg shadow-2xl shadow-blue-400 outline-1">
        <div class="grid grid-rows-1 space-y-0 p-20 h-[10%]">
            <div class="grid grid-cols-2">
                <div class="space-y-10">
                    <h1 class="font-[reaver] text-2xl font-extrabold">Steam ID</h1>
                    <h1 class="font-[reaver] text-2xl font-extrabold">Account ID</h1>
                    <h1 class="font-[reaver] text-2xl font-extrabold">Player Name</h1>
                    <h1 class="font-[reaver] text-2xl font-extrabold">Role Position</h1>
                    <h1 class="font-[reaver] text-2xl font-extrabold">Current Team</h1>
                </div>
                <div class="space-y-10">
                    <h1 class="font-[reaver] text-2xl font-extrabold before:content-[':'] before:mr-3">{data.player.steamId}</h1>
                    <h1 class="font-[reaver] text-2xl font-extrabold before:content-[':'] before:mr-3">{data.player.accountId}</h1>
                    <h1 class="font-[reaver] text-2xl font-extrabold before:content-[':'] before:mr-3">{data.player.name}</h1>
                    <h1 class="font-[reaver] text-2xl font-extrabold before:content-[':'] before:mr-3"> {mapRoleToString(data.player.rolePosition)}</h1>
                    {#if (data.player.team != null) && (data.player.team.logo != null)}
                        <img src={teamLogo} alt={data.player.team.name} class="outline-0 shadow-2xl shadow-blue-500 bg-gray-300 p-4 rounded-2xl"
                        onerror={(e) => e.target.src = asset(`/resources/image_style/default_team_logo.png`)}/>
                        <h1 class="font-[reaver] text-2xl font-extrabold text-center justify-start"><a href={`/dashboard/dota-config/team/${data.player.team.teamId}`}>{data.player.team.name}</a></h1>
                    {:else if data.player.team && (data.player.team.logo == null)}
                         <h1 class="font-[reaver] text-2xl font-extrabold before:content-[':'] before:mr-3">{data.player.team.name}</h1>
                    {:else}
                        <h1 class="font-[reaver] text-2xl font-extrabold before:content-[':'] before:mr-3">not signed to any teams</h1>
                    {/if}  
                </div>
            </div>
        </div>
        <h1 class="text-2xl font-[grenze] mb-4">Edit Player Data</h1>
        <hr>
         <div class="grid grid-rows-5 py-6">
            <div class="justify-between flex flex-row place-content-between gap-2 px-20">
                <label for="input-player-name" class="font-[reaver]">Steam ID</label>
                <input type="text" placeholder="Player Steam ID" bind:value={requestUpdatePlayer.steamId} class="bg-gray-100/20 rounded-lg w-lg font-[radiance]"/>
            </div>
           <div class="justify-between flex flex-row place-content-between gap-2 px-20">
                <label for="input-player-name" class="font-[reaver]">Account ID</label>
                <input type="text" placeholder="Player Account ID" bind:value={requestUpdatePlayer.accountId} class="bg-gray-100/20 rounded-lg w-lg font-[radiance]"/>
            </div>
            <div class="justify-between flex flex-row place-content-between gap-2 px-20">
                <label for="input-player-name" class="font-[reaver]">Player Name</label>
                <input type="text" placeholder="Player Name" bind:value={requestUpdatePlayer.name} class="bg-gray-100/20 rounded-lg w-lg font-[radiance]"/>
            </div>
            <div class="justify-between flex flex-row place-content-between gap-2 px-20">
                <label for="input-player-name" class="font-[reaver]">Role Position</label>
                <!-- <input type="text" placeholder="" bind:value={data.player.rolePosition} class="bg-gray-100/20 rounded-lg w-lg font-[radiance]"/> -->
                 <select bind:value={requestUpdatePlayer.rolePosition} class="bg-gray-100/20 rounded-lg w-lg font-[radiance]">
                   {#each roleDescription as role}
                        <option value={role.pos} selected={role.pos == requestUpdatePlayer.rolePosition}>
                        {role.name}
                    </option>
                    {/each}
                 </select>
            </div>
            <div class="justify-between flex flex-row place-content-between gap-2 px-20">
                <label for="input-player-name" class="font-[reaver]">Team</label>
                {#if data.teams.length > 0}
                 <select bind:value={requestUpdatePlayer.teamId} class="bg-gray-100/20 rounded-lg w-lg font-[radiance]" placeholder="Select team to assign">
                    {#if data.player.teamId == null}
                    <option value="" selected>Unassigned</option>
                    {/if}
                   {#each data.teams as team}
                        <option value={team.teamId}>
                        {team.name}
                    </option>
                    {/each}
                 </select>
                {:else}
                <span>No teams created yet. <br/>Please create team first in dota-config page</span>
                {/if}
                <!-- <input type="text" placeholder="" bind:value={data.player.steamId} class="bg-gray-100/20 rounded-lg w-lg font-[radiance]"/> -->
            </div>
             <button class="update-player bg-blue-500 w-sm justify-self-center" onclick={handleUpdatePlayer}>Update Player <FontAwesomeIcon icon={faSave} size="1x" class="ml-1"/></button>
        </div>
       <!-- <code>rquest updatePlayer{JSON.stringify(requestUpdatePlayer)}</code>
       <code>page data{JSON.stringify(data)}</code> -->
    </div>
</div>

