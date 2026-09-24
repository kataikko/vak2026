<script lang="ts">
	import Door from "./Door.svelte";
    import logo from '$lib/assets/logo.png';
    import videos from '$lib/videos.json';

    function check_day(date: string | Date): boolean {
        if (!import.meta.env.PROD) return true;

        const today = new Date();
        const todayKey = [today.getFullYear(), today.getMonth() + 1, today.getDate()]
            .map((value, index) => index === 0 ? String(value) : String(value).padStart(2, '0'))
            .join('-');
        const dateKey = typeof date === 'string'
            ? date.slice(0, 10)
            : [date.getFullYear(), date.getMonth() + 1, date.getDate()]
                .map((value, index) => index === 0 ? String(value) : String(value).padStart(2, '0'))
                .join('-');

        return dateKey <= todayKey;
    }

    function available_videos(): number {
        return videos.filter((video) => check_day(video.date)).length;
    }
</script>

<svelte:head>
    <title>
        VAK - Vincent's Adventskalender
    </title>
</svelte:head>

<div class="min-h-screen w-screen bg-primary text-quartiary">
    <header class="border-b border-primary/20 bg-secondary">
        <div class="flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
            <a href="/" class="flex shrink-0 items-center gap-2 text-quartiary">
                <img src={logo} alt="VAK" class="size-9 object-cover" />
                <span class="hidden font-mono text-lg font-bold tracking-tight sm:inline">VAK VIDEO</span>
            </a>
        </div>
    </header>

    <div class="mx-auto max-w-[1440px]">
        <main id="archive" class="min-w-0 px-4 py-6 sm:px-6 lg:px-10">
            <div class="mb-6 flex items-end justify-between border-b border-primary/20 pb-3">
                <div>
                    <p class="font-mono text-xs uppercase tracking-widest text-quartiary">VAK Video</p>
                    <h1 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Adventskalender 2026</h1>
                </div>
                <span class="font-mono text-xs text-quartiary/60">{available_videos()}/{videos.length} videos</span>
            </div>
            <div class="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {#each videos as video}
                    {#if check_day(video.date)}
                        <Door day={video.day} title={video.title} description={video.description} tags={video.tags} />
                    {/if}
                {/each}
            </div>
        </main>
    </div>
</div>