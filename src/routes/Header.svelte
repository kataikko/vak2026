<script lang="ts">
    import logo from '$lib/assets/logo.png';
    let {calendar} = $props();
</script>

{#if !calendar}
    <header class="relative flex min-h-16 items-center border-b-2 border-primary bg-secondary px-4 py-3 shadow-sm md:px-8">
        <a class="grid size-10 place-items-center bg-tertiary text-quartiary transition hover:bg-primary hover:text-secondary" href="/" aria-label="Back to VAK archive">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
            </svg>
        </a>
        <a href="/" class="absolute left-1/2 -translate-x-1/2" aria-label="VAK home">
            <img src={logo} alt="VAK" class="h-10 w-auto" />
        </a>
    </header>
{/if}