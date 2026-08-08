/**
 * Новости — записи о том, что появляется в программе.
 *
 * Записи хранятся здесь, а не в отдельных файлах разметки: их единицы, а
 * сборщик markdown ради трёх абзацев — лишний инструмент, который придётся
 * обслуживать. Форма записи от места хранения не зависит, поэтому переезд,
 * когда записей станет много, ничего не сломает.
 *
 * КАЖДАЯ ЗАПИСЬ ПЕРЕВЕДЕНА. Новость, написанная только по-русски, на грузинской
 * версии выглядит как чужая страница, случайно попавшая на сайт. Если перевода
 * пока нет, берётся русский — это видно и это чинится, в отличие от пустоты.
 *
 * Правило текста то же, что у заметок обновлений в программе: пишем для
 * человека, о выгоде, без технических слов.
 */
import type { Lang } from '$lib/i18n';

export interface PostText {
	title: string;
	summary: string;
	/** Абзацы. Разметки нет намеренно: она соблазняет писать длинно. */
	body: string[];
}

export interface Post {
	slug: string;
	/** ISO, без времени: новость датируется днём, а не минутой. */
	date: string;
	/** Номер версии, если запись про обновление. */
	tag?: string;
	text: Record<Lang, PostText>;
}

export const POSTS: readonly Post[] = [
	{
		slug: 'dock-and-glass',
		date: '2026-08-07',
		tag: '1.1.8',
		text: {
			ru: {
				title: 'Нижняя панель стала своей, а вход — звёздным',
				summary:
					'Кнопки нижней панели теперь расставляются как удобно и переезжают на все ваши устройства. А экран входа встречает звёздным небом.',
				body: [
					'Кнопки можно расставлять перетаскиванием — прямо в панели или списком в настройках. Порядок, цвета и убранные разделы появляются на всех ваших устройствах сами.',
					'Под курсором кнопка вырастает, соседние подрастают меньше, а сама панель плавно поднимается следом. Быстрые клавиши идут за порядком: Ctrl и единица — первая кнопка, Ctrl и двойка — вторая.',
					'Экран входа получил настоящее небо со звёздами и созвездиями, а графический ключ избавился от рамки: точки лежат прямо на небе.',
				],
			},
			en: {
				title: 'The bottom bar became yours, and the lock screen got a sky',
				summary:
					'Bottom bar buttons can now be arranged however you like, and the arrangement travels to all your devices. The lock screen greets you with a starry sky.',
				body: [
					'Buttons are arranged by dragging, either in the bar itself or as a list in settings. The order, the colours and the hidden sections appear on all your devices by themselves.',
					'Under the cursor a button grows, its neighbours grow a little less, and the bar rises smoothly after them. Shortcuts follow the order: Ctrl and one is the first button, Ctrl and two the second.',
					'The lock screen now has a real sky with stars and constellations, and the pattern lock lost its frame: the dots lie directly on the sky.',
				],
			},
			ka: {
				title: 'ქვედა პანელი თქვენებური გახდა, შესვლა კი ვარსკვლავიანი',
				summary:
					'ქვედა პანელის ღილაკები ახლა თქვენთვის მოსახერხებლად ეწყობა და ყველა თქვენს მოწყობილობაზე გადადის. შესვლის ეკრანი კი ვარსკვლავიანი ცით გხვდებათ.',
				body: [
					'ღილაკების გადალაგება შეიძლება გადათრევით — პირდაპირ პანელში ან სიით პარამეტრებში. თანმიმდევრობა, ფერები და დამალული განყოფილებები ყველა თქვენს მოწყობილობაზე თავად ჩნდება.',
					'კურსორის ქვეშ ღილაკი იზრდება, მეზობლები ნაკლებად, თავად პანელი კი ნაზად ადის მათ კვალდაკვალ. სწრაფი კლავიშები თანმიმდევრობას მისდევს: Ctrl და ერთი — პირველი ღილაკი, Ctrl და ორი — მეორე.',
					'შესვლის ეკრანს ნამდვილი ცა დაემატა ვარსკვლავებითა და თანავარსკვლავედებით, გრაფიკულ გასაღებს კი ჩარჩო მოეხსნა: წერტილები პირდაპირ ცაზე დევს.',
				],
			},
		},
	},
	{
		slug: 'packing-that-thinks',
		date: '2026-08-07',
		tag: '1.1.8',
		text: {
			ru: {
				title: 'Упаковка, которая подсказывает',
				summary:
					'Окно упаковки само говорит, что собрать под заказы, какую цену поставить и сколько вы на этом заработаете.',
				body: [
					'Программа смотрит на активные заказы и показывает, чего не хватает: сколько упаковок нужно, сколько можно собрать прямо сейчас и на что не хватает сырья.',
					'Под ценой появились подсказки: двадцать, тридцать, сорок и пятьдесят процентов заработка. В расчёт входят цветы, работа сборщика и расходники — лента, бумага, ваза.',
					'Рядом с суммой партии теперь видно заработок. Если у сырья не задана цена закупки, программа честно говорит «неизвестно» вместо красивой, но выдуманной цифры.',
				],
			},
			en: {
				title: 'Packing that gives advice',
				summary:
					'The packing window now tells you what to assemble for open orders, what price to set and how much you will earn on it.',
				body: [
					'The app looks at open orders and shows what is missing: how many packs are needed, how many can be assembled right now and what there are no stems for.',
					'Price hints appeared: twenty, thirty, forty and fifty percent of earnings. The calculation includes the flowers, the work of the person packing and the consumables — ribbon, paper, vase.',
					'Next to the batch total you now see the earnings. If a purchase price is missing, the app honestly says «unknown» instead of a pretty but invented figure.',
				],
			},
			ka: {
				title: 'შეფუთვა, რომელიც გირჩევთ',
				summary:
					'შეფუთვის ფანჯარა თავად გეუბნებათ, რა აწყოთ შეკვეთებისთვის, რა ფასი დადოთ და რამდენს გამოიმუშავებთ ამაზე.',
				body: [
					'პროგრამა უყურებს აქტიურ შეკვეთებს და აჩვენებს, რა აკლია: რამდენი შეფუთვაა საჭირო, რამდენის აწყობა შეიძლება ახლავე და რისთვის არ არის ნედლეული.',
					'ფასის ქვეშ გაჩნდა მინიშნებები: მოგების ოცი, ოცდაათი, ორმოცი და ორმოცდაათი პროცენტი. ანგარიშში შედის ყვავილები, შემფუთავის შრომა და ხარჯვადი მასალა — ლენტი, ქაღალდი, ვაზა.',
					'პარტიის თანხის გვერდით ახლა ჩანს მოგება. თუ ნედლეულს შესყიდვის ფასი არ აქვს, პროგრამა პატიოსნად ამბობს «უცნობია» ლამაზი, მაგრამ მოგონილი ციფრის ნაცვლად.',
				],
			},
		},
	},
];

export const postBySlug = (slug: string): Post | undefined => POSTS.find((p) => p.slug === slug);

/** Текст записи на нужном языке. Нет перевода — берём русский, а не пустоту. */
export const textOf = (post: Post, code: Lang): PostText => post.text[code] ?? post.text.ru;

/** Дата словами того же языка, на котором читают. */
export function formatDate(iso: string, code: Lang): string {
	const locale = code === 'ka' ? 'ka-GE' : code === 'en' ? 'en-GB' : 'ru-RU';
	try {
		return new Date(iso).toLocaleDateString(locale, {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
	} catch {
		return iso;
	}
}
