<!--
  Главная.

  Порядок экранов повторяет порядок вопросов у человека, который впервые
  слышит о программе: что это → покажите → почему ей верить → подойдёт ли моему
  делу → на чём работает → сколько стоит.

  Блоки идут во всю ширину и чередуются по плотности: огромный заголовок,
  широкий экран программы, плотная сетка плиток, снова простор. Ровно этот
  ритм и читается как дорогая витрина, а не длина текста.
-->
<script lang="ts">
	import { base } from '$app/paths';
	import { t } from '$lib/i18n';
	import { release } from '$lib/stores/release';
	import AppScreen from '$lib/components/AppScreen.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { PHONES, DESKTOPS, DESKTOP_GENERATIONS } from '$lib/content/tested';

	const MODES = [
		{ key: 'mode_flowers', text: 'mode_flowers_text' },
		{ key: 'mode_workshop', text: 'mode_workshop_text' },
		{ key: 'mode_retail', text: 'mode_retail_text' },
	] as const;
</script>

<svelte:head>
	<title>Exsul — учёт для малого дела</title>
</svelte:head>

<!-- ── 1. Первый экран ─────────────────────────────────────────────────── -->
<section class="hero">
	<div class="page hero-inner">
		<Logo size={92} class="hero-logo" />
		<span class="mono">{$t('hero_kicker')}</span>
		<h1 class="hero-title">{$t('hero_title')}</h1>
		<p class="lead hero-lead">{$t('hero_sub')}</p>

		<div class="cta">
			<a class="btn btn-primary btn-lg" href="{base}/buy">{$t('hero_cta')}</a>
			<a class="btn btn-lg" href="{base}/overview">{$t('hero_second')}</a>
		</div>
		<p class="mono note">{$t('hero_cta_sub')} · {$t('hero_version').replace('{v}', $release.version)}</p>
	</div>

	<div class="page-wide hero-shot reveal">
		<AppScreen kind="orders" />
	</div>
</section>

<!-- ── 2. Бенто ────────────────────────────────────────────────────────── -->
<section class="page-wide section">
	<h2 class="head reveal">{$t('tiles_head')}</h2>

	<div class="bento">
		<article class="cell wide slab reveal">
			<h3>{$t('tile_offline_title')}</h3>
			<p class="muted">{$t('tile_offline_text')}</p>
			<span class="cell-fig" aria-hidden="true">
				<!-- Два устройства и связь между ними напрямую. -->
				<svg viewBox="0 0 220 80">
					<rect class="dev" x="10" y="18" width="70" height="46" rx="7" />
					<rect class="dev" x="140" y="24" width="42" height="34" rx="6" />
					<path class="link" d="M84 41 H136" />
					<circle class="spark" cx="110" cy="41" r="3.4" />
				</svg>
			</span>
		</article>

		<article class="cell slab reveal" style:--delay="80ms">
			<h3>{$t('tile_money_title')}</h3>
			<p class="muted">{$t('tile_money_text')}</p>
		</article>

		<article class="cell slab reveal" style:--delay="160ms">
			<h3>{$t('tile_speed_title')}</h3>
			<p class="muted">{$t('tile_speed_text')}</p>
		</article>

		<article class="cell slab reveal" style:--delay="80ms">
			<h3>{$t('tile_advice_title')}</h3>
			<p class="muted">{$t('tile_advice_text')}</p>
		</article>

		<article class="cell slab reveal" style:--delay="160ms">
			<h3>{$t('tile_print_title')}</h3>
			<p class="muted">{$t('tile_print_text')}</p>
		</article>

		<article class="cell wide slab reveal">
			<h3>{$t('tile_yours_title')}</h3>
			<p class="muted">{$t('tile_yours_text')}</p>
		</article>
	</div>
</section>

<!-- ── 3. Аналитика во всю ширину ──────────────────────────────────────── -->
<section class="page-wide section duo">
	<div class="duo-text reveal">
		<span class="eyebrow">{$t('feat_analytics')}</span>
		<h2>{$t('tile_money_title')}</h2>
		<p class="lead">{$t('feat_analytics_hint')}</p>
		<a class="btn" href="{base}/overview">{$t('hero_second')}</a>
	</div>
	<div class="duo-shot reveal" style:--delay="120ms">
		<AppScreen kind="analytics" />
	</div>
</section>

<!-- ── 4. Режимы ───────────────────────────────────────────────────────── -->
<section class="page-wide section">
	<div class="head-block reveal">
		<h2>{$t('modes_head')}</h2>
		<p class="lead">{$t('modes_sub')}</p>
	</div>

	<div class="modes">
		{#each MODES as mode, i (mode.key)}
			<article class="mode slab reveal" style:--delay="{i * 90}ms">
				<h3>{$t(mode.key)}</h3>
				<p class="muted">{$t(mode.text)}</p>
			</article>
		{/each}
	</div>

	<div class="duo flip">
		<div class="duo-text reveal">
			<span class="eyebrow">{$t('mode_workshop')}</span>
			<h2>{$t('feat_core')}</h2>
			<p class="lead">{$t('feat_core_hint')}</p>
		</div>
		<div class="duo-shot reveal" style:--delay="120ms">
			<AppScreen kind="stock" />
		</div>
	</div>

	<div class="duo">
		<div class="duo-text reveal">
			<span class="eyebrow">{$t('feat_pos')}</span>
			<h2>{$t('mode_retail')}</h2>
			<p class="lead">{$t('feat_pos_hint')}</p>
		</div>
		<div class="duo-shot reveal" style:--delay="120ms">
			<AppScreen kind="pos" />
		</div>
	</div>
</section>

<!-- ── 5. Проверено на железе ──────────────────────────────────────────── -->
<section class="page section">
	<div class="head-block reveal">
		<h2>{$t('tested_head')}</h2>
		<p class="lead">{$t('tested_sub')}</p>
	</div>

	<div class="tested">
		<div class="tested-col reveal">
			<span class="mono">{$t('tested_phones')}</span>
			<ul class="chips">
				{#each PHONES as name (name)}<li class="chip">{name}</li>{/each}
			</ul>
		</div>
		<div class="tested-col reveal" style:--delay="90ms">
			<span class="mono">{$t('tested_desktops')}</span>
			<ul class="chips">
				{#each DESKTOPS as name (name)}<li class="chip">{name}</li>{/each}
				{#each DESKTOP_GENERATIONS as key (key)}<li class="chip">{$t(key)}</li>{/each}
			</ul>
		</div>
	</div>

	<div class="notes">
		<article class="note slab reveal">
			<h4>{$t('tested_heat')}</h4>
			<p class="muted">{$t('tested_heat_text')}</p>
		</article>
		<article class="note slab reveal" style:--delay="90ms">
			<h4>{$t('tested_old')}</h4>
			<p class="muted">{$t('tested_old_text')}</p>
		</article>
	</div>
</section>

<!-- ── 6. Apple ────────────────────────────────────────────────────────── -->
<section class="page section">
	<div class="apple reveal">
		<span class="badge">{$t('soon_badge')}</span>
		<h2>{$t('soon_apple_title')}</h2>
		<p class="lead">{$t('soon_apple_text')}</p>
		<p class="faint small">{$t('soon_apple_note')}</p>
	</div>
</section>

<!-- ── 7. Призыв ───────────────────────────────────────────────────────── -->
<section class="page section">
	<div class="closing reveal">
		<h2>{$t('hero_cta')}</h2>
		<p class="lead">{$t('ed_sub')}</p>
		<div class="cta">
			<a class="btn btn-primary btn-lg" href="{base}/editions">{$t('nav_editions')}</a>
			<a class="btn btn-lg" href="{base}/download">{$t('nav_download')}</a>
		</div>
	</div>
</section>

<style>
	/* ── Первый экран ───────────────────────────────────────────────────── */
	.hero {
		padding: clamp(88px, 15vh, 190px) 0 0;
	}
	.hero-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 18px;
	}
	:global(.hero-logo) {
		margin-bottom: 8px;
	}
	.hero-title {
		max-width: 18ch;
	}
	.hero-lead {
		text-align: center;
	}
	.cta {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
		margin-top: 10px;
	}
	.note {
		margin-top: 2px;
	}
	.hero-shot {
		margin-top: clamp(44px, 8vh, 96px);
	}

	/* ── Общее ──────────────────────────────────────────────────────────── */
	.section {
		padding: clamp(80px, 13vh, 168px) 0 0;
	}
	.head {
		margin-bottom: 30px;
	}
	.head-block {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 34px;
		max-width: 66ch;
	}

	/* ── Бенто ──────────────────────────────────────────────────────────── */
	/* Ячейки разного размера в одной сетке: широкие задают ритм, обычные
	   держат плотность. Пропорции фиксированные, поэтому при загрузке ничего
	   не прыгает. */
	.bento {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 14px;
	}
	.cell {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 30px 30px 32px;
		grid-column: span 2;
	}
	.cell.wide {
		grid-column: span 4;
	}
	.cell p {
		font-size: 0.96rem;
		max-width: 62ch;
	}
	.cell-fig {
		margin-top: auto;
		padding-top: 18px;
	}
	.cell-fig svg {
		width: min(260px, 100%);
		height: auto;
		display: block;
	}
	.dev {
		fill: none;
		stroke: var(--line-strong);
		stroke-width: 1.5;
	}
	.link {
		stroke: var(--line-strong);
		stroke-width: 1.5;
		stroke-dasharray: 4 5;
	}
	.spark {
		fill: var(--ink);
		animation: travel 3.4s var(--ease-in-out) infinite;
	}
	@keyframes travel {
		0%,
		100% {
			transform: translateX(-24px);
			opacity: 0.2;
		}
		50% {
			transform: translateX(24px);
			opacity: 1;
		}
	}

	/* ── Пара «текст и экран» ───────────────────────────────────────────── */
	.duo {
		display: grid;
		grid-template-columns: 0.85fr 1.15fr;
		gap: clamp(24px, 4vw, 64px);
		align-items: center;
		padding-top: clamp(60px, 10vh, 120px);
	}
	.duo.flip .duo-text {
		order: 2;
	}
	.duo-text {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}
	.duo-text h2 {
		font-size: clamp(1.8rem, 3.4vw, 3rem);
	}

	/* ── Режимы ─────────────────────────────────────────────────────────── */
	.modes {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(272px, 1fr));
		gap: 14px;
	}
	.mode {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 30px;
	}
	.mode p {
		font-size: 0.94rem;
	}

	/* ── Проверено ──────────────────────────────────────────────────────── */
	.tested {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 30px;
	}
	.tested-col {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.chip {
		padding: 7px 14px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--glass-1);
		font-size: 0.84rem;
		color: var(--ink-soft);
	}
	.notes {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 14px;
		margin-top: 26px;
	}
	.note {
		display: flex;
		flex-direction: column;
		gap: 9px;
		padding: 26px 28px;
	}
	.note p {
		font-size: 0.92rem;
	}

	/* ── Apple и призыв ─────────────────────────────────────────────────── */
	.apple,
	.closing {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		padding: clamp(48px, 8vw, 96px) clamp(24px, 5vw, 72px);
		text-align: center;
		border-radius: var(--radius-xl);
		border: 1px solid var(--glass-edge);
		background: linear-gradient(170deg, rgb(255 255 255 / 0.06), rgb(255 255 255 / 0.02));
		box-shadow: var(--shadow-2), var(--sheen);
	}
	.apple .lead,
	.closing .lead {
		text-align: center;
	}
	.small {
		font-size: 0.88rem;
	}

	@media (max-width: 900px) {
		.bento {
			grid-template-columns: 1fr;
		}
		.cell,
		.cell.wide {
			grid-column: span 1;
			padding: 26px 24px 28px;
		}
		.duo {
			grid-template-columns: 1fr;
		}
		.duo.flip .duo-text {
			order: 0;
		}
	}
</style>
