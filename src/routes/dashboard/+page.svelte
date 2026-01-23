<script>
    import { asset } from "$app/paths";
    import { socket } from "$lib/const/const";
    import "$lib/assets/style/global.css";
    let { data } = $props();
</script>


<!-- Chart or Table Placeholder -->
<div class="bg-white p-6 rounded-xl shadow min-h-[300px]">
    <h2 class="text-lg font-semibold mb-4 text-gray-700">Recent Activity</h2>
    <p class="text-gray-500 text-sm">
        This is where your chart or data table will go.
    </p>
</div>
