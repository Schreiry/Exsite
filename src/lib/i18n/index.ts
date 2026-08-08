/**
 * Язык сайта: русский, английский, грузинский.
 *
 * Три решения, из которых следует всё остальное.
 *
 * 1. СЛОВАРЬ В КОДЕ, ПО ФАЙЛУ НА ЯЗЫК. Отдельный загрузчик переводов на
 *    статическом сайте означал бы лишний запрос перед первой буквой. Файлы
 *    разделены, чтобы переводчик правил один язык и не боялся задеть другие.
 *
 * 2. ЯЗЫК ВЫБИРАЕТСЯ ДО ПЕРВОЙ ОТРИСОВКИ, а не в `onMount`. Иначе грузин видит
 *    вспышку русского текста, которая сменяется его языком, — и это выглядит
 *    как поломка, а не как заботливость.
 *
 * 3. ЦЕНА ПОКАЗЫВАЕТСЯ В ВАЛЮТЕ ЯЗЫКА. Грузинскому гостю сумма переводится в
 *    лари по курсу, остальным остаётся доллар. Платёж всё равно проходит в
 *    долларах — об этом на странице оплаты сказано прямо, чтобы человек не
 *    удивился списанию.
 */
import { derived, writable, type Readable } from 'svelte/store';
import { RU } from './ru';
import { EN } from './en';
import { KA } from './ka';

export type Lang = 'ru' | 'en' | 'ka';
export const LANGS: readonly Lang[] = ['ka', 'en', 'ru'];

/** Как язык подписан в переключателе. Своим алфавитом — так его узнают. */
export const LANG_LABEL: Record<Lang, string> = { ka: 'ქარ', en: 'ENG', ru: 'РУС' };

const KEY = 'exsul.site.lang';

function detect(): Lang {
	if (typeof localStorage !== 'undefined') {
		const saved = localStorage.getItem(KEY);
		if (saved === 'ru' || saved === 'en' || saved === 'ka') return saved;
	}
	if (typeof navigator !== 'undefined') {
		for (const raw of navigator.languages ?? [navigator.language]) {
			const code = (raw ?? '').slice(0, 2).toLowerCase();
			if (code === 'ka') return 'ka';
			if (code === 'ru') return 'ru';
		}
	}
	// Решение владельца: незнакомого гостя встречаем по-английски.
	return 'en';
}

export const lang = writable<Lang>(typeof window === 'undefined' ? 'en' : detect());

/** Держит `<html lang>` в согласии с выбором — это читают поисковики и озвучка. */
export function initLang(): void {
	lang.subscribe((value) => {
		if (typeof document !== 'undefined') document.documentElement.lang = value;
	});
}

export function setLang(next: Lang): void {
	lang.set(next);
	try {
		localStorage.setItem(KEY, next);
	} catch {
		/* приватный режим — выбор проживёт до перезагрузки */
	}
}

type Dict = Record<string, string>;
const DICTS: Record<Lang, Dict> = { ru: RU, en: EN, ka: KA };

/**
 * Перевод по ключу.
 *
 * Пропущенный ключ возвращает сам ключ, а не пустоту: на странице сразу видно,
 * ЧТО именно не переведено, вместо дыры, которую заметят через месяц.
 */
export const t: Readable<(key: string) => string> = derived(lang, ($lang) => {
	const dict = DICTS[$lang];
	return (key: string) => dict[key] ?? EN[key] ?? key;
});

// ── Деньги ──────────────────────────────────────────────────────────────────

/**
 * Курс лари к доллару. Число здесь — не биржевой курс, а ЦЕНА НА ВИТРИНЕ:
 * округлённая вверх до приятного значения, чтобы сумма не менялась от новостей
 * и не оказалась ниже того, что спишет платёжный посредник.
 *
 * Пересматривать раз в квартал; дату держим рядом, чтобы было видно, когда
 * число устарело.
 */
export const GEL_PER_USD = 2.75;
export const GEL_RATE_DATE = '2026-08-08';

/** Цена в валюте языка. Грузинский — лари, остальные — доллар. */
export function formatPrice(usd: number, code: Lang): string {
	if (code !== 'ka') return `$${usd}`;
	// До десятка вверх: «110 ₾» читается как цена, «107.25 ₾» — как расчёт.
	const gel = Math.ceil((usd * GEL_PER_USD) / 10) * 10;
	// Пробел неразрывный: с обычным знак валюты срывается на следующую строку,
	// и цена разваливается на две части посреди карточки.
	return `${gel} ₾`;
}

/** Цена, следящая за языком, — для разметки: `{$price(25)}`. */
export const price: Readable<(usd: number) => string> = derived(
	lang,
	($lang) =>
		(usd: number) =>
			formatPrice(usd, $lang),
);
