<script lang="ts">
	import '@videojs/html/video/player';
	import '@videojs/html/ui/container';
	import '@videojs/html/ui/controls';
	import '@videojs/html/ui/controls-backdrop';
	import '@videojs/html/ui/controls-content';
	import '@videojs/html/ui/controls-group';
	import '@videojs/html/ui/fullscreen-button';
	import '@videojs/html/ui/mute-button';
	import '@videojs/html/ui/slider-buffer';
	import '@videojs/html/ui/slider-fill';
	import '@videojs/html/ui/slider-thumb';
	import '@videojs/html/ui/slider-track';
	import '@videojs/html/ui/time-slider';
	import '@videojs/html/ui/volume-slider';
	import '@videojs/html/media/youtube-video';
	let {
		source,
		audio,
		poster,
		title,
		description,
		tags = []
	}: {
		source: string;
		audio: string;
		poster?: string;
		title?: string;
		description?: string;
		tags?: string[];
	} = $props();

	import type { VideoPlayerElement } from '@videojs/html/video';
	import { onMount } from 'svelte';

	let player: VideoPlayerElement;
	let paused = $state(true);
	let muted = $state(false);
	let audioOnly = $state(false);
	let audioTime = $state(0);
	let audioElement = $state<HTMLAudioElement>();
	let audioPlayPending = $state(false);
	let posterFailed = $state(false);
	const videoId = $derived(
		source.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/)?.[1] ??
			(/^[\w-]{11}$/.test(source) ? source : '')
	);
	const fallbackPosterUrl = $derived(
		videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
	);
	const posterUrl = $derived(poster && !posterFailed ? poster : fallbackPosterUrl);

	async function playAudio() {
		if (!audioElement || audioPlayPending) return;
		audioPlayPending = true;
		try {
			await audioElement.play();
		} catch (error) {
			console.error('Unable to start audio playback', error);
		} finally {
			audioPlayPending = false;
		}
	}

	async function toggleVideoPlayback() {
		if (player.store.paused) {
			try {
				await player.store.play();
			} catch (error) {
				console.error('Unable to start video playback', error);
			}
		} else {
			player.store.pause();
		}
	}

	async function switchAudioMode() {
		if (!audioElement) return;
		const position = audioOnly ? audioTime : player.store.currentTime;
		const shouldPlay = !paused;

		if (audioOnly) {
			audioElement.pause();
			audioElement.currentTime = position;
			await player.store.seek(position);
			audioOnly = false;
			if (shouldPlay) await player.store.play();
		} else {
			player.store.pause();
			audioElement.currentTime = position;
			audioElement.volume = muted ? 0 : 1;
			audioOnly = true;
			if (shouldPlay) await playAudio();
		}
	}

	onMount(() => {
		const element = audioElement;
		if (!element) return;
		const sync = () => {
			if (!audioOnly) {
				paused = player.store.paused;
				muted = player.store.muted;
			}
		};
		sync();
		const unsubscribe = player.store.subscribe(sync);
		const updateAudio = () => {
			audioTime = element.currentTime;
			paused = element.paused;
		};
		element.addEventListener('timeupdate', updateAudio);
		element.addEventListener('play', updateAudio);
		element.addEventListener('pause', updateAudio);
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: title ?? 'VAK',
				artist: 'Vincent',
				album: 'VAK 2026',
				artwork: posterUrl ? [{ src: posterUrl }] : undefined
			});
			navigator.mediaSession.setActionHandler('play', () => void playAudio());
			navigator.mediaSession.setActionHandler('pause', () => element.pause());
			navigator.mediaSession.setActionHandler('seekbackward', () => {
				element.currentTime = Math.max(0, element.currentTime - 10);
			});
			navigator.mediaSession.setActionHandler('seekforward', () => {
				element.currentTime = Math.min(element.duration, element.currentTime + 10);
			});
		}
		return () => {
			unsubscribe();
			element.removeEventListener('timeupdate', updateAudio);
			element.removeEventListener('play', updateAudio);
			element.removeEventListener('pause', updateAudio);
		};
	});
</script>

<div class="flex h-full w-full items-center justify-center bg-primary p-4">
	<div class="h-fit w-full overflow-hidden bg-secondary shadow-2xl shadow-primary/50">
		<video-player bind:this={player} class="block min-h-32 w-full bg-tertiary p-3">
			<media-container class="relative block aspect-video w-full overflow-hidden bg-primary">
				<audio bind:this={audioElement} src={audio} preload="metadata" class="hidden"></audio>
				<youtube-video src={source} playsinline preload="metadata" class="block size-full">
					<track
						kind="captions"
						srclang="de"
						label="Keine gesprochenen Inhalte"
						src="data:text/vtt,WEBVTT%0A"
					/>
				</youtube-video>
				{#if paused}
					<div class="pointer-events-none absolute inset-0 z-20 bg-primary">
						{#if posterUrl}
							<img
								src={posterUrl}
								alt=""
								class="absolute inset-0 size-full object-cover"
								onerror={() => (posterFailed = true)}
							/>
						{/if}
					</div>
				{/if}
				{#if audioOnly}
					<div
						class="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-primary px-6 text-center text-quartiary"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="size-6"
						>
							<path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
							<path
								d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z"
							/>
						</svg>
						<span class="font-mono text-sm tracking-widest">Audio Only</span>
					</div>
				{/if}
			</media-container>
			<media-controls class="block bg-secondary">
				<media-controls-content class="block">
					<media-controls-group
						class="flex w-full items-center gap-2 border-2 border-quartiary bg-secondary/95 p-2 shadow-lg shadow-primary/50"
						aria-label="Video controls"
					>
						{#if audioOnly}
							<button
								type="button"
								class="grid size-9 shrink-0 cursor-pointer place-items-center border-2 border-quartiary bg-tertiary text-xl leading-none text-quartiary"
								aria-label={paused ? 'Play' : 'Pause'}
								onclick={() => (paused ? void playAudio() : audioElement?.pause())}
							>
								{#if paused}
									<span aria-hidden="true">▶</span>
								{:else}
									<span aria-hidden="true">Ⅱ</span>
								{/if}
							</button>
						{:else}
							<button
								type="button"
								class="grid size-9 shrink-0 cursor-pointer place-items-center border-2 border-quartiary bg-tertiary text-xl leading-none text-quartiary"
								aria-label={paused ? 'Play' : 'Pause'}
								onclick={() => void toggleVideoPlayback()}
							>
								{#if paused}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										class="size-6"
									>
										<path
											fill-rule="evenodd"
											d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
											clip-rule="evenodd"
										/>
									</svg>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										class="size-6"
									>
										<path
											fill-rule="evenodd"
											d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
											clip-rule="evenodd"
										/>
									</svg>
								{/if}
							</button>
						{/if}
						{#if audioOnly}
							<input
								type="range"
								min="0"
								max={audioElement?.duration || 0}
								step="0.1"
								value={audioTime}
								aria-label="Audio position"
								class="h-6 min-w-0 flex-1 accent-primary"
								oninput={(event) => {
									if (audioElement) {
										audioElement.currentTime = Number(event.currentTarget.value);
										audioTime = audioElement.currentTime;
									}
								}}
							/>
						{:else}
							<media-time-slider
								class="relative flex h-6 min-w-0 flex-1 cursor-pointer items-center border-2 border-quartiary bg-secondary px-2"
							>
								<media-slider-track class="absolute inset-0 block cursor-pointer">
									<media-slider-buffer
										class="absolute inset-y-0 left-0 block w-[var(--media-slider-buffer)] bg-tertiary/70"
									></media-slider-buffer>
									<media-slider-fill
										class="absolute inset-y-0 left-0 block w-[var(--media-slider-fill)] bg-primary"
									></media-slider-fill>
								</media-slider-track>
								<media-slider-thumb
									class="absolute top-1/2 left-[var(--media-slider-fill)] block size-4 -translate-y-1/2 cursor-grab active:cursor-grabbing"
								></media-slider-thumb>
							</media-time-slider>
						{/if}
						<media-mute-button
							class="grid size-9 shrink-0 cursor-pointer place-items-center border-2 border-quartiary bg-tertiary text-lg leading-none text-quartiary"
							aria-label={muted ? 'Unmute' : 'Mute'}
						>
							{#if muted}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="size-6"
								>
									<path
										d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 0 0-1.06-1.06l-1.72 1.72-1.72-1.72Z"
									/>
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="size-6"
								>
									<path
										d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z"
									/>
									<path
										d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z"
									/>
								</svg>
							{/if}
						</media-mute-button>
						<media-volume-slider
							class="hidden w-20 shrink-0 cursor-pointer px-2 md:block"
							orientation="horizontal"
						>
							<media-slider-track
								class="relative block h-2 cursor-pointer border border-quartiary bg-tertiary"
							>
								<media-slider-fill
									class="absolute inset-y-0 left-0 block w-[var(--media-slider-fill)] bg-quartiary"
								></media-slider-fill>
								<media-slider-thumb
									class="absolute top-1/2 left-[var(--media-slider-fill)] block size-3 -translate-y-1/2 cursor-grab border border-quartiary bg-secondary active:cursor-grabbing"
								></media-slider-thumb>
							</media-slider-track>
						</media-volume-slider>
						<button
							type="button"
							class="grid size-9 shrink-0 cursor-pointer place-items-center border-2 border-quartiary bg-tertiary text-quartiary"
							aria-label={audioOnly ? 'Video anzeigen' : 'Nur Audio hören'}
							aria-pressed={audioOnly}
							title={audioOnly ? 'Video anzeigen' : 'Nur Audio hören'}
							onclick={() => void switchAudioMode()}
						>
							{#if audioOnly}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="size-6"
								>
									<path
										d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z"
									/>
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="size-6"
								>
									<path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
									<path
										d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z"
									/>
								</svg>
							{/if}
						</button>
						{#if !audioOnly}
							<media-fullscreen-button
								class="grid size-9 shrink-0 cursor-pointer place-items-center border-2 border-quartiary bg-tertiary text-lg leading-none text-quartiary"
								aria-label="Fullscreen"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									class="size-5"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m11.25-5.25v4.5m0-4.5h-4.5m4.5 0L15 9m-11.25 11.25v-4.5m0 4.5h4.5m-4.5 0L9 15m11.25 5.25v-4.5m0 4.5h-4.5m4.5 0L15 15"
									/>
								</svg>
							</media-fullscreen-button>
						{/if}
					</media-controls-group>
				</media-controls-content>
			</media-controls>
		</video-player>
		{#if title || description}
			<div
				class="border-t-2 border-quartiary bg-secondary px-4 pt-3 pb-4 text-sm leading-relaxed text-quartiary"
			>
				{#if title}
					<h1 class="mb-2 text-lg leading-tight font-bold">{title}</h1>
				{/if}
				{#if description}<p>{description}</p>{/if}
				{#if tags.length}
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each tags as tag}
							<span
								class="border border-quartiary/40 bg-tertiary px-2 py-1 font-mono text-xs text-quartiary"
								>#{tag}</span
							>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
