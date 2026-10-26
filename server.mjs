import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found');}res.setHeader('Content-Type',({'html':'text/html; charset=utf-8','js':'text/javascript; charset=utf-8','css':'text/css; charset=utf-8','json':'application/json','webmanifest':'application/manifest+json','svg':'image/svg+xml'})[path.extname(file).slice(1)]||'application/octet-stream');res.setHeader('Cache-Control','no-cache');res.end(data);});}).listen(4173,'127.0.0.1',()=>console.log('EnglishFlow: http://127.0.0.1:4173'));
