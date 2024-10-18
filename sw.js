const staticCacheName = 'site-static-v1';
const assets = [
    '.',
    'index.html',
    'app.js',
    'dog.png',
    'style.css',
    'images/icons/icon-128x128.png',
    'images/icons/icon-192x192.png'
];

// Событие install (вызывается при установке)
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('Кэширование ресурсов');
            return cache.addAll(assets);
        })
        .catch(err => console.error('Ошибка кэширования:', err)) // Обработка ошибки
    );
});

// Событие activate (обновление кэша)
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// Событие fetch (вызывается при любом запросе к серверу)
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        })
    );
});