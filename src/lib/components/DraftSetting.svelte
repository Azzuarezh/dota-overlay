<script>
  import { deserialize } from '$app/forms';
  import { asset } from '$app/paths';
  import {MATCH_SERIES} from '$lib/const/const';
  import { onMount } from 'svelte';
  import "$lib/assets/style/dashboard.css";
  
  let data = $props()

  let teamInDb = $state([])
  
  async function getTeamList(){
   const response = await fetch('/api/dota-config/teams', {
			method: 'GET'
  });
  const result = deserialize(await response.text())
    if(result.logo != null){result.logo = "data:image/png;base64," + result.logo}
    teamInDb = result
  }


  onMount(()=>{
    getTeamList()
  })

  let teams = [
     { name: "Aurora",             tag: "AURORA" },
     { name: "BetBoom",            tag: "BB" },
     { name: "Extreme Gaming",     tag: "XG" },
     { name: "Falcon",             tag: "FLCN" },
     { name: "Heroic",             tag: "HEROIC" },
     { name: "Nigma Galaxy",       tag: "NGX" },
     { name: "Parivision",         tag: "PV" },
     { name: "Tidebound",          tag: "TT" },
     { name: "Tundra",             tag: "TUNDRA"}
  ];

  let radiant_team = $state({});
  let dire_team = $state({});
  let selected_series =$state("")
  let manual_description=$state("")
  let default_description=$state(true)
  let default_series= $state(true)

  let radiant_score = $state(0);
  let dire_score =$state(0);

  let setting_overriden = $state(false) 
  let team_logo_overriden = $state(false)

  function check_input(){

    if(radiant_team.length == 0) return false;
    if(dire_team.length == 0) return false;
    if(!default_series && selected_series == "") return false;
    if(!default_description && manual_description =='') return false
    return true;
  }


  function findTeamIndex(team){
    if(Object.keys(team).length !== 0){
      const index= teamInDb.findIndex(t => t.tag == team.tag)
      return index;
    }    
  }

  function displayTeamLogo(team){
    const selectedTeamIdx = findTeamIndex(team);
    let logo = null
    if(selectedTeamIdx > -1){
      if(teamInDb[selectedTeamIdx].logo != null){
        logo = teamInDb[selectedTeamIdx].logo
      } 
    }
    return logo;
  }

  const target_socket = {
    userId: data.userId,
    gsi_client_id: data.gsi_client_id
  }

  function override_setting(e){
      e.preventDefault()
      if(!check_input()) alert('please fill the correct form before override the settings')
      data.socket.emit('overlay-client:setting-override',{
          override:true,
          series: (default_series)?null:selected_series,
          series_description:(default_description)?null:manual_description,
          radiant_score: (default_series)?null:radiant_score ,
          dire_score: (default_series)?null:dire_score,
          target_socket:target_socket
        })
      setting_overriden = true;
      setTimeout(()=>{
        setting_overriden = false
      },3000)
  }

  function revert_setting(e){
    e.preventDefault()
      data.socket.emit('overlay-client:setting-override',{override:false,  target_socket:target_socket})
      setting_overriden = true;
      setTimeout(()=>{
        setting_overriden = false
      },3000)
  }

  function override_team_info(e){
    e.preventDefault()
    if(Object.keys(radiant_team).length == 0 || Object.keys(dire_team).length == 0)alert('please choose both team to override')
    data.socket.emit('overlay-client:team-info-override',{
        override:true,
        radiant_team_info: {
            tag:radiant_team.tag, 
            name:radiant_team.name, 
            logo:(radiant_team.logo != null)?"data:image/png;base64," + displayTeamLogo(radiant_team):asset('/resources/esport_team/RAD.png')
        } ,
        dire_team_info: {
            tag:dire_team.tag, 
            name:dire_team.name,
            logo:(dire_team.logo != null)?"data:image/png;base64," + displayTeamLogo(dire_team):asset('/resources/esport_team/DIR.png')
          },
        target_socket:target_socket
    })
    team_logo_overriden = true
    setTimeout(()=> {team_logo_overriden = false},3000)
  }

  function revert_team_info(e){
    e.preventDefault
     data.socket.emit('overlay-client:team-info-override',{
        override:false,
        target_socket:target_socket
      })
    team_logo_overriden = true
    setTimeout(()=> {team_logo_overriden = false},3000)
  }




  function play_pause(e){
    e.preventDefault();
    data.socket.emit('overlay-client:toggle_music', {target_socket: target_socket})
  }
  


</script>
<div>
  <h1 class="font-[radiance] text-2xl">Draft Actions</h1>
  <a class="button-goto-overlay"
    data-sveltekit-preload-data="false" href={data.overlay_page_url} target="_blank">Open overlay page</a>
    <button class="button-toggle-music" onclick={play_pause} type="button">Toggle Play/Pause Music on Overlay Page</button>
</div>
    <!-- Toggle Show/Hide Match Setting -->
    <div class="w-full" >

      {#if setting_overriden}
        <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
                    <div class="flex">
                        <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                        <div>
                        <p class="font-bold text-3xl">Setting override</p>
                        <p class="text-lg">Draft Detail updated. Match series and scores are now follow the settings</p>
                        </div>
                    </div>
        </div>
        {/if}
        {#if team_logo_overriden}
        <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
                    <div class="flex">
                        <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                        <div>
                        <p class="font-bold text-3xl">Team logo override</p>
                        <p class="text-lg">Radiant and dire team logo updated. The logo are now follow the settings</p>
                        </div>
                    </div>
        </div>
        {/if}

      <div class="grid grid-cols-2">
          <div class="my-10 border-b border-gray-100">
          <h1 class="font-bold text-xl ">Match Series:</h1>
          <div class="space-y-5">
            <select
              class="w-[70%] bg-gray-100 text-gray-900 my-5 p-3 rounded-3xl focus:outline-none focus:shadow-outline"
              bind:value={selected_series} disabled={default_series}
            >
            <option value="" disabled>
                  Choose between Best of 1, 3, or 5
                  </option>
              {#each MATCH_SERIES as serial}
                  <option value={serial.value}>
                    {serial.label}
                  </option>
                {/each}
            </select>
            <input id="default_series" type="checkbox" class="custom-checkbox ml-4" value="default_series" bind:checked={default_series}/> Use Default series instead
          </div>
          <div class="space-y-5 mb-3">
            <h1 class="font-bold text-xl ">Series Description (overwrite text center screen)</h1>
          <p>if default is checked, the overlay will use either Best of 1, 2, 3 (depend on the match). if  default is not checked, the series description is <strong>REQUIRED</strong> </p>
          <input
              id="series_description"
              bind:value={manual_description}
              class="w-[70%] bg-gray-100 text-gray-900 mt-2 p-3 rounded-3xl focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Upper Bracket/Lower Bracket/Final etc."
              maxlength={15}
              disabled={default_description}
            />
            <input id="default_description" type="checkbox" class="custom-checkbox" value="default_description" bind:checked={default_description}/> Use Default description instead
          </div>

          <div class="grid grid-cols-2 gap-5">
            <div>
              <h1 class="font-bold text-xl ">Radiant Score :</h1>
                <input
                  id="radiant_score"
                  bind:value={radiant_score}
                  class="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-3xl focus:outline-none focus:shadow-outline"
                  type="number"
                  placeholder="Radiant Score"
                  disabled={default_series}
                  max={3}
                />
            </div>
            <div>
              <h1 class="font-bold text-xl ">Dire Score :</h1>
                <input id="dire_score"
                  bind:value={dire_score}
                  class="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-3xl focus:outline-none focus:shadow-outline"
                  type="number"
                  placeholder="Dire Score"
                  disabled={default_series}
                  max={3}
                />
            </div>
          </div>

          <button class="button-override-settings" onclick={override_setting}>Override Draft settings</button>
          <button class="button-override-settings" onclick={revert_setting}>Revert settings to Dota Client</button>
        </div>
      </div>
      
      {#if team_logo_overriden}
        <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
                    <div class="flex">
                        <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                        <div>
                        <p class="font-bold text-3xl">Team Logo changed</p>
                        <p class="text-lg">Team logo now follow the image below</p>
                        </div>
                    </div>
        </div>
        {/if}


      <div class="my-4 py-10">
        <h1 class="font-bold uppercase text-xl ">Team Info (From Database)</h1>
        <div class="pt-1">if the team have no detail, you can and force it to selected team from database</div>  
      </div>
      <div class="grid gap-5 grid-cols-2 mt-5 rounded-3xl w-4xl">
        <div>
          <h1 class="font-bold text-xl ">Radiant team Logo:</h1>
          <select id="radiant_team_select"
          placeholder="Radiant Team*"
          class="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-3xl focus:outline-none focus:shadow-outline"
          bind:value={radiant_team}>
            {#each teamInDb as team}
              <option value={team} disabled={team == dire_team}>
                {team.name} ({team.tag})
              </option>
            {/each}
          </select> 
          <img
            class="team_logo py-1 items-center relative left-36 rounded-lg border-gray-600 border-2 bg-gray-400"
            src={(radiant_team.logo != null)?"data:image/png;base64," + displayTeamLogo(radiant_team):asset('/resources/esport_team/RAD.png')}
            onerror={(e) => e.target.src= asset(`/resources/pick_logo.png`)}
            alt={radiant_team.name}
          />
          <pre class="font-bold uppercase text-xl ">
            Tim Radiant : {radiant_team && radiant_team.name
              ? radiant_team.name
              : '[not selected]'}
          </pre>
        </div>
        <div>
          <h1 class="font-bold text-xl ">Dire team logo:</h1>
           <select id="dire_team_select"
            placeholder="Dire Team*"
            class="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-3xl focus:outline-none focus:shadow-outline"
            bind:value={dire_team}>
              {#each teamInDb as team}
                <option value={team} disabled={team== radiant_team}>
                  {team.name}
                </option>
              {/each}
            </select>
          <img
            class="team_logo py-1 items-center relative left-36 rounded-lg border-gray-600 border-2 bg-gray-400"
            src={(dire_team.logo != null)?"data:image/png;base64," + displayTeamLogo(dire_team):asset('/resources/esport_team/DIR.png')}
            alt={dire_team.name}           
            onerror={(e) => e.target.src= asset(`/resources/pick_logo.png`)}
          />
          <pre class="font-bold uppercase text-xl ">
           Team Dire : {dire_team && dire_team.name
              ? dire_team.name
              : '[not selected]'}
          </pre>
        </div>
      </div>
      <button class="button-override-team-info" onclick={override_team_info}>Override team info</button>
      <button class="button-override-team-info" onclick={revert_team_info}>Revert team info to dota client</button>
    </div>