// Liệt kê khung cần render lại: khung có motion blur (window.blurN(t)>1) + khoảng [a,b) chỉ định. Dùng: node liet_ke_khung.js <cảnh.html> <tổng khung> [a-b,...]
const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const [page,N,extra='']=process.argv.slice(2);const root=__dirname;
const srv=http.createServer((q,s)=>{const p=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(p,(e,d)=>{if(e){s.writeHead(404);s.end();return;}const ty={'.html':'text/html','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.hdr':'application/octet-stream','.bin':'application/octet-stream'};s.writeHead(200,{'Content-Type':ty[path.extname(p)]||'application/octet-stream'});s.end(d);});}).listen(0,async()=>{
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const pg=await b.newPage({viewport:{width:180,height:320}});
 await pg.goto(`http://127.0.0.1:${srv.address().port}/${page}?w=180`);await pg.waitForFunction('window.ready===true',null,{timeout:900000});
 const L=await pg.evaluate(n=>{const o=[];for(let f=0;f<n;f++)if(window.blurN(f/30)>1)o.push(f);return o;},+N);
 const set=new Set(L);for(const r of extra.split(',').filter(Boolean)){const [a,c]=r.split('-').map(Number);for(let f=a;f<c;f++)set.add(f);}
 console.log([...set].sort((x,y)=>x-y).join(','));await b.close();srv.close();});
