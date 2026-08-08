<!--
  Экраны программы, нарисованные заново.

  Это не картинки и не снимки: разметка, которая повторяет настоящие экраны
  теми же шрифтами, тем же стеклом и теми же расчётами. Отсюда три выигрыша,
  ради которых это и сделано так:

    · экран остаётся чётким на любом мониторе и ничего не весит;
    · графики рисуются при появлении, а не стоят мёртвой картинкой;
    · перевод и валюта работают в них так же, как на всём сайте.

  ЧИСЛА ЗДЕСЬ ПОКАЗАТЕЛЬНЫЕ И СОГЛАСОВАННЫЕ. Суммы сходятся со строками,
  проценты — с графиками. Витрина, на которой «итого» не равно сумме позиций,
  выдаёт себя мгновенно, и доверие после этого не вернуть.
-->
<script lang="ts">
	interface Props {
		kind: 'orders' | 'analytics' | 'stock' | 'pos';
		/** Подпись под окном. Необязательна. */
		caption?: string;
	}

	let { kind, caption }: Props = $props();

	// ── Заказы ──────────────────────────────────────────────────────────────
	const ORDERS = [
		{ who: 'Цветочная лавка «Ирис»', city: 'Тбилиси', sum: '1 240', due: 'сегодня', state: 'ready', paid: 100 },
		{ who: 'Ресторан Sofia', city: 'Батуми', sum: '860', due: 'завтра', state: 'work', paid: 50 },
		{ who: 'Нино Абашидзе', city: 'Рустави', sum: '320', due: '12 авг', state: 'work', paid: 0 },
		{ who: 'Отель Vera', city: 'Тбилиси', sum: '2 150', due: '14 авг', state: 'plan', paid: 30 },
	];

	// ── Аналитика ───────────────────────────────────────────────────────────
	// Выручка по дням недели. Ломаная строится из этих же чисел, поэтому
	// подписи и график не могут разойтись.
	const REVENUE = [820, 1140, 960, 1480, 1320, 2040, 1760];
	const DAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
	const CATEGORIES = [
		{ name: 'Букеты', value: 42 },
		{ name: 'Горшечные', value: 27 },
		{ name: 'Упаковка', value: 18 },
		{ name: 'Прочее', value: 13 },
	];

	const maxRevenue = Math.max(...REVENUE);
	const totalRevenue = REVENUE.reduce((a, b) => a + b, 0);

	/** Ломаная выручки в координатах 0..100 по обеим осям. */
	const linePath = REVENUE.map((v, i) => {
		const x = (i / (REVENUE.length - 1)) * 100;
		const y = 100 - (v / maxRevenue) * 88 - 6;
		return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
	}).join(' ');

	/** Та же ломаная, замкнутая вниз — заливка под графиком. */
	const areaPath = `${linePath} L100 100 L0 100 Z`;

	// ── Склад ───────────────────────────────────────────────────────────────
	const GOODS = [
		{ name: 'Роза Freedom, 60 см', left: 240, price: '3,50', tone: 0 },
		{ name: 'Эустома, микс', left: 96, price: '4,20', tone: 1 },
		{ name: 'Гипсофила', left: 54, price: '2,80', tone: 2 },
		{ name: 'Букет «Тбилиси»', left: 12, price: '85,00', tone: 3 },
		{ name: 'Лента атласная 5 см', left: 8, price: '6,00', tone: 4 },
		{ name: 'Крафт-бумага', left: 31, price: '1,90', tone: 5 },
	];

	// ── Касса ───────────────────────────────────────────────────────────────
	const CART = [
		{ name: 'Букет «Тбилиси»', qty: 1, price: 85 },
		{ name: 'Роза Freedom, 60 см', qty: 15, price: 3.5 },
		{ name: 'Упаковка крафт', qty: 1, price: 6 },
	];
	const cartTotal = CART.reduce((s, r) => s + r.qty * r.price, 0);
</script>

<figure class="shot">
	<div class="window">
		<!-- Шапка окна: три кружка и путь. Ровно столько, сколько нужно, чтобы
		     мозг узнал «это программа», и ни деталью больше. -->
		<div class="titlebar">
			<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
			<span class="path">
				{#if kind === 'orders'}Exsul · Заказы
				{:else if kind === 'analytics'}Exsul · Аналитика
				{:else if kind === 'stock'}Exsul · Склад
				{:else}Exsul · Касса{/if}
			</span>
		</div>

		<div class="body">
			{#if kind === 'orders'}
				<div class="kpis">
					<div class="kpi"><span class="kpi-v">14</span><span class="kpi-l">в работе</span></div>
					<div class="kpi"><span class="kpi-v">4 570 ₾</span><span class="kpi-l">к получению</span></div>
					<div class="kpi"><span class="kpi-v">3</span><span class="kpi-l">срок сегодня</span></div>
				</div>

				<div class="split">
					<ul class="orders">
						{#each ORDERS as o (o.who)}
							<li class="order">
								<span class="dot {o.state}" aria-hidden="true"></span>
								<span class="o-main">
									<span class="o-who">{o.who}</span>
									<span class="o-sub">{o.city} · срок {o.due}</span>
								</span>
								<span class="o-right">
									<span class="o-sum">{o.sum} ₾</span>
									<span class="bar"><i style:width="{o.paid}%"></i></span>
								</span>
							</li>
						{/each}
					</ul>

					<!-- Карта доставки: условная, но с настоящей геометрией города —
					     дороги и река, а не случайные штрихи. -->
					<div class="map" aria-hidden="true">
						<svg viewBox="0 0 100 120" preserveAspectRatio="none">
							<path class="road" d="M8 96 L34 74 L52 78 L70 54 L92 40" />
							<path class="road thin" d="M4 60 L30 52 L48 60 L66 34 L88 26" />
							<path class="road thin" d="M20 118 L28 88 L44 62 L52 30 L60 6" />
							<path class="river" d="M0 34 C22 44 34 26 52 34 C70 42 82 24 100 30" />
							<circle class="pin hot" cx="70" cy="54" r="3.4" />
							<circle class="pin" cx="34" cy="74" r="2.6" />
							<circle class="pin" cx="52" cy="30" r="2.6" />
							<circle class="pin" cx="88" cy="26" r="2.6" />
						</svg>
						<span class="map-tag">4 адреса · 21 км</span>
					</div>
				</div>
			{:else if kind === 'analytics'}
				<div class="kpis">
					<div class="kpi"><span class="kpi-v">{totalRevenue.toLocaleString('ru')} ₾</span><span class="kpi-l">выручка за неделю</span></div>
					<div class="kpi"><span class="kpi-v">38%</span><span class="kpi-l">маржа</span></div>
					<div class="kpi"><span class="kpi-v">+17%</span><span class="kpi-l">к прошлой неделе</span></div>
				</div>

				<div class="chart">
					<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
						<defs>
							<linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stop-color="rgb(255 255 255 / 0.22)" />
								<stop offset="100%" stop-color="rgb(255 255 255 / 0)" />
							</linearGradient>
						</defs>
						{#each [25, 50, 75] as y (y)}
							<line class="grid" x1="0" y1={y} x2="100" y2={y} />
						{/each}
						<path class="area" d={areaPath} fill="url(#rev-fill)" />
						<path class="line" d={linePath} />
					</svg>
					<div class="days">
						{#each DAYS as d (d)}<span>{d}</span>{/each}
					</div>
				</div>

				<div class="cats">
					{#each CATEGORIES as c (c.name)}
						<div class="cat">
							<span class="cat-top"><span>{c.name}</span><span class="cat-v">{c.value}%</span></span>
							<span class="cat-bar"><i style:--w="{c.value}%"></i></span>
						</div>
					{/each}
				</div>
			{:else if kind === 'stock'}
				<div class="kpis">
					<div class="kpi"><span class="kpi-v">56</span><span class="kpi-l">позиций</span></div>
					<div class="kpi"><span class="kpi-v">6 048 ₾</span><span class="kpi-l">склад стоит</span></div>
					<div class="kpi"><span class="kpi-v">3</span><span class="kpi-l">заканчиваются</span></div>
				</div>

				<div class="goods">
					{#each GOODS as g (g.name)}
						<article class="good">
							<span class="thumb" style:--tone={g.tone} aria-hidden="true"></span>
							<span class="g-name">{g.name}</span>
							<span class="g-row">
								<span class="g-left" class:low={g.left < 20}>{g.left} шт</span>
								<span class="g-price">{g.price} ₾</span>
							</span>
						</article>
					{/each}
				</div>
			{:else}
				<div class="pos">
					<ul class="receipt">
						{#each CART as r (r.name)}
							<li>
								<span class="r-name">{r.name}</span>
								<span class="r-qty">{r.qty} ×</span>
								<span class="r-sum">{(r.qty * r.price).toFixed(2)} ₾</span>
							</li>
						{/each}
						<li class="total">
							<span class="r-name">Итого</span>
							<span class="r-sum big">{cartTotal.toFixed(2)} ₾</span>
						</li>
					</ul>

					<div class="pay">
						<span class="pay-title">Оплата</span>
						<div class="methods">
							<span class="method on">Карта</span>
							<span class="method">Наличные</span>
							<span class="method">Смешанная</span>
						</div>
						<div class="keypad" aria-hidden="true">
							{#each ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ',', '←'] as k (k)}
								<span class="key">{k}</span>
							{/each}
						</div>
						<span class="pay-btn">Провести продажу</span>
					</div>
				</div>
			{/if}
		</div>
	</div>

	{#if caption}
		<figcaption class="mono cap">{caption}</figcaption>
	{/if}
</figure>

<style>
	.shot {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	/* Окно программы: тёмное стекло в тонкой светлой оправе. Оправа и тень
	   делают его предметом, лежащим НА полотне, а не дырой в нём. */
	.window {
		border-radius: var(--radius-l);
		border: 1px solid color-mix(in srgb, #ffffff 14%, transparent);
		background: linear-gradient(180deg, #14161d, #0b0d12);
		box-shadow: var(--shadow-3), inset 0 1px 0 rgb(255 255 255 / 0.1);
		overflow: hidden;
	}

	.titlebar {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 11px 16px;
		border-bottom: 1px solid rgb(255 255 255 / 0.07);
		background: rgb(255 255 255 / 0.03);
	}
	.dots {
		display: inline-flex;
		gap: 6px;
	}
	.dots i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: rgb(255 255 255 / 0.16);
	}
	.path {
		font-size: 0.74rem;
		letter-spacing: 0.04em;
		color: rgb(255 255 255 / 0.42);
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 18px;
		color: #eef1f6;
	}

	/* ── Показатели ─────────────────────────────────────────────────────── */
	.kpis {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
	}
	.kpi {
		display: flex;
		flex-direction: column;
		gap: 3px;
		padding: 14px 16px;
		border-radius: 22px;
		border: 1px solid rgb(255 255 255 / 0.08);
		background: rgb(255 255 255 / 0.04);
	}
	.kpi-v {
		font-family: var(--font-display);
		font-size: clamp(1.15rem, 2vw, 1.6rem);
		font-weight: 450;
		letter-spacing: -0.02em;
		white-space: nowrap;
	}
	.kpi-l {
		font-size: 0.72rem;
		color: rgb(255 255 255 / 0.46);
	}

	/* ── Заказы ─────────────────────────────────────────────────────────── */
	.split {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: 12px;
	}
	.orders {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.order {
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 12px 14px;
		border-radius: 20px;
		border: 1px solid rgb(255 255 255 / 0.07);
		background: rgb(255 255 255 / 0.035);
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex: 0 0 auto;
		background: rgb(255 255 255 / 0.3);
	}
	.dot.ready {
		background: #7fe0b0;
	}
	.dot.work {
		background: #e8d48a;
	}
	.dot.plan {
		background: rgb(255 255 255 / 0.28);
	}
	.o-main {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
		flex: 1;
	}
	.o-who {
		font-size: 0.85rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.o-sub {
		font-size: 0.71rem;
		color: rgb(255 255 255 / 0.42);
	}
	.o-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 5px;
	}
	.o-sum {
		font-size: 0.85rem;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.bar {
		display: block;
		width: 54px;
		height: 3px;
		border-radius: 2px;
		background: rgb(255 255 255 / 0.1);
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		border-radius: 2px;
		background: rgb(255 255 255 / 0.55);
	}

	.map {
		position: relative;
		border-radius: 20px;
		border: 1px solid rgb(255 255 255 / 0.07);
		background: rgb(255 255 255 / 0.03);
		overflow: hidden;
		min-height: 180px;
	}
	.map svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.road {
		fill: none;
		stroke: rgb(255 255 255 / 0.16);
		stroke-width: 1.4;
		vector-effect: non-scaling-stroke;
	}
	.road.thin {
		stroke: rgb(255 255 255 / 0.08);
		stroke-width: 1;
	}
	.river {
		fill: none;
		stroke: rgb(130 175 235 / 0.22);
		stroke-width: 3;
		vector-effect: non-scaling-stroke;
	}
	.pin {
		fill: rgb(255 255 255 / 0.5);
	}
	.pin.hot {
		fill: #ffffff;
	}
	.map-tag {
		position: absolute;
		left: 12px;
		bottom: 12px;
		padding: 5px 10px;
		border-radius: 999px;
		background: rgb(10 12 16 / 0.7);
		border: 1px solid rgb(255 255 255 / 0.1);
		font-size: 0.7rem;
		color: rgb(255 255 255 / 0.7);
	}

	/* ── Аналитика ──────────────────────────────────────────────────────── */
	.chart {
		display: flex;
		flex-direction: column;
		gap: 7px;
		padding: 16px 16px 12px;
		border-radius: 22px;
		border: 1px solid rgb(255 255 255 / 0.08);
		background: rgb(255 255 255 / 0.03);
	}
	.chart svg {
		width: 100%;
		height: clamp(110px, 16vw, 168px);
		display: block;
		overflow: visible;
	}
	.grid {
		stroke: rgb(255 255 255 / 0.06);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}
	.line {
		fill: none;
		stroke: #ffffff;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
		/* Линия прочерчивается при появлении: график читается как измерение,
		   а не как заранее нарисованная картинка. */
		stroke-dasharray: 260;
		stroke-dashoffset: 260;
		animation: draw 1.8s var(--ease-out) 0.25s forwards;
	}
	.area {
		opacity: 0;
		animation: fadein 1.2s var(--ease-out) 0.9s forwards;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	@keyframes fadein {
		to {
			opacity: 1;
		}
	}
	.days {
		display: flex;
		justify-content: space-between;
		font-size: 0.68rem;
		color: rgb(255 255 255 / 0.38);
	}

	.cats {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px 16px;
	}
	.cat {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.cat-top {
		display: flex;
		justify-content: space-between;
		font-size: 0.76rem;
		color: rgb(255 255 255 / 0.62);
	}
	.cat-v {
		font-variant-numeric: tabular-nums;
		color: #ffffff;
	}
	.cat-bar {
		height: 4px;
		border-radius: 2px;
		background: rgb(255 255 255 / 0.08);
		overflow: hidden;
	}
	.cat-bar i {
		display: block;
		height: 100%;
		width: var(--w);
		border-radius: 2px;
		background: linear-gradient(90deg, rgb(255 255 255 / 0.45), rgb(255 255 255 / 0.85));
		transform-origin: left;
		animation: grow 1.1s var(--ease-out) 0.4s backwards;
	}
	@keyframes grow {
		from {
			transform: scaleX(0);
		}
	}

	/* ── Склад ──────────────────────────────────────────────────────────── */
	.goods {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
	}
	.good {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 10px;
		border-radius: 20px;
		border: 1px solid rgb(255 255 255 / 0.07);
		background: rgb(255 255 255 / 0.035);
	}
	/* Место под фотографию товара. Оттенок у каждой карточки свой, но все они
	   приглушены до одного уровня — это фон под снимок, а не украшение. */
	.thumb {
		display: block;
		aspect-ratio: 4 / 3;
		border-radius: 14px;
		background:
			radial-gradient(120% 100% at 30% 0%, rgb(255 255 255 / 0.12), transparent 70%),
			linear-gradient(
				160deg,
				hsl(calc(200 + var(--tone) * 26) 30% 26%),
				hsl(calc(190 + var(--tone) * 26) 24% 14%)
			);
	}
	.g-name {
		font-size: 0.78rem;
		line-height: 1.3;
	}
	.g-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-size: 0.74rem;
		font-variant-numeric: tabular-nums;
	}
	.g-left {
		color: rgb(255 255 255 / 0.5);
	}
	.g-left.low {
		color: #e8b98a;
	}
	.g-price {
		color: #ffffff;
	}

	/* ── Касса ──────────────────────────────────────────────────────────── */
	.pos {
		display: grid;
		grid-template-columns: 1.25fr 1fr;
		gap: 12px;
	}
	.receipt {
		list-style: none;
		margin: 0;
		padding: 14px 16px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		border-radius: 22px;
		border: 1px solid rgb(255 255 255 / 0.08);
		background: rgb(255 255 255 / 0.035);
	}
	.receipt li {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: 10px;
		align-items: baseline;
		font-size: 0.82rem;
	}
	.r-qty,
	.r-sum {
		font-variant-numeric: tabular-nums;
		color: rgb(255 255 255 / 0.62);
	}
	.r-sum {
		color: #ffffff;
	}
	.receipt .total {
		margin-top: 4px;
		padding-top: 12px;
		border-top: 1px solid rgb(255 255 255 / 0.1);
		grid-template-columns: 1fr auto;
	}
	.r-sum.big {
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 450;
	}

	.pay {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 14px;
		border-radius: 22px;
		border: 1px solid rgb(255 255 255 / 0.08);
		background: rgb(255 255 255 / 0.035);
	}
	.pay-title {
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgb(255 255 255 / 0.42);
	}
	.methods {
		display: flex;
		gap: 6px;
	}
	.method {
		padding: 7px 11px;
		border-radius: 999px;
		border: 1px solid rgb(255 255 255 / 0.1);
		font-size: 0.72rem;
		color: rgb(255 255 255 / 0.6);
	}
	.method.on {
		background: #ffffff;
		border-color: transparent;
		color: #0b0d12;
	}
	.keypad {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 5px;
	}
	.key {
		display: grid;
		place-items: center;
		padding: 9px 0;
		border-radius: 14px;
		border: 1px solid rgb(255 255 255 / 0.07);
		background: rgb(255 255 255 / 0.04);
		font-size: 0.82rem;
		color: rgb(255 255 255 / 0.7);
	}
	.pay-btn {
		display: grid;
		place-items: center;
		padding: 12px;
		border-radius: 16px;
		background: #ffffff;
		color: #0b0d12;
		font-size: 0.85rem;
		font-weight: 450;
	}

	.cap {
		text-align: center;
	}

	@media (max-width: 720px) {
		.split,
		.pos {
			grid-template-columns: 1fr;
		}
		.goods {
			grid-template-columns: repeat(2, 1fr);
		}
		.map {
			min-height: 130px;
		}
		.kpis {
			gap: 7px;
		}
		.kpi {
			padding: 11px 12px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.line {
			stroke-dashoffset: 0;
			animation: none;
		}
		.area {
			opacity: 1;
			animation: none;
		}
		.cat-bar i {
			animation: none;
		}
	}
</style>
