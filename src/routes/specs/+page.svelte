<!--
  Характеристики.

  Второй слой из решения владельца: на главной говорим о выгоде, а подробности
  для тех, кто их ищет, вынесены сюда. Так страница не пугает цветочный магазин
  словом «Rust» и одновременно убеждает того, кто разбирается.

  ЗДЕСЬ ТОЛЬКО ПРОВЕРЯЕМЫЕ ЧИСЛА. Версия приходит из файла обновлений, число
  проверок посчитано по коду. Скорости запуска и расхода памяти здесь пока нет
  намеренно: она появится, когда будет замерена на живых машинах, а не выдумана
  ради красивой строки.
-->
<script lang="ts">
	import { base } from '$app/paths';
	import { t } from '$lib/i18n';
	import { release } from '$lib/stores/release';

	const GROUPS = [
		{
			title: 'specs_group_core',
			rows: [
				{ label: 'spec_core_lang', value: 'spec_core_lang_v', hint: 'spec_core_lang_hint' },
				{ label: 'spec_ui', value: 'spec_ui_v', hint: 'spec_ui_hint' },
				{ label: 'spec_db', value: 'spec_db_v', hint: 'spec_db_hint' },
				{ label: 'spec_sync', value: 'spec_sync_v', hint: 'spec_sync_hint' },
			],
		},
		{
			title: 'specs_group_platform',
			rows: [
				{ label: 'spec_os', value: 'spec_os_v', hint: 'spec_os_hint' },
				{ label: 'spec_ram', value: 'spec_ram_v', hint: 'spec_ram_hint' },
				{ label: 'spec_net', value: 'spec_net_v', hint: 'spec_net_hint' },
			],
		},
		{
			title: 'specs_group_data',
			rows: [
				{ label: 'spec_backup', value: 'spec_backup_v', hint: 'spec_backup_hint' },
				{ label: 'spec_history', value: 'spec_history_v', hint: 'spec_history_hint' },
			],
		},
		{
			title: 'specs_group_quality',
			rows: [{ label: 'spec_tests', value: 'spec_tests_v', hint: 'spec_tests_hint' }],
		},
	] as const;
</script>

<svelte:head>
	<title>Характеристики Exsul</title>
</svelte:head>

<section class="page head">
	<h1>{$t('specs_head')}</h1>
	<p class="lead">{$t('specs_sub')}</p>
</section>

<section class="page live">
	<div class="slab live-card reveal">
		<span class="eyebrow">{$t('spec_version')}</span>
		<span class="big nums">{$release.version}</span>
		{#if $release.codename}<span class="faint">{$release.codename}</span>{/if}
	</div>
	<div class="slab live-card reveal">
		<span class="eyebrow">{$t('spec_updates_from')}</span>
		<span class="big nums">0.9.20</span>
		<span class="faint">{$t('spec_updates_from_hint')}</span>
	</div>
</section>

<section class="page groups">
	{#each GROUPS as group (group.title)}
		<section class="group reveal">
			<h2>{$t(group.title)}</h2>
			<dl class="slab rows">
				{#each group.rows as row (row.label)}
					<div class="row">
						<dt>
							<span class="label">{$t(row.label)}</span>
							<span class="hint faint">{$t(row.hint)}</span>
						</dt>
						<dd class="value">{$t(row.value)}</dd>
					</div>
				{/each}
			</dl>
		</section>
	{/each}
</section>

<section class="page closing">
	<div class="slab lift box reveal">
		<h2>{$t('nav_faq')}</h2>
		<p class="lead">{$t('faq_head')}</p>
		<a class="btn btn-primary" href="{base}/faq">{$t('nav_faq')}</a>
	</div>
</section>

<style>
	.head {
		padding: clamp(44px, 8vh, 96px) 0 30px;
	}
	.head h1 {
		margin-bottom: 14px;
	}

	.live {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 14px;
		margin-bottom: clamp(34px, 6vh, 64px);
	}
	.live-card {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 26px 28px;
	}
	.big {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 2.8rem);
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1.05;
	}

	.groups {
		display: flex;
		flex-direction: column;
		gap: clamp(30px, 5vh, 54px);
	}
	.group h2 {
		font-size: clamp(1.3rem, 2.2vw, 1.8rem);
		margin-bottom: 14px;
	}
	.rows {
		padding: 4px 26px;
	}
	.row {
		display: grid;
		grid-template-columns: minmax(200px, 1fr) minmax(160px, 0.9fr);
		gap: 18px;
		align-items: baseline;
		padding: 20px 0;
		border-bottom: 1px solid var(--line);
	}
	.row:last-child {
		border-bottom: none;
	}
	dt {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.label {
		font-weight: 450;
	}
	.hint {
		font-size: 0.83rem;
		line-height: 1.4;
	}
	.value {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.05rem;
		font-weight: 450;
		text-align: right;
		font-variant-numeric: tabular-nums;
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

	@media (max-width: 640px) {
		.row {
			grid-template-columns: 1fr;
			gap: 6px;
		}
		.value {
			text-align: left;
		}
	}
</style>
