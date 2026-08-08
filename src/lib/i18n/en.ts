/**
 * English dictionary.
 *
 * This is the fallback for every other language, so no key may be missing here.
 * Same writing rules as the Russian file: plain words, no jargon, no em dashes
 * in headings.
 */
export const EN: Record<string, string> = {
	// ── Shell ───────────────────────────────────────────────────────────────
	nav_overview: 'Overview',
	nav_editions: 'Editions',
	nav_download: 'Download',
	nav_about: 'How it works',
	nav_blog: 'News',
	nav_specs: 'Tech specs',
	nav_faq: 'Questions',
	nav_buy: 'Buy',
	skip_to_content: 'Skip to content',
	menu_open: 'Menu',
	menu_close: 'Close menu',

	// ── Home ────────────────────────────────────────────────────────────────
	hero_kicker: 'Bookkeeping for a family business',
	hero_title: 'The whole trade. One app.',
	hero_sub:
		'Greenhouse, stock, orders, customers and money. Works offline and without anyone else’s servers: your devices talk to each other directly.',
	hero_cta: 'Buy Exsul',
	hero_second: 'See the overview',
	hero_cta_sub: 'One-time purchase. Windows and Android',
	hero_version: 'Version {v}',

	tiles_head: 'Built to be relied on',
	tile_money_title: 'Counts money honestly',
	tile_money_text:
		'Spent, worth, earned. Per product and for the whole stock. Where cost is unknown it says so instead of quietly using zero.',
	tile_offline_title: 'Works where there is no signal',
	tile_offline_text:
		'In the greenhouse, in the van, in the back of the warehouse. Your data lives on your devices, not in someone else’s cloud, and it stays there when the internet drops.',
	tile_speed_title: 'Opens right away',
	tile_speed_text:
		'The core is written in Rust and the database sits next to you. The app never waits for a network to show your own numbers.',
	tile_advice_title: 'Tells you what to do',
	tile_advice_text:
		'What is missing for open orders, what is ready to ship, who owes money and what price earns the margin you want.',
	tile_print_title: 'Prints your paperwork',
	tile_print_text:
		'Delivery notes, receipts, pre-orders and barcode labels. Straight from the app, with nothing else installed.',
	tile_yours_title: 'Stays yours forever',
	tile_yours_text:
		'A one-time purchase with no subscription. When the update period ends the app keeps working: only new versions stop arriving.',

	// ── Business modes ──────────────────────────────────────────────────────
	modes_head: 'One app. Any trade.',
	modes_sub:
		'The app reshapes itself around your business: every mode has its own screens, its own maths and its own separate database. One mode knows nothing about another.',
	mode_flowers: 'Flowers',
	mode_flowers_text:
		'Greenhouse, cutting, packing by stem count, priced stock, delivery orders on a map.',
	mode_flowers_item1: 'Incoming stems and written-off losses',
	mode_flowers_item2: 'Packing with price and profit hints',
	mode_flowers_item3: 'Orders, deadlines, debts, delivery',
	mode_workshop: 'Workshop',
	mode_workshop_text: 'Products, materials, real cost, dimensions, sales and a register.',
	mode_workshop_item1: 'Catalogue with photos and sizes',
	mode_workshop_item2: 'Materials and honest cost price',
	mode_workshop_item3: 'Sales, receipts, shifts, cash reconciliation',
	mode_retail: 'Shop',
	mode_retail_text: 'Shelf, weighed goods, register, phone as a barcode scanner.',
	mode_retail_item1: 'Barcodes and labels printed in batches',
	mode_retail_item2: 'Your phone works as the register’s scanner',
	mode_retail_item3: 'Reports by receipt and by product',
	mode_soon: 'More to come',
	mode_soon_text:
		'New trades arrive as separate layers and never disturb the one already running for you.',

	// ── Tested ──────────────────────────────────────────────────────────────
	tested_head: 'Tested on real hardware',
	tested_sub:
		'Not in theory and not on one developer machine. We ran the app on phones, tablets and computers of different years, measuring heat, responsiveness and battery drain.',
	tested_phones: 'Phones and tablets',
	tested_desktops: 'Computers',
	tested_gen6: 'Intel Core, 6th generation',
	tested_gen3: 'Intel Core, 3rd generation',
	tested_old: 'Older hardware',
	tested_old_text:
		'The app was also checked on sixth and third generation Intel machines and their AMD equivalents. On a weak computer it simplifies the glass and drops heavy effects by itself to stay quick.',
	tested_heat: 'Heat under control',
	tested_heat_text:
		'Phones got their own round of work: blur and live effects are tuned so the device does not get hot in your hand during a long shift.',

	// ── Coming to Apple ─────────────────────────────────────────────────────
	soon_badge: 'Coming soon',
	soon_apple_title: 'Exsul is coming to Mac and iPhone',
	soon_apple_text:
		'Today the app runs on Windows and Android. macOS and iOS builds are in the works: same database, same data, same direct link between your devices.',
	soon_apple_note: 'Your key is not wasted: an edition stays yours on every platform.',

	// ── Editions ────────────────────────────────────────────────────────────
	ed_head: 'Editions',
	ed_sub:
		'A one-time purchase, the app stays yours forever. Editions differ in devices, staff, features and how long updates keep coming.',
	ed_essential: 'Essential',
	ed_essential_for: 'One person, one trade',
	ed_standard: 'Standard',
	ed_standard_for: 'A family business on several devices',
	ed_advanced: 'Advanced',
	ed_advanced_for: 'Trade and production together',
	ed_ultimate: 'Ultimate',
	ed_ultimate_for: 'Those who need the app shaped around them',
	ed_featured: 'Most popular',
	ed_price_soon: 'Ask for a price',
	ed_price_note: 'Once, forever',
	ed_buy: 'Buy',
	ed_choose: 'Choose',
	ed_chosen: 'Chosen',
	ed_compare: 'What each edition includes',
	ed_compare_hint: 'Tap an edition to see only that one.',
	ed_compare_all: 'Show all',
	ed_forever: 'The app stays yours forever',
	ed_included: 'Included',
	ed_not_included: 'Not included',

	feat_group_core: 'Basics',
	feat_group_team: 'People and devices',
	feat_group_power: 'Power',
	feat_group_care: 'Care',

	feat_core: 'Books, stock, orders, printing',
	feat_core_hint: 'Products, balances, customers, money, documents.',
	feat_p2p: 'Server-free sync',
	feat_p2p_hint: 'Devices exchange data directly, bypassing other people’s clouds.',
	feat_backup: 'Backups',
	feat_backup_hint: 'Database and photos in one password-protected file.',
	feat_devices: 'Your devices',
	feat_devices_hint: 'The owner’s computers and phones, which see all the money.',
	feat_staff: 'Staff',
	feat_staff_hint: 'Their phones handle orders but never receive revenue or cost figures.',
	feat_modes: 'Business modes',
	feat_modes_hint: 'Flowers, workshop, shop and future trades.',
	feat_widgets: 'Dashboard widgets',
	feat_widgets_hint: 'Your own set of cards on the home screen.',
	feat_analytics: 'Deep analytics',
	feat_analytics_hint: 'Charts over time, profit and margin, breakdown by category.',
	feat_excel: 'Export to Excel',
	feat_excel_hint: 'Any table in the app becomes a file in one tap.',
	feat_pos: 'Register',
	feat_pos_hint: 'Sales with receipts, shifts and cash reconciliation.',
	feat_scanner: 'Barcode scanner',
	feat_scanner_hint: 'Your phone becomes a scanner for the register.',
	feat_labels: 'Batch label printing',
	feat_labels_hint: 'Barcodes and QR for the whole stock in one go.',
	feat_updates: 'Updates',
	feat_updates_hint: 'How long new versions keep arriving. The app works after that too.',
	feat_support: 'Support',
	feat_support_hint: 'How fast we answer and by which channel.',
	feat_custom: 'Changes for you',
	feat_custom_hint: 'The app adjusted to how you actually work.',

	val_yes: 'Yes',
	val_no: 'No',
	val_two_devices: '2',
	val_three_devices: '3',
	val_five_devices: '5',
	val_ten_devices: '10',
	val_no_staff: 'none',
	val_two_staff: '2',
	val_five_staff: '5',
	val_unlimited: 'unlimited',
	val_one_mode: 'one',
	val_all_modes: 'all',
	val_basic: 'basic',
	val_6_months: '6 months',
	val_12_months: '1 year',
	val_36_months: '3 years',
	val_forever: 'forever',
	val_mail: 'email',
	val_priority: 'fast',
	val_personal_6: 'personal, 6 months',

	ed_staff_head: 'Staff are counted separately',
	ed_staff_text:
		'Staff do not take up your own device slots. A worker’s phone receives orders and stock, while revenue, cost and reports are never sent to it at all. These are not hidden screens: that data simply does not travel to their device.',
	ed_updates_head: 'What happens when updates end',
	ed_updates_text:
		'Nothing switches off. The app keeps working with your data, offline, for as long as you need. Only new versions stop arriving, and you can extend them whenever you like.',

	// ── Specs ───────────────────────────────────────────────────────────────
	specs_head: 'Tech specs',
	specs_sub:
		'For those who like detail. Honest numbers: what is inside, what it runs on and what it needs.',
	specs_group_core: 'Inside',
	specs_group_platform: 'Where it runs',
	specs_group_data: 'Data',
	specs_group_quality: 'Quality',
	spec_core_lang: 'Core',
	spec_core_lang_v: 'Rust',
	spec_core_lang_hint: 'The language people use when something must be fast and must not crash.',
	spec_ui: 'Interface',
	spec_ui_v: 'Svelte 5',
	spec_ui_hint: 'Screens are compiled ahead of time instead of being rebuilt on every move.',
	spec_db: 'Database',
	spec_db_v: 'SQLite, a file on your disk',
	spec_db_hint: 'The same format browsers and phones use. Openable by anything, going nowhere.',
	spec_sync: 'Device link',
	spec_sync_v: 'Direct, no server',
	spec_sync_hint: 'Over cable, Wi-Fi or a private network. Your data passes through no one else.',
	spec_os: 'Systems',
	spec_os_v: 'Windows 10 and 11, Android 8 and newer',
	spec_os_hint: 'macOS and iOS are in the works.',
	spec_ram: 'Memory needed',
	spec_ram_v: '4 GB and up',
	spec_ram_hint: 'Checked on weak machines too: heavy glass turns itself off there.',
	spec_net: 'Internet',
	spec_net_v: 'Not required',
	spec_net_hint: 'Only for updates and the first key check.',
	spec_backup: 'Backup',
	spec_backup_v: 'One file with database and photos',
	spec_backup_hint: 'Compressed and password-protected. Restore is verified automatically.',
	spec_history: 'History',
	spec_history_v: 'Kept in full',
	spec_history_hint: 'Every movement of goods and money stays a record you can look up.',
	spec_tests: 'Automated checks',
	spec_tests_v: '113 in the core and 45 suites in the interface',
	spec_tests_hint: 'Run before every build so old things do not break under new ones.',
	spec_version: 'Current version',
	spec_updates_from: 'Updates from version',
	spec_updates_from_hint: 'Older builds migrate their data step by step before updating.',

	// ── How it works ────────────────────────────────────────────────────────
	about_head: 'How it works',
	about_sub: 'Briefly: why the app runs offline and why your data is yours.',
	about_p2p_head: 'Not a single server of ours',
	about_p2p_text:
		'There is no cloud collecting your numbers. Every device keeps the full database and exchanges changes directly with your other devices. The office computer and the phone in the van agree between themselves once they share a network.',
	about_p2p_note:
		'If the two are far apart they find each other through a private network you switch on yourself.',
	about_conflict_head: 'Two people changed the same thing',
	about_conflict_text:
		'Nothing is lost. Every action is written as its own event with its own time, and devices fold those events into one order. The winner is not whoever saved last: the app merges both.',
	about_safety_head: 'What staff can see',
	about_safety_text:
		'Revenue, cost and reports are not sent to a worker’s device. The role is granted from the main device and signed with its key, so another phone cannot declare itself the owner and ask for the money.',
	about_backup_head: 'If the computer dies',
	about_backup_text:
		'A backup is one file with your photos inside, closed with a password. Restoring is verified on the spot rather than on the bad day: the app unpacks the copy and checks it.',
	about_privacy_head: 'What we know about you',
	about_privacy_text:
		'Nothing about your trade. We see no customers, no revenue, no products. The key is checked once at activation, and that is where our part ends.',

	// ── Download ────────────────────────────────────────────────────────────
	dl_head: 'Download Exsul',
	dl_sub: 'The app needs a key. Buy an edition and the key arrives by email with the install link.',
	dl_windows: 'For Windows',
	dl_android: 'For Android',
	dl_version: 'Version',
	dl_all: 'All versions and what changed',
	dl_note: 'Files live in the same store the app itself checks for updates.',
	dl_apple_soon: 'Mac and iPhone builds are on the way.',

	// ── Buy ─────────────────────────────────────────────────────────────────
	buy_head: 'Checkout',
	buy_sub:
		'After payment the key arrives by email, usually within a minute, together with the install link.',
	buy_name: 'Your name',
	buy_contact: 'Email or phone',
	buy_edition: 'Edition',
	buy_note: 'Anything we should know',
	buy_send: 'Go to payment',
	buy_total: 'Total',
	buy_gel_note: 'You will be charged in dollars: {usd}. The lari figure is a conversion.',
	buy_step_pay: 'You pay by card. A payment partner handles the money, not us.',
	buy_step_key: 'The key arrives by email, usually within a minute.',
	buy_step_activate: 'Open Settings, then Licence, paste the key and start working.',
	buy_manual_note:
		'Card payment is being connected. Leave your contact and we will issue the key and suggest a convenient way to pay.',
	buy_request: 'Send request',
	buy_sent: 'Request sent. We will answer on the contact you gave.',
	buy_fail: 'Could not send. Please write to us directly:',
	buy_required: 'Leave an email or phone, otherwise there is nowhere to send the key.',

	// ── Questions ───────────────────────────────────────────────────────────
	faq_head: 'Common questions',
	faq_q_internet: 'Do I need the internet?',
	faq_a_internet:
		'No. It is needed once to check the key and later for updates. All the work happens without it.',
	faq_q_newpc: 'I changed computers. Is my key gone?',
	faq_a_newpc:
		'No. The key belongs to your account, not to the hardware. Free the old device in settings and activate the new one.',
	faq_q_expire: 'What happens when updates end?',
	faq_a_expire:
		'The app keeps working with your data, without limits. Only new versions stop arriving.',
	faq_q_data: 'Where is my data?',
	faq_a_data:
		'On your devices. We neither see nor store it. You make the backup yourself, as one file, and keep it wherever you like.',
	faq_q_refund: 'Can I get a refund?',
	faq_a_refund: 'Yes, within fourteen days if the app does not suit you. Write to us and we refund.',
	faq_q_upgrade: 'Can I move to a higher edition?',
	faq_a_upgrade: 'Yes, at any time. You pay the difference and your data stays where it is.',
	faq_q_staff: 'Will an employee see my revenue?',
	faq_a_staff:
		'No. Money summaries are never sent to their device, so there is nothing there to find.',

	// ── Roadmap ─────────────────────────────────────────────────────────────
	road_head: 'What comes next',
	road_sub: 'We do not promise what we are not building. Here is the work already under way.',
	road_ka: 'Full Georgian interface',
	road_ka_text: 'The whole app translated down to the last label, not only the main screens.',
	road_bt: 'Bluetooth link',
	road_bt_text: 'Devices will find each other even where there is no Wi-Fi and no internet.',
	road_shop: 'Shop front from the app',
	road_shop_text: 'Your own catalogue site taking orders, published in one tap.',
	road_apple: 'Mac and iPhone builds',
	road_apple_text: 'The same app and the same data on Apple hardware.',

	// ── News ────────────────────────────────────────────────────────────────
	blog_head: 'News',
	blog_sub: 'What appears in the app and what changes. Short and to the point.',
	blog_back: 'All news',
	blog_release: 'Release',

	// ── Footer ──────────────────────────────────────────────────────────────
	foot_rights: 'Bookkeeping for small trade',
	foot_contact: 'Contact',
	foot_lang: 'Language',
	foot_product: 'Product',
	foot_help: 'Help',
	foot_version: 'Current version',
};
