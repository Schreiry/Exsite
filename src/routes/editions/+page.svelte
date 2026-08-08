<!--
  Издания. Две части: карточки для выбора и таблица для проверки.

  Карточка отвечает на «какое мне», таблица — на «а что именно я получу».
  Обе строятся из одного файла с изданиями, поэтому разойтись не могут.

  ПОДСВЕТКА ВМЕСТО СВЕТОФОРА. Выбранное издание становится ярче, остальные
  гаснут; «есть» — плотный знак, «нет» — тихий прочерк. Зелёного с красным тут
  нет намеренно: красная клетка читается как «не бери это», а младшие издания
  мы тоже продаём.

  На узком экране таблица не ломается в кашу: она прокручивается вбок, а первая
  колонка стоит на месте, иначе через три шага непонятно, о какой строке речь.
-->
<script lang="ts">
	import { t, price } from '$lib/i18n';
	import EditionCard from '$lib/components/EditionCard.svelte';
	import {
		EDITIONS,
		FEATURES,
		FEATURE_GROUPS,
		type EditionId,
		type FeatureValue,
	} from '$lib/content/editions';

	/** `null` — показаны все издания на равных. */
	let picked = $state<EditionId | null>(null);

	const choose = (id: EditionId) => {
		picked = picked === id ? null : id;
	};

	function cell(v: FeatureValue): { kind: 'yes' | 'no' | 'text'; textKey?: string } {
		if (v === true) return { kind: 'yes' };
		if (v === false) return { kind: 'no' };
		return { kind: 'text', textKey: v.textKey };
	}

	const rowsOf = (group: string) => FEATURES.filter((f) => f.group === group);
</script>

<svelte:head>
	<title>Издания Exsul</title>
</svelte:head>

<section class="page head">
	<h1>{$t('ed_head')}</h1>
	<p class="lead">{$t('ed_sub')}</p>
	<p class="muted forever">{$t('ed_forever')}</p>
</section>

<section class="page tiers">
	{#each EDITIONS as edition (edition.id)}
		<EditionCard
			{edition}
			selected={picked === edition.id}
			onselect={() => choose(edition.id)}
		/>
	{/each}
</section>

<!-- ── Две вещи, о которых спрашивают чаще всего ────────────────────────── -->
<section class="page notes">
	<article class="slab note reveal">
		<h3>{$t('ed_staff_head')}</h3>
		<p class="muted">{$t('ed_staff_text')}</p>
	</article>
	<article class="slab note reveal">
		<h3>{$t('ed_updates_head')}</h3>
		<p class="muted">{$t('ed_updates_text')}</p>
	</article>
</section>

<!-- ── Таблица ─────────────────────────────────────────────────────────── -->
<section class="page compare">
	<div class="compare-head reveal">
		<h2>{$t('ed_compare')}</h2>
		<div class="compare-tools">
			<p class="faint hint">{$t('ed_compare_hint')}</p>
			{#if picked}
				<button type="button" class="btn btn-quiet all" onclick={() => (picked = null)}>
					{$t('ed_compare_all')}
				</button>
			{/if}
		</div>
	</div>

	<div class="table-wrap slab reveal">
		<table class:narrowed={picked !== null}>
			<caption class="sr-only">{$t('ed_compare')}</caption>
			<thead>
				<tr>
					<th class="feat-col"></th>
					{#each EDITIONS as e (e.id)}
						<th class="ed-col" class:dim={picked !== null && picked !== e.id} class:on={picked === e.id}>
							<button type="button" class="ed-btn" onclick={() => choose(e.id)} aria-pressed={picked === e.id}>
								<span class="ed-name">{$t(e.nameKey)}</span>
								<span class="ed-price nums">
									{e.priceUsd === null ? '—' : $price(e.priceUsd)}
								</span>
							</button>
						</th>
					{/each}
				</tr>
			</thead>

			{#each FEATURE_GROUPS as group (group.id)}
				<tbody>
					<tr class="group-row">
						<!-- Заголовок группы идёт во всю ширину, поэтому липкость первой
						     колонки ему не нужна: липнуть нечему, а лишний слой только
						     спорил бы с шапкой за место. -->
						<th class="group-name" scope="rowgroup" colspan={EDITIONS.length + 1}>
							{$t(group.titleKey)}
						</th>
					</tr>
					{#each rowsOf(group.id) as f (f.id)}
						<tr>
							<th class="feat-col" scope="row">
								<span class="feat-name">{$t(f.titleKey)}</span>
								<span class="feat-hint faint">{$t(f.hintKey)}</span>
							</th>
							{#each EDITIONS as e (e.id)}
								{@const c = cell(e.features[f.id])}
								<td
									class="ed-col"
									class:dim={picked !== null && picked !== e.id}
									class:on={picked === e.id}
								>
									{#if c.kind === 'yes'}
										<span class="mark yes" title={$t('ed_included')}>
											<svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
												<path
													d="M3 7.3 5.7 10 11 3.9"
													fill="none"
													stroke="currentColor"
													stroke-width="1.7"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</svg>
											<span class="sr-only">{$t('ed_included')}</span>
										</span>
									{:else if c.kind === 'no'}
										<span class="mark no" title={$t('ed_not_included')}>
											<span aria-hidden="true">–</span>
											<span class="sr-only">{$t('ed_not_included')}</span>
										</span>
									{:else}
										<span class="txt">{$t(c.textKey ?? '')}</span>
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			{/each}
		</table>
	</div>
</section>

<style>
	.head {
		padding: clamp(44px, 8vh, 96px) 0 30px;
	}
	.head h1 {
		margin-bottom: 14px;
	}
	.forever {
		margin-top: 10px;
		font-size: 0.9rem;
	}

	.tiers {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(262px, 1fr));
		gap: 16px;
		padding-bottom: clamp(34px, 6vh, 64px);
	}

	.notes {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 14px;
		padding-bottom: clamp(40px, 7vh, 80px);
	}
	.note {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 26px 28px;
	}
	.note p {
		font-size: 0.93rem;
	}

	.compare {
		padding-bottom: clamp(40px, 7vh, 80px);
	}
	.compare-head {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 14px;
		margin-bottom: 18px;
	}
	.compare-tools {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.hint {
		font-size: 0.86rem;
	}
	.all {
		padding: 8px 16px;
		font-size: 0.86rem;
		border-color: var(--line);
	}

	.table-wrap {
		padding: 4px;
		overflow-x: auto;
		/* Полоса прокрутки живёт у таблицы, а не у страницы: страница по
		   горизонтали не ездит никогда. */
		overscroll-behavior-x: contain;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	th,
	td {
		padding: 13px 14px;
		text-align: center;
		border-bottom: 1px solid color-mix(in srgb, var(--line) 70%, transparent);
	}

	/* Первая колонка стоит на месте при прокрутке вбок. */
	.feat-col {
		position: sticky;
		left: 0;
		z-index: 2;
		text-align: left;
		min-width: 232px;
		background: color-mix(in srgb, var(--paper) 94%, transparent);
	}
	.feat-name {
		display: block;
		font-weight: 450;
	}
	.feat-hint {
		display: block;
		font-size: 0.78rem;
		line-height: 1.35;
	}

	/* Шапка таблицы НЕ липнет по вертикали намеренно. Раньше у неё стоял
	   `top: 60px`, но липкость считается от ближайшего прокручиваемого предка,
	   а это наша обёртка с боковой прокруткой, а не окно. Шапка съезжала на
	   60 точек вниз и накрывала собой первую строку группы. По вертикали здесь
	   липнуть не от чего: обёртка ездит только вбок. */
	thead th {
		padding: 0;
		background: color-mix(in srgb, var(--paper) 94%, transparent);
	}
	thead .feat-col {
		z-index: 3;
	}

	.ed-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		width: 100%;
		padding: 14px 10px;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		cursor: pointer;
		border-radius: 12px;
		transition: background 0.2s ease;
	}
	.ed-btn:hover {
		background: color-mix(in srgb, var(--ink) 5%, transparent);
	}
	.ed-name {
		font-family: var(--font-display);
		font-size: 1.02rem;
		font-weight: 500;
	}
	.ed-price {
		font-size: 0.8rem;
		color: var(--ink-faint);
	}

	/* Выбранное издание: колонка чуть светлее и с плотной кромкой.
	   Остальные гаснут, но остаются читаемыми — их всё ещё сравнивают. */
	.ed-col {
		transition:
			opacity 0.28s ease,
			background 0.28s ease;
	}
	.ed-col.dim {
		opacity: 0.38;
	}
	.ed-col.on {
		background: color-mix(in srgb, var(--ink) 6%, transparent);
	}
	thead .ed-col.on {
		box-shadow: inset 0 -2px 0 var(--ink);
	}

	.group-row th {
		padding: 22px 14px 8px;
		border-bottom: 1px solid var(--line-strong);
		font-family: var(--font-display);
		font-size: 0.82rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}
	:global(:lang(ka)) .group-row th {
		text-transform: none;
		letter-spacing: 0.02em;
	}

	.mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
	}
	.mark.yes {
		background: var(--accent);
		color: var(--accent-ink);
	}
	.mark.no {
		color: color-mix(in srgb, var(--ink) 30%, transparent);
		font-size: 1rem;
	}
	.txt {
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}

	tbody:last-child tr:last-child th,
	tbody:last-child tr:last-child td {
		border-bottom: none;
	}

	@media (max-width: 720px) {
		.feat-col {
			min-width: 178px;
		}
		.feat-hint {
			display: none;
		}
	}
</style>
