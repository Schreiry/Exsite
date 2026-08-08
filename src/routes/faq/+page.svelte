<!--
  Вопросы и планы.

  Обе части намеренно на одной странице: сюда приходят с сомнением, а сомнение
  снимается двумя вещами — честным ответом на неудобный вопрос и честным
  списком того, что ещё не сделано.

  Ответы раскрываются нажатием (обычный `<details>`, а не самодельная гармошка):
  так они работают с клавиатуры, ищутся поиском по странице и печатаются.
-->
<script lang="ts">
	import { base } from '$app/paths';
	import { t } from '$lib/i18n';

	const QUESTIONS = [
		['faq_q_internet', 'faq_a_internet'],
		['faq_q_data', 'faq_a_data'],
		['faq_q_newpc', 'faq_a_newpc'],
		['faq_q_expire', 'faq_a_expire'],
		['faq_q_staff', 'faq_a_staff'],
		['faq_q_upgrade', 'faq_a_upgrade'],
		['faq_q_refund', 'faq_a_refund'],
	] as const;

	const ROAD = [
		['road_ka', 'road_ka_text'],
		['road_bt', 'road_bt_text'],
		['road_shop', 'road_shop_text'],
		['road_apple', 'road_apple_text'],
	] as const;
</script>

<svelte:head>
	<title>Вопросы об Exsul</title>
</svelte:head>

<section class="page head">
	<h1>{$t('faq_head')}</h1>
</section>

<section class="page list">
	{#each QUESTIONS as [q, a] (q)}
		<details class="slab item reveal">
			<summary>
				<span class="q">{$t(q)}</span>
				<span class="sign" aria-hidden="true"></span>
			</summary>
			<p class="muted a">{$t(a)}</p>
		</details>
	{/each}
</section>

<section class="page section">
	<div class="section-intro reveal">
		<h2>{$t('road_head')}</h2>
		<p class="lead">{$t('road_sub')}</p>
	</div>

	<ol class="road">
		{#each ROAD as [title, text] (title)}
			<li class="slab step reveal">
				<span class="badge">{$t('soon_badge')}</span>
				<h3>{$t(title)}</h3>
				<p class="muted">{$t(text)}</p>
			</li>
		{/each}
	</ol>
</section>

<section class="page section closing">
	<div class="slab lift box reveal">
		<h2>{$t('foot_contact')}</h2>
		<p class="lead">{$t('buy_manual_note')}</p>
		<a class="btn btn-primary" href="mailto:gamerdg634@gmail.com">gamerdg634@gmail.com</a>
		<a class="btn btn-quiet" href="{base}/editions">{$t('nav_editions')}</a>
	</div>
</section>

<style>
	.head {
		padding: clamp(44px, 8vh, 96px) 0 30px;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.item {
		padding: 0 26px;
		overflow: hidden;
	}
	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 22px 0;
		cursor: pointer;
		list-style: none;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: -4px;
		border-radius: 8px;
	}
	.q {
		font-family: var(--font-display);
		font-size: 1.06rem;
		font-weight: 500;
		letter-spacing: -0.01em;
	}

	/* Плюс, который превращается в минус. Две полоски вместо стрелки: стрелка
	   обещает переход на другую страницу, а здесь раскрывается текст. */
	.sign {
		position: relative;
		flex: 0 0 auto;
		width: 15px;
		height: 15px;
	}
	.sign::before,
	.sign::after {
		content: '';
		position: absolute;
		inset: 50% 0 auto 0;
		height: 1.5px;
		border-radius: 2px;
		background: var(--ink-soft);
		transition: transform 0.3s var(--ease-out);
	}
	.sign::after {
		transform: rotate(90deg);
	}
	.item[open] .sign::after {
		transform: rotate(0deg);
	}

	.a {
		padding: 0 0 24px;
		font-size: 0.96rem;
		max-width: 68ch;
	}

	.section {
		padding: clamp(58px, 10vh, 118px) 0 0;
	}
	.section-intro {
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin-bottom: 26px;
		max-width: 62ch;
	}

	.road {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 14px;
	}
	.step {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		padding: 26px 28px;
	}
	.step p {
		font-size: 0.94rem;
	}

	.closing .box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		padding: clamp(38px, 6vw, 66px);
		text-align: center;
		border-radius: var(--radius-l);
	}
	.closing .lead {
		text-align: center;
	}
</style>
