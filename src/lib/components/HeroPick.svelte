<script>
    import {slide} from 'svelte/transition'
    import { asset } from '$app/paths';
    export let hero_name;
    export let team;
    export let esport_team_logo
    export let choosen_heroes;
    export let is_radiant = true
    if(esport_team_logo != null) esport_team_logo = "data:image/png;base64," + esport_team_logo;
</script>


{#if hero_name != "none" && hero_name != "picking"}
        <div class={['pick', team ,'rounded-lg']} >
            <video transition:slide={{ duration: 500, delay:4000, axis:'y' }} class="pick_video rounded-lg" autoplay muted loop>
                    <source type="video/webm" src={asset(`/resources/picks/${hero_name}.webm`)} />
            </video>
            {#each choosen_heroes as cs}
                {#if cs.name == hero_name }
                <div class="player_name">{cs.played_by}</div>
                {/if}
            {/each}            
            <div class="shadow"></div>
        </div>
{:else if hero_name == "picking"}
    <div class={['pick', team ,'rounded-lg','active']} >
        <img src={(esport_team_logo != null)?esport_team_logo:asset(`/resources/esport_team/${(is_radiant)?"RAD":"DIR"}.png`)} 
        alt={team.name}
        class={['relative', 'left-[21%]','top-1/4', 'items-end','h-20', 'w-20', 'justify-end']}
        onerror={(e) => e.target.src = asset(`/resources/esport_team/${(is_radiant)?"RAD":"DIR"}.png`)}
        />

        <div class="shadow"></div>
    </div>
{:else if hero_name == "none"}
    <div class={['pick', team ,'rounded-lg']} >
           <img  src={(esport_team_logo != null)?esport_team_logo:asset(`/resources/esport_team/${(is_radiant)?"RAD":"DIR"}.png`)} 
                alt={team.name}
                class={['relative', 'left-[21%]','top-1/4', 'items-end','h-20', 'w-20', 'justify-end']}
                onerror={(e) => e.target.src = asset(`/resources/esport_team/${(is_radiant)?"RAD":"DIR"}.png`)}
                />     
        <div class="shadow"></div>
    </div>
{/if}
