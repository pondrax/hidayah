<script lang="ts">
	import { browser } from '$app/environment';
	import { PUBLIC_APP_NAME } from '$env/static/public';

	import '../app.css';

	let theme = 'cupcake';

	if (browser) {
		if (localStorage.theme) {
			theme = localStorage.theme;
		}
	}

	$: {
		if (browser) document.documentElement.setAttribute('data-theme', theme);
	}
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME}</title>
	<meta
		name="description"
		content="Hidayah Islami merupakan aplikasi pocket anda untuk memudahkan kita dalam hal islami"
	/>
</svelte:head>

<slot />
<div class="fixed w-full top-0 z-30">
	<div class="max-w-5xl m-auto p-5 text-right">
		<div class="dropdown dropdown-end">
			<button class="btn btn-sm btn-ghost" aria-label="Change Theme">
				<i class="ri-sun-line" />
			</button>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<ul
				tabindex="0"
				class="dropdown-content menu menu-compact p-0 shadow bg-base-100 rounded-box"
			>
				<li><button on:click={() => (theme = 'dark')}>Dark</button></li>
				<li><button on:click={() => (theme = 'cupcake')}>Cupcake</button></li>
				<li><button on:click={() => (theme = 'pastel')}>Pastel</button></li>
				<li><button on:click={() => (theme = 'winter')}>Winter</button></li>
			</ul>
		</div>
	</div>
</div>
