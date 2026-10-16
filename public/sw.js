// Pookie Space Service Worker - Push & Offline Cache
const CACHE_NAME = 'pookie-space-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      // Clean up ALL previous caches to guarantee no stale assets
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

// Fetch handler: NEVER intercept or cache during development on localhost
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  const isLocalhost = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

  // If running on localhost or Vite dev modules, let the network handle it directly!
  if (isLocalhost || url.includes('/@') || url.includes('/src/') || url.includes('/node_modules/')) {
    return;
  }

  // Only handle GET requests and http/https in production
  if (event.request.method !== 'GET' || !url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Push notification received event
self.addEventListener('push', (event) => {
  let data = {
    title: 'Pookie Space 💗',
    body: 'Tienes un nuevo mensaje de naimnecita ✨',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    url: '/'
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/favicon.svg',
    badge: data.badge || '/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'Ver ahora 💖' },
      { action: 'close', title: 'Más tarde' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Custom message listener from main thread (e.g. for scheduled reminders)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, delayMs, id } = event.data;
    setTimeout(() => {
      self.registration.showNotification(title || 'Pookie Space 💗', {
        body: body || '¡Recordatorio de naimnecita! ✨',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: id || 'reminder',
        vibrate: [200, 100, 200]
      });
    }, delayMs || 1000);
  }
});
