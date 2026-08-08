<!--
  Фон витрины: светлый лист, воздух и очень тихое звёздное небо.

  Почему так, а не «живой шейдер». Первая попытка была тёмно-синей и с текучим
  стеклом во весь экран — рядом с настоящей программой это выглядело чужим и
  крикливым. Дорогое впечатление даёт не количество эффектов, а их отсутствие
  там, где они не нужны: белый лист, воздух и один сильный предмет — снимок
  программы.

  Небо здесь ровно то же, что на экране входа в программу, только светлое:
  звёзды тёмные, линии созвездий ещё тише. Это связь, а не украшение.

  Стоимость: один SVG, мерцание ведёт CSS. За кадр не выполняется ни строчки
  кода — фон не мешает ни прокрутке, ни анимациям страницы.
-->
<script lang="ts">
	import { SKY_LAYOUT, starField } from '$lib/sky';

	const stars = starField(78);
</script>

<div class="sky" aria-hidden="true">
	<svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
		{#each stars as s, i (i)}
			<circle class="star" cx={s.x * 100} cy={s.y * 100} r={s.r} style:--d="{s.delay}s" />
		{/each}

		{#each SKY_LAYOUT as place (place.constellation.name)}
			{@const c = place.constellation}
			<g class="constellation" style:opacity={place.opacity}>
				{#each c.lines as [a, b] (`${a}-${b}`)}
					<line
						class="link"
						x1={(place.x + c.stars[a].x * place.size) * 100}
						y1={(place.y + c.stars[a].y * place.size) * 100}
						x2={(place.x + c.stars[b].x * place.size) * 100}
						y2={(place.y + c.stars[b].y * place.size) * 100}
					/>
				{/each}
				{#each c.stars as st, i (i)}
					<circle
						class="star bright"
						cx={(place.x + st.x * place.size) * 100}
						cy={(place.y + st.y * place.size) * 100}
						r={st.r * 0.26}
						style:--d="{i * 0.9}s"
					/>
				{/each}
			</g>
		{/each}
	</svg>
</div>

<style>
	.sky {
		position: fixed;
		inset: 0;
		z-index: -1;
		/* Свет: два едва различимых пятна, чтобы лист не был плоским. Цвета в
		   них нет — только светлее и темнее самого листа. */
		background:
			radial-gradient(120% 80% at 18% -10%, #ffffff, transparent 62%),
			radial-gradient(90% 70% at 88% 8%, #ffffff, transparent 58%),
			linear-gradient(180deg, var(--paper), var(--paper-deep));
	}
	svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.star {
		fill: color-mix(in srgb, var(--ink) 30%, transparent);
		animation: twinkle 6.5s ease-in-out infinite;
		animation-delay: var(--d, 0s);
	}
	.star.bright {
		fill: color-mix(in srgb, var(--ink) 46%, transparent);
	}
	.link {
		stroke: color-mix(in srgb, var(--ink) 13%, transparent);
		stroke-width: 0.09;
		vector-effect: non-scaling-stroke;
	}
	@keyframes twinkle {
		0%, 100% { opacity: 0.42; }
		50% { opacity: 0.9; }
	}
	@media (prefers-reduced-motion: reduce) {
		.star { animation: none; opacity: 0.7; }
	}
</style>
