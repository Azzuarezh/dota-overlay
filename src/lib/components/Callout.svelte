
<script>
    import {fade} from 'svelte/transition'
   // import {announced_picked_hero, popup_visible}  from '../../routes/overlays/[gsitoken]/draft/draftstate.svelte'
   let {data} = $props()
</script>

{#if data.popup_visible.value}
<div transition:fade={{ duration: 5000 }}  class="callout fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-lg h-1/2">
    <h1 class="heading items-center place-content-center justify-center justify-items-center">
        <span class="hero popup">{announced_picked_hero.name}</span>
    </h1>
</div>
{/if}
<style>
    

@keyframes pop-word {
  to {
    transform: rotateX(0);
  }
}

@keyframes show {
  to {
    opacity: 1;
  }
}

@keyframes hide {
  to {
    opacity: 0;
  }
}

.heading {
  font-size: 64px;
  color:var(--color-red-800);
  font-family: Reaver;
  line-height: 0.85;
  perspective: 500px;
}

.popup {
  display: block;
  animation: show 0.01s forwards, pop-word 2s forwards;
  animation-timing-function: cubic-bezier(0.14, 1.23, 0.33, 1.16);
  opacity: 0;

  transform: rotateX(120deg);
  transform-origin: 50% 100%;
}



    
</style>