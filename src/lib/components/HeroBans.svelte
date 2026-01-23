<script>
    import { asset } from "$app/paths";
    export let hero_name;
    export let team;
</script>
{#if hero_name == "banning" && hero_name != "none"}
     <div class="ban {team} rounded-lg active"></div>
{/if}
{#if hero_name == "none" && hero_name != "banning"}
  <div class="ban {team} rounded-lg "></div>
{/if}

{#if hero_name != "none" && hero_name != "banning"}
  <div class="ban {team} rounded-lg fade-in">
        <img class="ban_img rounded-lg slotted" src={asset(`/resources/bans/${hero_name}.png`)} alt="" />
  </div>
{/if}
