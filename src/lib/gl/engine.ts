/**
 * Маленький движок для живых поверхностей.
 *
 * Зачем он вообще нужен, если шейдер — это тридцать строк. Затем, что на
 * странице таких поверхностей несколько (фон и по одной на каждое издание), и
 * все ошибки здесь одинаковые:
 *
 *  1. КАДР ОДИН НА ВСЕХ. Пять поверхностей с собственным `requestAnimationFrame`
 *     дерутся за один и тот же кадр, и браузер тратит время на переключение
 *     между ними вместо рисования. Здесь петля одна, а поверхности — её список.
 *
 *  2. НЕВИДИМОЕ НЕ РИСУЕТСЯ. Поверхность за краем экрана и вкладка в фоне не
 *     стоят ни одного кадра. Это не оптимизация «на всякий случай»: живой фон,
 *     который крутится в свёрнутом окне, греет телефон в кармане.
 *
 *  3. ЧАСТОТА НИЖЕ ЭКРАННОЙ. Материал течёт медленно, разницы между 60 и 30
 *     кадрами на нём не видно, а работы ровно вдвое меньше.
 *
 *  4. КАЧЕСТВО ПОДБИРАЕТСЯ ПО МАШИНЕ И ПРОВЕРЯЕТСЯ ЗАМЕРОМ. Начинаем с догадки
 *     по железу, а дальше смотрим на настоящее время кадра и снижаем плотность
 *     точек, если не успеваем. Догадка о причине тормозов в этом проекте уже
 *     дважды была неверной — поэтому решает замер, а не мнение.
 *
 * Если WebGL нет или он отвалился, поверхность молча остаётся с тем фоном,
 * который задан ей в CSS. Пустых чёрных дыр не бывает.
 */

export interface SurfaceOptions {
	canvas: HTMLCanvasElement;
	/** Исходник фрагментного шейдера. Вершинный один на всех. */
	fragment: string;
	/** Значения, которые шейдер читает как `uniform float`. Живые: читаются каждый кадр. */
	uniforms?: () => Record<string, number | [number, number] | [number, number, number]>;
	/** Кадров в секунду. Медленному материалу хватает 30. */
	fps?: number;
	/** Множитель плотности точек поверх общего качества. Фон можно рисовать грубее. */
	scale?: number;
}

export interface Surface {
	/** Снять поверхность с петли и освободить память видеокарты. */
	destroy(): void;
}

const VERTEX = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

/** Догадка о мощности машины до первого замера. */
function guessQuality(): number {
	if (typeof navigator === 'undefined') return 1;
	const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;
	const cores = navigator.hardwareConcurrency ?? 8;
	const coarse =
		typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
	if (mem <= 4 || cores <= 4) return 0.55;
	if (coarse) return 0.7;
	return 1;
}

function prefersStill(): boolean {
	return (
		typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
	);
}

interface Entry {
	canvas: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	program: WebGLProgram;
	vao: WebGLVertexArrayObject | null;
	locations: Map<string, WebGLUniformLocation | null>;
	uniforms: () => Record<string, number | [number, number] | [number, number, number]>;
	frameMs: number;
	scale: number;
	last: number;
	visible: boolean;
	width: number;
	height: number;
	born: number;
}

const entries = new Set<Entry>();
let loop = 0;
let quality = 1;
let qualityKnown = false;
/** Скользящее время кадра всей петли: по нему решаем, тянет ли машина. */
let slowFrames = 0;
let observer: IntersectionObserver | null = null;
let resizer: ResizeObserver | null = null;

function ensureObservers(): void {
	if (typeof IntersectionObserver === 'undefined') return;
	observer ??= new IntersectionObserver(
		(list) => {
			for (const item of list) {
				for (const entry of entries) {
					if (entry.canvas === item.target) entry.visible = item.isIntersecting;
				}
			}
		},
		// Немного заранее: поверхность должна уже течь к тому моменту, когда
		// человек её увидит, а не оживать у него на глазах.
		{ rootMargin: '120px' },
	);
	resizer ??= new ResizeObserver((list) => {
		for (const item of list) {
			for (const entry of entries) if (entry.canvas === item.target) resize(entry);
		}
	});
}

function resize(entry: Entry): void {
	const rect = entry.canvas.getBoundingClientRect();
	if (rect.width === 0 || rect.height === 0) return;
	const dpr = Math.min(typeof devicePixelRatio === 'number' ? devicePixelRatio : 1, 2);
	const density = Math.max(0.4, dpr * quality * entry.scale);
	const w = Math.max(1, Math.round(rect.width * density));
	const h = Math.max(1, Math.round(rect.height * density));
	if (w === entry.width && h === entry.height) return;
	entry.width = w;
	entry.height = h;
	entry.canvas.width = w;
	entry.canvas.height = h;
}

function compile(gl: WebGL2RenderingContext, fragment: string): WebGLProgram | null {
	const build = (type: number, source: string): WebGLShader | null => {
		const shader = gl.createShader(type);
		if (!shader) return null;
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			// Шейдер не собрался — молчим в бою, но говорим при разработке:
			// поверхность просто не появится, и без сообщения это не найти.
			if (import.meta.env.DEV) console.warn('[gl]', gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	};

	const vs = build(gl.VERTEX_SHADER, VERTEX);
	const fs = build(gl.FRAGMENT_SHADER, fragment);
	if (!vs || !fs) return null;

	const program = gl.createProgram();
	if (!program) return null;
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	gl.deleteShader(vs);
	gl.deleteShader(fs);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		if (import.meta.env.DEV) console.warn('[gl]', gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		return null;
	}
	return program;
}

function draw(entry: Entry, now: number): void {
	const { gl } = entry;
	gl.viewport(0, 0, entry.width, entry.height);
	gl.useProgram(entry.program);
	gl.bindVertexArray(entry.vao);

	const put = (name: string, value: number | number[]): void => {
		if (!entry.locations.has(name)) {
			entry.locations.set(name, gl.getUniformLocation(entry.program, name));
		}
		const loc = entry.locations.get(name);
		if (!loc) return;
		if (typeof value === 'number') gl.uniform1f(loc, value);
		else if (value.length === 2) gl.uniform2f(loc, value[0], value[1]);
		else if (value.length === 3) gl.uniform3f(loc, value[0], value[1], value[2]);
	};

	put('uTime', (now - entry.born) / 1000);
	put('uSize', [entry.width, entry.height]);
	for (const [name, value] of Object.entries(entry.uniforms())) put(name, value);

	gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function tick(now: number): void {
	loop = requestAnimationFrame(tick);
	if (typeof document !== 'undefined' && document.hidden) return;

	const started = performance.now();
	let drew = false;

	for (const entry of entries) {
		if (!entry.visible) continue;
		if (now - entry.last < entry.frameMs) continue;
		entry.last = now;
		draw(entry, now);
		drew = true;
	}

	if (!drew || qualityKnown) return;

	// Замер: если кадры стабильно долгие, машина не тянет выбранную плотность.
	// Снижаем один раз и на этом успокаиваемся — вечная подстройка сама по себе
	// стоит дороже, чем лишние точки.
	if (performance.now() - started > 12) slowFrames += 1;
	else slowFrames = Math.max(0, slowFrames - 1);

	if (slowFrames >= 12) {
		quality = Math.max(0.4, quality * 0.65);
		qualityKnown = true;
		for (const entry of entries) {
			entry.width = 0;
			resize(entry);
		}
	}
}

/** Живая поверхность в переданном холсте. `null` — рисовать нечем, оставьте CSS-фон. */
export function createSurface(options: SurfaceOptions): Surface | null {
	const { canvas, fragment } = options;
	const gl = canvas.getContext('webgl2', {
		alpha: true,
		antialias: false,
		depth: false,
		stencil: false,
		// Живой фон не стоит того, чтобы будить дискретную видеокарту ноутбука.
		powerPreference: 'low-power',
		preserveDrawingBuffer: false,
	});
	if (!gl) return null;

	const program = compile(gl, fragment);
	if (!program) return null;

	// Один треугольник вместо двух: он покрывает экран целиком и рисуется
	// быстрее прямоугольника, потому что нет шва по диагонали.
	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
	const attr = gl.getAttribLocation(program, 'aPos');
	gl.enableVertexAttribArray(attr);
	gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);

	if (!qualityKnown) quality = guessQuality();

	const still = prefersStill();
	const entry: Entry = {
		canvas,
		gl,
		program,
		vao,
		locations: new Map(),
		uniforms: options.uniforms ?? (() => ({})),
		frameMs: 1000 / (options.fps ?? 30),
		scale: options.scale ?? 1,
		last: 0,
		visible: true,
		width: 0,
		height: 0,
		born: performance.now(),
	};
	resize(entry);

	if (still) {
		// Человек попросил систему не двигать картинку. Материал он всё равно
		// увидит — но один кадр, застывший.
		draw(entry, performance.now());
		return {
			destroy() {
				gl.deleteProgram(program);
				gl.deleteBuffer(buffer);
				gl.deleteVertexArray(vao);
			},
		};
	}

	ensureObservers();
	observer?.observe(canvas);
	resizer?.observe(canvas);
	entries.add(entry);
	if (!loop) loop = requestAnimationFrame(tick);

	const onContextLost = (event: Event): void => {
		// Видеокарта забрала контекст (спящий режим, смена монитора). Не спорим:
		// снимаем поверхность, CSS-фон под ней остаётся.
		event.preventDefault();
		entries.delete(entry);
	};
	canvas.addEventListener('webglcontextlost', onContextLost);

	return {
		destroy() {
			canvas.removeEventListener('webglcontextlost', onContextLost);
			observer?.unobserve(canvas);
			resizer?.unobserve(canvas);
			entries.delete(entry);
			gl.deleteProgram(program);
			gl.deleteBuffer(buffer);
			gl.deleteVertexArray(vao);
			if (entries.size === 0 && loop) {
				cancelAnimationFrame(loop);
				loop = 0;
			}
		},
	};
}
