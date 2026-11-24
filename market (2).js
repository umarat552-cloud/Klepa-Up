/* Klepa Up: магазин (номера стран, юзернеймы, NFT) и рынок игроков */
(function(){
'use strict';
const X=window.KX;let E,tab='num',cty='sn',tier=0,uT=0,uQ='',mT='all',mS='new',mQ='',mMine=0,lim={},tm=0;const cache=new Map();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let CN=null,UN=null;
const cnMap=()=>{if(!CN){CN=new Map();for(const ct of KC.CT)for(let t=1;t<=5;t++)for(const n of KC.NUMS[ct.id][t])CN.set(n,{id:ct.id,t})}return CN};
const unMap=()=>{if(!UN){UN=new Map();for(let t=1;t<=5;t++)for(const n of KC.USR[t])UN.set(n,t)}return UN};
const owned={cnum:n=>E.S.inv.some(x=>x.num===n),usr:n=>E.S.inv.some(x=>x.un===n)};
const active=()=>X&&X.W&&X.W.initData;
const addItem=it=>{if(!it||!E.G[it.k])return;const o={id:Date.now()+Math.random(),k:it.k};if(it.num)o.num=it.num;if(it.un)o.un=it.un;E.S.inv.unshift(o)};
const iname=(it)=>it.un?'@'+it.un:it.num||(E.G[it.k]?E.G[it.k].n:it.k);
const SH=window.KSHOP={init(e){E=e;const el=document.getElementById('shopc');if(el)SH.render(el)},owned:(k,key)=>owned[k](key),
 info(kind,key){if(kind==='cnum'){const m=cnMap().get(key);if(!m)return null;const g=E.G['c'+m.id+m.t];return{k:g.k,price:g.price,name:key,tag:KC.TN[m.t-1][0]+' номер',sub:KC.CTN[m.id]+' · '+g.short}}
  if(kind==='usr'){const t=unMap().get(key);if(!t)return null;const g=E.G['usr'+t];return{k:g.k,price:g.price,name:'@'+key,tag:KC.UT[t-1][0],sub:'Коллекционный юзернейм'}}return null},
 render(e){if(!E)return;const tabs=[['num','Номера','phone'],['usr','Юзернеймы','at'],['nft','NFT','gift'],['mk','Рынок','market']];
  clearInterval(tm);let h=`<div class="cases four">${tabs.map(t=>`<button data-t="${t[0]}" class="${tab===t[0]?'on':''}">${t[1]}</button>`).join('')}</div>`;
  h+=tab==='num'?numHtml():tab==='usr'?usrHtml():tab==='nft'?nftHtml():mkShell();
  e.innerHTML=h;wire(e);if(tab==='mk'){loadMk(e);tm=setInterval(()=>{if(!e.isConnected||tab!=='mk')return clearInterval(tm);if(!e.contains(document.activeElement)||document.activeElement.tagName!=='INPUT')loadMk(e)},8000)}}};
/* ---------- номера ---------- */
function numHtml(){const cs=[['sn','Анонимные'],...KC.CT.map(c=>[c.id,c.n])];
 let h=`<div class="tchips">${cs.map(c=>`<button class="tchip${cty===c[0]?' on':''}" data-ct="${c[0]}">${KC.FLAG[c[0]==='sn'?'sn':c[0]]}${c[1]}</button>`).join('')}</div>`;
 if(cty==='sn'){h+=`<div class="shn">Анонимные номера +888 с Fragment. Каждый номер уникален: купленный принадлежит только вам</div><div class="tchips"><button class="tchip${!tier?' on':''}" data-f="0">Все</button>${E.TIERS.map(x=>`<button class="tchip${tier===x.t?' on':''}" data-f="${x.t}">${x.n}</button>`).join('')}</div>`;
  const list=[];E.TIERS.forEach(x=>{if(!tier||x.t===tier)E.SN[x.t].forEach(c=>list.push([c,x]))});
  return h+'<div class="nums">'+list.map(([c,x])=>{const sold=!!E.S.nb[c];return`<div class="nc${sold?' sold':''}" style="--c1:${x.c[0]};--c2:${x.c[1]}"><span class="ntg">${x.s}</span>${E.ima(E.G[x.k])}<small>+888</small><div class="num">${c.slice(0,4)} ${c.slice(4)}</div><button class="btn sm" data-c="${c}"${sold?' disabled':''}>${sold?'Куплен':E.fmt(x.p)+' '+E.ST}</button></div>`}).join('')+'</div>'}
 const ct=KC.CT.find(c=>c.id===cty);h+=`<div class="shn">${ct.n}: ${ct.cc}. Пять категорий от обычных до легендарных номеров, много вариантов в каждой</div><div class="tchips"><button class="tchip${!tier?' on':''}" data-f="0">Все</button>${KC.TN.map((x,i)=>`<button class="tchip${tier===i+1?' on':''}" data-f="${i+1}">${x[0]}</button>`).join('')}</div>`;
 const list=[];for(let t=1;t<=5;t++)if(!tier||tier===t)KC.NUMS[cty][t].forEach(n=>list.push([n,t]));const L=lim['n'+cty+tier]||24;
 h+='<div class="nums">'+list.slice(0,L).map(([n,t])=>{const g=E.G['c'+cty+t],sold=owned.cnum(n);return`<div class="nc${sold?' sold':''}" style="--c1:${ct.c[0]};--c2:${ct.c[1]}"><span class="ntg">${KC.TN[t-1][0]}</span>${E.ima(g)}<small>${ct.cc}</small><div class="num lg">${n}</div><button class="btn sm" data-cn="${esc(n)}"${sold?' disabled':''}>${sold?'Куплен':E.fmt(g.price)+' '+E.ST}</button></div>`}).join('')+'</div>';
 return h+(list.length>L?`<button class="btn g sm" data-more="n${cty}${tier}">Показать ещё · ${list.length-L}</button>`:'')}
/* ---------- юзернеймы ---------- */
function usrHtml(){let h=`<div class="shn">Коллекционные юзернеймы. Покажите свой в профиле как в Telegram, продавайте на рынке или выбивайте в самом дорогом кейсе</div><div class="tchips"><button class="tchip${!uT?' on':''}" data-ut="0">Все</button>${KC.UT.map((x,i)=>`<button class="tchip${uT===i+1?' on':''}" data-ut="${i+1}">${x[0]}</button>`).join('')}</div><div class="ksrch">${KI('search')}<input class="epi" id="usq" placeholder="Поиск юзернейма" value="${esc(uQ)}" autocapitalize="off" autocomplete="off"></div><div class="ulist">${usrList()}</div>`;return h}
function usrList(){const q=uQ.trim().toLowerCase().replace(/^@/,''),list=[];for(let t=1;t<=5;t++)if(!uT||uT===t)KC.USR[t].forEach(n=>{if(!q||n.includes(q))list.push([n,t])});const L=lim['u'+uT+q]||24;
 return '<div class="ugrid">'+list.slice(0,L).map(([n,t])=>{const g=E.G['usr'+t],sold=owned.usr(n);return`<div class="uc${sold?' sold':''}" style="--c1:${KC.UT[t-1][2][0]};--c2:${KC.UT[t-1][2][1]}"><span class="ntg">${KC.UT[t-1][0]}</span><b>@${esc(n)}</b><button class="btn sm" data-un="${esc(n)}"${sold?' disabled':''}>${sold?'Куплен':E.fmt(g.price)+' '+E.ST}</button></div>`}).join('')+'</div>'+(list.length>L?`<button class="btn g sm" data-more="u${uT}${q}">Показать ещё · ${list.length-L}</button>`:'')||'<div class="kd">Ничего не найдено</div>'}
/* ---------- NFT ---------- */
function nftHtml(){const items=Object.values(E.G).filter(g=>g.nft&&!g.num&&!g.usr).sort((a,b)=>a.v-b.v);return`<div class="shn">Настоящие NFT-подарки. Можно покупать любое количество</div><div class="grid">`+items.map(g=>`<div class="gc nft"><span class="badge">NFT</span>${E.ima(g)}<div class="t">${g.n}</div><div class="val">≈ ${g.ton} TON</div><button class="btn sm" data-k="${g.k}">${E.fmt(E.nftPrice(g))} ${E.ST}</button></div>`).join('')+'</div>'}
/* ---------- рынок ---------- */
const mkShell=()=>`<div class="shn">Рынок игроков. Продавайте и покупайте NFT, номера и юзернеймы за звёзды. Комиссия 5% с продавца</div><div class="tchips">${[['all','Всё'],['gift','NFT'],['num','Номера'],['usr','Юзернеймы']].map(x=>`<button class="tchip${mT===x[0]?' on':''}" data-mt="${x[0]}">${x[1]}</button>`).join('')}</div><div class="tchips">${[['new','Новые'],['cheap','Дешевле'],['dear','Дороже']].map(x=>`<button class="tchip${mS===x[0]?' on':''}" data-ms="${x[0]}">${x[1]}</button>`).join('')}<button class="tchip${mMine?' on':''}" data-mine="1">${KI('tag')}Мои лоты</button></div><div class="ksrch">${KI('search')}<input class="epi" id="mkq" placeholder="Поиск: номер, юзернейм, продавец" value="${esc(mQ)}" autocapitalize="off" autocomplete="off"></div><div class="mklist kl2"><div class="kd">Загрузка…</div></div>`;
const listing=m=>{const g=E.G[m.item.k]||{n:m.item.k};cache.set(m.id,m);return`<div class="card mkc"><div class="mki">${E.G[m.item.k]?E.ima(E.G[m.item.k]):''}</div><div class="mkb"><b>${esc(iname(m.item))}</b><small>${esc(g.n)}</small><div class="mks">${KI('user')}<span>${esc(m.sname)}${m.sun?' @'+esc(m.sun):''}</span></div></div><div class="mkp">${m.mine?`<button class="btn sm g" data-cancel="${m.id}">Снять</button>`:`<button class="btn sm" data-buy="${m.id}">${E.fmt(m.price)} ${E.ST}</button>`}${m.mine?`<small>${E.fmt(m.price)} ${E.ST}</small>`:''}</div></div>`};
async function loadMk(e){const box=e.querySelector('.mklist');if(!box)return;if(!active()){box.innerHTML='<div class="kd">Рынок работает внутри Telegram</div>';return}
 const r=await X.api('x/mk_list',{t:mT,s:mS,q:mQ,mine:mMine?1:0});if(!e.isConnected||tab!=='mk')return;if(r.e){box.innerHTML=`<div class="kd">${esc(r.e)}</div>`;return}
 cache.clear();box.innerHTML=r.l.map(listing).join('')||`<div class="kd">${mMine?'У вас нет активных лотов':'Лотов пока нет. Выставьте свой первым: «Мои подарки» → предмет → «Выставить на рынок»'}</div>`}
async function buy(id,e){const m=cache.get(id);if(!m)return;const nm=iname(m.item);if(E.S.stars<m.price){E.toast('Не хватает звёзд');E.hp('error');return}
 if(!await X.ask(`Купить «${nm}» за ${E.fmt(m.price)} звёзд?`))return;const r=await X.api('x/mk_buy',{id,bal:E.S.stars});if(r.e){E.hp('error');E.toast(r.e);return loadMk(e)}
 E.S.stars=r.bal;addItem(r.item);E.save();E.bal();E.renderAll();E.hp('success');window.KS&&KS.coin();E.toast('Покупка совершена: '+nm);X.sync&&X.sync();loadMk(e)}
async function cancel(id,e){if(!await X.ask('Снять лот с рынка?'))return;const r=await X.api('x/mk_cancel',{id});if(r.e){E.toast(r.e);return loadMk(e)}if(r.item)addItem(r.item);E.save();E.renderAll();E.toast('Лот снят, предмет вернулся в коллекцию');X.sync&&X.sync();loadMk(e)}
function wire(e){let ti=0;
 e.onclick=ev=>{const b=ev.target.closest('button');if(!b)return;const d=b.dataset,R=()=>{E.hp('light');SH.render(e)};
  if(d.t){tab=d.t;return R()}if(d.ct){cty=d.ct;tier=0;return R()}if(d.f!==undefined){tier=+d.f;return R()}if(d.ut!==undefined){uT=+d.ut;return R()}
  if(d.c)return E.openBuy('num',d.c);if(d.cn)return E.openBuy('cnum',d.cn);if(d.un)return E.openBuy('usr',d.un);if(d.k)return E.openBuy('nft',d.k);
  if(d.more){lim[d.more]=(lim[d.more]||24)+24;return SH.render(e)}
  if(d.mt){mT=d.mt;return R()}if(d.ms){mS=d.ms;return R()}if(d.mine){mMine=mMine?0:1;return R()}
  if(d.buy)return buy(d.buy,e);if(d.cancel)return cancel(d.cancel,e)};
 const us=e.querySelector('#usq');if(us)us.oninput=()=>{uQ=us.value;e.querySelector('.ulist').innerHTML=usrList()};
 const mq=e.querySelector('#mkq');if(mq)mq.oninput=()=>{mQ=mq.value;clearTimeout(ti);ti=setTimeout(()=>loadMk(e),350)}}
/* ---------- продажа на рынке ---------- */
window.KMK={sell(id){const x=E.S.inv.find(y=>y.id===id);if(!x)return;if(!active())return E.toast('Рынок работает внутри Telegram');
 const g=E.G[x.k],nm=E.nmx(x,g),base=g.price||(g.nft&&!g.num&&!g.usr?E.nftPrice(g):g.v),o=KUI.ovl('Выставить на рынок'),c=o.querySelector('.kc');
 c.innerHTML=`<div class="card kpr"><div class="mki big">${E.ima(g)}</div><div class="t" style="font-size:19px">${esc(nm)}</div><div class="sub">${esc(g.n)}</div></div><div class="ksec" style="margin:0">Цена, звёзд</div><input class="epi" id="mkp" type="number" inputmode="numeric" value="${base}"><div class="kchips2">${[.8,1,1.5,2].map(m=>`<button data-m="${m}">×${m}</button>`).join('')}</div><div class="kmuted" id="mkn"></div><button class="btn" id="mkg">Выставить на рынок</button>`;
 const P=c.querySelector('#mkp'),upd=()=>{const p=Math.floor(+P.value)||0;c.querySelector('#mkn').innerHTML=p>0?`Комиссия 5%: ${E.fmt(Math.ceil(p*.05))} ${E.ST}. Вы получите ${E.fmt(p-Math.ceil(p*.05))} ${E.ST}`:'Укажите цену';c.querySelector('#mkg').disabled=!(p>=1)};P.oninput=upd;
 c.querySelector('.kchips2').onclick=ev=>{const m=ev.target.dataset.m;if(m){P.value=Math.max(1,Math.round(base*m));upd()}};upd();
 c.querySelector('#mkg').onclick=async()=>{const p=Math.floor(+P.value),b=c.querySelector('#mkg');b.disabled=true;await X.sync();
  const r=await X.api('x/mk_sell',{item:{k:x.k,num:x.num,un:x.un},price:p});if(r.e){E.hp('error');E.toast(r.e);return upd()}
  const i=E.S.inv.findIndex(y=>y.id===id);if(i>=0){const it=E.S.inv[i];if(it.num&&String(it.num).startsWith('+888'))delete E.S.nb[String(it.num).replace(/\D/g,'').slice(3)];E.S.inv.splice(i,1)}
  E.save();E.renderAll();E.hp('success');window.KS&&KS.coin();E.toast('Лот выставлен на рынок');X.sync&&X.sync();o.close();tab='mk';mMine=1}}};
})();
