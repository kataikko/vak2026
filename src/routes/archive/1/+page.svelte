<script lang="ts">
	import Header from "../../Header.svelte";
	import Player from "../../Player.svelte";
    import videos from "$lib/videos.json";

    const video = videos.find((entry) => entry.day === 1)!;
</script>

<div class="min-h-screen w-screen overflow-x-hidden bg-primary">
    <Header calendar={false}/>
    <main class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1440px] items-center justify-center p-4 sm:p-8 lg:p-12">
        <div class="w-full max-w-[54rem]">
            <Player source={video.source} title={video.title} description={video.description} tags={video.tags}></Player>
        </div>
    </main>
</div>