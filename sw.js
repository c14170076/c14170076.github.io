self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('first-app')
      .then(function(cache) {
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
        ])
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
