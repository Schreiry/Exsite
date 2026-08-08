<!--
  Знак Exsul.

  Логотип — прозрачное стекло со светлыми бликами. На белом листе такое
  изображение почти исчезает, поэтому в светлых местах он лежит на тёмной
  шайбе: ровно так же, как иконка программы лежит на рабочем столе. На тёмном
  первом экране шайба не нужна — там знак светится сам.

  Размеры файла подобраны заранее (32…512), браузер берёт подходящий сам через
  `srcset`. Отдавать картинку в тысячу точек ради значка в двадцать — самый
  простой способ сделать сайт медленным.
-->
<script lang="ts">
	import { base } from '$app/paths';

	interface Props {
		/** Сторона знака в точках. */
		size?: number;
		/**
		 * Тёмная подложка. По умолчанию её НЕТ: знак сделан из стекла и должен
		 * лежать прямо на полотне, а рамка вокруг превращает его в наклейку.
		 * Нужна только там, где под знаком светлая плита.
		 */
		plate?: boolean;
		class?: string;
	}

	let { size = 28, plate = false, class: className = '' }: Props = $props();

	const SIZES = [32, 64, 128, 180, 256, 512];
	const srcset = SIZES.map((s) => `${base}/logo-${s}.png ${s}w`).join(', ');
	const fallback = `${base}/logo-128.png`;
</script>

<span
	class="logo {className}"
	class:plate
	style:--s="{size}px"
>
	<img
		src={fallback}
		{srcset}
		sizes="{size}px"
		width={size}
		height={size}
		alt=""
		decoding="async"
		draggable="false"
	/>
</span>

<style>
	.logo {
		display: inline-grid;
		place-items: center;
		width: var(--s);
		height: var(--s);
		flex: 0 0 auto;
	}
	.logo img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		/* Знак не лежит на плоскости, а висит над ней: мягкий холодный ореол
		   плюс короткая тень. Тени по форме стекла браузер считает сам. */
		filter:
			drop-shadow(0 1px 2px rgb(0 0 0 / 0.45))
			drop-shadow(0 0 18px rgb(150 190 255 / 0.22));
	}

	/* Шайба: тёмный камень с мягким светом сверху, как у иконки на столе. */
	.logo.plate {
		padding: calc(var(--s) * 0.13);
		width: calc(var(--s) * 1.26);
		height: calc(var(--s) * 1.26);
		border-radius: calc(var(--s) * 0.34);
		background:
			radial-gradient(120% 100% at 30% 0%, #2b3240, transparent 70%),
			linear-gradient(160deg, #1b2029, #0d1016);
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.12),
			0 1px 2px rgb(16 18 24 / 0.24),
			0 6px 18px rgb(16 18 24 / 0.16);
	}
	.logo.plate img {
		filter: drop-shadow(0 1px 3px rgb(0 0 0 / 0.45));
	}
</style>
