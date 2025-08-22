

const CACHE_NAME = 'alarme-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'alarme.mp3',
  'alarme2.mp3',
  'alarme3.mp3',
  'alarme4.mp3',
  'alarme5.mp3',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto com sucesso!');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
