const CACHE='englishflow-v8';
const CORE=['./src/person-tables.js','./src/account.js','./src/schedule.js','./src/life.js','./src/grammar-path.js','./src/grammar-notes.js','./src/studio.css?v=8','./src/studio.css','./src/ui.js','./src/today.js','./src/studio.js','./src/oxford.js','./src/oxford-original.css?v=8','./src/oxford-original.css','./src/curriculum.json','./cloud-config.json','./','./index.html','./src/app.js?v=8','./src/style.css?v=8','./src/app.js','./src/style.css','./src/cloud.js','./src/store.js','./src/planner.js','./src/materials.json','./src/grammar.json','./icons/icon.svg','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE.map(url=>new Request(url,{cache:'reload'}))))));
self.addEventListener('message',e=>{if(e.data==='ACTIVATE')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('englishflow-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.pathname.includes('/oxford3000-nauka/audio/')){e.respondWith(audio(e.request));return;}if(u.origin!==self.location.origin)return;e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r;}).catch(()=>caches.match(e.request).then(r=>r||new Response('Brak połączenia. Otwórz ten materiał online przed nauką offline.',{status:503}))));});

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
