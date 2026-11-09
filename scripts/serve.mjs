import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
http.createServer((req,res)=>{try{let url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(url.startsWith('/open-your-eyes/'))url=url.slice('/open-your-eyes'.length);let target=path.resolve(root,'.'+url);if(!target.startsWith(root+path.sep)&&target!==root){res.writeHead(403).end();return;}if(fs.existsSync(target)&&fs.statSync(target).isDirectory()){if(!url.endsWith('/')){res.writeHead(301,{Location:req.url+'/'}).end();return;}target=path.join(target,'index.html');}if(!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(fs.readFileSync(path.join(root,'404.html')));return;}res.writeHead(200,{'Content-Type':types[path.extname(target)]||'text/plain; charset=utf-8','Cache-Control':'no-store'});fs.createReadStream(target).pipe(res);}catch{res.writeHead(400).end('Bad request');}}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}/open-your-eyes/`));
