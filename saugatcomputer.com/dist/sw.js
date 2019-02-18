if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(function(reg) {
      //    console.log("Service Worker Registered");
      //    setTimeout(function(){reg.update()}, '3000')
    })
    .catch(err => console.log(err));
}

let cacheName = "ltm-workspace_cache";
let skipURL = ["static-v.tawk.to", "va.tawk.to"];
self.addEventListener("install", function(event) {
  /**
   * Steps todo 2-3
   *
   *  2. delete previous cache
   *  3. add components to cache
   */
  // console.log('installing ');
  self.skipWaiting();
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      //   console.log(cacheNames);
      // console.log('deleting');
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return true;
          })
          .map(function(cacheName) {
            //   console.log(cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }

        let reqURL = new URL(event.request.url);

        if (skipURL.includes(reqURL.host)) {
          return fetch(event.request);
        } else {
          return caches.open(cacheName).then(function(cache) {
            return fetch(event.request).then(function(response) {
              cache.put(event.request, response.clone());
              return response;
            });
          });
        }
      })
      .catch(err => caches.match("/"))
  );
});

// self.addEventListener('activate', function(event) {
//     // console.log(event);
//     event.waitUntil(
//       caches.keys().then(function(cacheNames) {
//         //   console.log(cacheNames);
//         return Promise.all(
//           cacheNames.filter(function(cacheName) {
//             return true;
//           }).map(function(cacheName) {
//             //   console.log(cacheName);
//             return caches.delete(cacheName);
//           })
//         );
//       })
//       .then(res => window.location.reload)
//     );
//   });
let version = 0.5;
