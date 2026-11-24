/* Klepa Up: банк, QR, чат (ответы, реакции, медиа), официальный канал, загрузка файлов */
import fs from 'fs';import crypto from 'crypto';import express from 'express';import QRCode from 'qrcode';
export default async function(c){
const {guardT,app,authz,get,put,all,del,db,F,say,esc,nm,own,P,can,perms,log,OW,E,sleep,bot}=c;
const EM=['👍','❤️','🔥','😂','😮','🎉'],MIME={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','video/mp4':'mp4','video/webm':'webm','video/quicktime':'mov','video/3gpp':'mp4','video/x-m4v':'mp4'},EXT=Object.fromEntries(Object.entries(MIME).map(([k,v])=>[v,k]));
const busy=new Set(),upl=new Map(),lm=new Map(),IDR=/^[\w-]{8,16}\.(jpg|png|webp|gif|mp4|webm|mov)$/;
if(F)fs.mkdirSync('media',{recursive:true});else await db.query('create table if not exists media(id text primary key,mime text,data bytea,ts bigint)');
const post=(p,fn)=>app.post('/api/x/'+p,authz,async(q,r)=>{try{await fn(q.u,q.body,o=>r.json(o||{ok:1}),e=>r.status(400).json({e}))}catch(e){console.error(e);r.status(500).json({e:'server'})}});
const link=(id,amt)=>`https://t.me/${bot()}${E.APP_SHORT?'/'+E.APP_SHORT:''}?startapp=${id==='ch'?'ch':'pay_'+id+(amt?'_'+amt:'')}`;
const pv=m=>(m.text||(m.media?(m.media.t==='vid'?'🎬 Видео':'📷 Фото'):'')).slice(0,90);
const okm=m=>m&&IDR.test(m.id||'')?{id:m.id,t:/\.(mp4|webm|mov)$/.test(m.id)?'vid':'img'}:null;
const react=(d,uid,e)=>{if(!EM.includes(e))return;d.rx=d.rx||{};const had=(d.rx[e]||[]).includes(uid);for(const k of Object.keys(d.rx)){d.rx[k]=d.rx[k].filter(x=>x!==uid);if(!d.rx[k].length)delete d.rx[k]}if(!had)(d.rx[e]=d.rx[e]||[]).push(uid)};
const slim=(m,me)=>{const rx={};let my='';for(const[e,a]of Object.entries(m.rx||{})){rx[e]=a.length;if(a.includes(me))my=e}const{vw,...x}=m;return{...x,rx,my,...(m.vw?{views:m.vw.length}:{})}};
const byTs=(a,b)=>a.ts-b.ts;
/* ---------- файлы ---------- */
app.post('/api/x/upload',express.raw({type:()=>true,limit:'32mb'}),authz,async(q,r)=>{try{const u=q.u;let mime=(q.get('content-type')||'').split(';')[0].trim().toLowerCase();const fx=(q.get('x-ext')||'').toLowerCase();if(!MIME[mime]&&EXT[fx])mime=EXT[fx];const ext=MIME[mime];
 if(u.ban)return r.status(403).json({e:'Вы заблокированы'});if(!ext||!Buffer.isBuffer(q.body)||!q.body.length)return r.status(400).json({e:'Формат файла не поддерживается'});
 if(q.body.length>(mime.startsWith('video')?30e6:5e6))return r.status(413).json({e:'Файл слишком большой: фото до 5 МБ, видео до 30 МБ'});
 const n=Date.now(),a=(upl.get(u.id)||[]).filter(t=>n-t<6e4);if(a.length>=6)return r.status(429).json({e:'Слишком много загрузок, подождите минуту'});a.push(n);upl.set(u.id,a);
 const id=crypto.randomBytes(9).toString('base64url').replace(/[^\w-]/g,'a')+'.'+ext;
 if(F)fs.writeFileSync('media/'+id,q.body);else await db.query('insert into media values($1,$2,$3,$4)',[id,mime,q.body,n]);
 r.json({id,t:mime.startsWith('video')?'vid':'img'})}catch(e){console.error(e);r.status(500).json({e:'server'})}});
app.get('/media/:id',async(q,r)=>{const id=q.params.id;if(!IDR.test(id))return r.sendStatus(404);let buf;
 if(F){try{buf=fs.readFileSync('media/'+id)}catch{return r.sendStatus(404)}}else{const x=(await db.query('select data from media where id=$1',[id])).rows[0];if(!x)return r.sendStatus(404);buf=x.data}
 const h={'content-type':EXT[id.split('.')[1]],'cache-control':'public,max-age=31536000,immutable','x-content-type-options':'nosniff','accept-ranges':'bytes'},rg=/bytes=(\d*)-(\d*)/.exec(q.get('range')||'');
 if(rg){let a=rg[1]?+rg[1]:0,b=rg[2]?+rg[2]:buf.length-1;if(!rg[1]&&rg[2]){a=buf.length-+rg[2];b=buf.length-1}b=Math.min(b,buf.length-1);if(a>b||a<0)return r.status(416).end();r.status(206).set({...h,'content-range':`bytes ${a}-${b}/${buf.length}`,'content-length':b-a+1}).end(buf.subarray(a,b+1))}
 else r.set({...h,'content-length':buf.length}).end(buf)});
/* ---------- QR-код ---------- */
function qrSvg(text){const q=QRCode.create(text,{errorCorrectionLevel:'H'}),n=q.modules.size,d=q.modules.data,m=3,W=n+m*2,L=Math.max(3,Math.round(n*.1)),h=n/2,cx=h+m,
 fin=(x,y)=>(x<7&&y<7)||(x>=n-7&&y<7)||(x<7&&y>=n-7),logo=(x,y)=>Math.abs(x+.5-h)<=L&&Math.abs(y+.5-h)<=L;let s='';
 for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(d[y*n+x]&&!fin(x,y)&&!logo(x,y))s+=`<rect x="${x+m+.03}" y="${y+m+.03}" width=".94" height=".94" rx=".3"/>`;
 const eye=(x,y)=>`<rect x="${x+m}" y="${y+m}" width="7" height="7" rx="1.2"/><rect x="${x+m+1}" y="${y+m+1}" width="5" height="5" rx=".4" fill="#fff"/><rect x="${x+m+2}" y="${y+m+2}" width="3" height="3" rx=".1"/>`;
 const R=L*.78,r=L*.32,st=[...Array(10)].map((_,i)=>{const a=-Math.PI/2+i*Math.PI/5,k=i%2?r:R;return(cx+k*Math.cos(a)).toFixed(2)+','+(cx+k*Math.sin(a)).toFixed(2)}).join(' ');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" shape-rendering="geometricPrecision"><defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="${W}"><stop offset="0" stop-color="#1a1200"/><stop offset="1" stop-color="#3a1fa6"/></linearGradient></defs><rect width="${W}" height="${W}" rx="2.4" fill="#fff"/><g fill="url(#g)">${s}${eye(0,0)}${eye(n-7,0)}${eye(0,n-7)}</g><circle cx="${cx}" cy="${cx}" r="${L+.15}" fill="#ffd21f"/><polygon points="${st}" fill="#1a1200"/></svg>`}
post('qr',async(u,b,ok,no)=>{if(!bot())return no('Бот ещё запускается, попробуйте через минуту');const amt=Math.min(1e6,Math.max(0,Math.floor(+b.amt)||0)),l=link(u.id,amt);ok({svg:qrSvg(l),link:l})});
/* ---------- банк ---------- */
const brief=x=>({id:x.id,name:nm(x),un:x.un||'',photo:x.photo||'',v:!!x.v||own(x),title:x.title||''});
post('find',async(u,b,ok)=>{const q=String(b.q||'').trim().replace(/^@/,'').toLowerCase();if(!q)return ok({l:[]});let l;
 if(/^\d{5,}$/.test(q)){const t=await get('u',q);l=t?[t]:[]}else{const A=await all('u',5000);l=A.filter(x=>(x.un||'').toLowerCase()===q).concat(A.filter(x=>(x.un||'').toLowerCase().startsWith(q)||nm(x).toLowerCase().includes(q)).slice(0,6));l=[...new Map(l.map(x=>[x.id,x])).values()]}
 ok({l:l.filter(x=>x.id!==u.id).slice(0,6).map(brief)})});
post('transfer',async(u,b,ok,no)=>{const amt=Math.floor(+b.amt);if(!(amt>=1&&amt<=1e6))return no('Сумма перевода: от 1 до 1 000 000 ⭐');if(u.ban)return no('Вы заблокированы');if(P(u).reset)return no('Аккаунт обнуляется, подождите минуту');
 const q=String(b.to||'').trim().replace(/^@/,'').toLowerCase();let t=/^\d{5,}$/.test(q)?await get('u',q):(await all('u',5000)).find(x=>(x.un||'').toLowerCase()===q);
 if(!t)return no('Получатель не найден. Он должен хотя бы раз запустить приложение');if(t.id===u.id)return no('Нельзя перевести звёзды самому себе');
 if(busy.has(u.id))return no('Подождите, предыдущий перевод ещё выполняется');busy.add(u.id);
 try{if(b.bal!=null&&Number.isFinite(+b.bal))u.bal=Math.max(0,Math.floor(+b.bal));if((u.bal||0)<amt)return no('Недостаточно звёзд');
  const note=String(b.note||'').trim().slice(0,60),ts=Date.now(),id=ts+'-'+u.id+'-'+t.id;u.bal-=amt;t.bal=(t.bal||0)+amt;
  const p=P(t);p.s+=amt;p.tx.push({name:nm(u),amt});p.tx=p.tx.slice(-10);await put('u',u.id,u);await put('u',t.id,t);
  const rec={id,ts,from:u.id,to:t.id,fn:nm(u),fu:u.un||'',tn:nm(t),tu:t.un||'',amt,note};
  await put('tx'+u.id,id,rec);await put('tx'+t.id,id,rec);await put('txall',id,rec);
  say(t.id,`💸 <b>${esc(nm(u))}</b>${u.un?' (@'+esc(u.un)+')':''} перевёл вам <b>${amt} ⭐</b>${note?'\n💬 '+esc(note):''}`);ok({rec,bal:u.bal})}finally{busy.delete(u.id)}});
post('history',async(u,b,ok)=>ok({l:await all('tx'+u.id,200)}));
post('a_tx',async(u,b,ok,no)=>{if(!can(u,'users'))return no('Нет прав');ok({l:await all('txall',100)})});
/* ---------- общий чат ---------- */
const ref=async id=>{const m=id&&await get('c',id);return m?{id:m.id,name:m.name,text:pv(m)}:undefined};
post('chatget',async(u,b,ok)=>ok({m:(await all('c',80)).sort(byTs).map(m=>slim(m,u.id))}));
post('chatsend',async(u,b,ok,no)=>{if(u.ban)return no('Вы заблокированы');const text=String(b.text||'').trim().slice(0,500),media=okm(b.media);if(!text&&!media)return no('');const ts=Date.now();if(ts-(lm.get(u.id)||0)<1200)return no('Не так быстро');lm.set(u.id,ts);
 const id=ts+'-'+u.id;await put('c',id,{id,ts,uid:u.id,name:nm(u),photo:u.photo||'',v:!!u.v||own(u),title:c.self(u).title,num:u.num||'',cun:u.cun||'',text,media:media||undefined,re:await ref(b.reply),rx:{}});ok()});
post('chatreact',async(u,b,ok,no)=>{const m=await get('c',b.id);if(!m)return no('Сообщение удалено');react(m,u.id,b.e);await put('c',m.id,m);ok()});
post('chdelmsg',async(u,b,ok,no)=>{const m=await get('c',b.id);if(!m)return ok();if(m.uid!==u.id){if(!can(u,'ban'))return no('Нет прав');if(!own(u)&&OW.includes(m.uid))return no('Нельзя удалять сообщения владельца');log(u,'chdelmsg '+m.id)}await del('c',m.id);ok()});
/* ---------- официальный канал ---------- */
const meta=async()=>(await get('meta','ch'))||{n:0};
post('chlist',async(u,b,ok)=>{const ms=(await all('c',80)).sort(byTs),ps=(await all('ch',40)).sort(byTs),s=((await get('s',u.id))?.m||[]).at(-1),lc=ms.at(-1),lp=ps.at(-1);
 ok({chat:{last:lc?{name:lc.name,text:pv(lc),ts:lc.ts}:null,unread:ms.filter(m=>m.ts>(+b.cs||0)&&m.uid!==u.id).length},ch:{last:lp?{text:pv(lp),ts:lp.ts}:null,unread:ps.filter(p=>p.ts>(+b.ks||0)).length,members:(await meta()).n,joined:!!u.chj},sup:{last:s?{text:s.t.slice(0,90),ts:s.ts,a:s.f==='a'}:null}})});
post('chget',async(u,b,ok)=>ok({p:(await all('ch',40)).sort(byTs).map(p=>slim(p,u.id)),members:(await meta()).n,joined:!!u.chj,canPost:can(u,'channel')}));
post('chview',async(u,b,ok)=>{for(const id of(b.ids||[]).slice(0,20)){const p=await get('ch',id);if(p&&!(p.vw||[]).includes(u.id)){(p.vw=p.vw||[]).push(u.id);await put('ch',id,p)}}ok()});
post('chreact',async(u,b,ok,no)=>{const p=await get('ch',b.id);if(!p)return no('Пост удалён');react(p,u.id,b.e);await put('ch',p.id,p);ok()});
post('chjoin',async(u,b,ok)=>{const m=await meta(),on=!!b.on;if(on&&!u.chj)m.n++;if(!on&&u.chj)m.n=Math.max(0,m.n-1);u.chj=on?1:0;await put('u',u.id,u);await put('meta','ch',m);ok({members:m.n,joined:on})});
post('chpost',async(u,b,ok,no)=>{if(!can(u,'channel'))return no('Нет права публиковать в канале');const text=String(b.text||'').trim().slice(0,2000),media=okm(b.media);if(!text&&!media)return no('Добавьте текст или фото/видео');
 const ts=Date.now(),id=ts+'-'+crypto.randomBytes(3).toString('hex');await put('ch',id,{id,ts,uid:u.id,text,media:media||undefined,rx:{},vw:[]});log(u,'chpost '+pv({text,media}).slice(0,60));
 if(b.notify&&bot())(async()=>{for(const x of await all('u',5000))if(x.chj){await say(x.id,'📢 <b>Новый пост в канале Klepa Up</b>\n\n'+esc(pv({text,media})),{reply_markup:{inline_keyboard:[[{text:'Открыть канал',url:link('ch')}]]}});await sleep(45)}})();
 ok({id})});
post('chdel',async(u,b,ok,no)=>{if(!can(u,'channel'))return no('Нет права');await del('ch',b.id);log(u,'chdel '+b.id);ok()});
/* ---------- рынок: лоты игроков (NFT, номера, юзернеймы) ---------- */
const TOK=/^[a-z0-9_]{2,16}$/,cleanItem=i=>{if(!i||!TOK.test(i.k||''))return null;const o={k:i.k};if(i.num&&/^[\d+()\- ]{5,24}$/.test(i.num))o.num=String(i.num);if(i.nbk&&/^[a-z0-9]{3,24}$/.test(i.nbk))o.nbk=i.nbk;if(i.un&&/^[a-z0-9_]{2,24}$/i.test(i.un))o.un=String(i.un);return o};
const mkv=(m,me)=>({id:m.id,seller:m.seller,sname:m.sname,sun:m.sun,photo:m.photo,item:m.item,price:m.price,ts:m.ts,mine:m.seller===me}),FEE=.05;
post('mk_list',async(u,b,ok)=>{let l=await all('mk',400);const q=String(b.q||'').toLowerCase().replace(/^@/,'');
 if(b.t==='num')l=l.filter(m=>m.item.num);else if(b.t==='usr')l=l.filter(m=>m.item.un);else if(b.t==='gift')l=l.filter(m=>!m.item.num&&!m.item.un);if(b.mine)l=l.filter(m=>m.seller===u.id);
 if(q)l=l.filter(m=>((m.item.num||'')+(m.item.un||'')+m.item.k+m.sname+m.sun).toLowerCase().includes(q));
 l.sort(b.s==='cheap'?(a,c)=>a.price-c.price:b.s==='dear'?(a,c)=>c.price-a.price:(a,c)=>c.ts-a.ts);ok({n:l.length,l:l.slice(0,100).map(m=>mkv(m,u.id))})});
post('mk_sell',async(u,b,ok,no)=>{if(u.ban)return no('Вы заблокированы');const it=cleanItem(b.item),price=Math.floor(+b.price);if(!it)return no('Неверный предмет');if(!(price>=1&&price<=1e9))return no('Цена от 1 до 1 000 000 000 звёзд');
 if((await all('mk',500)).filter(m=>m.seller===u.id).length>=20)return no('Не более 20 активных лотов');
 const i=(u.inv||[]).findIndex(x=>x.k===it.k);if(i<0)return no('Предмет не найден, подождите несколько секунд и повторите');u.inv.splice(i,1);await put('u',u.id,u);
 const id=Date.now()+'-'+crypto.randomBytes(3).toString('hex');await put('mk',id,{id,seller:u.id,sname:nm(u),sun:u.un||'',photo:u.photo||'',item:it,price,ts:Date.now()});ok({id})});
post('mk_cancel',async(u,b,ok,no)=>{const m=await get('mk',b.id);if(!m)return no('Лот уже продан или снят');if(m.seller!==u.id&&!can(u,'ban'))return no('Это не ваш лот');await del('mk',m.id);
 if(m.seller===u.id){(u.inv=u.inv||[]).push({k:m.item.k,n:'',nft:1,x:m.item.num||m.item.un||''});await put('u',u.id,u);return ok({item:m.item})}
 const t=await get('u',m.seller);if(t){P(t).it.push(m.item);await put('u',t.id,t)}log(u,'mk_cancel '+m.id);ok({})});
post('mk_buy',async(u,b,ok,no)=>{if(u.ban)return no('Вы заблокированы');const lk='mk'+b.id;if(busy.has(lk))return no('Лот уже покупают');busy.add(lk);
 try{const m=await get('mk',b.id);if(!m)return no('Лот уже продан или снят');if(m.seller===u.id)return no('Это ваш лот');
  if(b.bal!=null&&Number.isFinite(+b.bal))u.bal=Math.max(0,Math.floor(+b.bal));if((u.bal||0)<m.price)return no('Недостаточно звёзд');
  const s=await get('u',m.seller),fee=Math.ceil(m.price*FEE),net=m.price-fee;u.bal-=m.price;(u.inv=u.inv||[]).push({k:m.item.k,n:'',nft:1,x:m.item.num||m.item.un||''});await put('u',u.id,u);
  if(s){const p=P(s);p.s+=net;p.tx.push({name:'Рынок: '+nm(u),amt:net});p.tx=p.tx.slice(-10);s.bal=(s.bal||0)+net;await put('u',s.id,s);say(s.id,`🏷 <b>${esc(nm(u))}</b> купил ваш лот на рынке за <b>${m.price} ⭐</b>. Вам начислено <b>${net} ⭐</b> (комиссия ${fee}).`)}
  await del('mk',m.id);const id=Date.now()+'-'+u.id+'-'+m.seller,rec={id,ts:Date.now(),from:u.id,to:m.seller,fn:nm(u),fu:u.un||'',tn:m.sname,tu:m.sun,amt:m.price,note:'Рынок',kind:'market',fee};
  await put('tx'+u.id,id,rec);await put('tx'+m.seller,id,rec);await put('txall',id,rec);ok({item:m.item,bal:u.bal,rec})}finally{busy.delete(lk)}});
post('a_utx',async(u,b,ok,no)=>{if(!can(u,'users'))return no('Нет прав');ok({l:await all('tx'+(+b.id||0),15)})});
/* ---------- заявка на официальную галочку ---------- */
post('vreq_get',async(u,b,ok)=>ok({r:await get('vr',u.id)||null,verified:!!u.v||own(u)}));
post('vreq_send',async(u,b,ok,no)=>{if(u.ban)return no('Вы заблокированы');if(u.v||own(u))return no('У вас уже есть официальная галочка');const old=await get('vr',u.id);
 if(old&&old.status==='pending')return no('Заявка уже на рассмотрении');if(old&&old.status==='rejected'&&Date.now()-old.rts<864e5)return no('Повторную заявку можно подать через '+Math.ceil((864e5-(Date.now()-old.rts))/36e5)+' ч');
 const text=String(b.text||'').trim().slice(0,600),links=String(b.links||'').trim().slice(0,200);if(text.length<20)return no('Опишите, почему вам нужна галочка (минимум 20 символов)');
 const r={uid:u.id,name:nm(u),un:u.un||'',photo:u.photo||'',text,links,ts:Date.now(),status:'pending'};await put('vr',u.id,r);OW.forEach(i=>say(i,`✅ <b>Заявка на галочку</b>\n${esc(nm(u))}${u.un?' @'+esc(u.un):''} (<code>${u.id}</code>)\n${esc(text)}${links?'\n🔗 '+esc(links):''}\n\nРассмотреть: Профиль → Админ-панель → Заявки`));ok({r})});
post('a_vreqs',async(u,b,ok,no)=>{if(!can(u,'roles'))return no('Нет прав');ok({l:(await all('vr',100)).sort((a,c)=>(a.status==='pending'?0:1)-(c.status==='pending'?0:1)||c.ts-a.ts)})});
post('a_vdecide',async(u,b,ok,no)=>{if(!can(u,'roles'))return no('Нет прав');const r=await get('vr',b.id);if(!r)return no('Заявка не найдена');if(r.status!=='pending')return no('Заявка уже рассмотрена');const t=await get('u',r.uid);if(!t)return no('Игрок не найден');
 if(t.id===u.id&&!own(u))return no('Свою заявку может рассмотреть только владелец');r.status=b.ok?'approved':'rejected';r.reason=String(b.reason||'').trim().slice(0,200);r.rts=Date.now();r.by=nm(u);await put('vr',r.uid,r);
 if(b.ok){t.v=true;await put('u',t.id,t);say(t.id,'✅ <b>Официальная галочка выдана!</b> Она уже отображается в вашем профиле.')}else say(t.id,'❌ Заявка на галочку отклонена.'+(r.reason?'\nПричина: '+esc(r.reason):'')+'\nПовторно подать заявку можно через 24 часа.');
 log(u,'vdecide '+r.uid+' '+(b.ok?'approve':'reject'));ok()});
/* ---------- новогодний календарь: 7 дверей, 1-7 декабря по Москве ---------- */
const AY=+E.ADV_YEAR||2026,AP={1:{s:500},2:{k:'jester'},3:{s:2000},4:{k:'snake'},5:{s:5000},6:{k:'wine'},7:{k:'monkey',s:3000}};
const advNow=()=>+E.ADV_NOW||Date.now(),unl=d=>Date.UTC(AY,11,d)-3*36e5,dead=()=>Date.UTC(AY+1,0,15)-3*36e5;
post('adv_get',async(u,b,ok)=>{const now=advNow(),a=u.adv||{};ok({y:AY,now,until:dead(),days:Object.keys(AP).map(Number).map(d=>{const done=a[d]||0,st=done?'done':now>=dead()?'gone':now>=unl(d)?'open':'lock';return{d,at:unl(d),st,done,prize:done?AP[d]:undefined}})})});
post('adv_claim',async(u,b,ok,no)=>{if(u.ban)return no('Вы заблокированы');const d=+b.d,pz=AP[d],now=advNow(),lk='adv'+u.id;if(!pz)return no('Такой двери нет');if(busy.has(lk))return no('Подождите секунду');busy.add(lk);
 try{if(now<unl(d))return no('Эта дверь откроется '+new Date(unl(d)+3*36e5).toLocaleDateString('ru-RU',{day:'numeric',month:'long',timeZone:'UTC'}));if(now>=dead())return no('Календарь закрыт');if(u.adv&&u.adv[d])return no('Подарок уже получен');
  u.adv={...(u.adv||{}),[d]:now};const p=P(u);if(pz.s)p.s+=pz.s;if(pz.k)p.n.push(pz.k);await put('u',u.id,u);ok({d,prize:pz})}finally{busy.delete(lk)}});
}
