<script>
  import CenterScreen from "$lib/components/CenterScreen.svelte";
  import Callout from "$lib/components/Callout.svelte";
  import HeroPick from "$lib/components/HeroPick.svelte";
  import HeroBans from "$lib/components/HeroBans.svelte";
  import '$lib/assets/style/draft.css'
  import HeroShowcaseVideo from "$lib/components/HeroShowcaseVideo.svelte";
  import { asset } from "$app/paths";
  // import { overlaySocket } from '$lib/const/const'
  import { captains_mode } from '$lib/const/game_mode';
  import io from "socket.io-client";
  /** @type {import('./$types').PageProps} */
  let { data } = $props()

 let draft_active_time_remaining = $state({ value: data.draft_active_time_remaining });
 let radiant_bonus_time = $state({ value: data.radiant_bonus_time });
 let dire_bonus_time = $state({ value: data.dire_bonus_time });
 let active_team = $state({ name: data.active_team });
 let phase = $state({ value: data.phase });
 let radiant_state = $state({ state: data.radiant_state });
 let dire_state = $state({ state: data.dire_state });
 let series_type = $state({ type: data.series_type });
 let series_description = $state({ desc: data.series_description })
 let draft_ended = $state({ value: data.draft_ended });
 let turn = $state({ value: data.turn });
 let radiant_team_info = $state({ value: data.radiant_team_info});
 let dire_team_info = $state({ value: data.dire_team_info });
  //heroes choosen by team
let radiant_choosen_heroes = $state({ values: data.radiant_choosen_heroes })
let dire_choosen_heroes = $state({ values: data.dire_choosen_heroes })

let radiant_picked_heroes = $state({ values: data.radiant_picked_heroes });
let radiant_banned_heroes = $state({ values: data.radiant_banned_heroes })
let dire_picked_heroes = $state({ values: data.dire_picked_heroes });
let dire_banned_heroes = $state({ values: data.dire_banned_heroes })
let setting_override = $state({ value: data.setting_override })
let toggle_pause_music = $state({ value: data.toggle_pause_music })

let announced_picked_hero = $state({ name: data.announced_picked_hero })
let popup_visible = $state({ value: data.popup_visible })


let picking_order = $state([])
let current_team_pick = $state("none")
let watch_index = $state(0)

//adjustment for patch 7.40 new draft rule
let firstPickTeam = $state("")

// onMount(() => {
// 		overlaySocket.auth = {client_type:'overlay_client', token:data.gsi_token}
//     if(!overlaySocket.connected) overlaySocket.connect()
// 	});


  export const formatted_series_type = (series) => {
    switch (series) {
      case "bo1":
        return "BEST OF 1";
      case "bo3":
        return "BEST OF 3";
      case "bo5":
        return "BEST OF 5";
    }
  }

  const overlaySocket = io('http://localhost:3000', {auth:{client_type:'overlay_client', token:data.gsi_token}})

  // data.socket.auth = {client_type:'overlay_client', token: data.gsi_token}
	// if(!data.socket.connected) data.socket.connect()
  overlaySocket.on('gamestate:time',(data)=>{
    //console.log('time :', data.clock_time)
  })

  overlaySocket.on("gamestate:draft", (evtData) => {
  try{
    draft_active_time_remaining.value = (evtData.draft.activeteam_time_remaining)? evtData.draft.activeteam_time_remaining : 0;
    radiant_bonus_time.value = (evtData.draft.radiant_bonus_time)?evtData.draft.radiant_bonus_time : 0;
    dire_bonus_time.value = (evtData.draft.dire_bonus_time)?evtData.draft.dire_bonus_time : 0;
    
    // console.log('draft active time: ', draft_active_time_remaining.value)

    // GENERAL INFO (Center Screen)
    //series type (bo1/bo3/bo5 etc)
    series_type.type = (evtData.league && evtData.league.series_type) ? evtData.league.series_type : "";
    series_description.desc = (setting_override.value)?series_description.desc:formatted_series_type(series_type.type)
    active_team.name = evtData.draft.activeteam === 2 ? "radiant" : "dire";
    turn.value = active_team.name

    if (setting_override.value == false) {
      //radiant team info
      if (evtData.league && evtData.league.radiant) {
        const radiant = evtData.league.radiant
        radiant_team_info.value = {
          name: radiant.name,
          tag: radiant.team_tag.toUpperCase(),
          series_wins: radiant.series_wins
        }
      }
      else {
        //default
        radiant_team_info.value = {
          name: "radiant",
          tag: "RAD",
          series_wins: 0
        }
      }

      //dire team info
      if (evtData.league && evtData.league.dire) {
        const dire = evtData.league.dire
        dire_team_info.value = {
          name: dire.name,
          tag: dire.team_tag.toUpperCase(),
          series_wins: dire.series_wins
        }
      }
      else {
        //default
        dire_team_info.value = {
          name: "dire",
          tag: "DIR",
          series_wins: 0
        }
      }
    }

  //END GENERAL INFO (Center Screen)

    const isPickPhase = evtData.draft.pick;
    phase.value = isPickPhase ? "picking" : "banning"; // Assign phase inside the callback

    //drafting finished, player choose hero
    if (evtData.added && evtData.added.hero) {
      draft_ended.value = true;

      if (evtData.added.hero.team2) {
          let radiant_heroes = evtData.added.hero.team2;
          Object.keys(radiant_heroes).forEach((radiant_player, index) => {

          let player_name = evtData.player.team2[radiant_player].name;
          let selected_hero = evtData.hero.team2[radiant_player].name.replaceAll("npc_dota_hero_", "");
          let x = { name: player_name, played_by: selected_hero }
          radiant_choosen_heroes.values[index] = x;
        });
      }
      if (evtData.added.hero.team3) {
          let dire_heroes = evtData.added.hero.team3;
          Object.keys(dire_heroes).forEach((dire_player, index) => {
          let player_name = evtData.player.team3[dire_player].name;
          let selected_hero = evtData.hero.team3[dire_player].name.replaceAll("npc_dota_hero_", "");
          let y = { name: player_name, playing: selected_hero }
          dire_choosen_heroes.values[index] = { name: player_name, played_by: selected_hero }
        });
      }
    }

    //method to show hero popup
    //method 1 : drawback is some heroes will not popup because on GSI request client sometimes doesn't have picked hero in "previously" data
    // uncomment to use this method 
    // if (evtData.previously && evtData.previously.draft) {
    //   let previousDraft = evtData.previously.draft;
    //   let team_index = previousDraft.activeteam;
    //   if (active_team) {
    //     //either 2 (radiant) or 3 (dire)
    //     let teamKey = `team${team_index}`;//'team '+ team_index;
    //     let previousDraftState = previousDraft[teamKey]; // {pick0_id:"",pick0_class:""}

    //     if (previousDraftState) {
    //       let ispreviousPhaseIsPicking = false;
    //       let pickedHeroKey = ""
    //       Object.keys(previousDraftState).forEach((key) => {
    //         if (key.includes("pick")) {
    //           pickedHeroKey = key
    //           ispreviousPhaseIsPicking = true
    //           return;
    //         }
    //       })
    //       //if previous event picking?
    //       if (ispreviousPhaseIsPicking) {
    //         announced_picked_hero.name = evtData.draft[teamKey][pickedHeroKey];
    //         popup_visible.value = true;
    //         setTimeout(() => {
    //           popup_visible.value = false;
    //         }, 6000)
    //       }
    //     }

    //   }

    // }
    //end method 1


    //method 2 : drawback is some heroes will popup overriding the previous animation because quick pick in 2nd pick phase (usualy tem pick 2 heroes and they pick as soon as after pick 1 hero)
    // commonly happen on 2nd pick phase
    // if(picking_order.length == 0) {     
    // let draft_order = []
    // //const is_radiant_fp = (evtData.draft && evtData.draft.team2.home_team);
    // console.log('draft evt data:', JSON.stringify(evtData.draft))
    // // console.log('is radiant first pick:', evtData.draft.team2.home_team)
    // // console.log('is dire first pick:', evtData.draft.team3.home_team)
    // captains_mode.draft.forEach((phase) => {
    //     //only put pick selection in draft_order  
    //     if(phase.name.includes("Pick phase", 0)){
    //         phase.selections.forEach((selection) => {
    //         //console.log('selection:', selection)
    //         //const team = is_radiant_fp ? (selection.team === "first" ? "team2" : "team3") : (selection.team === "first" ? "team3" : "team2");
    //         const team =(selection.team === "first" )? "team2" : "team3"
    //         //console.log('is radiant first pick:', is_radiant_fp, ' selection team:', selection.team, ' team:', team)
    //         const el_id = `${team}_${selection.type}${selection.id}`;
    //         draft_order.push(el_id);
    //       });
    //     }       
    //   });
    //   picking_order = draft_order   
    // }
    // else{
    //   //check current pick index for watching
    //   for(const order in picking_order){
    //     let po = picking_order[order].split("_") //split string team(x)_pick(n)
    //     let current_team = po[0] //team2 or team3
    //     let pick_index = po[1] +'_class' // added suffix class for checking key
    //     if(evtData.draft[current_team][pick_index] == "") {
    //       current_team_pick = picking_order[order]
    //       break
    //     }      
    //   }    
    // }
    // end method 2

    //method 3 : changes from  patch 7.40 where draft has update new rule (cannot rely on home team anymore and also adjust in game_mode.js file). Drawback still same as method 2 above
  if(picking_order.length == 0) {     
      let draft_order = []
      //wait until one team ban first (first ban = first pick. see patch 7.40)
      //const is_radiant_fp = (evtData.draft && evtData.draft.team2.home_team);
      if(firstPickTeam ==""){
         if(evtData.draft.team2.ban0_class != "" && evtData.draft.team3.ban0_class == ""){
          firstPickTeam = "radiant" //both team already ban, just assume radiant first pick
        }
        else if(evtData.draft.team3.ban0_class != "" && evtData.draft.team2.ban0_class == ""){
          firstPickTeam = "dire" //both team already ban, just assume radiant first pick
        }
      }
     

      //only if first pick team already determined
      if(firstPickTeam != ""){
        const is_radiant_fp = (firstPickTeam == "radiant") ? true : false
        console.log('determined first pick team:', firstPickTeam, ' is radiant first pick:', is_radiant_fp)
      
      captains_mode.draft.forEach((phase) => {
          //only put pick selection in draft_order  
          if(phase.name.includes("Pick phase", 0)){
              phase.selections.forEach((selection) => {
              //console.log('selection:', selection)
              const team = is_radiant_fp ? (selection.team === "first" ? "team2" : "team3") : (selection.team === "first" ? "team3" : "team2");
              //console.log('is radiant first pick:', is_radiant_fp, ' selection team:', selection.team, ' team:', team)
              const el_id = `${team}_${selection.type}${selection.id}`;
              draft_order.push(el_id);
            });
          }       
        });
        picking_order = draft_order   
      }
      else{
        //check current pick index for watching
        for(const order in picking_order){
          let po = picking_order[order].split("_") //split string team(x)_pick(n)
          let current_team = po[0] //team2 or team3
          let pick_index = po[1] +'_class' // added suffix class for checking key
          if(evtData.draft[current_team][pick_index] == "") {
            current_team_pick = picking_order[order]
            break
          }      
        }    
      }
    }
      
    //check current pick index for watching
    if(picking_order[watch_index]){
      let x = picking_order[watch_index].split('_')
      let t = x[0]
      let i = x[1] + '_class'
      if(watch_index == picking_order.findIndex((d) => d == current_team_pick) && picking_order[watch_index],evtData.draft[t][i]) {
        announced_picked_hero.name = evtData.draft[t][i]
        watch_index +=1
        popup_visible.value = true;
        setTimeout(() => {
          popup_visible.value = false;
        }, 4500)   
      }
      }
    //end method 3
    
  

    // GENERAL INFO -- can be override by form match setting
    for (let i = 0; i <= 6; i++) {

      if (evtData.draft.team3) {
        const banKeyDire = `ban${i}_class`;
        const banDataDire = evtData.draft.team3[banKeyDire];


        if (banDataDire) {
          dire_state.state = banDataDire;
          dire_banned_heroes.values[i] = banDataDire;
        } else {
          dire_state.state = phase.value;
          dire_banned_heroes.values[i] = "none";
        }
      }

      if (evtData.draft.team2) {
        const banKeyRadiant = `ban${i}_class`;
        const banDataRadiant = evtData.draft.team2[banKeyRadiant];
        if (banDataRadiant) {
          radiant_state.state = banDataRadiant;
          radiant_banned_heroes.values[i] = banDataRadiant;
        } else {
          radiant_state.state = phase.value;
          radiant_banned_heroes.values[i] = "none";
        }
      }

    }

    if (active_team.name === "radiant" && phase.value === "banning") {
      const nextRadiantBanIndex = radiant_banned_heroes.values.findIndex(
        (ban) => ban === "none",
      );
      if (nextRadiantBanIndex !== -1) {
        radiant_banned_heroes.values[nextRadiantBanIndex] = "banning";
      }
    }

    if (active_team.name === "dire" && phase.value === "banning") {
      const nextDireBanIndex = dire_banned_heroes.values.findIndex((ban) => ban === "none");
      if (nextDireBanIndex !== -1) {
        dire_banned_heroes.values[nextDireBanIndex] = "banning";
      }
    }

    for (let i = 0; i <= 4; i++) {
      if (evtData.draft.team3) {
        const pickKeyDire = `pick${i}_class`;
        const pickDataDire = evtData.draft.team3[pickKeyDire];
        if (pickDataDire) {
          dire_state.state = pickDataDire;
          dire_picked_heroes.values[i] = pickDataDire;
        } else {
          dire_state.state = phase.value;
          dire_picked_heroes.values[i] = "none";
        }
      }

      if (evtData.draft.team2) {
        const pickKeyRadiant = `pick${i}_class`;
        const pickDataRadiant = evtData.draft.team2[pickKeyRadiant];
        if (pickDataRadiant) {
          radiant_state.state = pickDataRadiant;
          radiant_picked_heroes.values[i] = pickDataRadiant;
        } else {
          radiant_state.state = phase.value;
          radiant_picked_heroes.values[i] = "none";
        }
      }

      if (evtData.hero && evtData.hero.team3) {
        const playerKeyDire = `player${i + 5}`; //dire player index start with 5
        const playerDataDire = evtData.player.team3[playerKeyDire];
        const heroDataDire = evtData.hero.team3[playerKeyDire];
        if (heroDataDire) {
          let shorted_name_hero = (heroDataDire.name) ? heroDataDire.name.replaceAll("npc_dota_hero_", "") : ""; // this is to change from npc_dota_hero_*
          dire_choosen_heroes.values[i] = { name: shorted_name_hero, played_by: playerDataDire.name }
        }
      }

      if (evtData.hero && evtData.hero.team2) {
        const playerKeyRadiant = `player${i}`;
        const playerDataRadiant = evtData.player.team2[playerKeyRadiant];
        const heroDataRadiant = evtData.hero.team2[playerKeyRadiant];
        if (heroDataRadiant) {
          let shorted_name_hero = (heroDataRadiant.name) ? heroDataRadiant.name.replaceAll("npc_dota_hero_", "") : ""; // this is to change from npc_dota_hero_*
          radiant_choosen_heroes.values[i] = { name: shorted_name_hero, played_by: playerDataRadiant.name }
        }
      }



    }

    if (active_team.name === "radiant" && phase.value === "picking") {
      const nextRadiantPickIndex = radiant_picked_heroes.values.findIndex(
        (pick) => pick === "none",
      );
      if (nextRadiantPickIndex !== -1) {
        radiant_picked_heroes.values[nextRadiantPickIndex] = "picking";
      }
    }

    if (active_team.name === "dire" && phase.value === "picking") {
      const nextDirePickIndex = dire_picked_heroes.values.findIndex((pick) => pick === "none");
      if (nextDirePickIndex !== -1) {
        dire_picked_heroes.values[nextDirePickIndex] = "picking";
      }
    }

   } 
   catch(error){
    console.warn('error happen, this might be the data not successfully parsed as from dota client might not send required data ', error)
  }

});

overlaySocket.on('settings:override', (data) =>{
  // console.log('incoming command to change de draft overlay settings', data)
  if(data.override){
    series_type.type = data.series
    if(!data.default_description) series_description.desc = data.series_description
    dire_team_info.value = data.dire_team_info
    radiant_team_info.value= data.radiant_team_info  
    //set draft settings from dashboard
    setting_override.value = true
  }
  else{
    series_type.type = "bo3";
    series_description.desc = formatted_series_type(series_type.type)
    dire_team_info.value = {
          name: "dire",
          tag: "DIR",
          series_wins: 0
        }

    radiant_team_info.value= {
          name: "radiant",
          tag: "RAD",
          series_wins: 0
        }
    //revert back to dota client 
    setting_override.value = false
  }
  
})

overlaySocket.on('settings:toggle_music',() =>{
    toggle_pause_music.value = !toggle_pause_music.value
})


</script>
  <HeroShowcaseVideo announcedPickedHero={announced_picked_hero.name} isPopupVisible={popup_visible.value} />
<audio src={asset('/resources/music/draft-intl.wav')} bind:paused={toggle_pause_music.value}></audio>
<div id="draft">
  <div class="side_container">
      <div class="pick_group gap-1 px-1">
        {#each radiant_picked_heroes.values as pick}
          <HeroPick 
          hero_name={pick} 
          team="radiant" 
          esport_team_tag={radiant_team_info.value.tag}
          choosen_heroes={radiant_choosen_heroes.values}
          />
        {/each}
    </div>
    <div class="ban_group gap-1 py-1 px-2">
       {#each radiant_banned_heroes.values as ban, index}
        <HeroBans hero_name={ban} team="radiant" />
      {/each}
    </div>
  </div>
  <CenterScreen
    activeteam_time_remaining={draft_active_time_remaining.value}
    radiant_bonus_time={radiant_bonus_time.value}
    dire_bonus_time={dire_bonus_time.value}
    turn={active_team.name.value}
    phase={phase.value}
    draft_ended={draft_ended.value}
    radiant_team_info={radiant_team_info.value}
    dire_team_info={dire_team_info.value}
    series_type={series_type.type}
    series_description={series_description.desc}
  />
  <div class="side_container">
    <!-- normal order (Left to Right)-->
    <div class="pick_group gap-1 px-1">
       {#each {length: dire_picked_heroes.values.length} as _, index}
        {@const reverseIndex = dire_picked_heroes.values.length - 1 - index}
		    {@const pick =  dire_picked_heroes.values[reverseIndex]}
          <HeroPick hero_name={pick} 
          team="dire" 
          esport_team_tag={dire_team_info.value.tag}
          choosen_heroes={dire_choosen_heroes.values}
          is_radiant={false}
          />
        {/each}
    </div>
    <!-- reverse order (Right to Left)-->
    <div class="ban_group gap-1 py-1 px-2 items-end place-content-end place-items-end">
      {#each {length :dire_banned_heroes.values.length} as _, index}
       {@const reverseIndex = dire_banned_heroes.values.length - 1 - index}
       {@const ban =  dire_banned_heroes.values[reverseIndex]}
        <HeroBans hero_name={ban} team="dire" />
      {/each}
    </div>
  </div>
</div>
