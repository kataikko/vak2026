<script lang="ts">
	let { day, description, tags }: { day: number; description: string; tags: string[] } = $props();
</script>

<a href={`/archive/${day}`} class="group block min-w-0">
	<article class="overflow-hidden border border-primary/30 bg-secondary shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-xl group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-tertiary">
		<div class="relative grid aspect-video place-items-center overflow-hidden bg-gradient-to-br from-tertiary via-secondary to-primary">
			<div class="absolute -right-4 -top-8 font-mono text-[10rem] font-black leading-none text-secondary/40 transition duration-300 group-hover:scale-110">{day}</div>
			<div class="relative border-2 border-primary bg-secondary px-5 py-3 text-center shadow-xl">
				<p class="font-mono text-xs font-bold uppercase tracking-[0.3em] text-quartiary">VAK Video</p>
				<p class="mt-1 text-3xl font-black text-quartiary">#{day}</p>
			</div>
			<div class="absolute bottom-2 right-2 bg-primary px-2 py-1 font-mono text-xs font-bold text-secondary">
				VAK #{day}
			</div>
		</div>

		<div class="flex gap-3 p-3">
			<div class="grid size-9 shrink-0 place-items-center border-2 border-primary bg-tertiary font-mono text-sm font-bold text-quartiary">
				{day}
			</div>
			<div class="min-w-0">
				<h2 class="line-clamp-2 font-semibold leading-tight text-quartiary">
					VAK Video Adventskalender: Türchen {day}
				</h2>
				<p class="mt-1 text-xs text-quartiary/70">VAK Video · Archive 2026</p>
				<p class="mt-2 line-clamp-2 text-sm leading-snug text-quartiary/80">{description}</p>
				<div class="mt-2 flex flex-wrap gap-1">
					{#each tags.slice(0, 3) as tag}
						<span class="border border-primary/30 bg-tertiary px-1.5 py-0.5 font-mono text-[0.65rem] text-quartiary">#{tag}</span>
					{/each}
				</div>
			</div>
		</div>
	</article>
</a>
