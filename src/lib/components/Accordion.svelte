<script>
    let data =$props();
    let accordionOpen = $state(true);
    if(data.default_open == false) accordionOpen=false;
    function setAccordionOpen(value){
        accordionOpen = value;
    }

    const [PLAYERS,TEAMS] =["PLAYERS","TEAMS"]
    
</script>
<div class="py-5 w-[80%]">
      <button
        onclick={() => setAccordionOpen(!accordionOpen)}
        class="flex justify-center w-full py-2 rounded-xl border-1 gap-5 shadow-lg shadow-amber-gray-500/30 border-dotted bg-blue-400/70"
      >
        <span class="text-2xl font-extrabold pl-9 font-[grenze]">{data.title}</span>
        <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-10 transform transition-transform duration-200 pr-0.5"
              class:rotate-90={accordionOpen}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
       
      </button>
      <div
        class={`grid overflow-hidden transition-all duration-300 ease-in-out text-slate-600 text-sm ${
          accordionOpen
            ? "grid-rows-[1fr] opacity-100 my-2 border-1 rounded-2xl"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div class="overflow-hidden p-4">
            {@render data.accordion_content(data.records)}
        </div>
      </div>
    </div>