<!--
  Как устроено. Страница для того, кто спрашивает «а где мои данные?» и «а если
  интернета нет?». Отвечаем прямо и без технических слов.

  Раньше весь текст этой страницы был вшит по-русски и не переводился: на
  английском и грузинском человек упирался в стену кириллицы. Теперь она живёт
  в словаре, как и всё остальное.
-->
<script lang="ts">
	import { base } from '$app/paths';
	import { t } from '$lib/i18n';

	const BLOCKS = [
		{ head: 'about_p2p_head', text: 'about_p2p_text', note: 'about_p2p_note' },
		{ head: 'about_conflict_head', text: 'about_conflict_text' },
		{ head: 'about_safety_head', text: 'about_safety_text' },
		{ head: 'about_backup_head', text: 'about_backup_text' },
		{ head: 'about_privacy_head', text: 'about_privacy_text' },
	] as const;
</script>

<svelte:head>
	<title>Как устроен Exsul</title>
</svelte:head>

<section class="page head">
	<h1>{$t('about_head')}</h1>
	<p class="lead">{$t('about_sub')}</p>
</section>

<section class="page blocks">
	{#each BLOCKS as block, i (block.head)}
		<article class="slab block reveal" class:wide={i === 0}>
			<h2>{$t(block.head)}</h2>
			<p class="muted">{$t(block.text)}</p>
			{#if 'note' in block && block.note}
				<p class="faint note">{$t(block.note)}</p>
			{/if}
		</article>
	{/each}
</section>

<section class="page closing">
	<div class="slab lift box reveal">
		<h2>{$t('nav_specs')}</h2>
		<p class="lead">{$t('specs_sub')}</p>
		<a class="btn btn-primary" href="{base}/specs">{$t('nav_specs')}</a>
	</div>
</section>

<style>
	.head {
		padding: clamp(44px, 8vh, 96px) 0 30px;
	}
	.head h1 {
		margin-bottom: 14px;
	}

	.blocks {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 14px;
	}
	.block {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 30px 30px 32px;
	}
	/* Первый блок отвечает на главный вопрос, поэтому занимает всю ширину. */
	.block.wide {
		grid-column: 1 / -1;
	}
	.block h2 {
		font-size: clamp(1.35rem, 2.2vw, 1.9rem);
	}
	.block p {
		font-size: 0.96rem;
	}
	.note {
		font-size: 0.88rem;
		padding-top: 4px;
		border-top: 1px solid var(--line);
	}

	.closing {
		padding: clamp(50px, 9vh, 104px) 0 0;
	}
	.box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		padding: clamp(38px, 6vw, 66px);
		text-align: center;
		border-radius: var(--radius-l);
	}
	.box .lead {
		text-align: center;
	}
</style>
