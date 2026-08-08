<!--
  Снимок программы.

  Программа тёмная, и на первом экране она лежит в светлой рамке, как устройство
  на столе.

  Снимок ПОДКЛЮЧАЕТСЯ САМ, когда появится файл `static/app-screen.png`: картинка
  сначала проверяется в памяти и вставляется, только если действительно
  загрузилась. Так на странице никогда не бывает битой иконки, а сборщик сайта
  не жалуется на ссылку в никуда.

  Пока снимка нет, показан макет из тех же материалов, что в программе. Это
  честная заглушка, а не обещание: она не притворяется настоящим экраном и не
  показывает выдуманных цифр.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	const SRC = `${base}/app-screen.png`;
	let real = $state(false);

	onMount(() => {
		const probe = new Image();
		probe.onload = () => (real = true);
		probe.src = SRC;
	});
</script>

<figure class="shot">
	<div class="frame">
		{#if real}
			<img src={SRC} alt="Экран программы Exsul" decoding="async" />
		{:else}
			<div class="mock" aria-hidden="true">
				<div class="mock-bar">
					<span class="chip"></span>
					<span class="chip w2"></span>
					<span class="chip w3"></span>
				</div>
				<div class="mock-kpi">
					{#each [0, 1, 2] as i (i)}
						<div class="kpi">
							<span class="kpi-num"></span>
							<span class="kpi-lbl"></span>
						</div>
					{/each}
				</div>
				<div class="mock-grid">
					{#each [0, 1, 2, 3, 4, 5] as i (i)}
						<div class="tile" style:--d="{i * 70}ms">
							<span class="tile-photo"></span>
							<span class="tile-line"></span>
							<span class="tile-line short"></span>
						</div>
					{/each}
				</div>
				<div class="mock-dock">
					{#each [0, 1, 2, 3, 4] as i (i)}
						<span class="dock-icon" class:on={i === 2}></span>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</figure>

<style>
	.shot {
		margin: 0;
	}
	.frame {
		padding: 10px;
		border-radius: var(--radius-lg);
		background: color-mix(in srgb, #ffffff 12%, transparent);
		border: 1px solid color-mix(in srgb, #ffffff 16%, transparent);
		box-shadow:
			0 2px 6px rgb(0 0 0 / 0.4),
			0 40px 90px rgb(0 0 0 / 0.45);
	}
	.frame img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: calc(var(--radius-lg) - 10px);
	}

	/* ── Заглушка: тот же материал, что в программе ── */
	.mock {
		display: flex;
		flex-direction: column;
		gap: 12px;
		aspect-ratio: 16 / 10;
		padding: 14px;
		border-radius: calc(var(--radius-lg) - 10px);
		background: linear-gradient(180deg, #14161b, #0b0d11);
	}
	.mock-bar {
		display: flex;
		gap: 7px;
	}
	.chip {
		height: 10px;
		width: 70px;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.1);
	}
	.chip.w2 {
		width: 42px;
	}
	.chip.w3 {
		width: 54px;
	}

	.mock-kpi {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 9px;
	}
	.kpi {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 11px;
		border-radius: 12px;
		border: 1px solid rgb(255 255 255 / 0.08);
		background: rgb(255 255 255 / 0.04);
	}
	.kpi-num {
		height: 16px;
		width: 58%;
		border-radius: 5px;
		background: linear-gradient(90deg, rgb(255 255 255 / 0.34), transparent);
	}
	.kpi-lbl {
		height: 7px;
		width: 42%;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.1);
	}

	.mock-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 9px;
		flex: 1;
	}
	.tile {
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 9px;
		border-radius: 12px;
		border: 1px solid rgb(255 255 255 / 0.08);
		background: rgb(255 255 255 / 0.04);
		animation: breathe 5.2s ease-in-out infinite;
		animation-delay: var(--d);
	}
	.tile-photo {
		flex: 1;
		border-radius: 8px;
		background: linear-gradient(135deg, rgb(150 180 235 / 0.24), transparent 70%);
	}
	.tile-line {
		height: 6px;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.11);
	}
	.tile-line.short {
		width: 52%;
	}

	.mock-dock {
		display: flex;
		justify-content: center;
		gap: 8px;
		padding: 7px;
		border-radius: 14px;
		border: 1px solid rgb(255 255 255 / 0.08);
		background: rgb(255 255 255 / 0.05);
	}
	.dock-icon {
		width: 20px;
		height: 20px;
		border-radius: 6px;
		background: rgb(255 255 255 / 0.12);
	}
	.dock-icon.on {
		background: rgb(255 255 255 / 0.34);
	}

	@keyframes breathe {
		0%,
		100% {
			opacity: 0.75;
		}
		50% {
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.tile {
			animation: none;
		}
	}
</style>
