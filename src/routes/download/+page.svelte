<!--
  Скачать. Одна задача: как можно быстрее дать нужный файл и честно сказать,
  какая это версия и что в ней нового.

  Версия берётся из того же файла обновлений, который читает сама программа:
  второй список, обновляемый руками, разошёлся бы с настоящим на втором релизе.
-->
<script lang="ts">
	import { t } from '$lib/i18n';
	import { release } from '$lib/stores/release';
	import { UPDATES_REPO } from '$lib/content/releases';
</script>

<svelte:head>
	<title>Скачать Exsul</title>
</svelte:head>

<section class="page head">
	<h1>{$t('dl_head')}</h1>
	<p class="lead">{$t('dl_sub')}</p>
	<p class="ver muted nums">
		{$t('dl_version')} {$release.version}{#if $release.codename} · {$release.codename}{/if}
	</p>
</section>

<section class="page grid">
	<article class="slab os-card">
		<div class="os" aria-hidden="true">
			<svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
				<path d="M3 5.5 10.5 4.4v7.1H3zM11.6 4.2 21 3v8.5h-9.4zM3 12.5h7.5v7.1L3 18.5zM11.6 12.5H21V21l-9.4-1.2z" />
			</svg>
		</div>
		<h2>{$t('dl_windows')}</h2>
		{#if $release.windows}
			<p class="muted file">{$release.windows.fileName}</p>
			<a class="btn btn-primary" href={$release.windows.downloadUrl}>{$t('nav_download')}</a>
		{:else}
			<a class="btn" href="{UPDATES_REPO}/releases">{$t('dl_all')}</a>
		{/if}
	</article>

	<article class="slab os-card">
		<div class="os" aria-hidden="true">
			<svg
				viewBox="0 0 24 24"
				width="34"
				height="34"
				fill="none"
				stroke="currentColor"
				stroke-width="1.7"
				stroke-linecap="round"
			>
				<rect x="6" y="2.5" width="12" height="19" rx="2.6" />
				<path d="M10.5 18.5h3" />
			</svg>
		</div>
		<h2>{$t('dl_android')}</h2>
		{#if $release.android}
			<p class="muted file">{$release.android.fileName}</p>
			<a class="btn btn-primary" href={$release.android.downloadUrl}>{$t('nav_download')}</a>
		{:else}
			<a class="btn" href="{UPDATES_REPO}/releases">{$t('dl_all')}</a>
		{/if}
	</article>

	<article class="slab os-card soon">
		<div class="os" aria-hidden="true">
			<svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
				<path
					d="M16.4 12.6c0-2 1.6-3 1.7-3-.9-1.4-2.4-1.5-2.9-1.6-1.2-.1-2.4.7-3 .7s-1.6-.7-2.6-.7c-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2 2.5 2s1.3-.6 2.5-.6 1.5.6 2.6.6 1.7-1 2.3-2c.7-1.1 1-2.2 1-2.3 0 0-2-.8-2-3.1zM14.4 5.9c.5-.7.9-1.6.8-2.6-.8 0-1.8.5-2.4 1.2-.5.6-1 1.6-.8 2.5.9.1 1.8-.4 2.4-1.1z"
				/>
			</svg>
		</div>
		<h2>macOS · iOS</h2>
		<p class="muted file">{$t('dl_apple_soon')}</p>
		<span class="badge">{$t('soon_badge')}</span>
	</article>
</section>

{#if $release.notes.length > 0}
	<section class="page block reveal">
		<h2 class="nums">{$t('dl_version')} {$release.version}</h2>
		<ul class="notes slab">
			{#each $release.notes as note (note)}
				<li>{note}</li>
			{/each}
		</ul>
	</section>
{/if}

<section class="page block">
	<p class="muted">{$t('dl_note')}</p>
	<a class="btn" href="{UPDATES_REPO}/releases">{$t('dl_all')}</a>
</section>

<style>
	.head {
		padding: clamp(44px, 8vh, 96px) 0 26px;
	}
	.head h1 {
		margin-bottom: 14px;
	}
	.ver {
		margin-top: 12px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(268px, 1fr));
		gap: 16px;
	}
	.os-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		padding: 30px;
	}
	.os {
		color: var(--ink);
	}
	.os-card.soon .os {
		color: var(--ink-faint);
	}
	.file {
		font-size: 0.84rem;
		word-break: break-word;
	}

	.block {
		padding: clamp(36px, 6vh, 72px) 0;
		display: flex;
		flex-direction: column;
		gap: 16px;
		align-items: flex-start;
	}
	.notes {
		list-style: none;
		margin: 18px 0 0;
		padding: 22px 26px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		color: var(--ink);
	}
	.notes li {
		padding-left: 18px;
		position: relative;
	}
	.notes li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62em;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ink-faint);
	}
</style>
