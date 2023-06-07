const FILES_TO_CACHE = [
	'/',
	'/index.html',
	'/index.js',
	'/db.js',
	'/styles.css',
	'/manifest.webmanifest',
	'/icons/android-icon-144x144.png',
	'/icons/favicon-96x96.png',
	'/icons/ms-icon-150x150.png',
	'/icons/apple-icon-60x60.png',
	'/icons/icon-96x96.png',
];

const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('Your files were pre-cached successfully!');
			return cache.addAll(FILES_TO_CACHE);
		})
	);

	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
						console.log('Removing old cache data', key);
						return caches.delete(key);
					}
				})
			);
		})
	);

	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	if (event.request.url.includes('/api')) {
		event.respondWith(
			caches
				.open(DATA_CACHE_NAME)
				.then((cache) => {
					return fetch(event.request)
						.then((response) => {
							if (response.status === 200) {
								cache.put(event.request.url, response.clone());
							}

							return response;
						})
						.catch((err) => {
							console.log(err);
							return cache.match(event.request);
						});
				})
				.catch((err) => console.log(err))
		);

		return;
	}

	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		})
	);
});
