const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const root='/root/work/engine';
const srv=http.createServer((q,s)=>{const p=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(p,(e,d)=>{if(e){s.writeHead(404);s.end();return;}s.writeHead(200,{'Content-Type':({'.js':'text/javascript','.html':'text/html','.woff2':'font/woff2'})[path.extname(p)]||'application/octet-stream'});s.end(d);});}).listen(0,async()=>{
const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});pg.on('pageerror',e=>console.log('ERR',e.message));
await pg.goto(`http://127.0.0.1:${srv.address().port}/ep06_gfx.html`);await pg.waitForFunction('window.ready===true');
for(const t of [2.5,22.5,25,30,47,50,57,60,64]){const r=await pg.evaluate(t=>{window.renderFrame(t);return [...document.querySelectorAll('.el')].filter(e=>+e.style.opacity>0).map(e=>e.id+':'+e.style.opacity+':'+e.getBoundingClientRect().top.toFixed(0)+':'+e.style.transform)},t);console.log(t,r);}
await b.close();srv.close();});
