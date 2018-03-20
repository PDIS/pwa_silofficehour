
var dataCacheName = 'aucalPWA-v1';
var cacheName = 'aucalPWA-final-1';
var filesToCache = [
 
  'https://aucal.pdis.nat.gov.tw/auCal',
  'https://code.jquery.com/jquery-1.12.4.js',
  'https://cdn.jsdelivr.net/npm/vue',
  'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js',
  'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js',
  'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css',
  '/stylesheets/style.css',
  '/stylesheets/images/calender_1.png',
  '/stylesheets/images/calender_2.png',
  '/stylesheets/images/solab.jpg',
  '/index.html',
  '/scripts/app.js'
  
];




self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  
  return self.clients.claim();
});



self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://aucal.pdis.nat.gov.tw/auCal';
  if (e.request.url.indexOf(dataUrl) > -1) {

    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
 
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
