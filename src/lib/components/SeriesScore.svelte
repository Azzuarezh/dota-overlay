<script>
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faSquare } from "@fortawesome/free-regular-svg-icons";
    import { faSquare as solidSquare} from "@fortawesome/free-solid-svg-icons";

    export let series_type;
    export let score;
    export let reverse_order = false;
</script>

{#if reverse_order}
  {#if series_type =="bo1" }
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
  {#if series_type =="bo1" }
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





