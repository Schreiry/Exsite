/**
 * Куда уходит заявка на лицензию.
 *
 * Сайт статический — своего сервера у него нет, и отправить письмо сам он не
 * может. Поэтому заявка уходит через приёмник форм: это одна строка настройки,
 * а не сервер, который надо держать и охранять.
 *
 * ЧТО НУЖНО СДЕЛАТЬ ОДИН РАЗ (минута, подробно — в README):
 *   1. web3forms.com → ввести свою почту → Create Access Key.
 *   2. Ключ придёт письмом. Вставить его в `ACCESS_KEY` строкой ниже.
 *   3. Опубликовать сайт заново.
 * До этого форма не пропадает и не врёт: она открывает почтовую программу с
 * уже заполненным письмом. Человек всё равно может отправить заявку, просто
 * своим почтовым клиентом.
 *
 * Когда подключим оплату (Paddle или Lemon Squeezy), кнопка «Купить» начнёт
 * вести на оплату, а эта форма останется для тех, кому нужен счёт или разговор.
 */

export const ACCESS_KEY = '';

export const OWNER_EMAIL = 'gamerdg634@gmail.com';

export interface OrderRequest {
	name: string;
	contact: string;
	edition: string;
	note: string;
}

/** Готово ли автоматическое отправление. */
export const canPostForm = (): boolean => ACCESS_KEY.trim().length > 0;

/** Письмо для запасного пути — когда ключа приёмника ещё нет. */
export function mailtoFor(req: OrderRequest): string {
	const subject = `Заявка на лицензию Exsul — ${req.edition}`;
	const body = [
		`Издание: ${req.edition}`,
		`Имя: ${req.name}`,
		`Связь: ${req.contact}`,
		'',
		req.note,
	].join('\n');
	return `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Отправить заявку. Возвращает `true`, если приёмник её принял.
 *
 * Сбой не глотаем: страница обязана сказать, что письмо не ушло, и показать
 * прямые контакты. Потерянная заявка — это потерянный покупатель.
 */
export async function sendOrder(req: OrderRequest): Promise<boolean> {
	if (!canPostForm()) return false;
	try {
		const res = await fetch('https://api.web3forms.com/submit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify({
				access_key: ACCESS_KEY,
				subject: `Заявка на лицензию Exsul — ${req.edition}`,
				from_name: req.name || 'Exsul — сайт',
				name: req.name,
				contact: req.contact,
				edition: req.edition,
				message: req.note,
			}),
		});
		return res.ok;
	} catch {
		return false;
	}
}
