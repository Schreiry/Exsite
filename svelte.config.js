import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * Витрина — статический сайт.
 *
 * Адрес меняется ОДНОЙ переменной. Пока домена нет, сайт живёт на GitHub Pages
 * по адресу вида `schreiry.github.io/Exsul`, и всем ссылкам нужен префикс
 * `/Exsul`. Когда домен появится, достаточно собрать без `SITE_BASE` — префикс
 * исчезнет, и ни одна страница не потребует правки.
 *
 *   npm run build                      → для своего домена (exsul.app)
 *   SITE_BASE=/Exsul npm run build     → для GitHub Pages
 *
 * `fallback: '404.html'` нужен именно Pages: сервер не знает о наших путях и
 * на прямой заход по `/editions` отдаёт свою 404 — а с этим файлом отдаст наш,
 * и роутер откроет нужную страницу сам.
 */
const base = process.env.SITE_BASE ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true,
		}),
		paths: { base, relative: false },
		prerender: { handleHttpError: 'warn' },
	},
};

export default config;
