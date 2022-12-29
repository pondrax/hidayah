<script lang="ts">
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { intersect } from '$lib/util';
	import { lastRead } from '$lib/store';
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;
	$: header = data.header;
	$: categories = data.categories;
	$: list = data.list;

	let visibility = 15;
	let load = false;
	let query = '';

	$: if (load == true) {
		visibility += 15;
		visibility = Math.min(visibility, list.length);
	}
	const loadNext = (e: any) => {
		load = e.detail?.isIntersecting;
	};
	const setLastRead = (e: any) => {
		if (e.detail?.isIntersecting && e.target.id) {
			let id = e.target.id.replace('id-', '');
			let tag = '/' + header.category + '/' + header.no;

			$lastRead = Object.assign($lastRead, {
				[tag]: {
					id,
					no: header.no,
					title: header.title,
					subtitle: header.subtitle,
					time: new Date().getTime()
				}
			});
		}
	};

	onMount(async () => {
		if (browser) {
			query = location.search;
		}
		intersect();
	});

	let time = data.list.map(([id, aya]: any) => [aya.id, 0]);
	let activeID: string | undefined | null;
	let activeTxt: string;

	$: isActive = (id: string | number, word: { start: number; end: number }) => {
		return time[id] > word.start && (!word.end || time[id] < word.end);
	};
	const onAudioUpdate = (target: any, id: string) => {
		time[id] = target?.currentTime;
	};
	const onAudioWord = (target: any) => {
		activeTxt = target.dataset.txtid;
		// scrollTo(`[data-txt-el="${activeTxt}"]`);
	};
	const onAudioEnded = (target: any, id: string) => {
		const audios = document.querySelectorAll('audio');
		const current = [...audios].findIndex((x) => x == target);
		const nextAudio = audios[current + 1];
		if (nextAudio) {
			nextAudio.play();
			activeID = nextAudio.dataset.id;
			scrollTo('#id-' + nextAudio.dataset.id);
		} else {
			activeID = null;
		}
		time[id] = null;
	};
	// console.log(time);
	const scrollTo = (el: string) => {
		document.querySelector(el)?.scrollIntoView({ behavior: 'smooth' });
	};
	const play = (id: string) => {
		const el = document.querySelector(`audio[data-id="${id}"]`);
		if (el instanceof HTMLAudioElement) {
			if (activeID == id) {
				activeID = null;
				el.pause();
			} else {
				activeID = id;
				el.play();
			}
		}
	};

	const arabicNumber = (num: number | string) => {
		return ('' + num).replace(/[0-9]/g, function (t) {
			return '٠١٢٣٤٥٦٧٨٩'.slice(+t, +t + 1);
		});
	};

	const prev = (num: string) => {
		return Math.max(parseInt(num) - 1, 1);
	};
	const next = (num: string) => {
		return Math.min(parseInt(num) + 1, list.length + 1);
	};
	const submit = async (ev: any) => {
		ev.preventDefault();
		// ev.target.form.submit();
		const data = new FormData(ev.target.form);
		const params = new URLSearchParams(data as any);
		history.pushState({}, '', '?' + params.toString());
		query = '?' + params.toString();
		await invalidateAll();
	};
</script>

<!-- {JSON.stringify($lastRead)} -->
<div class="flex flex-col relative max-w-5xl m-auto h-screen">
	<div>
		<div class="flex flex-wrap md:flex-nowrap w-full top-0 z-10 bg-base-100 px-5">
			<a href="/home" class="mx-auto p-5">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="max-h-16 w-full"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					width="400"
					height="269.78557504873294"
					viewBox="0, 0, 400,269.78557504873294"
				>
					<g>
						<path
							d="M192.574 15.789 C 188.737 22.044,187.533 28.188,188.920 34.437 C 189.618 37.582,190.397 44.717,190.650 50.292 C 190.902 55.867,191.611 67.797,192.223 76.803 C 192.836 85.809,193.535 96.511,193.776 100.585 C 194.017 104.659,194.726 114.834,195.350 123.197 C 198.766 168.924,199.711 190.410,198.806 201.722 C 197.861 213.516,198.103 215.325,200.350 213.292 C 204.749 209.310,211.461 179.461,210.161 169.655 C 209.929 167.904,209.011 154.366,208.122 139.571 C 207.232 124.776,206.208 108.460,205.845 103.314 C 205.483 98.168,204.648 86.062,203.989 76.413 C 203.330 66.764,202.625 57.008,202.422 54.732 L 202.053 50.594 205.122 53.367 C 211.912 59.502,212.094 56.176,205.886 39.376 C 195.727 11.879,195.366 11.240,192.574 15.789 M156.197 35.283 C 155.857 35.819,154.760 38.187,153.761 40.546 C 149.937 49.571,149.905 48.414,154.215 57.163 C 163.335 75.678,167.089 98.103,163.825 114.569 C 162.938 119.045,162.381 122.875,162.588 123.082 C 162.794 123.288,162.963 123.047,162.963 122.547 C 162.963 122.047,163.685 121.637,164.568 121.637 C 165.624 121.637,165.987 121.971,165.628 122.612 C 165.328 123.148,165.622 123.060,166.282 122.417 C 170.020 118.774,174.662 100.674,174.654 89.778 C 174.638 68.707,160.843 27.977,156.197 35.283 M316.179 43.402 C 308.460 46.186,299.162 49.537,295.517 50.850 C 287.411 53.771,275.410 58.325,273.294 59.283 C 272.437 59.672,268.051 61.422,263.548 63.172 C 259.045 64.922,254.255 66.863,252.904 67.485 C 251.552 68.107,250.217 68.616,249.937 68.616 C 249.656 68.616,247.955 69.277,246.156 70.084 C 244.357 70.892,238.499 73.395,233.138 75.647 C 222.064 80.299,219.893 81.975,216.638 88.385 C 212.988 95.574,214.155 96.357,222.612 92.396 C 239.979 84.261,284.188 66.504,296.686 62.644 C 298.830 61.981,300.936 61.183,301.365 60.870 C 301.793 60.557,307.297 58.639,313.594 56.608 C 325.289 52.836,325.837 52.521,328.372 48.139 C 335.046 36.602,335.043 36.601,316.179 43.402 M92.459 71.111 C 90.918 73.384,88.852 76.214,87.868 77.401 L 86.080 79.558 83.391 77.112 C 73.509 68.120,71.846 67.418,69.731 71.345 C 68.923 72.846,68.055 74.074,67.803 74.074 C 67.550 74.074,66.581 75.432,65.648 77.092 C 64.715 78.751,63.422 80.549,62.775 81.086 C 60.479 82.991,61.641 84.762,69.060 90.662 C 77.879 97.674,78.017 97.633,85.860 85.585 C 86.124 85.180,89.228 87.161,92.757 89.987 C 100.705 96.352,100.270 96.382,105.971 89.084 C 110.874 82.807,111.674 80.286,109.357 78.416 C 108.606 77.810,105.712 75.442,102.924 73.153 C 100.136 70.864,97.272 68.538,96.559 67.985 C 95.425 67.105,94.909 67.498,92.459 71.111 M305.458 85.436 C 304.279 86.076,303.265 87.202,303.205 87.939 C 303.146 88.676,302.997 90.682,302.876 92.398 C 302.754 94.113,302.414 97.654,302.120 100.267 C 301.548 105.347,301.618 105.475,306.933 108.936 C 308.310 109.833,301.436 117.624,299.187 117.714 C 297.221 117.793,290.068 125.156,289.972 127.199 C 289.657 133.943,291.872 136.462,298.094 136.434 C 303.452 136.409,307.744 135.359,309.690 133.598 C 310.561 132.809,312.027 132.124,312.947 132.076 C 316.321 131.898,318.794 131.086,321.869 129.145 C 328.513 124.951,327.218 124.002,317.950 126.275 C 302.015 130.183,288.975 129.239,297.744 124.813 C 302.688 122.317,311.376 114.352,312.288 111.479 C 312.556 110.634,313.278 109.942,313.893 109.942 C 314.507 109.942,315.010 109.591,315.010 109.162 C 315.010 107.968,317.870 108.235,319.187 109.552 C 322.442 112.807,326.311 109.920,327.179 103.590 C 328.446 94.343,312.935 81.380,305.458 85.436 M129.825 86.531 C 123.415 88.179,119.575 90.989,105.295 104.483 C 99.623 109.844,94.720 114.328,94.400 114.448 C 94.081 114.568,92.697 112.232,91.326 109.257 C 87.428 100.800,86.024 100.317,84.247 106.823 C 81.725 116.057,81.108 120.018,81.875 122.036 C 82.302 123.159,82.651 124.380,82.651 124.749 C 82.651 125.775,65.901 138.810,55.992 145.496 C 37.107 158.239,32.420 162.183,36.162 162.183 C 41.747 162.183,75.147 142.750,84.071 134.308 C 85.634 132.829,86.321 133.115,87.189 135.605 C 87.952 137.793,87.736 138.097,81.231 143.987 C 61.396 161.945,55.661 171.175,54.800 186.529 C 54.307 195.312,55.128 197.382,59.897 199.374 C 68.877 203.126,91.103 194.007,95.626 184.715 C 96.544 182.830,97.838 180.058,98.500 178.558 L 99.705 175.828 99.755 178.038 C 99.982 188.102,107.596 205.967,114.676 213.046 C 135.890 234.260,159.118 217.452,155.134 183.769 C 154.009 174.254,147.281 161.035,144.483 162.840 C 140.136 165.644,139.466 178.144,143.331 184.321 C 148.468 192.533,149.267 195.316,147.262 198.028 C 142.047 205.082,127.268 203.400,119.841 194.907 C 112.033 185.979,111.342 184.152,105.244 156.335 C 104.398 152.476,103.206 147.047,102.596 144.271 L 101.486 139.225 110.197 130.236 C 131.326 108.435,140.385 92.613,134.746 87.360 C 133.807 86.485,132.842 85.806,132.602 85.850 C 132.361 85.894,131.111 86.200,129.825 86.531 M240.633 95.765 C 240.417 96.116,239.718 98.835,239.081 101.808 C 236.624 113.277,236.447 112.003,242.345 125.383 C 253.936 151.677,259.109 169.561,259.209 183.684 L 259.259 190.760 253.413 197.719 C 247.676 204.548,239.670 212.550,237.145 213.978 C 236.443 214.376,235.517 215.122,235.088 215.636 C 227.360 224.900,200.171 236.932,185.575 237.547 C 167.297 238.318,164.682 230.640,172.425 198.930 C 176.159 183.637,173.362 184.081,168.148 199.610 C 158.333 228.844,161.093 250.331,175.439 256.353 C 196.347 265.129,252.336 229.439,262.274 201.000 L 264.022 195.997 266.107 208.315 C 269.956 231.060,274.915 237.738,289.161 239.363 C 300.209 240.623,309.905 237.874,321.565 230.174 L 326.950 226.618 332.091 227.938 C 358.375 234.685,372.119 230.451,376.116 214.375 C 380.329 197.428,375.158 186.274,358.920 177.284 C 353.659 174.372,348.650 170.940,345.222 167.898 L 342.296 165.302 344.573 165.302 C 353.302 165.302,350.643 161.820,336.348 154.531 C 323.323 147.890,323.412 147.856,322.368 159.922 C 321.836 166.063,321.612 166.686,318.780 169.913 C 308.958 181.100,303.915 200.916,307.903 212.646 C 308.810 215.313,309.552 217.647,309.552 217.833 C 309.552 218.752,303.777 220.021,297.856 220.403 C 283.817 221.308,279.213 217.183,276.107 200.914 C 271.829 178.511,270.365 170.718,269.414 165.302 C 264.390 136.692,254.487 109.516,244.944 98.148 C 242.411 95.132,241.378 94.560,240.633 95.765 M311.457 96.860 C 312.917 98.945,313.080 103.665,311.696 103.796 C 309.573 103.997,308.348 103.474,306.648 101.640 C 304.445 99.263,304.440 99.353,306.936 97.039 C 309.471 94.690,309.925 94.672,311.457 96.860 M126.617 99.220 C 125.349 101.697,100.061 127.875,98.938 127.875 C 96.760 127.875,97.442 122.840,99.930 120.553 C 126.320 96.286,129.368 93.849,126.617 99.220 M320.387 100.222 C 323.384 103.635,323.382 103.706,320.273 103.692 C 316.720 103.675,315.929 102.928,316.367 100.000 C 316.847 96.791,317.401 96.821,320.387 100.222 M93.310 156.785 C 95.615 166.792,95.567 167.865,92.666 171.169 C 85.941 178.828,63.158 184.236,63.158 178.173 C 63.158 175.137,88.613 148.483,90.838 149.189 C 91.267 149.325,92.380 152.743,93.310 156.785 M333.279 179.922 C 345.634 196.934,331.261 215.597,316.107 202.220 C 310.694 197.443,312.286 190.364,320.784 181.419 C 327.050 174.823,329.374 174.545,333.279 179.922 M362.038 199.040 C 378.346 209.346,369.518 216.609,346.761 211.609 L 341.042 210.352 342.412 206.293 C 343.165 204.061,344.369 199.248,345.086 195.598 L 346.390 188.961 351.272 192.141 C 353.956 193.890,358.801 196.995,362.038 199.040 M140.950 231.834 C 139.779 233.689,138.200 235.939,137.441 236.835 C 136.683 237.731,135.712 239.001,135.283 239.657 C 134.634 240.648,133.336 239.860,127.572 234.972 L 120.642 229.095 118.821 231.312 C 114.728 236.294,109.825 244.187,110.207 245.180 C 110.431 245.764,113.182 248.279,116.321 250.769 C 119.459 253.259,122.401 255.788,122.859 256.388 C 124.120 258.045,126.457 257.197,128.344 254.397 C 129.275 253.015,131.082 250.582,132.359 248.990 L 134.681 246.095 138.101 248.771 C 139.982 250.242,142.358 252.205,143.381 253.133 C 148.510 257.785,148.556 257.769,154.982 249.027 C 160.268 241.837,160.326 242.079,151.566 234.741 C 142.761 227.365,143.624 227.601,140.950 231.834 "
							stroke="none"
							fill="hsl(var(--bc))"
							fill-rule="evenodd"
						/>
					</g>
				</svg>
				<h2 class="w-full text-center whitespace-nowrap opacity-80">{PUBLIC_APP_NAME}</h2>
			</a>
			<div class="w-full md:mt-16">
				<input
					type="text"
					placeholder="Apa yang ingin dibaca hari ini"
					class="input input-bordered w-full"
				/>
			</div>
		</div>
    <div class="px-5">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <div tabindex="0" class="collapse collapse-arrow md:-my-5">
        <div class="collapse-title text-lg font-medium">
          {header.no} : {header.title}
        </div>
        <div class="collapse-content">
          <p>{@html header.description}</p>
          <br/>
        </div>
      </div>
		</div>
	</div>
	<div class="flex justify-between px-6 z-10">
		<!-- {JSON.stringify(categories[header.no-1])} -->
		<div class="btn-group">
			<a
				href={'/quran/' + prev(header.no) + query}
				aria-label="Prev"
				class="btn btn-sm btn-ghost gap-2"
			>
				<i class="ri-arrow-left-s-line" />
				{categories[prev(header.no) - 1]}
			</a>
			<a
				href={'/quran/' + next(header.no) + query}
				aria-label="Next"
				class="btn btn-sm btn-ghost gap-2"
			>
				{categories[next(header.no) - 1]}<i class="ri-arrow-right-s-line" />
			</a>
		</div>

		<form method="get">
			<select name="reciter" class="select select-sm select-ghost" on:change={submit}>
				{#each Object.entries(header.reciterList) as [key]}
					<option value={key} selected={key == header.reciter}>Reciter: {key}</option>
				{/each}
			</select>
		</form>
	</div>
	<div class="overflow-y-scroll overflow-x-hidden h-full">
		<div class="grid gap-5 p-5 pb-20">
			<div class="text-center">
				<div class="arabic text-2xl text-secondary">
					أَعُوْذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيْمِ
				</div>
				<!-- <div class="arabic text-2xl text-secondary">
          بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
        </div> -->
			</div>
			{#each data.list as [id, aya]}
				{#if id <= visibility}
					<div
						id={'id-' + aya.id}
						class="flex flex-col gap-3 p-5 w-full border-b-2"
						data-intersect
						on:intersect={setLastRead}
					>
						<div class="flex flex-wrap gap-5 -mb-5">
							<div class="text-xl">
								{header.no} : {id}
							</div>
							<label class="swap text-2xl">
								<input
									type="checkbox"
									checked={activeID === aya.id}
									on:click={() => play(aya.id)}
									aria-label="Audio Player"
								/>
								<div class="swap-on ri-pause-line" />
								<div class="swap-off ri-play-line" />
							</label>
							<!-- {JSON.stringify(header.reciterList)} -->
							<audio
								data-id={aya.id}
								src={header.reciterUrl + aya.id + '.mp3'}
								preload="none"
								on:timeupdate={({ target }) => onAudioUpdate(target, aya.id)}
								on:ended={({ target }) => onAudioEnded(target, aya.id)}
							/>
						</div>

						<div class="flex flex-row-reverse	flex-wrap gap-5">
							{#each aya.word as word}
								<div
									class="tooltip text-center"
									class:tooltip-open={isActive(aya.id, word)}
									data-tip={word.locale}
								>
									<div
										class="arabic text-4xl hover:text-secondary"
										class:text-secondary={isActive(aya.id, word)}
									>
										{word.ar}
									</div>
								</div>
							{/each}
							<div class="arabic text-4xl text-primary">
								{arabicNumber(id)}
							</div>
						</div>
						<div class="flex flex-wrap gap-1">
							{#each aya.word as word}
								<div class="text-md opacity-80" class:text-accent={isActive(aya.id, word)}>
									{word.tl}
								</div>
							{/each}
						</div>

						<div>
							{#each aya.aya.split('.') as txt, txtId}
								{#if txt.length > 0}
									<audio
										data-id={aya.id}
										data-txtid={aya.id + txtId}
										src={'/api/tts?q=' + txt}
										preload="none"
										on:timeupdate={({ target }) => onAudioWord(target)}
										on:ended={({ target }) => onAudioEnded(target, aya.id)}
									/>
									<span
										data-txt-el={aya.id + txtId}
										class="hover:text-error"
										class:font-bold={activeTxt == String(aya.id + txtId)}
									>
										{txt}.
									</span>
								{/if}
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		</div>
		<div data-intersect on:intersect={loadNext} class="h-20" />
	</div>
</div>
