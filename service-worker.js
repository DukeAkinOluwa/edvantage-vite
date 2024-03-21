const cacheData = "edvantageData";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheData)
      .then((cache) => {
        const urlsToCache = ['/assets/', '/Images/', 'https://fonts.googleapis.com/css2?...'];

        try {
          return cache.addAll(urlsToCache);
        } catch (error) {
          console.error("Failed to cache resources:", error);
        }

        console.log("All resources cached successfully"); // Optional for development
      })
  );
});


self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // If there's a cached response, check for updates in the background
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 304 || cachedResponse.headers.get('ETag') === networkResponse.headers.get('ETag')) {
            // If no updates (304 Not Modified) or ETags match, return cached response
            console.log("Serving from cache (no updates)");
            return cachedResponse;
          } else {
            // If updates found, update cache and return network response
            console.log("Cache updated with new response");
            return caches.open(cacheData).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
        });
      } else {
        // No cached response, fetch from network and cache for future use
        return fetch(event.request).then((networkResponse) => {
          return caches.open(cacheData).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      }
    })
  );
});



// this.addEventListener("fetch", (event)=>{
//     if(!navigator.onLine){
//         event.respondWith(
//             caches.match(event.request).then((resp)=>{
//                 if(resp){
//                     return resp
//                 }
//             })
//         )
//         let requestUrl = event.request.clone();
//         fetch(requestUrl)
//     }
// })
