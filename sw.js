const CACHE_NAME = 'bitlog-cache-v29'; // アプリを更新した時はこの名前を変更する（例: v28）
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './quagga.min.js' // ★外部URLではなく、ローカルのQuagga.jsをキャッシュするように修正
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// オフライン時はキャッシュから返す（Cache First戦略）
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // キャッシュがあればそれを返す
        }
        return fetch(event.request); // なければネットワークへ
      })
  );
});

// 古いキャッシュの削除処理
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});