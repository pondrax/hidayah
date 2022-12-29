<script lang="ts">
	import { browser } from '$app/environment';

	if (browser) {
		if (localStorage.home) {
			location.href = '/home';
		}
	}
	const start = () => {
		localStorage.home = 1;
	};
</script>

<div class="carousel w-full h-screen">
	<div id="item1" class="carousel-item w-full p-6">
		<img src="https://placeimg.com/300/600" alt="img" class="mask mask-hexagon" />
	</div>
	<div id="item2" class="carousel-item w-full">
		<img src="https://placeimg.com/300/600/design" alt="img" class="w-full" />
	</div>
	<div id="item3" class="carousel-item w-full">
		<img src="https://placeimg.com/300/600/arch" alt="img" class="w-full" />
	</div>
</div>
<div class="flex justify-center w-full py-2 gap-2 -mt-16 relative z-30">
	<a href="#item1" class="btn btn-xs btn-circle">&nbsp;</a>
	<a href="#item2" class="btn btn-xs btn-circle">&nbsp;</a>
	<a href="#item3" class="btn btn-xs btn-circle">&nbsp;</a>
	<a href="/home" class="btn btn-xs" on:click={start}>Start</a>
</div>
