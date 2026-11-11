// Line Breakdown service worker – v1.2
const C='lb-v1.3';
const F=['./','index.html','config.js','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.hostname.includes('microsoft')||u.hostname.includes('sharepoint'))return;
  if(u.origin===location.origin){ // app files: network first, so updates arrive at once; cache when offline
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));return}
  if(u.hostname.includes('jsdelivr')||u.hostname.includes('msauth')){ // libraries: cache first
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res.ok){const c=res.clone();caches.open(C).then(x=>x.put(e.request,c))}return res})))}
});
