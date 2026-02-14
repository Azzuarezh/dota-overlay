<script>
  import { asset } from '$app/paths';
  import {MATCH_SERIES} from '$lib/const/const';
  
  let data = $props()

  

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

  let radiant_score = $state(0);
  let dire_score =$state(0);


  function check_input(){

    if(radiant_team.length == 0) return false;
    if(dire_team.length == 0) return false;
    if(selected_series == "") return false;
    if(!default_description && manual_description =='') return false
    return true;
  }

  const target_socket = {
    userId: data.userId,
    gsi_client_id: data.gsi_client_id
  }

  function override_setting(){
      if(!check_input()) alert('please fill the correct form before override the settings')
      data.socket.emit('overlay-client:setting-override',{
          override:true,
          series: selected_series,
          series_description:manual_description,
          default_description:default_description,
          radiant_team_info: {tag:radiant_team.tag, name:radiant_team.name, series_wins: radiant_score} ,
          dire_team_info: {tag:dire_team.tag, name:dire_team.name, series_wins: dire_score},
          target_socket:target_socket
        })
  }

  function revert_setting(){
        data.socket.emit('overlay-client:setting-override',{override:false,  target_socket:target_socket})
  }


  function play_pause(){
    data.socket.emit('overlay-client:toggle_music', {target_socket: target_socket})
  }
  

</script>
<div>
  <h1 class="font-[radiance] text-2xl">Draft Actions</h1>
  <a class="button-goto-overlay"
    data-sveltekit-preload-data="false" href={data.overlay_page_url} target="_blank">Open overlay page</a>
    <button class="button-toggle-music" onclick={play_pause}>Toggle Play/Pause Music on Overlay Page</button>
</div>
    <!-- Toggle Show/Hide Match Setting -->
    <div class="w-full" >
      <div class="grid my-4 py-5">
        <h1 class="font-bold uppercase text-xl ">Match Setting</h1>
        <div class="pt-1 text-lg">This tab is to configure draft overlays. You can change the series name, descriptions team name, and score to the overlay. You may also can play background music</div>
        <div class="flex">
          
        </div>
      </div>
      <div class="my-10 border-b border-gray-100">
       <h1 class="font-bold text-xl ">Match Series:</h1>
       <select
          class="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-3xl focus:outline-none focus:shadow-outline"
          bind:value={selected_series}
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
      
      <div class="my-4 py-10">
        <h1 class="font-bold uppercase text-xl ">Team Info (Optional)</h1>
        <div class="pt-1">if the team have no detail, you can register and force it to overlays </div>  

      </div>
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5 rounded-3xl">
        <div>
          <h1 class="font-bold text-xl ">Radiant team (required):</h1>
          <select id="radiant_team_select"
          placeholder="Radiant Team*"
          class="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-3xl focus:outline-none focus:shadow-outline"
          bind:value={radiant_team}>
            {#each teams as team}
              <option value={team} disabled={team == radiant_team}>
                {team.name}
              </option>
            {/each}
          </select>

          <h1 class="font-bold text-xl ">Radiant Score :</h1>
          <input
            id="radiant_score"
            bind:value={radiant_score}
            class="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-3xl focus:outline-none focus:shadow-outline"
            type="number"
            placeholder="Radiant Score"
            max={3}
          />
          <img
            class="team_logo py-1 items-center relative left-36 "
            src={asset(`/resources/${radiant_team && radiant_team.tag ? "esport_team/" + radiant_team.tag.toUpperCase() : 'pick_logo'}.png`)}
            alt=""
          />
          <pre class="font-bold uppercase text-xl ">
            Tim Radiant : {radiant_team && radiant_team.name
              ? radiant_team.name
              : '[not selected]'}
          </pre>
        </div>
        <div>
          <h1 class="font-bold text-xl ">Dire team (required):</h1>
           <select id="dire_team_select"
            placeholder="Dire Team*"
            class="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-3xl focus:outline-none focus:shadow-outline"
            bind:value={dire_team}>
              {#each teams as team}
                <option value={team} disabled={team== radiant_team}>
                  {team.name}
                </option>
              {/each}
            </select>
          <h1 class="font-bold text-xl ">Dire Score :</h1>
          <input id="dire_score"
            bind:value={dire_score}
            class="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-3xl focus:outline-none focus:shadow-outline"
            type="number"
            placeholder="Dire Score"
            max={3}
          />
          <img
            class="team_logo py-1 items-center relative left-36"
            src={asset(`/resources/${dire_team && dire_team.tag ? "esport_team/" + dire_team.tag.toUpperCase() : 'pick_logo'}.png`)}
            alt=""
          />
          <pre class="font-bold uppercase text-xl ">
           Team Dire : {dire_team && dire_team.name
              ? dire_team.name
              : '[not selected]'}
          </pre>
        </div>
      </div>
       <button class="setting" onclick={override_setting}>Override Draft settings</button>
       <button class="setting" onclick={revert_setting}>Revert settings to Dota Client</button>
    </div>
<style>
  .setting{
    background-color: var(--color-blue-900);
    padding: .5em .5em .5em .5em;
    margin: 1em 2em 2em 2em;
    color: var(--color-yellow-500);
    height: 60x;
    border-radius: 6%;
  }
  button.setting{
     padding: .5em .5em .5em .5em;
     margin: 1em 1em 1em 1em;
     width: 20%;
  }
  input.custom-checkbox{
    margin-left: 1.5em;
  }

  
</style>