/**
 * Откуда сайт узнаёт о версиях.
 *
 * Из того же файла обновлений, который читает сама программа. Второй список
 * версий, который надо было бы обновлять руками, разошёлся бы с настоящим уже
 * на втором релизе — и человек скачал бы не то.
 *
 * Файл лежит в репозитории обновлений. Сайт запрашивает его в браузере, а не
 * при сборке: тогда новая версия появляется на странице сама, без пересборки
 * сайта. Не ответил — показываем последнюю известную (`FALLBACK`), потому что
 * пустая страница загрузки хуже слегка устаревшей.
 */

export const UPDATES_REPO = 'https://github.com/Schreiry/Exsul-Updates';

export const MANIFEST_URL =
	'https://raw.githubusercontent.com/Schreiry/Exsul-Updates/main/update-manifest.json';

export interface PlatformFile {
	fileName: string;
	downloadUrl: string;
	sha256?: string;
}

export interface ReleaseInfo {
	version: string;
	codename?: string;
	releaseDate?: string;
	releasePageUrl?: string;
	notes: string[];
	windows?: PlatformFile;
	android?: PlatformFile;
}

/** Что показать, пока (или если) манифест недоступен. */
export const FALLBACK: ReleaseInfo = {
	version: '1.1.8',
	codename: 'Led Zeppelin',
	releasePageUrl: `${UPDATES_REPO}/releases`,
	notes: [],
};

/** Разбор манифеста. Чужой файл — значит, каждое поле проверяем. */
export function parseManifest(raw: unknown): ReleaseInfo | null {
	if (!raw || typeof raw !== 'object') return null;
	const m = raw as Record<string, unknown>;
	if (typeof m.version !== 'string' || m.version.length === 0) return null;

	const platforms = (m.platforms ?? {}) as Record<string, unknown>;
	const file = (key: string): PlatformFile | undefined => {
		const p = platforms[key];
		if (!p || typeof p !== 'object') return undefined;
		const o = p as Record<string, unknown>;
		if (typeof o.downloadUrl !== 'string' || typeof o.fileName !== 'string') return undefined;
		return {
			fileName: o.fileName,
			downloadUrl: o.downloadUrl,
			sha256: typeof o.sha256 === 'string' ? o.sha256 : undefined,
		};
	};

	return {
		version: m.version,
		codename: typeof m.codename === 'string' ? m.codename : undefined,
		releaseDate: typeof m.releaseDate === 'string' ? m.releaseDate : undefined,
		releasePageUrl:
			typeof m.releasePageUrl === 'string' ? m.releasePageUrl : `${UPDATES_REPO}/releases`,
		notes: Array.isArray(m.notes) ? m.notes.filter((n): n is string => typeof n === 'string') : [],
		windows: file('windows-x64'),
		android: file('android-arm64'),
	};
}

export async function fetchRelease(): Promise<ReleaseInfo> {
	try {
		const res = await fetch(MANIFEST_URL, { cache: 'no-store' });
		if (!res.ok) return FALLBACK;
		return parseManifest(await res.json()) ?? FALLBACK;
	} catch {
		return FALLBACK;
	}
}
