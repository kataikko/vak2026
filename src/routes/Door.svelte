<script lang="ts">
	let { day, title, description, tags, img }: { day: number; title: string; description: string; tags: string[]; img: string } = $props();
</script>

<a href={`/archive/${day}`} class="group block min-w-0">
	<article class="overflow-hidden border-2 border-quartiary bg-secondary shadow-xl">
		<div class="relative grid aspect-video place-items-center overflow-hidden bg-gradient-to-br from-tertiary via-secondary to-primary">
			<img src={img} alt="" class="absolute inset-0 size-full object-cover" />
			<div class="absolute bottom-2 right-2 border-2 border-quartiary bg-primary px-2 py-1 font-mono text-xs font-bold text-secondary">
				VAK #{day}
			</div>
		</div>

		<div class="flex gap-3 p-3">
			<div class="grid size-9 shrink-0 place-items-center border-2 border-quartiary bg-tertiary font-mono text-sm font-bold text-quartiary">
				{day}
			</div>
			<div class="min-w-0">
				<h2 class="line-clamp-2 font-semibold leading-tight text-quartiary">{title}</h2>
				<p class="mt-1 text-xs text-quartiary/70">VAK · Advent Calendar 2026</p>
				<p class="mt-2 line-clamp-2 text-sm leading-snug text-quartiary/80">{description}</p>
				<div class="mt-2 flex flex-wrap gap-1">
					{#each tags.slice(0, 3) as tag}
						<span class="border-2 border-quartiary bg-tertiary px-1.5 py-0.5 font-mono text-[0.65rem] text-quartiary">#{tag}</span>
					{/each}
				</div>
			</div>
		</div>
	</article>
</a>
