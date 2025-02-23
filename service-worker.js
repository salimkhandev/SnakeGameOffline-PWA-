const CACHE_NAME = 'snake-game-v3';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/icons/android-chrome-192x192.png',
    '/icons/android-chrome-512x512.png',
    '/icons/apple-touch-icon.png',
    '/icons/favicon-16x16.png',
    '/icons/favicon-32x32.png',
    '/icons/favicon.ico',
    '/screenshots/screenshot-desktop.png',
    '/screenshots/screenshot-mobile.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // console.log('im fetching...', event.request,'this is the event');
    event.respondWith(
    
        // does the bellow line only check ture and false ie boolean?
        
        caches.match(event.request)
            .then((response) => {
          
                if (response) {
                    return response;
                    
                }

                // Clone the request because it can only be used once
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                    .then((response) => {
                        // Check if response is valid
                        if (response) {

                            return response;  // Browser will consume this response
                        }
                        // Clone the response because it can only be used once
                        const responseToCache = response.clone();
                        console.log('im ✅  caching the response', responseToCache,'this is the response to cache');

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return a fallback response for failed network requests
                        return new Response('Offline - No network connection');
                    });
            })
    );
});





self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    

});



