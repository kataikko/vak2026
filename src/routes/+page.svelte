<script lang="ts">
	import Door from "./Door.svelte";
    import logo from '$lib/assets/logo.png';
    import videos from '$lib/videos.json';
</script>

<svelte:head>
    <title>
        VAK - Videos
    </title>
</svelte:head>

<div class="min-h-screen w-screen bg-primary text-quartiary">
    <header class="border-b border-primary/20 bg-secondary">
        <div class="flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
            <button type="button" class="grid size-9 place-items-center text-2xl text-quartiary lg:hidden" aria-label="Open navigation">☰</button>
            <a href="/" class="flex shrink-0 items-center gap-2 text-quartiary">
                <img src={logo} alt="VAK" class="size-9 object-cover" />
                <span class="hidden font-mono text-lg font-bold tracking-tight sm:inline">VAK VIDEO</span>
            </a>
            <span class="hidden font-mono text-xs text-quartiary/70 md:block">ARCHIVE 2026</span>
        </div>
    </header>

    <div class="mx-auto max-w-[1440px]">
        <main id="archive" class="min-w-0 px-4 py-6 sm:px-6 lg:px-10">
            <div class="mb-6 flex items-end justify-between border-b border-primary/20 pb-3">
                <div>
                    <p class="font-mono text-xs uppercase tracking-widest text-quartiary">VAK Video</p>
                    <h1 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Adventskalender 2026</h1>
                </div>
                <span class="font-mono text-xs text-quartiary/60">{videos.length} videos</span>
            </div>
            <div class="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {#each videos as video}
                    <Door day={video.day} description={video.description} tags={video.tags} />
                {/each}
            </div>
        </main>
    </div>
</div>