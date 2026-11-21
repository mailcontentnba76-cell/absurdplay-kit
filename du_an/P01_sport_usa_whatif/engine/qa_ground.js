// node qa_ground.js page.html t0 t1 dt  → in các khung có vật lún
const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const [page,t0,t1,dt]=process.argv.slice(2);const root='/root/work/engine';
const srv=http.createServer((q,s)=>{const p=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(p,(e,d)=>{if(e){s.writeHead(404);s.end();return;}s.writeHead(200,{'Content-Type':p.endsWith('.js')?'text/javascript':p.endsWith('.html')?'text/html':'application/octet-stream'});s.end(d);});}).listen(0,async()=>{
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const pg=await b.newPage({viewport:{width:270,height:480}});
 pg.on('pageerror',e=>{console.error('PAGEERROR',e.message);process.exit(2);});
 await pg.goto(`http://127.0.0.1:${srv.address().port}/${page}`);await pg.waitForFunction('window.ready===true',null,{timeout:900000});
 let n=0;for(let t=+t0;t<+t1;t+=+dt){const r=await pg.evaluate((process.env.FN||"window.qaGround")+"("+t+")");if(r.length){n++;console.log(t.toFixed(2),JSON.stringify(r));}}
 console.log('frames with sinking:',n);await b.close();srv.close();});
