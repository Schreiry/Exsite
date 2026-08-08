<!--
  Новости.

  Список собирается из двух источников, как решил владелец: записи, написанные
  руками, и заметки текущего обновления, которые приезжают из того же файла,
  что читает сама программа. Второй источник избавляет от обязанности дублировать
  одно и то же: выпустили версию — новость про неё уже на сайте.

  Заметка о версии стоит в списке только если она не повторяет запись, написанную
  вручную для той же версии: два рассказа об одном обновлении подряд выглядят
  как ошибка.
-->
<script lang="ts">
	import { base } from '$app/paths';
	import { t, lang } from '$lib/i18n';
	import { POSTS, textOf, formatDate } from '$lib/content/posts';
	import { release } from '$lib/stores/release';

	const handWritten = $derived(POSTS.map((p) => ({ post: p, text: textOf(p, $lang) })));

	const releaseNote = $derived(
		$release.notes.length > 0 && !POSTS.some((p) => p.tag === $release.version)
			? {
					version: $release.version,
					date: $release.releaseDate ?? '',
					notes: $release.notes.slice(0, 4),
					url: $release.releasePageUrl,
				}
			: null,
	);
</script>

<svelte:head>
	<title>Новости Exsul</title>
</svelte:head>

<section class="page head">
	<h1>{$t('blog_head')}</h1>
	<p class="lead">{$t('blog_sub')}</p>
</section>

<section class="page list">
	{#if releaseNote}
		<a class="slab post reveal" href={releaseNote.url}>
			<div class="meta">
				{#if releaseNote.date}
					<time datetime={releaseNote.date}>{formatDate(releaseNote.date, $lang)}</time>
				{/if}
				<span class="tag nums">{releaseNote.version}</span>
			</div>
			<h2>{$t('blog_release')} {releaseNote.version}</h2>
			<ul class="bullets">
				{#each releaseNote.notes as note (note)}
					<li>{note}</li>
				{/each}
			</ul>
		</a>
	{/if}

	{#each handWritten as row (row.post.slug)}
		<a class="slab post reveal" href="{base}/blog/{row.post.slug}">
			<div class="meta">
				<time datetime={row.post.date}>{formatDate(row.post.date, $lang)}</time>
				{#if row.post.tag}<span class="tag nums">{row.post.tag}</span>{/if}
			</div>
			<h2>{row.text.title}</h2>
			<p class="muted">{row.text.summary}</p>
		</a>
	{/each}
</section>

<style>
	.head {
		padding: clamp(44px, 8vh, 96px) 0 26px;
	}
	.head h1 {
		margin-bottom: 14px;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding-bottom: 40px;
	}
	.post {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 30px 32px;
		transition:
			transform 0.35s var(--ease-out),
			box-shadow 0.35s ease,
			border-color 0.25s ease;
	}
	.post:hover {
		transform: translateY(-2px);
		border-color: var(--line-strong);
		box-shadow: var(--shadow-3);
	}
	.post h2 {
		font-size: clamp(1.3rem, 2.4vw, 1.9rem);
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 0.82rem;
		color: var(--ink-faint);
	}
	.tag {
		padding: 2px 9px;
		border-radius: 999px;
		border: 1px solid var(--line);
		font-size: 0.76rem;
	}

	.bullets {
		list-style: none;
		margin: 2px 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 7px;
		font-size: 0.95rem;
		color: var(--ink-soft);
	}
	.bullets li {
		position: relative;
		padding-left: 17px;
	}
	.bullets li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62em;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--ink-faint);
	}
</style>
