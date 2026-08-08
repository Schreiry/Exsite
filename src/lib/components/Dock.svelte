<!--
  Док — вся навигация сайта.

  Он внизу и по центру, как в самой программе: до нижнего края одинаково близко
  и большому пальцу на телефоне, и курсору на мониторе. Шапки нет вовсе, и это
  освобождает верх страницы под то, ради чего человек пришёл.

  ТРИ ВЕЩИ, КОТОРЫЕ ЗДЕСЬ ВАЖНЫ.

  1. Док — единственная настоящая линза на сайте. Он реально искажает то, что
     проезжает под ним, и ловит свет по верхней кромке. Именно потому, что
     такой он один, это читается как дорогая деталь, а не как эффект ради
     эффекта.

  2. Подсветка активного раздела ПЕРЕЛЕТАЕТ, а не перекрашивается. Одна
     капсула на весь док, которая переезжает на новое место: глаз следит за
     предметом и понимает, что произошло, без единой подписи.

  3. Док не перерисовывается при смене страницы. Он живёт в оболочке, поэтому
     переезд капсулы и смена содержания идут одним движением.
-->
<script lang="ts">
	import { tick } from 'svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { t, lang, setLang, LANGS, LANG_LABEL, type Lang } from '$lib/i18n';

	interface Item {
		href: string;
		key: string;
		icon: 'overview' | 'editions' | 'download' | 'about' | 'news';
	}

	const ITEMS: Item[] = [
		{ href: '/overview', key: 'nav_overview', icon: 'overview' },
		{ href: '/editions', key: 'nav_editions', icon: 'editions' },
		{ href: '/download', key: 'nav_download', icon: 'download' },
		{ href: '/about', key: 'nav_about', icon: 'about' },
		{ href: '/blog', key: 'nav_blog', icon: 'news' },
	];

	let rail = $state<HTMLElement | null>(null);
	let pill = $state({ x: 0, w: 0, shown: false });
	let langOpen = $state(false);

	const isActive = (href: string) =>
		href === '/overview'
			? page.url.pathname === base + '/' || page.url.pathname.startsWith(base + href)
			: page.url.pathname.startsWith(base + href);

	/**
	 * Куда поставить капсулу.
	 *
	 * Меряем ПОКОЯЩИЕСЯ величины (`offsetLeft`/`offsetWidth`), а не живые рамки.
	 * Живые меняются от самой же анимации, и получается петля обратной связи —
	 * ровно та ошибка, на которой в программе дрожала лупа дока.
	 */
	async function placePill(): Promise<void> {
		await tick();
		if (!rail) return;
		const active = rail.querySelector<HTMLElement>('.item.on');
		if (!active) {
			pill = { ...pill, shown: false };
			return;
		}
		pill = { x: active.offsetLeft, w: active.offsetWidth, shown: true };
	}

	$effect(() => {
		void page.url.pathname;
		void $lang;
		void placePill();
	});

	/**
	 * Док темнеет, когда под ним проезжает светлая плита.
	 *
	 * Стекло берёт цвет у того, что под ним. Над угольным полотном светлый док
	 * читается прекрасно, а над белой плитой он растворялся: светлое на светлом.
	 * Поэтому дважды в секунду смотрим, что лежит ровно под доком, и меняем
	 * среду — так же, как это делает настоящее стекло на разном столе.
	 *
	 * Проверка идёт по точке, а не по списку блоков: список пришлось бы вести
	 * руками, и однажды новая светлая секция в него не попала бы.
	 */
	let overLight = $state(false);
	let dockEl = $state<HTMLElement | null>(null);

	function senseBackground(): void {
		if (!dockEl) return;
		const box = dockEl.getBoundingClientRect();
		const x = box.left + box.width / 2;
		const y = box.top + box.height / 2;
		// Сам док в этой точке первый — берём то, что под ним.
		const under = document.elementsFromPoint(x, y).find((el) => !dockEl?.contains(el));
		overLight = !!under?.closest('.slab');
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		let ticking = false;
		const onScroll = (): void => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				senseBackground();
				ticking = false;
			});
		};
		senseBackground();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});

	function pick(code: Lang): void {
		setLang(code);
		langOpen = false;
	}
</script>

<svelte:window onresize={placePill} />

<nav class="dock-wrap" aria-label="Exsul">
	<div class="dock glass lens chroma" class:over-light={overLight} bind:this={dockEl}>
		<div class="rail" bind:this={rail}>
			<span
				class="pill"
				class:shown={pill.shown}
				style:--x="{pill.x}px"
				style:--w="{pill.w}px"
				aria-hidden="true"
			></span>

			{#each ITEMS as item (item.href)}
				<a
					class="item"
					class:on={isActive(item.href)}
					href="{base}{item.href}"
					aria-current={isActive(item.href) ? 'page' : undefined}
				>
					<span class="icon" aria-hidden="true">
						{#if item.icon === 'overview'}
							<svg viewBox="0 0 20 20"><path d="M3 10.6 10 4l7 6.6M5.5 9.4V16h9V9.4" /></svg>
						{:else if item.icon === 'editions'}
							<svg viewBox="0 0 20 20"><path d="M3.5 6.5h5v9h-5zM11.5 4.5h5v11h-5z" /></svg>
						{:else if item.icon === 'download'}
							<svg viewBox="0 0 20 20"><path d="M10 3.5v9m0 0 3.4-3.4M10 12.5 6.6 9.1M4 15.5h12" /></svg>
						{:else if item.icon === 'about'}
							<svg viewBox="0 0 20 20"
								><path d="M10 3.2a6.8 6.8 0 1 0 0 13.6 6.8 6.8 0 0 0 0-13.6zM10 9v4.6M10 6.6v.6" /></svg
							>
						{:else}
							<svg viewBox="0 0 20 20"><path d="M4 5.5h12v9H4zM6.5 8.5h7M6.5 11.5h4.5" /></svg>
						{/if}
					</span>
					<span class="label">{$t(item.key)}</span>
				</a>
			{/each}
		</div>

		<span class="sep" aria-hidden="true"></span>

		<div class="side">
			<div class="lang-wrap">
				{#if langOpen}
					<div class="lang-menu glass">
						{#each LANGS as code (code)}
							<button
								type="button"
								class="lang-item"
								class:on={$lang === code}
								onclick={() => pick(code)}
							>{LANG_LABEL[code]}</button>
						{/each}
					</div>
				{/if}
				<button
					type="button"
					class="lang-btn"
					aria-expanded={langOpen}
					aria-label={$t('foot_lang')}
					onclick={() => (langOpen = !langOpen)}
				>{LANG_LABEL[$lang]}</button>
			</div>

			<a class="buy" href="{base}/buy">{$t('nav_buy')}</a>
		</div>
	</div>
</nav>

{#if langOpen}
	<button class="scrim" tabindex="-1" aria-hidden="true" onclick={() => (langOpen = false)}></button>
{/if}

<style>
	.dock-wrap {
		position: fixed;
		left: 0;
		right: 0;
		bottom: max(18px, env(safe-area-inset-bottom));
		z-index: 60;
		display: flex;
		justify-content: center;
		padding: 0 12px;
		pointer-events: none;
	}
	.dock {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 7px;
		border-radius: 999px;
		pointer-events: auto;
		box-shadow: var(--shadow-3), var(--sheen);
		max-width: 100%;
		transition:
			background var(--t-base) var(--ease-out),
			border-color var(--t-base) var(--ease-out),
			color var(--t-base) var(--ease-out);
	}

	/* Над светлой плитой стекло становится тёмным: светлое на светлом не
	   читается вовсе. Меняются только цвета среды — надписи, капсула и кнопка
	   покупки подхватывают их сами. */
	.dock.over-light {
		--ink: #14161b;
		--ink-soft: color-mix(in srgb, var(--ink) 74%, transparent);
		--line: color-mix(in srgb, var(--ink) 14%, transparent);
		--glass-1: color-mix(in srgb, var(--ink) 5%, transparent);
		--glass-3: color-mix(in srgb, var(--ink) 10%, transparent);
		--glass-edge-hot: color-mix(in srgb, var(--ink) 26%, transparent);
		--accent: #14161b;
		--accent-ink: #ffffff;
		--sheen: inset 0 1px 0 color-mix(in srgb, #ffffff 55%, transparent);
		background: color-mix(in srgb, #ffffff 46%, transparent);
		border-color: color-mix(in srgb, #14161b 12%, transparent);
		color: var(--ink);
	}

	.rail {
		position: relative;
		display: flex;
		align-items: center;
		gap: 2px;
	}

	/* Капсула активного раздела. Переезжает сдвигом и шириной — раскладка при
	   этом не пересчитывается ни разу. */
	.pill {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: var(--w);
		border-radius: 999px;
		background: var(--glass-3);
		border: 1px solid var(--glass-edge-hot);
		box-shadow: var(--sheen);
		opacity: 0;
		transform: translate3d(var(--x), 0, 0) scaleX(0.9);
		transition:
			transform var(--t-base) var(--ease-out),
			width var(--t-base) var(--ease-out),
			opacity var(--t-fast) var(--ease-out);
	}
	.pill.shown {
		opacity: 1;
		transform: translate3d(var(--x), 0, 0);
	}

	.item {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 16px;
		border-radius: 999px;
		font-size: 0.88rem;
		color: var(--ink-soft);
		white-space: nowrap;
		transition: color var(--t-fast) var(--ease-out);
	}
	.item:hover {
		color: var(--ink);
	}
	.item.on {
		color: var(--ink);
	}
	.icon {
		display: inline-flex;
		width: 18px;
		height: 18px;
	}
	.icon svg {
		width: 100%;
		height: 100%;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.sep {
		width: 1px;
		align-self: stretch;
		margin: 4px 2px;
		background: var(--line);
	}

	.side {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.lang-wrap {
		position: relative;
	}
	.lang-btn {
		padding: 9px 12px;
		border: 1px solid transparent;
		border-radius: 999px;
		background: transparent;
		color: var(--ink-soft);
		font: inherit;
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		cursor: pointer;
		transition:
			background var(--t-fast) var(--ease-out),
			color var(--t-fast) var(--ease-out);
	}
	.lang-btn:hover {
		color: var(--ink);
		background: var(--glass-1);
	}
	/* Выбор языка выезжает ВВЕРХ: вниз некуда, там край экрана. */
	.lang-menu {
		position: absolute;
		bottom: calc(100% + 10px);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 6px;
		border-radius: var(--radius-s);
		box-shadow: var(--shadow-2), var(--sheen);
		animation: rise var(--t-base) var(--ease-out);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translate(-50%, 10px);
		}
	}
	.lang-item {
		padding: 9px 16px;
		border: 0;
		border-radius: 10px;
		background: transparent;
		color: var(--ink-soft);
		font: inherit;
		font-size: 0.78rem;
		letter-spacing: 0.06em;
		cursor: pointer;
		transition: background var(--t-fast) var(--ease-out);
	}
	.lang-item:hover {
		background: var(--glass-1);
		color: var(--ink);
	}
	.lang-item.on {
		background: var(--accent);
		color: var(--accent-ink);
	}

	.buy {
		padding: 10px 20px;
		border-radius: 999px;
		background: var(--accent);
		color: var(--accent-ink);
		font-size: 0.88rem;
		font-weight: 450;
		white-space: nowrap;
		transition:
			transform var(--t-base) var(--ease-out),
			box-shadow var(--t-base) var(--ease-out);
	}
	.buy:hover {
		transform: translateY(-1px);
		box-shadow: 0 10px 26px rgb(0 0 0 / 0.45);
	}

	.scrim {
		position: fixed;
		inset: 0;
		z-index: 59;
		border: 0;
		padding: 0;
		background: transparent;
		cursor: default;
	}

	/* На узком экране остаются иконки: подписи занимали бы всю ширину, и док
	   пришлось бы прокручивать — а прокручиваемая навигация не навигация. */
	@media (max-width: 980px) {
		.label {
			display: none;
		}
		.item {
			padding: 11px 14px;
		}
	}
	@media (max-width: 560px) {
		.dock {
			gap: 3px;
			padding: 6px;
		}
		.item {
			padding: 10px 11px;
		}
		.buy {
			padding: 10px 15px;
			font-size: 0.84rem;
		}
		.lang-btn {
			padding: 9px 9px;
		}
	}
</style>
