<script>
    import {slide} from 'svelte/transition'
    import FlatImage from './FlatImage.svelte';
    import { asset } from '$app/paths';
    export let hero_name;
    export let team;
    export let esport_team_tag
    export let choosen_heroes;
    export let is_radiant = true
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
         <!-- <FlatImage image_path={asset(`/resources/esport_team/${(esport_team_tag != "")?esport_team_tag: (team =="radiant")?"RAD":"DIR"}.png`)}
         alt_text={team.name} 
         css_class={['relative', 'left-[21%]','top-1/4', 'items-end','h-20', 'w-20', 'justify-end']}/> -->

        <img src={asset(`/resources/esport_team/${(esport_team_tag != "")?esport_team_tag: (team =="radiant")?"RAD":"DIR"}.png`)} 
        alt={team.name}
        class={['relative', 'left-[21%]','top-1/4', 'items-end','h-20', 'w-20', 'justify-end']}
        onerror={(e) => e.target.src = asset(`/resources/esport_team/${(is_radiant)?"RAD":"DIR"}.png`)}
        />

        <div class="shadow"></div>
    </div>
{:else if hero_name == "none"}
    <div class={['pick', team ,'rounded-lg']} >
         <!-- <FlatImage image_path={asset(`/resources/esport_team/${(esport_team_tag != "")?esport_team_tag: (team =="radiant")?"RAD":"DIR"}.png`)}
         alt_text={team.name} 
         css_class={['relative', 'left-[21%]','top-1/4', 'items-end','h-20', 'w-20', 'justify-end']}/> -->

           <img src={asset(`/resources/esport_team/${(esport_team_tag != "")?esport_team_tag: (team =="radiant")?"RAD":"DIR"}.png`) } 
        alt={team.name}
        class={['relative', 'left-[21%]','top-1/4', 'items-end','h-20', 'w-20', 'justify-end']}
        onerror={(e) => e.target.src = asset(`/resources/esport_team/${(is_radiant)?"RAD":"DIR"}.png`)}
        />

        <div class="shadow"></div>
    </div>
{/if}
 
<style>
    .pick {
        background-image:var(--gradient-main);
    }

    .pick.active {
        background-image:var(--gradient-main-linear);
        background-size: 200% 200%;
        animation: gradient .75s ease infinite alternate;
    }

</style>
