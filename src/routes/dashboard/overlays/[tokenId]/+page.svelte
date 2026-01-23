<script>
    import DraftSetting from '$lib/components/DraftSetting.svelte';
    import '$lib/assets/style/dashboard.css'
    import io from "socket.io-client";
    let {data} = $props()
    let activeTab = $state('Draft'); // 👈 current active tab
    let dota_client_connected_status = $state(false)
   

    let overlay_page_url = `/overlays/${data.gsi_client.token}/draft`
  

    let socket = io('http://localhost:3000', {auth:{client_type:'overlay_client', token : data.gsi_client.token}})
    socket.on('ping', (data) =>{
        dota_client_connected_status = data
        //every 5 second, set to false if no event received
        setTimeout(()=> {dota_client_connected_status = false},10000)
    })


   
</script>
<div class="grid grid-cols-2">
  <h1 class="text-3xl font-bold">{data.gsi_client.name.toUpperCase()}</h1>
  <h1 class="text-3xl font-bold items-center place-self-end-safe mr-1 pr-2">status: {(dota_client_connected_status)?"🟢":"🔴"}</h1>
</div>
<!-- <MatchSetting/> -->
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
           overlay_page_url={overlay_page_url}
           socket={socket}/>
          </div>
        {:else if activeTab === 'Ingame'}
          <div class="text-gray-700 animate-fadeIn">
            <h3 class="font-semibold text-lg mb-2">Details</h3>
            <p class="text-sm">Here you can view more detailed information and user attributes.</p>
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