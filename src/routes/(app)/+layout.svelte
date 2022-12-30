<script lang="ts">
	const back = () => {
		history.back();
	};
</script>

<div>
	<slot />

	<div class="btm-nav z-10">
		<a href="/bookmark" aria-label="Bookmark">
			<i class="ri-bookmark-line" />
		</a>
		<a href="/home" class="active" aria-label="Home">
			<i class="ri-home-line" />
		</a>
		<button on:click={back} aria-label="Back">
			<i class="ri-arrow-left-line" />
		</button>
	</div>
</div>
