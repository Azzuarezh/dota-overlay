<script>
  export let activeteam_time_remaining;
  export let radiant_bonus_time;
  export let dire_bonus_time;
  export let turn;
  export let phase;
  export let draft_ended;
  export let radiant_team_info;
  export let dire_team_info;
  export let series_type;
  export let series_description;
  import SeriesScore from "./SeriesScore.svelte";
  import TeamLogo from "./TeamLogo.svelte";

  import {formatTime} from '$lib/const/const.js'
  import { asset } from "$app/paths";

  // function formatTime(seconds) {
  //   if (isNaN(seconds)) {
  //     return "0:00";
  //   }

  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  // }

 
</script>

<div
  class="info rounded-xl {draft_ended ?'with_logo':''}"
  id="center_info"
>
  <div id="scorebar_spacer" class="flex justify-evenly">   
    <div id="radiant_score">
      <SeriesScore series_type={series_type} score={radiant_team_info.series_wins} />
    </div>
     <span class="text-lg series-tag">{series_description}</span>
    <div id=dire_score>
      <SeriesScore series_type={series_type} score={dire_team_info.series_wins} reverse_order={true}/>
    </div>
  </div>
  <div class="current_selection item-center px-4">
    <div id="radiant_team" class="items-center place-items-center place-content-center">
      <h1 class="relative text-xl text-center team-tag">{#if radiant_team_info && radiant_team_info.tag}{radiant_team_info.tag.slice(0,3)}{:else}RADIANT{/if}</h1>
      <TeamLogo team={radiant_team_info}/>
    </div>

    <div id="arrow_spacer" class="items-center place-items-center place-content-center">
      {#if !draft_ended}
        {#if turn == "radiant"}
          <img class="h-20 mt-1 scale-x-[-1] arrow" src={asset('/resources/image_style/arrow.png')} alt="" />
        {:else}
          <img class="h-20 mt-1 arrow" src={asset('/resources/image_style/arrow.png')} alt="" />
        {/if}
      {/if}
    </div>

    <div id="dire_team" class="items-center place-items-center place-content-center">
      <h1 class="relative text-xl text-center team-tag">{#if dire_team_info && dire_team_info.tag}{dire_team_info.tag.slice(0,3)}{:else}DIRE{/if}</h1>
      <TeamLogo team={dire_team_info} is_radiant={false}/>
    </div>
  </div>

  {#if !draft_ended}
    <div class="grid grid-cols-2 justify-evenly items-center place-items-center gap-14">
      <div class="phase-box grid grid-rows-2 place-items-center">
        <span class="label active">{phase == 'picking' ?'PICK':'BAN'}</span>
        {#if Number(activeteam_time_remaining) > 0}         
          <span class="timer active">{formatTime(activeteam_time_remaining)}</span>
        {:else}
          <span class="timer">{formatTime(activeteam_time_remaining)}</span>
        {/if}       
      </div>
      <div class="phase-box grid grid-rows-2 place-items-center">
        <span class="label active">RESERVE</span>
        {#if Number(activeteam_time_remaining) <= 0}          
          <span class="timer active">{(turn == 'radiant') ? formatTime(radiant_bonus_time):formatTime(dire_bonus_time)}</span>
        {:else}
        <span class="timer">{(turn == 'radiant') ? formatTime(radiant_bonus_time):formatTime(dire_bonus_time)}</span>
        {/if}
      </div>
    </div>
  {/if}
</div>