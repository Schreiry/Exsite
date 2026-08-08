<!--
  Карточка издания.

  Внутри неё живёт материал, который считает видеокарта. Материал у каждого
  издания свой: чем дороже, тем гуще слои и глубже блики. Разница сделана
  плотностью, а не яркостью цвета — так же, как дорогая вещь в жизни отличается
  от дешёвой не количеством красок.

  Материал занимает нижнюю часть карточки и растворяется к верху. Там, где
  лежат буквы, он почти прозрачен: фон, из-за которого приходится вчитываться,
  плохой фон, каким бы красивым он ни был.
-->
<script lang="ts">
	import { base } from '$app/paths';
	import { t, price } from '$lib/i18n';
	import ShaderSurface from './ShaderSurface.svelte';
	import { EDITION_FRAGMENT } from '$lib/gl/shaders';
	import { FEATURES, type Edition, type FeatureValue } from '$lib/content/editions';

	interface Props {
		edition: Edition;
		selected: boolean;
		onselect: () => void;
	}

	let { edition, selected, onselect }: Props = $props();

	// Материал оживает, когда издание выбрано: волна проходит чуть быстрее и
	// становится плотнее. Это ответ на нажатие, а не украшение.
	const uniforms = () => ({
		uHue: edition.hue,
		uRich: edition.richness,
		uWake: selected ? 1 : 0,
		uTone: 1,
	});

	/** Что показать в строке: галочку, прочерк или уточнение. */
	function line(v: FeatureValue): { on: boolean; textKey?: string } {
		if (v === true) return { on: true };
		if (v === false) return { on: false };
		return { on: true, textKey: v.textKey };
	}

	// В карточке перечисляем только то, что входит: список из пятнадцати строк,
	// половина которых с прочерками, читается как жалоба. Полная картина —
	// в таблице ниже.
	const included = $derived(
		FEATURES.map((f) => ({ f, l: line(edition.features[f.id]) })).filter((r) => r.l.on),
	);
</script>

<article class="tier" class:featured={edition.featured} class:selected>
	<div class="material" aria-hidden="true">
		<ShaderSurface fragment={EDITION_FRAGMENT} {uniforms} fps={26} scale={0.7} />
	</div>

	<div class="body">
		<!-- Место под ярлык есть у всех карточек, даже пустое. Иначе ярлык
		     выделенного издания сдвигает его заголовок вниз, и названия
		     перестают стоять на одной линии с соседями. -->
		<div class="badge-slot">
			{#if edition.featured}
				<span class="badge mark-featured">{$t('ed_featured')}</span>
			{/if}
		</div>

		<h3 class="name">{$t(edition.nameKey)}</h3>
		<p class="for muted">{$t(edition.forWhoKey)}</p>

		<div class="price">
			{#if edition.priceUsd === null}
				<span class="soon">{$t('ed_price_soon')}</span>
			{:else}
				<span class="amount nums">{$price(edition.priceUsd)}</span>
				<span class="once faint">{$t('ed_price_note')}</span>
			{/if}
		</div>

		<ul class="list">
			{#each included as row (row.f.id)}
				<li>
					<span class="tick" aria-hidden="true">
						<svg viewBox="0 0 12 12" width="12" height="12">
							<path
								d="M2.5 6.4 4.8 8.7 9.5 3.6"
								fill="none"
								stroke="currentColor"
								stroke-width="1.6"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
					<span class="row-text">
						<span>{$t(row.f.titleKey)}</span>
						{#if row.l.textKey}<b class="val">{$t(row.l.textKey)}</b>{/if}
					</span>
				</li>
			{/each}
		</ul>

		<div class="actions">
			<a class="btn btn-primary buy" href="{base}/buy?edition={edition.id}">{$t('ed_buy')}</a>
			<button type="button" class="btn btn-quiet pick" onclick={onselect}>
				{selected ? $t('ed_chosen') : $t('ed_choose')}
			</button>
		</div>
	</div>
</article>

<style>
	.tier {
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: var(--radius-l);
		border: 1px solid color-mix(in srgb, #ffffff 12%, transparent);
		background: linear-gradient(170deg, #12161e, #080b11);
		box-shadow: var(--shadow-2);
		transition:
			transform 0.45s var(--ease-out),
			box-shadow 0.45s ease,
			border-color 0.3s ease;
	}
	.tier:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-3);
	}
	/* Выделенное издание отличается не свечением, а тем, что оно ближе:
	   плотнее кромка, глубже тень. */
	.tier.featured {
		border-color: color-mix(in srgb, #ffffff 24%, transparent);
	}
	.tier.selected {
		border-color: color-mix(in srgb, #ffffff 42%, transparent);
		box-shadow: var(--shadow-3);
	}

	/* Материал обрезается по скруглению карточки СВОИМ правилом, а не только
	   правилом родителя: у родителя есть сдвиг на наведении, а он
	   создаёт свой слой, и обрезка по радиусу переставала действовать —
	   углы живого полотна вылезали за скруглённый край. */
	.material {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		overflow: hidden;
		isolation: isolate;
		pointer-events: none;
	}

	.body {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 11px;
		flex: 1;
		padding: 28px 26px 26px;
	}
	.badge-slot {
		display: flex;
		align-items: center;
		min-height: 24px;
		margin-bottom: 2px;
	}
	.mark-featured {
		border-color: color-mix(in srgb, #ffffff 26%, transparent);
		background: color-mix(in srgb, #ffffff 12%, transparent);
		color: var(--ink);
	}

	.name {
		font-size: 1.55rem;
		letter-spacing: -0.02em;
	}
	.for {
		font-size: 0.9rem;
		min-height: 2.7em;
	}

	.price {
		display: flex;
		align-items: baseline;
		gap: 9px;
		min-height: 2.4rem;
		margin-top: 2px;
	}
	.amount {
		font-family: var(--font-display);
		font-size: 2.1rem;
		font-weight: 500;
		letter-spacing: -0.03em;
	}
	.once {
		font-size: 0.8rem;
	}
	.soon {
		font-size: 1rem;
		color: var(--ink-soft);
	}

	.list {
		list-style: none;
		margin: 6px 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 9px;
		flex: 1;
		font-size: 0.89rem;
		color: var(--ink-soft);
	}
	.list li {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		line-height: 1.45;
	}
	.tick {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
		width: 17px;
		height: 17px;
		margin-top: 1px;
		border-radius: 50%;
		background: color-mix(in srgb, #ffffff 14%, transparent);
		color: var(--ink);
	}
	/* Название и уточнение — два отдельных слова, а не одно: без явного
	   промежутка разметка склеивала их в «Сотрудникинет». */
	.row-text {
		display: flex;
		flex-wrap: wrap;
		gap: 0 5px;
	}
	.val {
		color: var(--ink);
		font-weight: 450;
	}

	.actions {
		display: flex;
		gap: 8px;
		margin-top: 16px;
	}
	.buy {
		flex: 1;
	}
	.pick {
		border-color: var(--line-strong);
		border-style: solid;
	}

	@media (max-width: 560px) {
		.body {
			padding: 24px 20px 22px;
		}
	}
</style>
