<script>
    import { asset } from "$app/paths";
    import { fade } from 'svelte/transition';
    let { announcedPickedHero ='', isPopupVisible=false } = $props();
    const webm_video_path = '/resources/hero_popup_video/webm'
    let video_path = $state(webm_video_path)
    let video_format = $state('.webm')
    
    //just for testing 
    // let {data = $bindable()} = $props()
    
   
   //console.log('data ', announcedPickedHero, isPopupVisible)
</script>
<!-- TODO: uncomment these blocks if you have webm files video for showing hero showcase -->
{#if isPopupVisible}
    <div class="absolute z-50">
        <div class="hero_showcase">
            <video transition:fade={{ duration: 500 , delay:500}}  id="hero_showcase" muted autoplay playsinline 
                src={asset(`${video_path}/${announcedPickedHero}${video_format}`)}
                onerror={(e) => e.target.src = asset(`/resources/hero_popup_video/demo/demo_text.webm`)}>
            </video>
        </div>
    </div>
{/if}
