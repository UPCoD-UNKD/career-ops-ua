<script lang="ts">
	import type { OfferDTO, MetaDTO } from '$lib/types';
	import { statsCollapsed } from '$lib/stores';

	interface Props {
		offers: OfferDTO[];
		meta: MetaDTO | null;
	}
	let { offers, meta }: Props = $props();

	const buckets = $derived(() => {
		const b = Array.from({ length: 10 }, () => 0);
		offers.forEach(o => { b[Math.min(9, Math.floor(o.score * 2))]++; });
		return b;
	});

	const maxBucket = $derived(() => Math.max(...buckets(), 1));

	const top4 = $derived(() => offers.filter(o => o.score >= 4).length);
	const avg  = $derived(() => {
		if (!offers.length) return 0;
		return offers.reduce((s, o) => s + o.score, 0) / offers.length;
	});

	const byCompany = $derived(() => {
		const map = offers.reduce<Record<string,number>>((acc, o) => {
			acc[o.company] = (acc[o.company] ?? 0) + 1;
			return acc;
		}, {});
		return [...Object.entries(map)].sort((a, b) => b[1] - a[1]).slice(0, 7);
	});
	const maxCo = $derived(() => byCompany()[0]?.[1] ?? 1);

	// Funnel counts
	function count(state: string) {
		return offers.filter(o => o.state === state).length;
	}
	const funnel = $derived(() => [
		{ label: 'Evaluated', n: offers.length, fill: true },
		{ label: 'Applied',   n: count('applied') + count('interview') + count('responded'), fill: false },
		{ label: 'Interview', n: count('interview'), fill: false },
		{ label: 'Offer',     n: 0, fill: false },
	]);
	const funnelMax = $derived(() => Math.max(...funnel().map(f => f.n), 1));
</script>

{#if $statsCollapsed}
	<!-- Collapsed: single thin row -->
	<div style="flex:0 0 auto;display:flex;align-items:center;gap:18px;padding:6px 16px;border-bottom:1px solid var(--line);background:var(--bg-1);font-family:var(--mono);font-size:11px;color:var(--fg-2);">
		<span style="letter-spacing:.12em;text-transform:uppercase;color:var(--fg-3)">Stats</span>
		<span><b style="color:var(--fg)">{offers.length}</b> roles</span>
		<span>avg <b style="color:var(--accent)">{avg().toFixed(2)}</b>/5</span>
		<span>top≥4 <b style="color:var(--fg)">{top4()}</b></span>
		<span class="spark" style="margin-left:6px">
			{#each buckets() as v, i}
				{@const h = Math.max(1, Math.round((v / maxBucket()) * 100))}
				<span style="height:{h}%;opacity:{v ? 0.4 + 0.6 * (v / maxBucket()) : 0.15}"></span>
			{/each}
		</span>
		<button class="icon-btn" onclick={() => statsCollapsed.set(false)} title="Expand stats (⌘.)" style="margin-left:auto;font-size:11px;padding:0 8px;height:24px;color:var(--fg-2)">
			<span class="kbd" style="margin-right:6px">⌘.</span>▾ expand
		</button>
	</div>
{:else}
	<!-- Expanded -->
	<div style="position:relative">
		<div class="statgrid">
			<div class="statcard">
				<div class="lbl">Pipeline</div>
				<div class="val">{offers.length}<span class="unit">roles</span></div>
			</div>
			<div class="statcard accent">
				<div class="lbl">Avg score</div>
				<div class="val">{avg().toFixed(2)}<span class="unit">/ 5</span></div>
			</div>
			<div class="statcard">
				<div class="lbl">Top ≥ 4</div>
				<div class="val">{top4()}</div>
			</div>
			<div class="statcard">
				<div class="lbl">Awaiting action</div>
				<div class="val">{offers.filter(o => o.state === 'evaluated').length}</div>
			</div>
		</div>
		<button class="icon-btn" onclick={() => statsCollapsed.set(true)} title="Collapse stats (⌘.)"
			style="position:absolute;top:8px;right:12px;font-size:11px;color:var(--fg-2);padding:0 8px;height:24px">
			<span class="kbd" style="margin-right:6px">⌘.</span>▴ minimize
		</button>
	</div>
	<div style="display:grid;grid-template-columns:1.1fr 1fr 1fr;border-bottom:1px solid var(--line);background:var(--bg)">
		<!-- Funnel -->
		<div>
			<div class="side-label" style="border-right:1px solid var(--line)">Funnel</div>
			<div class="funnel">
				{#each funnel() as step, i}
					<div class="step">
						<div class="bar {i === 0 ? 'fill' : ''}" style="height:{Math.max(4, (step.n / funnelMax()) * 70)}px;opacity:{i === 0 ? 1 : step.n ? 0.6 : 0.25}"></div>
						<div class="lbl"><span>{step.label}</span><b>{step.n}</b></div>
					</div>
				{/each}
			</div>
		</div>
		<!-- Histogram -->
		<div style="border-left:1px solid var(--line);border-right:1px solid var(--line)">
			<div class="side-label">Score distribution</div>
			<div style="padding:20px 16px 28px;height:110px">
				<div class="histogram">
					{#each buckets() as v, i}
						{@const pct = v ? Math.max(4, (v / maxBucket()) * 100) : 2}
						<div class="b" style="height:{pct}%;opacity:{v ? 0.4 + 0.6 * (v / maxBucket()) : 0.15}"></div>
					{/each}
				</div>
			</div>
		</div>
		<!-- By company -->
		<div>
			<div class="side-label">By company</div>
			<div style="display:flex;flex-direction:column;gap:4px;padding:4px 14px 12px">
				{#each byCompany() as [co, n]}
					<div style="display:grid;grid-template-columns:130px 1fr 22px;gap:8px;align-items:center;font-family:var(--mono);font-size:11px">
						<span style="color:var(--fg-1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{co}</span>
						<span style="height:6px;background:var(--bg-3);border-radius:3px;overflow:hidden">
							<span style="display:block;height:100%;width:{(n/maxCo())*100}%;background:var(--accent)"></span>
						</span>
						<span style="color:var(--fg-2);text-align:right">{n}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
