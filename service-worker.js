const staticCacheName = 'hello-pwa-v1';

const cacheAssets = async (urls) => {
  const cache = await caches.open(staticCacheName);
  await cache.addAll(urls);
};

const getCachedResponse = async (req) => {
  const cachedResponse = await caches.match(req);
  if (cachedResponse) return cachedResponse;

  return fetch(req);
};

addEventListener('install', async (event) => {
  event.waitUntil(cacheAssets([
    '.',
    'index.html',
    'css/styles.css',
    'img/background.jpg',
    'fonts/CourirerPrime.woff2',
    'https://kit.fontawesome.com/your-fontawesome-kit-id.js'
  ]));
});

addEventListener('activate', async (event) => {
  const cacheWhitelist = [staticCacheName];
  event.waitUntil(
    caches.keys().then(async (cacheNames) => {
      const promises = cacheNames.map(async (cacheName) => {
        if (!cacheWhitelist.includes(cacheName)) {
          await caches.delete(cacheName);
        }
      });
      await Promise.all(promises);
    })
  );
});

addEventListener('fetch', async (event) => {
  try {
    const cachedResponse = await getCachedResponse(event.request);
    event.respondWith(cachedResponse);
  } catch (error) {
    console.error('Error fetching resources:', error);
  }
});
