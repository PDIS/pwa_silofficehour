
var dataCacheName = 'aucalPWA-v1';
var cacheName = 'aucalPWA-final-1';
var filesToCache = [
 
  'https://aucal.pdis.nat.gov.tw/auCal',
  'https://cdn.jsdelivr.net/npm/vue',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.4/moment.min.js',
  'https://code.jquery.com/jquery-3.3.1.slim.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
  'https://pdis.github.io/pwa_silofficehour/stylesheets/style.css',
  'https://pdis.github.io/pwa_silofficehour/stylesheets/images/calender_1.png',
  'https://pdis.github.io/pwa_silofficehour/stylesheets/images/calender_2.png',
  'https://pdis.github.io/pwa_silofficehour/stylesheets/images/solab.jpg',
  'https://pdis.github.io/pwa_silofficehour/index.html',
  'https://pdis.github.io/pwa_silofficehour/scripts/app.js'
  
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
