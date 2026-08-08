<!--
  Оформление покупки.

  Программа без ключа не работает, поэтому это главный экран сайта, а не
  приложение к нему. Задача одна: человек выбирает издание и платит.

  Что произойдёт дальше, написано прямо на странице. Человек, отдающий деньги,
  обязан заранее знать, что получит и куда это придёт, иначе он не платит.

  Пока оплата не подключена, та же кнопка ведёт на заявку: покупатель не
  упирается в тупик, а владелец получает письмо и выдаёт ключ вручную.

  Здесь была ошибка, из-за которой страница не работала вовсе: издание по
  умолчанию называлось иначе, чем в списке изданий, поэтому не выбиралось
  ничего и ссылка на оплату не находилась никогда. Теперь имя издания
  разбирается одной общей проверкой, а не сравнением строк на глаз.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { t, price, lang, formatPrice } from '$lib/i18n';
	import { EDITIONS, parseEditionId, type EditionId } from '$lib/content/editions';
	import { checkoutFor } from '$lib/content/checkout';
	import { canPostForm, mailtoFor, sendOrder, OWNER_EMAIL } from '$lib/content/orderForm';

	let edition = $state<EditionId>('standart');
	let name = $state('');
	let contact = $state('');
	let note = $state('');
	let sending = $state<'idle' | 'sending' | 'sent' | 'failed'>('idle');
	let touched = $state(false);

	const chosen = $derived(EDITIONS.find((e) => e.id === edition) ?? EDITIONS[1]);
	const payUrl = $derived(checkoutFor(edition));
	const valid = $derived(contact.trim().length > 3);

	onMount(() => {
		const asked = parseEditionId(new URLSearchParams(window.location.search).get('edition'));
		if (asked) edition = asked;
	});

	async function submit(e: Event): Promise<void> {
		e.preventDefault();
		touched = true;
		if (!valid || sending === 'sending') return;
		const req = { name: name.trim(), contact: contact.trim(), edition, note: note.trim() };

		if (!canPostForm()) {
			// Приёмник заявок ещё не настроен — открываем письмо с заполненными
			// полями. Молча «отправить в никуда» нельзя: человек будет ждать.
			window.location.href = mailtoFor(req);
			sending = 'sent';
			return;
		}
		sending = 'sending';
		sending = (await sendOrder(req)) ? 'sent' : 'failed';
	}
</script>

<svelte:head>
	<title>Купить Exsul</title>
</svelte:head>

<section class="page wrap">
	<h1>{$t('buy_head')}</h1>
	<p class="lead">{$t('buy_sub')}</p>

	<div class="picker slab">
		{#each EDITIONS as e (e.id)}
			<button
				type="button"
				class="pick"
				class:on={edition === e.id}
				aria-pressed={edition === e.id}
				onclick={() => (edition = e.id)}
			>
				<span class="pick-name">{$t(e.nameKey)}</span>
				<span class="pick-price nums">{e.priceUsd === null ? '—' : $price(e.priceUsd)}</span>
			</button>
		{/each}
	</div>

	<div class="slab summary">
		<div class="sum-row">
			<span class="muted">{$t('buy_edition')}</span>
			<b>{$t(chosen.nameKey)}</b>
		</div>
		<div class="sum-row total">
			<span>{$t('buy_total')}</span>
			<b class="amount nums">
				{chosen.priceUsd === null ? $t('ed_price_soon') : $price(chosen.priceUsd)}
			</b>
		</div>

		{#if $lang === 'ka' && chosen.priceUsd !== null}
			<!-- Списывают доллары. Сумма в лари — пересчёт, и молчать об этом нельзя:
			     человек увидит в банке другое число и решит, что его обманули. -->
			<p class="faint fx">
				{$t('buy_gel_note').replace('{usd}', formatPrice(chosen.priceUsd, 'en'))}
			</p>
		{/if}

		{#if payUrl}
			<a class="btn btn-primary pay" href={payUrl}>{$t('buy_send')}</a>
		{/if}

		<ol class="steps">
			<li>{$t('buy_step_pay')}</li>
			<li>{$t('buy_step_key')}</li>
			<li>{$t('buy_step_activate')}</li>
		</ol>
	</div>

	{#if !payUrl}
		{#if sending === 'sent'}
			<div class="slab done">
				<span class="ok" aria-hidden="true">
					<svg viewBox="0 0 16 16" width="16" height="16">
						<path
							d="M3.5 8.4 6.5 11.4 12.5 4.9"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
				<p>{$t('buy_sent')}</p>
			</div>
		{:else}
			<form class="slab form" onsubmit={submit} novalidate>
				<p class="muted form-lead">{$t('buy_manual_note')}</p>

				<label class="field">
					<span class="field-label">{$t('buy_name')}</span>
					<input type="text" bind:value={name} autocomplete="name" />
				</label>

				<label class="field">
					<span class="field-label">{$t('buy_contact')}</span>
					<input
						type="text"
						bind:value={contact}
						autocomplete="email"
						aria-invalid={touched && !valid}
						oninput={() => (touched = true)}
					/>
					{#if touched && !valid}
						<span class="field-error">{$t('buy_required')}</span>
					{/if}
				</label>

				<label class="field">
					<span class="field-label">{$t('buy_note')}</span>
					<textarea rows="3" bind:value={note}></textarea>
				</label>

				{#if sending === 'failed'}
					<p class="fail">
						{$t('buy_fail')}
						<a href="mailto:{OWNER_EMAIL}">{OWNER_EMAIL}</a>
					</p>
				{/if}

				<button class="btn btn-primary" type="submit" disabled={sending === 'sending'}>
					{sending === 'sending' ? '…' : $t('buy_request')}
				</button>
			</form>
		{/if}
	{/if}
</section>

<style>
	.wrap {
		max-width: 640px;
		padding: clamp(44px, 8vh, 96px) 0 60px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.picker {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
		gap: 4px;
		padding: 5px;
		margin-top: 12px;
	}
	.pick {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
		padding: 12px 14px;
		border: none;
		border-radius: 13px;
		background: transparent;
		color: var(--ink-soft);
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			background 0.18s ease,
			color 0.18s ease;
	}
	.pick:hover {
		color: var(--ink);
		background: color-mix(in srgb, var(--ink) 5%, transparent);
	}
	.pick.on {
		background: var(--accent);
		color: var(--accent-ink);
	}
	.pick-name {
		font-size: 0.92rem;
		font-weight: 450;
	}
	.pick-price {
		font-size: 0.8rem;
		opacity: 0.78;
	}

	.summary {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 26px;
	}
	.sum-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		font-size: 0.95rem;
	}
	.sum-row.total {
		padding-top: 12px;
		border-top: 1px solid var(--line);
	}
	.amount {
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 500;
		letter-spacing: -0.02em;
	}
	.fx {
		font-size: 0.82rem;
		margin-top: -4px;
	}
	.pay {
		margin-top: 6px;
	}

	.steps {
		margin: 4px 0 0;
		padding-left: 20px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.88rem;
		color: var(--ink-soft);
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 15px;
		padding: 26px;
	}
	.form-lead {
		font-size: 0.9rem;
	}

	/* Подпись поля живёт над ним и не исчезает при вводе: подпись внутри поля
	   пропадает ровно тогда, когда человек забыл, что он тут заполняет. */
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.86rem;
		color: var(--ink-soft);
	}
	.field-label {
		font-weight: 450;
	}
	input,
	textarea {
		padding: 12px 14px;
		border-radius: 13px;
		border: 1px solid var(--line-strong);
		background: color-mix(in srgb, var(--ink) 3%, transparent);
		color: var(--ink);
		font: inherit;
		font-size: 0.95rem;
		transition:
			border-color 0.18s ease,
			box-shadow 0.18s ease;
	}
	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 12%, transparent);
	}
	input[aria-invalid='true'] {
		border-color: #b3261e;
	}
	textarea {
		resize: vertical;
	}
	.field-error {
		font-size: 0.8rem;
		color: #b3261e;
	}
	.fail {
		color: #b3261e;
		font-size: 0.86rem;
	}
	.fail a {
		color: inherit;
		text-decoration: underline;
	}
	.done {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 24px 26px;
	}
	.ok {
		width: 32px;
		height: 32px;
		flex: 0 0 auto;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: var(--accent);
		color: var(--accent-ink);
	}
</style>
