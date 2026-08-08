/**
 * Звёздное небо витрины — тот же рисунок, что на экране входа в программу.
 *
 * Здесь оно светлое: почти белый лист, звёзды тёмные и очень тихие. Это не
 * украшение ради украшения — это связь с программой: человек, увидевший небо
 * на сайте, встретит его же при первом запуске.
 *
 * Копия модуля из программы намеренно: сайт собирается отдельно и ничего из
 * неё не тянет. Расхождение здесь безопасно — это картинка, а не расчёт денег.
 */

export interface SkyStar {
	x: number;
	y: number;
	r: number;
	delay: number;
}

export interface Constellation {
	name: string;
	stars: { x: number; y: number; r: number }[];
	lines: [number, number][];
}

/** Большая Медведица — ковш из семи звёзд. */
const URSA_MAJOR: Constellation = {
	name: 'ursa-major',
	stars: [
		{ x: 0.02, y: 0.62, r: 1.15 },
		{ x: 0.2, y: 0.5, r: 1.0 },
		{ x: 0.37, y: 0.44, r: 0.9 },
		{ x: 0.55, y: 0.5, r: 0.85 },
		{ x: 0.62, y: 0.78, r: 0.95 },
		{ x: 0.92, y: 0.86, r: 1.1 },
		{ x: 0.86, y: 0.56, r: 1.2 },
	],
	lines: [
		[0, 1],
		[1, 2],
		[2, 3],
		[3, 4],
		[4, 5],
		[5, 6],
		[6, 3],
	],
};

/** Орион — плечи, пояс из трёх звёзд, ноги. */
const ORION: Constellation = {
	name: 'orion',
	stars: [
		{ x: 0.16, y: 0.06, r: 1.25 },
		{ x: 0.78, y: 0.12, r: 1.0 },
		{ x: 0.38, y: 0.48, r: 0.9 },
		{ x: 0.5, y: 0.5, r: 0.95 },
		{ x: 0.62, y: 0.52, r: 0.9 },
		{ x: 0.26, y: 0.94, r: 1.1 },
		{ x: 0.86, y: 0.9, r: 1.3 },
	],
	lines: [
		[0, 2],
		[1, 4],
		[2, 3],
		[3, 4],
		[2, 5],
		[4, 6],
	],
};

/** Кассиопея — пять звёзд буквой W. */
const CASSIOPEIA: Constellation = {
	name: 'cassiopeia',
	stars: [
		{ x: 0.03, y: 0.2, r: 0.95 },
		{ x: 0.28, y: 0.78, r: 1.05 },
		{ x: 0.52, y: 0.28, r: 1.15 },
		{ x: 0.75, y: 0.84, r: 1.0 },
		{ x: 0.97, y: 0.34, r: 0.9 },
	],
	lines: [
		[0, 1],
		[1, 2],
		[2, 3],
		[3, 4],
	],
};

export interface PlacedConstellation {
	constellation: Constellation;
	x: number;
	y: number;
	size: number;
	opacity: number;
}

/**
 * Созвездия разведены по краям, середина оставлена пустой: там стоит заголовок
 * и снимок программы, и фигура под ними мешала бы читать.
 */
export const SKY_LAYOUT: readonly PlacedConstellation[] = [
	{ constellation: URSA_MAJOR, x: 0.04, y: 0.05, size: 0.26, opacity: 0.5 },
	{ constellation: ORION, x: 0.72, y: 0.62, size: 0.24, opacity: 0.42 },
	{ constellation: CASSIOPEIA, x: 0.1, y: 0.74, size: 0.18, opacity: 0.34 },
];

/**
 * Мелкие звёзды. Раскладка детерминированная: небо не должно перетасовываться
 * при каждой перерисовке — человек видит один и тот же вид, а не мигание.
 */
export function starField(count: number, seed = 20260807): SkyStar[] {
	let state = seed >>> 0;
	const next = () => {
		state ^= state << 13;
		state ^= state >>> 17;
		state ^= state << 5;
		return ((state >>> 0) % 100000) / 100000;
	};

	const out: SkyStar[] = [];
	for (let i = 0; i < count; i += 1) {
		const bright = next();
		out.push({
			x: next(),
			y: next(),
			r: 0.05 + bright * bright * 0.13,
			delay: next() * 7,
		});
	}
	return out;
}
