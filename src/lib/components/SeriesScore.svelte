<script>
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faSquare } from "@fortawesome/free-regular-svg-icons";
    import { faSquare as solidSquare} from "@fortawesome/free-solid-svg-icons";

    let {series_type = $bindable(), score =$bindable(), reverse_order = false} = $props()
</script>

{#if reverse_order}
 <!-- dire  -->
  {#if series_type =="bo1" }
        {#if score == 0}
          <FontAwesomeIcon icon={faSquare} size="1x" />
        {:else}
         <FontAwesomeIcon icon={solidSquare} size="1x" />
        {/if}
  {:else if series_type == "bo2"}
        {#if score == 0}
          <FontAwesomeIcon icon={faSquare} size="1x" />
        {:else}
         <FontAwesomeIcon icon={solidSquare} size="1x" />
        {/if} 
  {:else if series_type == "bo3"}
          {#if score == 0}
            <FontAwesomeIcon icon={faSquare} size="1x" />
            <FontAwesomeIcon icon={faSquare} size="1x" />
          {:else if score >= 1 }
            <FontAwesomeIcon icon={faSquare} size="1x" />
            <FontAwesomeIcon icon={solidSquare} size="1x" />
          {:else if score >=2}
            <FontAwesomeIcon icon={solidSquare} size="1x" />
            <FontAwesomeIcon icon={solidSquare} size="1x" />
          {/if}
  {:else if series_type == "bo5"}
          {#if score == 0}
            <FontAwesomeIcon icon={faSquare} size="1x" />
            <FontAwesomeIcon icon={faSquare} size="1x" />
            <FontAwesomeIcon icon={faSquare} size="1x" />
          {:else if score == 1}        
            <FontAwesomeIcon icon={faSquare} size="1x" />
            <FontAwesomeIcon icon={faSquare} size="1x" />
            <FontAwesomeIcon icon={solidSquare} size="1x" />
          {:else if score == 2}
            <FontAwesomeIcon icon={faSquare} size="1x" />
            <FontAwesomeIcon icon={solidSquare} size="1x" />
            <FontAwesomeIcon icon={solidSquare} size="1x" />
          {:else if score >= 3}
            <FontAwesomeIcon icon={solidSquare} size="1x" />
            <FontAwesomeIcon icon={solidSquare} size="1x" />
            <FontAwesomeIcon icon={solidSquare} size="1x" />
          {/if}
  {/if}
{:else}
<!-- radiant -->
  {#if series_type =="bo1" }
        {#if score == 0}
          <FontAwesomeIcon icon={faSquare} size="1x" /> 
        {:else}
         <FontAwesomeIcon icon={solidSquare} size="1x" /> 
        {/if}
  {:else if series_type == "bo2"}
        {#if score == 0}
          <FontAwesomeIcon icon={faSquare} size="1x" />
        {:else}
         <FontAwesomeIcon icon={solidSquare} size="1x" />
        {/if}       
  {:else if series_type == "bo3"}
          {#if score == 0}
            <FontAwesomeIcon icon={faSquare} size="1x" /> <!-- 0-->
            <FontAwesomeIcon icon={faSquare} size="1x" /> 
          {:else if score >= 1 }
            <FontAwesomeIcon icon={solidSquare} size="1x" />
            <FontAwesomeIcon icon={faSquare} size="1x" />
          {:else if score >=2}
            <FontAwesomeIcon icon={solidSquare} size="1x" />
            <FontAwesomeIcon icon={solidSquare} size="1x" />
          {/if}
  {:else if series_type == "bo5"}
          {#if score == 0}
            <FontAwesomeIcon icon={faSquare} size="1x" />
            <FontAwesomeIcon icon={faSquare} size="1x" />
            <FontAwesomeIcon icon={faSquare} size="1x" />
          {:else if score == 1}                  
            <FontAwesomeIcon icon={solidSquare} size="1x" />
            <FontAwesomeIcon icon={faSquare} size="1x" />
            <FontAwesomeIcon icon={faSquare} size="1x" />
          {:else if score == 2}
          <FontAwesomeIcon icon={solidSquare} size="1x" />
            <FontAwesomeIcon icon={solidSquare} size="1x" />
            <FontAwesomeIcon icon={faSquare} size="1x" />            
          {:else if score >= 3}
            <FontAwesomeIcon icon={solidSquare} size="1x" />
            <FontAwesomeIcon icon={solidSquare} size="1x" />
            <FontAwesomeIcon icon={solidSquare} size="1x" />
          {/if}
  {/if}
{/if}





