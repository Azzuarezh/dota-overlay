<script>
    import '$lib/assets/style/global.css'
    import "$lib/assets/style/event_timing.css";
    import { slide, fade } from "svelte/transition";
    import {cubicInOut} from 'svelte/easing'
    import { asset } from "$app/paths";
    import { deserialize } from '$app/forms';
    import {
        formatTimeWithRoundedSecond,
        GENERIC_EVENT,
        FIRST_BLOOD,
    } from "$lib/const/const";
    import { EVENT_ROSHAN_KILLED, EVENT_ITEM_PURCHASE } from "$lib/const/const";
    import { items } from "$lib/const/item_ids";
    import io from "socket.io-client";
    import Firstblood from '$lib/components/DOTA/overlays/FirstBlood.svelte';
    import WinProbability from '$lib/components/DOTA/WinProbability.svelte';
    let { data } = $props()
    let radiant_team_info = $state(data.radiant_team_info)
    let dire_team_info = $state(data.dire_team_info)
     //for showing team info
    let loaded_team_logo_radiant = $state(false)
    let loaded_team_logo_dire = $state(false)
    let radiantWinProbability = $state(50)

    let showTeamLogoHudOverlay = $state(false)

    const overlaySocket = io(data.SOCKET_IO_URL, {auth:{client_type:'overlay_client', token:data.gsi_token}})

    function findTeamIndex(team_id){
    if(Object.keys(data.team_list).length !== 0){
      const index= data.team_list.findIndex(t => t.teamId == team_id)
      return index;
    }    
  }

    let item_purchased_overlay_visible = $state(false);

    let roshan_items_drop = $state([
        "item_null",
        "item_null",
        "item_null",
        "item_null",
        "item_null",
        "item_null",
    ]);
    let hero;

    let clock_time;

    let notable_items = data.notable_items; // boots, bkb, butterfly, manta, midas, greater crit (daedalus), bfury, sny, rapier, skadi, abyssal

    let first_blood_flag = $state(false);
    let first_blood_overlay_visible = $state(false);
    let first_blood_drawer = $state("");

   

    //show win probability
    let win_probability_overlay_visible = $state(false);


    //let roshan_overlay_visible = $state(false);

    let roshan_overlay_visible = $state(data.roshan_overlay_visible)
    let roshan_alive = $state(false);
    let roshan_phase_remaining = $state(0);

    let selectedPlayerBySpectator = $state()

    async function getPlayerInThisMatch(accountId){
        if(accountId != null){
            const response = await fetch(`${data.BASE_URL}/dashboard/dota-config/player/account/${accountId}`, {
                method: 'GET',
            });

            /** @type {import('@sveltejs/kit').ActionResult} */
            const result = deserialize(await response.text());
            if (result.type === 'success') {
                return result.player;
            }   
            else if(result.type ==='failure'){
                return null;
            }
        }      
    }

    function getRadiantWinProbability(playerTeams, map, buildings){
       // Safety check for incomplete GSI payloads
        if (!playerTeams || !map || !buildings || !playerTeams.team2 || !playerTeams.team3) {
            return 50.0;
        }

        // 1. Calculate Team Net Worths from the nested team2/team3 structure
        const sumNetWorth = (teamObj) => {
            return Object.values(teamObj).reduce((sum, p) => sum + (p.net_worth || 0), 0);
        };

        const radiantNW = sumNetWorth(playerTeams.team2);
        const direNW = sumNetWorth(playerTeams.team3);
        
        const nwLead = radiantNW - direNW;
        const gameTimeMin = map.game_time / 60;

        // 2. Tower Lead (Radiant = goodguys, Dire = badguys)
        const countStandingTowers = (teamData) => {
            if (!teamData) return 0;
            return Object.keys(teamData).filter(key => 
                key.includes('tower') && teamData[key].health > 0
            ).length;
        };

        const towerDiff = countStandingTowers(buildings.radiant) - countStandingTowers(buildings.dire);

        // 3. The Formula
        // We weight the NW lead heavily. Tower diff acts as a 1000 gold "momentum" swing.
        const totalAdvantage = nwLead + (towerDiff * 1000);

        // 4. Sigmoid Curve (S-Curve)
        // sensitivity: how "reactive" the percentage is. 
        // We decrease sensitivity as game time increases so 5k lead late-game isn't 90%.
        const sensitivity = 0.0002 / (1 + (gameTimeMin / 40));
        const radiantWinProb = 1 / (1 + Math.exp(-totalAdvantage * sensitivity));

        // 5. Return only Radiant side percentage
        return parseFloat((radiantWinProb * 100).toFixed(1));
    }

    let show_showIngameDataOnce = $state(false)

    overlaySocket.on('gamestate:ingame', (evtData) =>{
       
        if(evtData.map && evtData.buildings && evtData.player){
            // console.log('map:', evtData.map)
            // console.log('player:', evtData.player)
            // console.log('buildings:', evtData.buildings)
           radiantWinProbability = getRadiantWinProbability(evtData.player,evtData.map, evtData.buildings)
        }

        if(loaded_team_logo_radiant == false){
        //radiant team info
        if (evtData.league && evtData.league.radiant) {
          const radiant = evtData.league.radiant
          const evtRadiantTeamId = radiant.team_id;
          const selectedTeamIdx = findTeamIndex(evtRadiantTeamId)
          let radiant_team = data.team_list[selectedTeamIdx]
          if(radiant_team.logo != null) radiant_team.logo ='data:image/png;base64,' + radiant_team.logo
          radiant_team_info = radiant_team
          radiant_team_info.default = false;
          loaded_team_logo_radiant = true
        }
      }
      
      if(loaded_team_logo_dire == false){
        //dire team info        
        if (evtData.league && evtData.league.dire) {
          const dire_score = evtData.league.dire.series_wins
          const dire = evtData.league.dire
          const evtDireTeamId = dire.team_id;
          const selectedTeamIdx = findTeamIndex(evtDireTeamId)
          let dire_team = data.team_list[selectedTeamIdx]
          if(dire_team.logo != null) dire_team.logo ='data:image/png;base64,' + dire_team.logo
          dire_team_info = dire_team
          dire_team_info.default = false
          loaded_team_logo_dire = true
        } 
      }
       show_showIngameDataOnce = true
    })

    // prepare data for players
    overlaySocket.on("players", async(evtData) => {
        //pre execution so when the event listened, it won't process again
        try{
            for(let i = 0; i < 10; i++){
                    if(!data[`player${i}`].alreadyMounted){       
                        let gsi_player_account_id = evtData[`player${i}`].accountid
                        let gsi_player_name = evtData[`player${i}`].name
                        let playerFromDb = await getPlayerInThisMatch(gsi_player_account_id)
                        if(playerFromDb){
                            data[`player${i}`].accountId= playerFromDb.accountId
                            data[`player${i}`].name= playerFromDb.name
                            if(playerFromDb.avatarPicture != null){
                                data[`player${i}`].avatarPicture = 'data:image/png;base64,' + playerFromDb.avatarPicture
                            }
                            data[`player${i}`].existInDb = true                    
                        }
                        else{
                            //default to data from gsi client
                            data[`player${i}`].accountId= gsi_player_account_id
                            data[`player${i}`].name= gsi_player_name
                            data[`player${i}`].existInDb = false
                        }
                        data[`player${i}`].alreadyMounted = true
                    }
                }
        }
        catch(err){
            console.log('error retrieving player data:', err)
        }
        
    });

    //when spectator focus on selected player
    overlaySocket.on("players:selected",(evtData)=>{
        if(evtData.selected_player !== null){
            selectedPlayerBySpectator ={
                name:  data[evtData.selected_player].name,
                avatarPicture : data[evtData.selected_player].avatarPicture
            } 
        }
        else{
           selectedPlayerBySpectator = null; 
        }
    })


    let item_overlay_data = $state({
        purchaser: "player name",
        hero: "",
        name: "",
        time: "0:00",
    });
    let item_has_purchased = $state(false);

    function toggle_show_item() {
        item_purchased_overlay_visible = !item_purchased_overlay_visible;
    }
    function toggle_show_roshan() {
        roshan_overlay_visible = !roshan_overlay_visible;
    }

    function toggle_show_team_logo_hud(){
        showTeamLogoHudOverlay = !showTeamLogoHudOverlay
    }
    function toggle_show_win_probability(){
        win_probability_overlay_visible = !win_probability_overlay_visible
    }


    overlaySocket.on("gamestate:time", (data) => {
        clock_time = data.clock_time;
    });

    overlaySocket.on("heroes", (data) => {
        if (data) hero = data;
    });

    let last_evt_data_history;

    overlaySocket.on("eventstate", (evtData) => {
        if (evtData && Object.keys(evtData).length > 0) {
            let last_event = evtData[0];
            if (last_event.event_type == GENERIC_EVENT) {
                let event_data = JSON.parse(last_event.data);
                //to avoid redundant event which will show many times from event
                if (event_data == last_evt_data_history) return;

                // if (event_data.type == EVENT_ITEM_PURCHASE) {
                //     //only show notable items (e.g bkb manta daedalus. ee notable items variable above)
                //     if (notable_items.find((id) => id == event_data.value)) {
                //         if (!item_has_purchased) {
                //             item_overlay_data.name =
                //                 "item_" + items[event_data.value];
                //             let playerKey = `player${event_data.playerid1}`;
                //             item_overlay_data.purchaser =
                //                 player[playerKey].name;
                //             item_overlay_data.hero = hero[
                //                 playerKey
                //             ].name.replaceAll("npc_dota_hero_", "");
                //             item_overlay_data.time = clock_time;
                //             item_has_purchased = true;
                //             item_purchased_overlay_visible = true;
                //             setTimeout(() => {
                //                 item_has_purchased = false;
                //                 item_purchased_overlay_visible = false;
                //             }, 5000);
                //         }
                //         last_evt_data_history = event_data;
                //         return;
                //     }
                // }
                if (event_data.type == FIRST_BLOOD) {
                    if (!first_blood_flag) {
                        let playerKey = `player${event_data.playerid1}`;                      
                        first_blood_drawer = data[playerKey].name;
                        first_blood_overlay_visible = true;
                        setTimeout(() => {
                            first_blood_flag = true;
                            first_blood_overlay_visible = false;
                        }, 3000);
                        return;
                    } else return;
                }
            }
        }
    });

    overlaySocket.on('settings:toggle_show_roshan',() =>{
        if(!roshan_overlay_visible){
             toggle_show_roshan()
             setTimeout(() => {
                roshan_overlay_visible = false;
            }, 5000) 
        }
    })

    overlaySocket.on('settings:toggle_show_team_logo_hud',() =>{
        console.log('event setting show hud received')
         toggle_show_team_logo_hud()  
    })

    overlaySocket.on('settings:toggle_show_win_probability',() =>{
        if(!win_probability_overlay_visible){
             toggle_show_win_probability()
             setTimeout(() => {
                win_probability_overlay_visible = false;
            },6000) 
        }
    })

    overlaySocket.on("roshanstate", (roshan) => {
        // if(roshan && roshan.alive && roshan_sequence > 1){
        if (roshan && roshan.alive) {
            if (roshan.items_drop) {
                Object.keys(roshan.items_drop).forEach((itemKey) => {
                    roshan_items_drop[itemKey.slice(4)] =roshan.items_drop[itemKey]; //slicing to get item0,item1 or etc...
                });
            }
            roshan_alive = true;
        } else if (roshan && !roshan.alive) {
            roshan_phase_remaining = roshan.phase_time_remaining;
            roshan_alive = false;
        }
    });

</script>
<!-- <button class="uppercase setting" onclick={toggle_show_item} >Show/Hide Item purchase overlay</button > -->

<!--
{#if item_purchased_overlay_visible}   
    <div transition:fade={{ duration: 500 }} id="item_timing" class="justify-items-end justify-end place-items-start top-15 right-4 gap-1" >       
        <div transition:slide={{ duration: 1500, axis: "x" }} class=" bg-gray-500 w-[30%] h-[13%] p-5 place-content-start flex rounded-bl-lg rounded-tl-lg" >
            <div class="w-[22%] flex-none"> 
                <img src={asset(`/resources/items/${item_overlay_data.name}.png`)} alt="" class="w-30 h-25" />               
            </div>
            <div class="w-[22%] flex-none">
                <video autoplay muted loop class="w-30 h-25">
                    <source type="video/webm" src={asset(`/resources/picks/${item_overlay_data.hero}.webm`)} />
                </video>
            </div>
            <div transition:fade={{ duration: 500, delay: 500 }} class="flex-initial">
                <h1>{item_overlay_data.purchaser}</h1>
                <h1>{item_overlay_data.time}</h1>
            </div>
        </div>
    </div>
{/if} -->

<!-- background guide -->
<div class="fixed w-2k-width h-2k-height guide -z-10 top-0 left-0">
    
</div>
<div id="screen-2k" class="fixed w-2k-width h-2k-height top-0 left-0">
    <!-- radiant team logo hud -->
     {#if true}
    <div class="radiant-team-logo-hud absolute top-2 left-124" transition:fade={{duration:2000}}>
        <div class="grid grid-cols-2">
            <div class="w-[65px] h-[50px]">
                 <img src={(radiant_team_info.default == true)?asset('/resources/image_style/default_team_logo.png'):radiant_team_info.logo} 
                    alt="radiant team"
                    class="w-[38px] h-[38px] px-0.5"
                    onerror={(e) => e.target.src = asset('/resources/image_style/default_team_logo.png')}/>
            </div>
        </div>
    </div>
    <!-- dire team logo hud -->
    <div class="dire-team-logo-hud absolute top-2 left-345" transition:fade={{duration:2000}}>
        <div class="grid grid-cols-2">
            <div class="w-[65px] h-[50px]">
                 <img src={(dire_team_info.default == true)?asset('/resources/image_style/default_team_logo.png'):dire_team_info.logo} 
                    alt="player 1"
                    class="w-[38px] h-[38px] px-0.5"
                    onerror={(e) => e.target.src = asset('/resources/image_style/default_team_logo.png')}/>
            </div>
        </div>
    </div>
    {/if}

    <!-- Roshan timing -->
    {#if roshan_overlay_visible}
    <div transition:fade={{ duration: 500 }}  id="roshan_timing" class="absolute justify-items-end justify-end place-items-start top-46 left-320">
        <div transition:slide={{ duration: 1500, axis: "x" }} class="grid grid-cols-2 w-full gap-4"
            class:hidden={!roshan_alive}>
            <div class="roshan p-5 flex flex-row space-x-2 place-content-start rounded-bl-lg rounded-tl-lg ">
            <!-- Roshan Alive -->
            <div  class="basis-50 place-content-center justify-items-center-safe rounded-l">
                <video
                    autoplay
                    muted
                    loop
                    class="items-center rounded-xl scale-[500%]"
                >
                    <source
                        type="video/webm"
                        src={asset(`/resources/roshan_animation.webm`)}
                    />
                </video>
            </div>
            <div class="wrapper">
                <!-- roshan item -->
                <div
                    class="basis-80 bg-gray-800/50 grid grid-rows-2 space-y-1 rounded-lg p-4"
                >
                <div class="grid grid-cols-3 space-x-2">
                    <div id="item-slot0" class="bg-gray-800 rounded-xl">
                        <img
                            alt="BKB"
                            src={asset(`/resources/items/${roshan_items_drop[0]}.png`)}
                            class="rounded-xl"
                        />
                    </div>
                    <div id="item-slot2" class="bg-gray-900 rounded-xl">
                        <img
                            alt="BKB"
                            src={asset(`/resources/items/${roshan_items_drop[1]}.png`)}
                            class="rounded-xl"
                            onerror={(e) => (e.target.classList = "hidden")}
                        />
                    </div>
                    <div id="item-slot3" class="bg-gray-900 rounded-xl">
                        <img
                            alt="BKB"
                            src={asset(`/resources/items/${roshan_items_drop[2]}.png`)}
                            onerror={(e) => (e.target.classList = "hidden")}
                        />
                    </div>
                </div>
                    <div class="grid grid-cols-3 space-x-2">
                        <div id="item-slot4" class="bg-gray-900 rounded-xl">
                            <img
                                alt="BKB"
                                src={asset(`/resources/items/${roshan_items_drop[3]}.png`)}
                                class="rounded-xl"
                                onerror={(e) => (e.target.classList = "hidden")}
                            />
                        </div>
                        <div id="item-slot5" class="bg-gray-900 rounded-xl">
                            <img
                                alt="BKB"
                                src={asset(`/resources/items/${roshan_items_drop[4]}.png`)}
                                class="rounded-xl"
                                onerror={(e) => (e.target.classList = "hidden")}
                            />
                        </div>
                        <div id="item-slot6" class="bg-gray-900 rounded-xl">
                            <img
                                alt="BKB"
                                src={asset(`/resources/items/${roshan_items_drop[5]}.png`)}
                                class="rounded-xl"
                                onerror={(e) => (e.target.classList = "hidden")}
                            />
                        </div>
                    </div> 
                </div>
            </div>
        </div>
        </div>
        <div class="grid grid-cols-2 w-full gap-4"
            class:hidden={roshan_alive}>
            <div class="roshan p-5 flex flex-row space-x-2 place-content-start rounded-bl-lg rounded-tl-lg ">
            <!-- Roshan Cooldown -->
            <div  class="basis-50 place-content-center justify-items-center-safe rounded-l">
                <video
                    autoplay
                    muted
                    loop
                    class="items-center rounded-xl scale-[500%]"
                >
                    <source
                        type="video/webm"
                        src={asset(`/resources/roshan_animation.webm`)}
                    />
                </video>
            </div>
            <div class="wrapper">
                <!-- roshan Cooldown text -->
                            <div class="w-full h-[60%] place-items-center place-content-center">
                                <h1 class="text-amber-600 font-[radiance] text-4xl font-extrabold">Roshan Respawn at: {formatTimeWithRoundedSecond(roshan_phase_remaining)}</h1>              
                            </div>
            </div>
        </div>
        </div>

    </div>
    {/if}

    <!-- radiant hud (BETA)-->
    <div class="radiant-hud absolute top-17.5 left-135 hidden">
        <div class="grid grid-cols-5">
            <div class="w-[65px] h-[50px">
                 <img src={asset(`/resources/items/item_aegis.png`) } 
                    alt="player 1"
                    class="rounded-xl w-[60px] h-[50px] px-0.5"
                    onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}/>
            </div>
            <div class="w-[65px] h-[50px">
                 <img src={asset(`/resources/items/item_aegis.png`) } 
                    alt="player 1"
                    class="rounded-xl w-[60px] h-[50px] px-0.5"
                    onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}/>
            </div>
            <div class="w-[65px] h-[50px">
                 <img src={asset(`/resources/items/item_aegis.png`) } 
                    alt="player 1"
                    class="rounded-xl w-[60px] h-[50px] px-0.5"
                    onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}/>
            </div>
            <div class="w-[65px] h-[50px">
                 <img src={asset(`/resources/items/item_aegis.png`) } 
                    alt="player 1"
                    class="rounded-xl w-[60px] h-[50px] px-0.5"
                    onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}/>
            </div>
            <div class="w-[65px] h-[50px">
                 <img src={asset(`/resources/items/item_aegis.png`) } 
                    alt="player 1"
                    class="rounded-xl w-[60px] h-[50px] px-0.5"
                    onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}/>
            </div>

        </div>
    </div>

    <!-- dire hud (BETA)-->
     <div class="dire-hud absolute top-17.5 right-135 hidden">
        <div class="grid grid-cols-5">
            <div class="w-[65px] h-[50px">
                 <img src={asset(`/resources/items/item_aegis.png`) } 
                    alt="player 1"
                    class="rounded-xl w-[60px] h-[50px] px-0.5"
                    onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}/>
            </div>
            <div class="w-[65px] h-[50px">
                 <img src={asset(`/resources/items/item_aegis.png`) } 
                    alt="player 1"
                    class="rounded-xl w-[60px] h-[50px] px-0.5"
                    onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}/>
            </div>
            <div class="w-[65px] h-[50px">
                 <img src={asset(`/resources/items/item_aegis.png`) } 
                    alt="player 1"
                    class="rounded-xl w-[60px] h-[50px] px-0.5"
                    onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}/>
            </div>
            <div class="w-[65px] h-[50px">
                 <img src={asset(`/resources/items/item_aegis.png`) } 
                    alt="player 1"
                    class="rounded-xl w-[60px] h-[50px] px-0.5"
                    onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}/>
            </div>
            <div class="w-[65px] h-[50px">
                 <img src={asset(`/resources/items/item_aegis.png`) } 
                    alt="player 1"
                    class="rounded-xl w-[60px] h-[50px] px-0.5"
                    onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}/>
            </div>

        </div>
    </div>

    <!-- firstblood -->
     <div class="absolute top-[12%] left-150">
         <Firstblood show_firstblood={first_blood_overlay_visible} drawer={first_blood_drawer}/>
     </div>

     {#if win_probability_overlay_visible}
     <div transition:slide={{ duration: 2000,  axis:'y', easing: cubicInOut }} class="absolute top-[12%] left-150">
        <WinProbability radiant_win_probability={radiantWinProbability} radiant_team_info={radiant_team_info} dire_team_info={dire_team_info}/>
     </div>
     {/if}

    <!-- Player portrait -->
    <div id="player-portrait" class="absolute bottom-0 left-79">
        <img src={(selectedPlayerBySpectator != null)?selectedPlayerBySpectator.avatarPicture:asset(`/resources/image_style/esport_player_portrait.jpg`) } 
            alt={(selectedPlayerBySpectator)?selectedPlayerBySpectator.name:''}
            class="rounded-xl w-46 h-55"
            onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}/>
    </div>
    <!-- Player name -->
    <div id="player-name" class="absolute w-[11.5rem] bottom-58 left-79 h-7 place-content-end place-items-center rounded-lg p-0.5">
        <h1 class="text-xl font-[grenze] font-extrabold truncate text-white text-center" onerror={(e) => e.target.classList= 'hidden'}>{(selectedPlayerBySpectator)?selectedPlayerBySpectator.name:''}</h1>
    </div>
    <!-- Sponsor -->
    <div id="sponsor" class="absolute bottom-0 right-74 place-content-end place-items-end">
        <img src={asset(`/resources/image_style/qr_paypal.jpg`) }
            alt="Sponsor"
            class="rounded-xl w-58 h-60"
            onerror={(e) => e.target.classList.add("hidden")}/>
    </div>
</div>

<!-- <button class="z-30 fixed top-[50%] left-3 text-black bg-amber-600 border-3 rounded-xl p-4 font-extrabold font-[unifrakturcook] text-lg" 
onclick={() => {first_blood_overlay_visible = true; setTimeout(()=>{first_blood_overlay_visible = false}, 6000)}} >Show/Hide First blood overlay</button >-->
<button class="z-30 fixed top-[55%] left-3 text-black bg-cyan-600 border-3 rounded-xl p-4 font-extrabold font-[unifrakturcook] text-lg" 
onclick={() => win_probability_overlay_visible = !win_probability_overlay_visible} >Show/Hide win probability overlay</button > 
<style>
    .guide{
        /* background-image : url('/resources/ingame-overlay-guide.png'); */
        opacity: 1;
    }
</style>