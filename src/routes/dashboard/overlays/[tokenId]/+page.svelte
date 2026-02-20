<script>
    import DraftSetting from '$lib/components/DraftSetting.svelte';
    import '$lib/assets/style/dashboard.css'
    import io from "socket.io-client";
    import IngameSetting from '$lib/components/IngameSetting.svelte';
    import {GS_INGAME, GS_PRE, translateGSCodeToText} from '$lib/const/const.js'
    let {data} = $props()
    let activeTab = $state('Draft'); 
    let dota_client_connected_status = $state(false)
    
    let leagueStarted = $state(false)
    let radiantTeamDetail = $state({team_name:'',team_tag:'', score:0})
    let direTeamDetail =$state({team_name:'',team_tag:'', score:0})
    let gamePhase = $state(null)
    let gameTime = $state('')
    let clockTime = $state('')

    let draft_overlay_page_url = `/overlays/${data.gsi_client.token}/draft`
    let ingame_overlay_page_url = `/overlays/${data.gsi_client.token}/ingame`

    let socket = io('http://localhost:3000', {auth:{client_type:'overlay_client', token : data.gsi_client.token}})
    socket.on('ping', (data) =>{
        dota_client_connected_status = data
        //every 5 second, set to false if no event received
        setTimeout(()=> {dota_client_connected_status = false},5000)
    })

  socket.on('gamestate:time', (data) =>{
    if(!leagueStarted) leagueStarted = true
    gamePhase = data.game_state
    gameTime = data.game_time
    clockTime = data.clock_time
  })

  socket.on('league', (data)=>{
    if(data)leagueStarted = true
    if(data.radiant){
      radiantTeamDetail.team_name = data.radiant.name
      radiantTeamDetail.team_tag = data.radiant.team_tag
      radiantTeamDetail.score = data.radiant.series_wins
    }
    if(data.dire){
      direTeamDetail.team_name = data.dire.name
      direTeamDetail.team_tag = data.dire.team_tag
      direTeamDetail.score = data.dire.series_wins
    }
  })
   
</script>
<div class="grid grid-cols-2">
  <h1 class="text-3xl font-bold">{data.gsi_client.name.toUpperCase()}</h1>
  <h1 class="text-3xl font-bold items-center place-self-end-safe mr-1 pr-2">status: {(dota_client_connected_status)?"🟢":"🔴"}</h1>
</div>

  {#if leagueStarted}
  <p class="font-[radiance] text-2xl bg-red-500 rounded-2xl px-2 inline-block text-white animate-pulse">Live</p>
  <div class="mb-10">    
    <span class="font-[radiance] text-4xl">{radiantTeamDetail.team_name} ({radiantTeamDetail.team_tag}) : {radiantTeamDetail.score} </span> VS
    <span class="font-[radiance] text-4xl"> {direTeamDetail.score} : {direTeamDetail.team_name} ({direTeamDetail.team_tag})</span>
  </div>
  <p class="font-[radiance] text-2xl px-2 inline-block animate-pulse bg-radiant rounded-lg">
    {#if gamePhase == GS_PRE || gamePhase == GS_INGAME}
      {translateGSCodeToText(gamePhase)}: {clockTime} 
    {:else}
      {translateGSCodeToText(gamePhase)}: {gameTime}
    {/if}

  </p>

  {/if}
  <!-- Tabs -->
      <div class="bg-white p-6 rounded-xl shadow">
        <div class="border-b border-gray-200 mb-4">
          <ul class="flex space-x-6 text-sm font-medium">
            <li
              class="tab pb-2 cursor-pointer"
              class:text-blue-600={activeTab === 'Draft'}
              class:border-b-2={activeTab === 'Draft'}
              class:border-blue-600={activeTab === 'Draft'}            
            >
              <button class="transparent" onclick={() => (activeTab = 'Draft')}>Draft</button> 
            </li>
            <li
              class="tab pb-2 cursor-pointer"
              class:text-blue-600={activeTab === 'Ingame'}
              class:border-b-2={activeTab === 'Ingame'}
              class:border-blue-600={activeTab === 'Ingame'}             
            >
              <button class="transparent  " onclick={() => (activeTab = 'Ingame')}> In game</button>
            </li>
            <li
              class="tab pb-2 cursor-pointer"
              class:text-blue-600={activeTab === 'Scoreboard'}
              class:border-b-2={activeTab === 'Scoreboard'}
              class:border-blue-600={activeTab === 'Scoreboard'}            
            >
              <button class="transparent" onclick={() => (activeTab = 'Scoreboard')}>Scoreboard</button>
            </li>
          </ul>
        </div>

        {#if activeTab === 'Draft'}
          <div class="text-gray-700 animate-fadeIn">
           <DraftSetting 
           userId={data.user.id}
           gsi_client_id={data.gsi_client.id}
           overlay_page_url={draft_overlay_page_url}
           socket={socket}/>
          </div>
        {:else if activeTab === 'Ingame'}
          <div class="text-gray-700 animate-fadeIn">
            <IngameSetting 
            userId={data.user.id}
            gsi_client_id={data.gsi_client.id}
            overlay_page_url={ingame_overlay_page_url}
            socket={socket}/>
          </div>
        {:else if activeTab === 'Scoreboard'}
          <div class="text-gray-700 animate-fadeIn">
            <h3 class="font-semibold text-lg mb-2">Activity</h3>
            <p class="text-sm">Track user activity logs and recent interactions here.</p>
          </div>
        {/if}
      </div>
<style>
  .transparent {
    background-color: transparent;
    background-repeat: no-repeat;
    border: none;
    cursor: pointer;
    overflow: hidden;
    outline: none;
}
</style>