<!--
  Фон всего сайта: угольная ткань, по которой скользит свет.

  Живёт в оболочке и НИКОГДА не перезапускается при переходе между страницами.
  Это и есть та бесшовность, о которой шла речь: страницы сменяются, а полотно
  под ними продолжает течь с той же секунды, не мигнув.

  Под холстом лежит статичная заливка теми же цветами. Она видна ровно в двух
  случаях: пока страница только открылась и если видеокарты нет вовсе. Человек
  не должен догадаться, что чего-то не хватило.
-->
<script lang="ts">
	import ShaderSurface from './ShaderSurface.svelte';
	import { BACKDROP_FRAGMENT } from '$lib/gl/shaders';

	const uniforms = () => ({
		uAmp: 1.15,
		uLight: 1,
		// Те же значения, что у токенов --void и --slate. Разойдутся — по краям
		// экрана появится шов между холстом и заливкой под ним.
		uDeep: [0.031, 0.031, 0.039] as [number, number, number],
		uHigh: [0.115, 0.118, 0.135] as [number, number, number],
	});
</script>

<div class="backdrop" aria-hidden="true">
	<ShaderSurface fragment={BACKDROP_FRAGMENT} {uniforms} fps={30} scale={0.7} />
	<span class="vignette"></span>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: -1;
		background:
			radial-gradient(120% 90% at 15% -10%, #1a1b22, transparent 62%),
			radial-gradient(100% 80% at 88% 110%, #14151b, transparent 58%),
			linear-gradient(180deg, #08080a, #101116);
	}
	/* Края чуть темнее середины: полотно выглядит натянутым, а не приклеенным. */
	.vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(120% 100% at 50% 50%, transparent 52%, rgb(0 0 0 / 0.45));
	}
</style>
