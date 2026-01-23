<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/assets/style/global.css';
	import '$lib/assets/style/fonts.css';
	/** @type {import('./$types').LayoutProps} */
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
{@render children?.()}
