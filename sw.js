const CACHE='englishflow-v14';
const CORE=["./","./index.html","./cloud-config.json","./manifest.webmanifest","./src/academy.js","./src/academy.js?v=14","./src/account.js","./src/account.js?v=14","./src/app.js","./src/app.js?v=14","./src/auth-callback.js","./src/auth-callback.js?v=14","./src/cloud.js","./src/cloud.js?v=14","./src/curriculum.json","./src/grammar-notes.js","./src/grammar-notes.js?v=14","./src/grammar-path.js","./src/grammar-path.js?v=14","./src/grammar.json","./src/life.js","./src/life.js?v=14","./src/materials.json","./src/offline.js","./src/offline.js?v=14","./src/oxford-original.css","./src/oxford-original.css?v=14","./src/oxford.js","./src/oxford.js?v=14","./src/person-tables.js","./src/person-tables.js?v=14","./src/planner.js","./src/planner.js?v=14","./src/private-links.js","./src/private-links.js?v=14","./src/schedule.js","./src/schedule.js?v=14","./src/store.js","./src/store.js?v=14","./src/studio.css","./src/studio.css?v=14","./src/studio.js","./src/studio.js?v=14","./src/style.css","./src/style.css?v=14","./src/today.js","./src/today.js?v=14","./src/ui.js","./src/ui.js?v=14","./icons/icon-180.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon.svg"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE.map(url=>new Request(url,{cache:'reload'}))))));
self.addEventListener('message',e=>{if(e.data==='ACTIVATE')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('englishflow-')&&k!==CACHE&&k!=='englishflow-content').map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.pathname.includes('/oxford3000-nauka/audio/')){e.respondWith(audio(e.request));return;}if(u.origin!==self.location.origin)return;const navigation=e.request.mode==='navigate'&&[new URL('./',self.location.href).pathname,new URL('./index.html',self.location.href).pathname].includes(u.pathname);e.respondWith(fetch(e.request,{cache:'no-store'}).then(async r=>{if(r.ok){const copy=r.clone();await caches.open(CACHE).then(c=>c.put(navigation?new URL('./',self.location.href).href:e.request,copy)).catch(()=>{});}return r;}).catch(async()=>{const cached=await caches.match(e.request,{ignoreSearch:navigation})||(navigation?await caches.match(new URL('./',self.location.href).href):null);return cached||new Response('Brak zapisanej kopii. Przy pierwszym uruchomieniu potrzebujesz internetu.',{status:503});}));});

const AUDIO='s3k-audio';
async function audio(req){
  const c=await caches.open(AUDIO); const key=req.url.split('#')[0];
  let res=await c.match(key);
  if(!res){
    try{ res=await fetch(key); }catch(err){ return new Response('',{status:503}); }
    if(!res.ok) return res;
    try{ await c.put(key,res.clone()); }catch(err){}
  }
  const range=req.headers.get('range');
  const buf=await res.arrayBuffer(); const len=buf.byteLength;
  if(!range) return new Response(buf,{status:200,headers:{'Content-Type':'audio/mpeg','Content-Length':String(len),'Accept-Ranges':'bytes'}});
  const m=/bytes=(\d*)-(\d*)/.exec(range)||[];
  let start,end;
  if(m[1]===''||m[1]===undefined){ const suf=parseInt(m[2]||'0',10); start=Math.max(0,len-suf); end=len-1; }
  else { start=parseInt(m[1],10); end=m[2]?Math.min(parseInt(m[2],10),len-1):len-1; }
  if(start>=len) return new Response('',{status:416,headers:{'Content-Range':`bytes */${len}`}});
  return new Response(buf.slice(start,end+1),{status:206,headers:{'Content-Type':'audio/mpeg','Content-Range':`bytes ${start}-${end}/${len}`,'Content-Length':String(end-start+1),'Accept-Ranges':'bytes'}});
}
