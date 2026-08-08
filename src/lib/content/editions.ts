/**
 * Издания Exsul — что во что входит.
 *
 * ЭТОТ ФАЙЛ ПОВТОРЯЕТ `docs/EDITIONS.md`, а не придумывает своё. Правила
 * изданий живут там; здесь только их машинная запись для страницы. Разошлись —
 * значит, кто-то правил код мимо документа, и покупателю показывают два разных
 * обещания.
 *
 * ВНУТРЕННИЕ ИМЕНА (`essential`, `standart`, `advanced`, `ultimate`) совпадают с
 * теми, что в программе и в уже выпущенных ключах. Написание `standart` —
 * не опечатка, а исторический код тарифа: по нему служба активации узнаёт, что
 * выдавать. На экране человек видит правильное «Standard» (ключ `ed_standard`).
 * Менять внутреннее имя нельзя, видимое — сколько угодно.
 *
 * Цена в долларах: ими работает платёжный посредник. `null` означает «цена не
 * объявлена» — страница честно покажет «Уточнить стоимость» вместо выдумки.
 */

export type EditionId = 'essential' | 'standart' | 'advanced' | 'ultimate';

export type FeatureId =
	| 'core'
	| 'p2p'
	| 'backup'
	| 'devices'
	| 'staff'
	| 'modes'
	| 'widgets'
	| 'analytics'
	| 'excel'
	| 'pos'
	| 'scanner'
	| 'labels'
	| 'updates'
	| 'support'
	| 'custom';

/** Группы существуют ради чтения: пятнадцать строк подряд человек не осилит. */
export type FeatureGroup = 'core' | 'team' | 'power' | 'care';

export interface Feature {
	id: FeatureId;
	group: FeatureGroup;
	titleKey: string;
	hintKey: string;
}

export const FEATURE_GROUPS: readonly { id: FeatureGroup; titleKey: string }[] = [
	{ id: 'core', titleKey: 'feat_group_core' },
	{ id: 'team', titleKey: 'feat_group_team' },
	{ id: 'power', titleKey: 'feat_group_power' },
	{ id: 'care', titleKey: 'feat_group_care' },
];

export const FEATURES: readonly Feature[] = [
	{ id: 'core', group: 'core', titleKey: 'feat_core', hintKey: 'feat_core_hint' },
	{ id: 'p2p', group: 'core', titleKey: 'feat_p2p', hintKey: 'feat_p2p_hint' },
	{ id: 'backup', group: 'core', titleKey: 'feat_backup', hintKey: 'feat_backup_hint' },

	{ id: 'devices', group: 'team', titleKey: 'feat_devices', hintKey: 'feat_devices_hint' },
	{ id: 'staff', group: 'team', titleKey: 'feat_staff', hintKey: 'feat_staff_hint' },
	{ id: 'modes', group: 'team', titleKey: 'feat_modes', hintKey: 'feat_modes_hint' },

	{ id: 'widgets', group: 'power', titleKey: 'feat_widgets', hintKey: 'feat_widgets_hint' },
	{ id: 'analytics', group: 'power', titleKey: 'feat_analytics', hintKey: 'feat_analytics_hint' },
	{ id: 'excel', group: 'power', titleKey: 'feat_excel', hintKey: 'feat_excel_hint' },
	{ id: 'pos', group: 'power', titleKey: 'feat_pos', hintKey: 'feat_pos_hint' },
	{ id: 'scanner', group: 'power', titleKey: 'feat_scanner', hintKey: 'feat_scanner_hint' },
	{ id: 'labels', group: 'power', titleKey: 'feat_labels', hintKey: 'feat_labels_hint' },

	{ id: 'updates', group: 'care', titleKey: 'feat_updates', hintKey: 'feat_updates_hint' },
	{ id: 'support', group: 'care', titleKey: 'feat_support', hintKey: 'feat_support_hint' },
	{ id: 'custom', group: 'care', titleKey: 'feat_custom', hintKey: 'feat_custom_hint' },
];

/**
 * Значение строки в издании.
 *   true  — входит,
 *   false — не входит,
 *   объект — входит с уточнением («3 устройства», «6 месяцев»).
 */
export type FeatureValue = boolean | { textKey: string };

export interface Edition {
	id: EditionId;
	nameKey: string;
	forWhoKey: string;
	/** Доллары. `null` — цена ещё не объявлена. */
	priceUsd: number | null;
	/** Выделенное издание — то, которое советуем большинству. */
	featured?: boolean;
	/**
	 * Оттенок живого материала карточки, в градусах цветового круга.
	 * Чем дороже издание, тем теплее и глубже материал: серебро → сталь →
	 * синева → бронза. Цвет здесь единственная роскошь, поэтому он приглушён.
	 */
	hue: number;
	/** Сила свечения материала, 0..1. Растёт вместе с изданием. */
	richness: number;
	features: Record<FeatureId, FeatureValue>;
}

const yes = true;
const no = false;

export const EDITIONS: readonly Edition[] = [
	{
		id: 'essential',
		nameKey: 'ed_essential',
		forWhoKey: 'ed_essential_for',
		priceUsd: 25,
		hue: 220,
		richness: 0.18,
		features: {
			core: yes,
			p2p: yes,
			backup: yes,
			devices: { textKey: 'val_two_devices' },
			staff: { textKey: 'val_no_staff' },
			modes: { textKey: 'val_one_mode' },
			widgets: no,
			analytics: { textKey: 'val_basic' },
			excel: no,
			pos: no,
			scanner: no,
			labels: no,
			updates: { textKey: 'val_6_months' },
			support: { textKey: 'val_mail' },
			custom: no,
		},
	},
	{
		id: 'standart',
		nameKey: 'ed_standard',
		forWhoKey: 'ed_standard_for',
		priceUsd: 40,
		featured: true,
		hue: 205,
		richness: 0.36,
		features: {
			core: yes,
			p2p: yes,
			backup: yes,
			devices: { textKey: 'val_three_devices' },
			staff: { textKey: 'val_two_staff' },
			modes: { textKey: 'val_all_modes' },
			widgets: yes,
			analytics: yes,
			excel: yes,
			pos: no,
			scanner: no,
			labels: no,
			updates: { textKey: 'val_12_months' },
			support: { textKey: 'val_mail' },
			custom: no,
		},
	},
	{
		id: 'advanced',
		nameKey: 'ed_advanced',
		forWhoKey: 'ed_advanced_for',
		priceUsd: 65,
		hue: 250,
		richness: 0.58,
		features: {
			core: yes,
			p2p: yes,
			backup: yes,
			devices: { textKey: 'val_five_devices' },
			staff: { textKey: 'val_five_staff' },
			modes: { textKey: 'val_all_modes' },
			widgets: yes,
			analytics: yes,
			excel: yes,
			pos: yes,
			scanner: yes,
			labels: yes,
			updates: { textKey: 'val_36_months' },
			support: { textKey: 'val_priority' },
			custom: no,
		},
	},
	{
		id: 'ultimate',
		nameKey: 'ed_ultimate',
		forWhoKey: 'ed_ultimate_for',
		priceUsd: 180,
		hue: 32,
		richness: 0.85,
		features: {
			core: yes,
			p2p: yes,
			backup: yes,
			devices: { textKey: 'val_ten_devices' },
			staff: { textKey: 'val_unlimited' },
			modes: { textKey: 'val_all_modes' },
			widgets: yes,
			analytics: yes,
			excel: yes,
			pos: yes,
			scanner: yes,
			labels: yes,
			updates: { textKey: 'val_forever' },
			support: { textKey: 'val_personal_6' },
			custom: yes,
		},
	},
];

export const editionById = (id: EditionId): Edition | undefined => EDITIONS.find((e) => e.id === id);

/** Есть ли объявленные цены — от этого зависит вид кнопок покупки. */
export const pricesAnnounced = (): boolean => EDITIONS.some((e) => e.priceUsd !== null);

/** Разбор `?edition=` из ссылки. Чужая строка — значит, проверяем. */
export function parseEditionId(raw: string | null): EditionId | null {
	if (!raw) return null;
	const found = EDITIONS.find((e) => e.id === raw);
	return found ? found.id : null;
}
