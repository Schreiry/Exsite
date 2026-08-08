<!--
  Возможности.

  Страница отвечает на вопрос «подойдёт ли она моему делу». Поэтому она
  построена не общим списком умений, а по режимам: человек ищет своё дело и
  читает только про него.

  Крупные блоки в духе витрин Apple: одна мысль на блок, много воздуха, никакой
  таблицы возможностей. Таблица есть на странице изданий, там она уместна —
  туда приходят сравнивать, а сюда приходят узнавать.
-->
<script lang="ts">
	import { base } from '$app/paths';
	import { t } from '$lib/i18n';

	const MODES = [
		{
			key: 'mode_flowers',
			text: 'mode_flowers_text',
			items: ['mode_flowers_item1', 'mode_flowers_item2', 'mode_flowers_item3'],
		},
		{
			key: 'mode_workshop',
			text: 'mode_workshop_text',
			items: ['mode_workshop_item1', 'mode_workshop_item2', 'mode_workshop_item3'],
		},
		{
			key: 'mode_retail',
			text: 'mode_retail_text',
			items: ['mode_retail_item1', 'mode_retail_item2', 'mode_retail_item3'],
		},
	] as const;

	const TILES = [
		['tile_money_title', 'tile_money_text'],
		['tile_offline_title', 'tile_offline_text'],
		['tile_advice_title', 'tile_advice_text'],
		['tile_print_title', 'tile_print_text'],
		['tile_speed_title', 'tile_speed_text'],
		['tile_yours_title', 'tile_yours_text'],
	] as const;
</script>

<svelte:head>
	<title>Возможности Exsul</title>
</svelte:head>

<section class="page head">
	<h1>{$t('modes_head')}</h1>
	<p class="lead">{$t('modes_sub')}</p>
</section>

<section class="page modes">
	{#each MODES as mode, i (mode.key)}
		<article class="mode slab reveal" class:flip={i % 2 === 1}>
			<div class="mode-text">
				<span class="eyebrow">{$t('nav_overview')}</span>
				<h2>{$t(mode.key)}</h2>
				<p class="lead">{$t(mode.text)}</p>
				<ul class="mode-list">
					{#each mode.items as item (item)}
						<li>{$t(item)}</li>
					{/each}
				</ul>
			</div>
			<!-- Место под снимок этого режима. Пока снимков нет, здесь спокойная
			     пластина, а не пустая рамка с надписью «изображение». -->
			<div class="mode-art" aria-hidden="true"><span class="plate"></span></div>
		</article>
	{/each}

	<article class="glass soon-card reveal">
		<h2>{$t('mode_soon')}</h2>
		<p class="muted">{$t('mode_soon_text')}</p>
	</article>
</section>

<section class="page section">
	<h2 class="section-head reveal">{$t('tiles_head')}</h2>
	<div class="tiles">
		{#each TILES as [title, text] (title)}
			<article class="slab tile reveal">
				<h3>{$t(title)}</h3>
				<p class="muted">{$t(text)}</p>
			</article>
		{/each}
	</div>
</section>

<section class="page section closing">
	<div class="slab lift box reveal">
		<h2>{$t('ed_head')}</h2>
		<p class="lead">{$t('ed_sub')}</p>
		<div class="cta">
			<a class="btn btn-primary btn-lg" href="{base}/editions">{$t('nav_editions')}</a>
			<a class="btn btn-lg" href="{base}/about">{$t('nav_about')}</a>
		</div>
	</div>
</section>

<style>
	.head {
		padding: clamp(44px, 8vh, 96px) 0 34px;
	}
	.head h1 {
		margin-bottom: 16px;
	}

	.modes {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.mode {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 30px;
		align-items: center;
		padding: clamp(28px, 4vw, 52px);
		border-radius: var(--radius-l);
	}
	.mode.flip .mode-text {
		order: 2;
	}
	.mode-text {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.mode-text h2 {
		font-size: clamp(1.7rem, 3vw, 2.5rem);
	}
	.mode-list {
		list-style: none;
		margin: 8px 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 9px;
		font-size: 0.95rem;
		color: var(--ink-soft);
	}
	.mode-list li {
		position: relative;
		padding-left: 18px;
	}
	.mode-list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62em;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ink-faint);
	}

	.mode-art {
		display: grid;
		place-items: center;
		min-height: 220px;
	}
	.plate {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 10;
		border-radius: var(--radius);
		border: 1px solid var(--line);
		background:
			radial-gradient(120% 90% at 25% 0%, color-mix(in srgb, var(--ink) 6%, transparent), transparent 70%),
			linear-gradient(160deg, color-mix(in srgb, var(--ink) 4%, transparent), transparent);
	}

	/* Стекло, а не пунктир по пустоте: прежняя прозрачная карточка на угольном
	   полотне была почти невидима, и раздел читался как обрыв страницы. */
	.soon-card {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 30px;
	}

	.section {
		padding: clamp(58px, 10vh, 118px) 0 0;
	}
	.section-head {
		margin-bottom: 26px;
	}
	.tiles {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(272px, 1fr));
		gap: 14px;
	}
	.tile {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 30px 28px;
	}
	.tile p {
		font-size: 0.95rem;
	}

	.closing .box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		padding: clamp(40px, 7vw, 72px);
		text-align: center;
		border-radius: var(--radius-l);
	}
	.closing .lead {
		text-align: center;
	}
	.cta {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
	}

	@media (max-width: 860px) {
		.mode {
			grid-template-columns: 1fr;
			gap: 22px;
		}
		.mode.flip .mode-text {
			order: 0;
		}
		.mode-art {
			min-height: 0;
		}
	}
</style>
