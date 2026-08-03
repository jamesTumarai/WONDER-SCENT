self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // Do nothing, just pass through. It fulfills PWA requirement.
});
