var ver=3;
var CACHE_STATIC_NAME = 'static-v'+ver;
var CACHE_DYNAMIC_NAME = 'dynamic-v'+ver;

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
          '/offline.html',
          '/manifest.json',
          '/src/images/icons/app-icon-48x48.png',
          '/src/images/icons/app-icon-96x96.png',
          '/src/images/icons/app-icon-144x144.png',
          '/src/images/icons/app-icon-192x192.png',
          '/src/images/icons/app-icon-256x256.png',
          '/src/images/icons/app-icon-384x384.png',
          '/src/images/icons/app-icon-512x512.png',
          '/src/css/app.css',
          '/src/js/app.js',
          '/src/images/logo.png',
          '/tambahan/jquery-3.5.1.slim.min.js',
          '/tambahan/popper.min.js',
          '/tambahan/bootstrap.min.js',
          '/tambahan/bootstrap.min.css',
          '/src/images/pic1.jpg',
          '/src/images/pic2.png',
          '/src/images/pic3.jpg',
          '/src/images/pic4.jpg',
          '/src/images/pic5.jpg'
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
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function(err) {
              return caches.open(CACHE_STATIC_NAME)
                .then(function(cache) {
                  return cache.match('/offline.html');
                });
            });
        }
      })
  );
});
