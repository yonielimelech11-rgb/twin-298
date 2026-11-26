// service worker of the 298 twin, build a681548213a0: cache-first, so the app opens offline after the first visit
const C = 'twin-298-a681548213a0', FILES = ['./', './index.html', './wind.html', './manifest.webmanifest', './robots.txt', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('twin-298-') && k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => { if (e.request.method !== 'GET') return; const u = new URL(e.request.url); if (u.origin !== location.origin) return;
  if (/(detail|drawings)\.bin$/.test(u.pathname)) return e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(n => { if (n.ok) { const k = n.clone(); caches.open('twin-extra').then(c => c.put(e.request, k)) } return n })));
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || (e.request.mode === 'navigate' ? caches.open(C).then(c => c.match('./index.html')) : null)).then(r => r || fetch(e.request))) });   // every cache of this app: the page, and speech/ once downloaded
