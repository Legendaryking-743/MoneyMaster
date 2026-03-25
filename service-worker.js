const CACHE_NAME = 'moneymaster-v3';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './Home/home.html',
  './Home/Depenses.html',
  './Home/graphes.html',
  './Home/project.html',
  './Home/setting2.html',

  './Home/home.css',
  './Home/Depenses.css',
  './Home/project.css',
  './Home/style.css',

  './Home/script.js',
  './Home/Depenses.js',
  './Home/p.js',

  './manifest.json',

  './Home/img/Icone.png',
  './Home/img/moneymaster.png',
  './Home/nike.png',
  './Home/Fahh.mp3',
  './Home/Nice.mp3'
];

// Installation : mise en cache des fichiers
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        FILES_TO_CACHE.map(file =>
          cache.add(file).catch(() => console.warn('Fichier ignoré:', file))
        )
      )
    )
  );
  self.skipWaiting();
});

// Activation : supprime les anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch : cache first
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
