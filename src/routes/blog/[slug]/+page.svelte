<!--
  Одна запись новостей.

  Текст берётся на языке читателя; если перевода записи ещё нет, показывается
  русский. Пустая страница вместо новости — худший из вариантов.
-->
<script lang="ts">
	import { base } from '$app/paths';
	import { t, lang } from '$lib/i18n';
	import { textOf, formatDate } from '$lib/content/posts';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const text = $derived(textOf(data.post, $lang));
</script>

<svelte:head>
	<title>{text.title} — Exsul</title>
	<meta name="description" content={text.summary} />
</svelte:head>

<article class="page post">
	<a class="back" href="{base}/blog">← {$t('blog_back')}</a>
	<div class="meta">
		<time datetime={data.post.date}>{formatDate(data.post.date, $lang)}</time>
		{#if data.post.tag}<span class="tag nums">{data.post.tag}</span>{/if}
	</div>
	<h1>{text.title}</h1>
	<p class="lead">{text.summary}</p>

	<div class="body slab">
		{#each text.body as para (para)}
			<p>{para}</p>
		{/each}
	</div>
</article>

<style>
	.post {
		max-width: 760px;
		padding: clamp(36px, 7vh, 84px) 0 40px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.post h1 {
		font-size: clamp(2rem, 4.4vw, 3.2rem);
	}
	.back {
		color: var(--ink-soft);
		font-size: 0.9rem;
	}
	.back:hover {
		color: var(--ink);
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
		color: var(--ink);
		font-weight: 500;
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 32px;
		color: var(--ink);
		font-size: 1.02rem;
		line-height: 1.72;
	}
</style>
