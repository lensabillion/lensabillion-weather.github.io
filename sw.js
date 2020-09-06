const cacheName ='v2';


//Call Install Event
self.addEventListener('install',e => {
    console.log("service worker: Installed");
});
//Call Activate Event
self.addEventListener('activate',e => {
    console.log("service worker: Activated");
    //Remove Unwanted caches

    e.waitUntil(
        caches.keys().then(cacheNames =>{
            return Promise.all(
                cacheNames.map(cache =>{
                    if(cache !== cachName){
                        console.log('Service Worker:Clearing old cache')
                        return caches.delete(cache);
                    }
                })
            )
        })
   
        );
});
// Call Fetch Event
self.addEventListener('fetch',e =>{
    console.log('Service Worker:Fetching');
    e.respondWith(
        fetch(e.request)
        .then(res => {
            //clone of response
            const resClone = res.clone();
            //Open cache
            caches
            .open(cacheName)
            .then(cache => {
                cache.put(e.request,resClone);

            });
            return res;
        }).catch(err => caches.match(e.request).then(res=>res))
    );
});