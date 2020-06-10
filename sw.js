var ver=1;
var CACHE_STATIC_NAME = 'static-v'+ver;

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/src/images/icons/app-icon-48x48.png',
          '/src/images/icons/app-icon-96x96.png',
          '/src/images/icons/app-icon-144x144.png',
          '/src/images/icons/app-icon-192x192.png',
          '/src/images/icons/app-icon-256x256.png',
          '/src/images/icons/app-icon-384x384.png',
          '/src/images/icons/app-icon-512x512.png',
          '/src/css/app.css',
          '/src/js/app.js'
        ]);
      })
  )
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(res) {
        return res;
      })
  );
});
