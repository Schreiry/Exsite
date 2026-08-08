<!--
  Живая поверхность: холст, на котором видеокарта рисует материал.

  Компонент намеренно тонкий: вся общая работа (один кадр на всех, пропуск
  невидимого, подбор качества) живёт в движке. Здесь только холст и подложка.

  ПОДЛОЖКА ОБЯЗАТЕЛЬНА. Пока WebGL не поднялся — а на части машин он не
  поднимется никогда, — виден именно CSS-фон, заданный родителем. Поэтому
  холст прозрачен и лежит поверх подложки, а не вместо неё: отсутствие
  видеокарты выглядит как спокойный градиент, а не как чёрная дыра.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { createSurface, type Surface } from '$lib/gl/engine';

	interface Props {
		fragment: string;
		uniforms?: () => Record<string, number | [number, number] | [number, number, number]>;
		fps?: number;
		scale?: number;
		/** Подпись для чтения с экрана не нужна: это украшение, а не содержание. */
		class?: string;
	}

	let { fragment, uniforms, fps = 30, scale = 1, class: className = '' }: Props = $props();

	let canvas: HTMLCanvasElement;
	let alive = $state(false);

	onMount(() => {
		let surface: Surface | null = null;
		// Ждём первую раскладку: до неё холст нулевого размера, и качество
		// подобралось бы по пустым числам.
		const id = requestAnimationFrame(() => {
			surface = createSurface({ canvas, fragment, uniforms, fps, scale });
			alive = surface !== null;
		});
		return () => {
			cancelAnimationFrame(id);
			surface?.destroy();
		};
	});
</script>

<canvas bind:this={canvas} class="surface {className}" class:on={alive} aria-hidden="true"></canvas>

<style>
	.surface {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		/* Появляется мягко: резкое включение материала читается как мигание. */
		opacity: 0;
		transition: opacity 0.9s ease;
		pointer-events: none;
	}
	.surface.on {
		opacity: 1;
	}
</style>
