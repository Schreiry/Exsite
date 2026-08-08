/**
 * Текущая версия программы — одна на весь сайт.
 *
 * Манифест запрашивается ОДИН раз за посещение, а не на каждой странице: номер
 * версии стоит в подвале, значит нужен везде, и четыре одинаковых запроса при
 * переходах — чистая трата.
 *
 * Пока ответ не пришёл, показывается последняя известная версия. Пустое место
 * там, где человек ищет номер, читается как «сайт сломан», а слегка устаревший
 * номер не врёт ни о чём важном: ссылки на скачивание всё равно ведут в
 * хранилище обновлений.
 */
import { readable } from 'svelte/store';
import { FALLBACK, fetchRelease, type ReleaseInfo } from '$lib/content/releases';

let started = false;
let known: ReleaseInfo = FALLBACK;

export const release = readable<ReleaseInfo>(FALLBACK, (set) => {
	set(known);
	if (started || typeof fetch === 'undefined') return;
	started = true;
	void fetchRelease().then((info) => {
		known = info;
		set(info);
	});
});
