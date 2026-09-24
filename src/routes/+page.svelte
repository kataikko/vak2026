<script lang="ts">
	import Door from "./Door.svelte";
    import logo from '$lib/assets/logo.png';
    import videos from '$lib/videos.json';
	import Header from "./Header.svelte";

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
    <Header calendar={true}/>

    <div class="mx-auto max-w-[1440px]">
        <main id="archive" class="min-w-0 px-4 py-6 sm:px-6 lg:px-10">
            <div class="mb-6 flex items-end justify-between border-b-2 border-quartiary pb-3">
                <h1 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Adventskalender 2026</h1>
                <span class="font-mono text-xs text-quartiary/60">{available_videos()}/{videos.length} videos</span>
            </div>
            <div class="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {#each videos as video}
                    {#if check_day(video.date)}
                        <Door day={video.day} title={video.title} description={video.description} tags={video.tags} img={video.poster} />
                    {/if}
                {/each}
            </div>
        </main>
    </div>
</div>