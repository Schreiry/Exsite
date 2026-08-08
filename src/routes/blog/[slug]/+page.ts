import { error } from '@sveltejs/kit';
import { POSTS, postBySlug } from '$lib/content/posts';
import type { EntryGenerator, PageLoad } from './$types';

/** Какие записи собрать в файлы — статическому сайту нужен точный список. */
export const entries: EntryGenerator = () => POSTS.map((p) => ({ slug: p.slug }));

export const load: PageLoad = ({ params }) => {
	const post = postBySlug(params.slug);
	if (!post) throw error(404, 'Запись не найдена');
	return { post };
};
