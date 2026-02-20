<script>
  import '$lib/assets/style/global.css';
  import '$lib/assets/style/fonts.css';
  export let open = false;
  export let title = "Modal Title";

  const close = () => {
    open = false;
  };


  const handleKeydown = (e) => {
    if (e.key === "Escape") {
      close();
    }
  };
</script>

{#if open}
  <!-- Backdrop -->
  <button
    type="button"
    class="fixed inset-0 z-40 bg-black/50"
    aria-label="Close modal"
    on:click={close}
  ></button>

  <!-- Modal Wrapper (NO keyboard handlers here) -->
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-auto p-10">
    <!-- Modal Dialog -->
    <div
      class="bg-white rounded-xl shadow-xl w-[50%] p-5 mx-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
      on:keydown={handleKeydown}
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2
          id="modal-title"
          class="text-2xl font-semibold text-gray-800"
        >
          {title}
        </h2>

        <button
          type="button"
          class=" bg-red-400 text-white hover:text-gray-600 text-lg p-0.5 rounded-lg"
          aria-label="Close modal"
          on:click={close}
        >
          X
        </button>
      </div>

      <!-- Content -->
      <div class="text-gray-600">
        <slot></slot>
      </div>
    <!-- Footer -->
      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2 bg-blue-500 text-white font-[radiance] hover:bg-gray-200 disabled:opacity-50 rounded-xl"
          on:click={close}
        >
          Close
        </button>

      </div>

      
    </div>
  </div>
{/if}
