<!--
  Оболочка витрины: полотно, содержание, док.

  ЧТО ЗДЕСЬ ЖИВЁТ ПОСТОЯННО И ПОЧЕМУ ЭТО ВАЖНО. Полотно фона и док создаются
  один раз за посещение и не пересоздаются никогда. Поэтому при переходе между
  страницами фон не моргает и не начинается заново, а капсула активного раздела
  просто переезжает. Меняется только содержание: старое гаснет и слегка
  отъезжает, новое поднимается снизу. Это и есть бесшовность — не эффект, а
  отсутствие перезапуска.

  Стеклянный фильтр объявлен здесь же, одним набором на весь сайт: искажение
  считает браузер по этому описанию, и второго такого описания быть не должно.
-->
<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Backdrop from '$lib/components/Backdrop.svelte';
	import Dock from '$lib/components/Dock.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { initLang, t } from '$lib/i18n';
	import { release } from '$lib/stores/release';

	let { children } = $props();

	const FOOT = [
		{ href: '/overview', key: 'nav_overview' },
		{ href: '/editions', key: 'nav_editions' },
		{ href: '/download', key: 'nav_download' },
		{ href: '/about', key: 'nav_about' },
		{ href: '/specs', key: 'nav_specs' },
		{ href: '/faq', key: 'nav_faq' },
		{ href: '/blog', key: 'nav_blog' },
	];

	onMount(() => {
		initLang();

		// Появление блоков при прокрутке. Наблюдатель один на весь сайт и
		// отпускает блок сразу после показа: держать подписку ради анимации,
		// которая случается однажды, незачем.
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (!e.isIntersecting) continue;
					e.target.classList.add('in');
					io.unobserve(e.target);
				}
			},
			{ rootMargin: '0px 0px -4% 0px' },
		);

		const watch = (): void => {
			for (const el of document.querySelectorAll('.reveal:not(.in)')) io.observe(el);
		};
		watch();
		// Новая страница приносит свои блоки — их тоже надо заметить.
		const mo = new MutationObserver(watch);
		mo.observe(document.body, { childList: true, subtree: true });

		return () => {
			io.disconnect();
			mo.disconnect();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href="{base}/logo-64.png" type="image/png" />
	<link rel="apple-touch-icon" href="{base}/logo-180.png" />
</svelte:head>

<!--
  Описание линзы. `feTurbulence` рисует невидимое поле помех, `feDisplacementMap`
  смещает по нему точки того, что лежит под стеклом. Отсюда и берётся ощущение
  толщины: край стекла уводит картинку вбок, как настоящая линза.
-->
<svg class="filters" aria-hidden="true" focusable="false">
	<defs>
		<filter id="exsul-lens" x="-12%" y="-12%" width="124%" height="124%">
			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.006 0.01"
				numOctaves="2"
				seed="11"
				result="noise"
			/>
			<feGaussianBlur in="noise" stdDeviation="4" result="soft" />
			<feDisplacementMap
				in="SourceGraphic"
				in2="soft"
				scale="14"
				xChannelSelector="R"
				yChannelSelector="G"
			/>
		</filter>
	</defs>
</svg>

<Backdrop />

<a class="skip" href="#main">{$t('skip_to_content')}</a>

<a class="mark" href="{base}/" aria-label="Exsul">
	<Logo size={30} />
</a>

<main id="main">
	{#key page.url.pathname}
		<div
			class="stage"
			in:fly={{ y: 22, duration: 460, delay: 90, easing: cubicOut, opacity: 0 }}
			out:fly={{ y: -12, duration: 180, easing: cubicOut, opacity: 0 }}
		>
			{@render children()}

			<footer class="foot glass">
				<div class="page foot-inner">
					<div class="foot-brand">
						<Logo size={26} />
						<div>
							<div class="foot-name">Exsul</div>
							<div class="faint foot-tag">{$t('foot_rights')}</div>
							<!-- Кто сделал программу. Знак студии живёт рядом со строкой, а не
							     вместо неё: имя читается и без картинки. -->
							<a class="studio" href="{base}/about">
								<img
									src="{base}/studio-64.png"
									srcset="{base}/studio-64.png 64w, {base}/studio-128.png 128w"
									sizes="22px"
									width="22"
									height="22"
									alt=""
									decoding="async"
								/>
								<span>Agendum Studios</span>
							</a>
						</div>
					</div>

					<nav class="foot-nav" aria-label="Exsul">
						{#each FOOT as item (item.href)}
							<a href="{base}{item.href}">{$t(item.key)}</a>
						{/each}
					</nav>

					<div class="foot-contact">
						<a href="mailto:gamerdg634@gmail.com">gamerdg634@gmail.com</a>
						<span class="mono">{$t('foot_version')} {$release.version}</span>
					</div>
				</div>
			</footer>
		</div>
	{/key}
</main>

<Dock />

<style>
	/* Описание фильтра ничего не рисует само по себе. */
	.filters {
		position: absolute;
		width: 0;
		height: 0;
		pointer-events: none;
	}

	/* Знак в левом верхнем углу — всё, что осталось сверху. Навигация внизу. */
	.mark {
		position: fixed;
		top: max(20px, env(safe-area-inset-top));
		left: 24px;
		z-index: 55;
		display: inline-flex;
		transition: transform var(--t-base) var(--ease-out);
	}
	.mark:hover {
		transform: scale(1.06);
	}

	main {
		min-height: 100vh;
	}
	/* Обе страницы во время перехода лежат в одной клетке сетки и не толкают
	   друг друга: без этого новая страница на мгновение оказывается под старой
	   и содержание прыгает вниз на высоту экрана. */
	main {
		display: grid;
	}
	.stage {
		grid-area: 1 / 1;
	}

	/* Подвал — стеклянная полоса, а не край страницы. Сквозь него продолжает
	   идти полотно, поэтому сайт не обрывается плоской чертой. */
	.foot {
		margin-top: clamp(80px, 13vh, 148px);
		padding: 48px 0 var(--dock-space);
		border-radius: var(--radius-xl) var(--radius-xl) 0 0;
		border: 1px solid var(--glass-edge);
		border-bottom: 0;
		box-shadow: 0 -1px 0 color-mix(in srgb, #ffffff 12%, transparent);
	}
	.studio {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 10px;
		font-size: 0.82rem;
		color: var(--ink-faint);
		transition: color var(--t-fast) var(--ease-out);
	}
	.studio:hover {
		color: var(--ink-soft);
	}
	.studio img {
		width: 22px;
		height: 22px;
		object-fit: contain;
		opacity: 0.8;
	}
	.foot-inner {
		display: flex;
		flex-wrap: wrap;
		gap: 30px;
		align-items: flex-start;
		justify-content: space-between;
	}
	.foot-brand {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		min-width: 220px;
	}
	.foot-name {
		font-family: var(--font-display);
		font-weight: 450;
	}
	.foot-tag {
		font-size: 0.84rem;
	}
	.foot-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 10px 22px;
		max-width: 520px;
		font-size: 0.89rem;
		color: var(--ink-soft);
	}
	.foot-nav a:hover {
		color: var(--ink);
	}
	.foot-contact {
		display: flex;
		flex-direction: column;
		gap: 7px;
		font-size: 0.89rem;
	}
	.foot-contact a {
		color: var(--ink-soft);
	}
	.foot-contact a:hover {
		color: var(--ink);
	}

	@media (max-width: 640px) {
		.mark {
			left: 16px;
			top: 16px;
		}
	}
</style>
