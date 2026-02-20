<script>
    export let team;
    export let is_radiant = true
    import { asset } from "$app/paths";
</script>
{#if team && team.tag}
     <!-- <FlatImage image_path={asset(`/resources/esport_team/${team.tag}.png`)} alt_text={team.name} css_class={['h-14', 'team_logo','py-1']}/> -->
       <img src={(team.logo != null)?team.logo:asset(`/resources/esport_team/${(is_radiant)?"RAD":"DIR"}.png`)} 
        alt={team.name}
        class={['h-14', 'team_logo','py-1']}
        onerror={(e) => e.target.src = asset(`/resources/esport_team/${(is_radiant)?"RAD":"DIR"}.png`)}
        />
{:else}
    <img class="h-14 team_logo py-1" src={asset("/resources/pick_logo.png")} alt="dota_team"/>
{/if}