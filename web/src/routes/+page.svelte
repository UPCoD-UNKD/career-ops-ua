<script lang="ts">
	import { onMount } from 'svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	import StateBar from '$lib/components/StateBar.svelte';
	import StatsBanner from '$lib/components/StatsBanner.svelte';
	import PipelineList from '$lib/components/PipelineList.svelte';
	import PipelineListCompact from '$lib/components/PipelineListCompact.svelte';
	import ReportPanel from '$lib/components/ReportPanel.svelte';
	import FileEditor from '$lib/components/FileEditor.svelte';
	import ChatDock from '$lib/components/ChatDock.svelte';
	import Keybinds from '$lib/components/Keybinds.svelte';

	import { fetchOffers, fetchFiles } from '$lib/api';
	import {
		offers, meta, states, files,
		activeId, pipeMode, dockOpen, view
	} from '$lib/stores';

	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			const [offersRes, filesRes] = await Promise.all([
				fetchOffers(),
				fetchFiles().catch(() => [])
			]);
			meta.set(offersRes.meta);
			states.set(offersRes.states);
			offers.set(offersRes.offers);
			files.set(filesRes);

			// Set first offer as active
			if (offersRes.offers.length > 0 && !window.location.hash) {
				activeId.set(offersRes.offers[0].n);
			}

			// Restore from hash
			const hash = window.location.hash;
			const m = hash.match(/^#offer\/(\d+)$/);
			if (m) activeId.set(parseInt(m[1], 10));
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load data';
		} finally {
			loading = false;
		}
	});

	// Sync active offer to URL hash
	$effect(() => {
		const id = $activeId;
		if (id != null) {
			history.replaceState(null, '', `#offer/${id}`);
		}
	});

	const activeOffer = $derived(() => $offers.find(o => o.n === $activeId) ?? null);

	// Pipeline panel style based on mode
	function pipeStyle(mode: string): string {
		switch (mode) {
			case 'full':    return 'flex:1 1 60%;transition:flex 180ms ease,max-width 180ms ease;';
			case 'compact': return 'flex:0 0 240px;max-width:240px;transition:flex 180ms ease,max-width 180ms ease;';
			default:        return 'flex:0 0 28px;max-width:28px;transition:flex 180ms ease,max-width 180ms ease;';
		}
	}
</script>

<div class="app">
	<!-- TopBar -->
	<TopBar meta={$meta} />

	<!-- Stats banner (Layout B only) -->
	<StatsBanner offers={$offers} meta={$meta} />

	<!-- State tabs -->
	<StateBar states={$states} />

	<!-- Main content area -->
	<div style="display:flex;flex:1 1 auto;min-height:0;overflow:hidden">

		{#if $pipeMode === 'hidden'}
			<!-- Pipeline hidden: show vertical tab stub -->
			<button
				onclick={() => pipeMode.set('compact')}
				title="Show pipeline (⌘\\)"
				style="flex:0 0 28px;writing-mode:vertical-rl;text-orientation:mixed;background:var(--bg-2);border:none;border-right:1px solid var(--line);color:var(--fg-2);font-family:var(--mono);font-size:11px;letter-spacing:.12em;cursor:pointer;padding:12px 0;text-transform:uppercase"
			>
				▸ PIPELINE · {$offers.length}
			</button>
		{:else}
			<!-- Pipeline panel -->
			<div class="panel" style={pipeStyle($pipeMode)}>
				<div class="panel-header">
					<span class="title">Pipeline</span>
					{#if $pipeMode === 'full'}
						<span style="color:var(--fg-3);font-size:11px">· {$offers.length} roles · grouped</span>
					{/if}
					<div class="right">
						{#if $pipeMode === 'full'}
							<button
								class="icon-btn {$view === 'report' ? 'primary' : ''}"
								onclick={() => view.set('report')}
								title="Report view"
							>✎</button>
							<button
								class="icon-btn {$view === 'files' ? 'primary' : ''}"
								onclick={() => view.set('files')}
								title="Files view"
							>⟦⟧</button>
							<span class="divider-v" style="height:16px;margin:0 4px"></span>
						{/if}
						<button
							class="icon-btn"
							onclick={() => pipeMode.update(m => m === 'full' ? 'compact' : 'full')}
							title="Toggle compact (⌘\\)"
						>{$pipeMode === 'full' ? '◧' : '◨'}</button>
						<button
							class="icon-btn"
							onclick={() => pipeMode.set('hidden')}
							title="Hide pipeline"
						>×</button>
					</div>
				</div>

				{#if $pipeMode === 'full'}
					<PipelineList offers={$offers} />
				{:else}
					<PipelineListCompact offers={$offers} />
				{/if}
			</div>
		{/if}

		<!-- Right pane: report or file editor -->
		<div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;border-left:1px solid var(--line)">
			{#if loading}
				<div style="display:flex;align-items:center;justify-content:center;flex:1;color:var(--fg-3);font-family:var(--mono);font-size:12px">
					Loading pipeline…
				</div>
			{:else if error}
				<div style="display:flex;align-items:center;justify-content:center;flex:1;flex-direction:column;gap:12px;color:var(--red);font-family:var(--mono);font-size:13px">
					<div>⚠ {error}</div>
					<div style="color:var(--fg-3);font-size:11px">Make sure the Go server is running: cd dashboard && go run ./cmd/server -path ..</div>
				</div>
			{:else if $view === 'report'}
				<ReportPanel offer={activeOffer()} />
			{:else}
				<FileEditor files={$files} />
			{/if}
		</div>
	</div>

	<!-- Claude Code dock (Layout B bottom) -->
	<div class="dock" style="height:{$dockOpen ? 280 : 38}px">
		<button class="dock-handle" onclick={() => dockOpen.update(v => !v)} style="width:100%;text-align:left">
			<span style="color:var(--green)">●</span>
			<span>Claude Code</span>
			<span style="color:var(--fg-3);text-transform:none;letter-spacing:0">
				· career-ops · context: {activeOffer() ? `#${activeOffer()!.n} ${activeOffer()!.company}` : 'pipeline'}
			</span>
			<div class="right">
				<span class="kbd">⌘J</span>
				<span>{$dockOpen ? '▾' : '▴'}</span>
			</div>
		</button>
		{#if $dockOpen}
			<div style="flex:1;min-height:0;display:flex;overflow:hidden">
				<ChatDock activeOffer={activeOffer()} />
			</div>
		{/if}
	</div>

	<!-- Keybinds footer -->
	<Keybinds />
</div>
