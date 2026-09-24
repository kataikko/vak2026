<script lang="ts">
    let {
        paused = $bindable(), 
        time = $bindable(), 
        duration,
        format_func,
        light,
        bar = $bindable<HTMLElement>()
    } = $props();

    let left = $derived.by(() => {
        if (bar) {
            return bar.getBoundingClientRect().left
        } else {
            return 0
        }
    });

    let width = $state(0)

    let indicator = $derived((width) * (time / duration) - 10)

    function seek(e: PointerEvent) {
        let p = (e.clientX - left) / width;
        if (p < 0) p = 0;
        if (p > 1) p = 1;

        time = p * duration;
    }

    function seekAction(e: PointerEvent) {
        seek(e);

        window.addEventListener('pointermove', seek);

        window.addEventListener('pointerup', () => {
            window.removeEventListener('pointermove', seek);
        }, {
            once: true
        });

    }

    function play() {
        paused = !paused
    }

    function rewind() {
        time = (time <= 5) ? 0 : time - 5
    }

    function skip() {
        time = (time >= duration - 5) ? time = duration : time + 5
    }
</script>

<div class="w-full h-full px-5 flex justify-center">
    <div id="controls" class="flex self-end">
        <button onclick={rewind} id="rewind" class="{light ? "fill-quartiary": "fill-primary"} w-8">
            <div class="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M88 256L232 256C241.7 256 250.5 250.2 254.2 241.2C257.9 232.2 255.9 221.9 249 215L202.3 168.3C277.6 109.7 386.6 115 455.8 184.2C530.8 259.2 530.8 380.7 455.8 455.7C380.8 530.7 259.3 530.7 184.3 455.7C174.1 445.5 165.3 434.4 157.9 422.7C148.4 407.8 128.6 403.4 113.7 412.9C98.8 422.4 94.4 442.2 103.9 457.1C113.7 472.7 125.4 487.5 139 501C239 601 401 601 501 501C601 401 601 239 501 139C406.8 44.7 257.3 39.3 156.7 122.8L105 71C98.1 64.2 87.8 62.1 78.8 65.8C69.8 69.5 64 78.3 64 88L64 232C64 245.3 74.7 256 88 256z"/></svg>
            </div>
        </button>
        <button onclick={play} id="play" class="{light ? "fill-quartiary": "fill-primary"} w-10">
            {#if !paused}
                <div class="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z"/></svg>
                </div>
            {:else}
                <div class="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"/></svg>
                </div>
            {/if}
        </button>
        <button onclick={skip} id="skip" class="{light ? "fill-quartiary": "fill-primary"} w-8">
            <div class="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M552 256L408 256C398.3 256 389.5 250.2 385.8 241.2C382.1 232.2 384.1 221.9 391 215L437.7 168.3C362.4 109.7 253.4 115 184.2 184.2C109.2 259.2 109.2 380.7 184.2 455.7C259.2 530.7 380.7 530.7 455.7 455.7C463.9 447.5 471.2 438.8 477.6 429.6C487.7 415.1 507.7 411.6 522.2 421.7C536.7 431.8 540.2 451.8 530.1 466.3C521.6 478.5 511.9 490.1 501 501C401 601 238.9 601 139 501C39.1 401 39 239 139 139C233.3 44.7 382.7 39.4 483.3 122.8L535 71C541.9 64.1 552.2 62.1 561.2 65.8C570.2 69.5 576 78.3 576 88L576 232C576 245.3 565.3 256 552 256z"/></svg>
            </div>
        </button>
    </div>
</div>
<div class="relative mx-5 h-full">
    <div class="w-full flex justify-between pb-2">
        <div>
            <p class="{light ? "text-quartiary": "text-primary"}">{format_func(time)}</p>
        </div>
        <div>
            <p class="{light ? "text-quartiary": "text-primary"}">{format_func(duration)}</p>
        </div>
    </div>
    <div
        bind:clientWidth={width}
        class="w-full h-1/3 relative"
            onpointerdown={e => seekAction(e)}
        >
        <hr bind:this={bar} class="{light ? "text-quartiary": "text-primary"} w-full absolute" />
        <div id="indicator" style="--indicator-position: {indicator}px" class="{light ? "fill-quartiary": "fill-primary"} w-5 absolute top-[-10px] left-(--indicator-position) cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320z"/></svg>
        </div>
    </div>
</div>