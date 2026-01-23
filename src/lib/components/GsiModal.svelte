<script>
  import '$lib/assets/style/global.css';
	import '$lib/assets/style/fonts.css';
  export let open = false;
  export let title = "Modal Title";
  export let hideControlButtons = false;
  export let selectedToken = "";
  export let tokenName = "";

  export let onConfirm = async () => {};
  export let onCancel = () => {};

  let processing = false;
  let success = false;

 

  const close = () => {
    if (processing) return;
    open = false;
    onCancel();
  };

  const confirm = async () => {
    if (processing) return;
    processing = true;

    try {
      success = await onConfirm();
      if(success) open = false;
    } finally {
      processing = false;
    }
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
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
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
          class="text-lg font-semibold text-gray-800"
        >
          {title}
        </h2>

        <button
          type="button"
          class=" bg-red-400 text-white hover:text-gray-600"
          aria-label="Close modal"
          on:click={close}
        >
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="text-gray-600">
        <slot></slot>
      </div>

      {#if !hideControlButtons}
        <!-- Footer -->
      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
          on:click={close}
          disabled={processing}
        >
          Cancel
        </button>

        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          on:click={confirm}
          disabled={processing}
        >
          {processing ? "Processing..." : "Confirm"}
        </button>
      </div>
      {/if}

      
    </div>
  </div>
{/if}
