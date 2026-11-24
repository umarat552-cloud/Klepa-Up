/* Klepa Up: подключение к серверу, чат, профили, поддержка, отзывы, админ-панель, обнуление */
(function(){
'use strict';
if(!window.KI){window.KI=()=>'';window.KST=''}
let K,W,perms=[],last='',menuKey='';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const api=async(a,b={})=>{try{const r=await fetch('/api/'+a,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...b,initData:(W&&W.initData)||''})});const j=await r.json();if(j&&j.e==='auth')j.e='Не удалось войти. Откройте приложение заново из бота';return j}catch(e){return{e:'Нет связи с сервером'}}};
const can=p=>perms.includes('*')||perms.includes(p);
const tm=t=>new Date(t).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
const dt=t=>t?new Date(t).toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}):'—';
const ago=t=>{const s=(Date.now()-t)/1e3;return !t?'—':s<120?'<span class="kdot"></span>онлайн':s<3600?Math.floor(s/60)+' мин назад':s<86400?Math.floor(s/3600)+' ч назад':dt(t)};
const rc=t=>/админ|заместит|модер/i.test(t)?'adm':'dev';
const badge=u=>(u.v?K.VB:'')+(u.title?`<span class="rolec ${rc(u.title)}">${esc(u.title)}</span>`:'');
const av=(u,c='kav')=>u.photo?`<img class="${c}" src="${esc(u.photo)}" alt="" referrerpolicy="no-referrer">`:`<div class="${c}">${esc((u.name||'?')[0].toUpperCase())}</div>`;
const num=n=>K.fmt(n||0);
const gname=k=>esc(K.G[k]?K.G[k].n:k);
const nfts=()=>Object.entries(K.G).filter(([k,g])=>g.nft).map(([k,g])=>`<option value="${k}">${esc(g.n)}</option>`).join('');
const stk=[],bb=()=>{try{stk.length?W.BackButton.show():W.BackButton.hide()}catch(e){}};
const ask=m=>new Promise(r=>W&&W.showConfirm?W.showConfirm(m,r):r(confirm(m)));
function ov(title){const o=document.createElement('div');o.className='kov';o.innerHTML=`<div class="kh"><button class="kb" aria-label="Назад">‹</button><b>${title}</b></div><div class="kc"></div>`;document.body.appendChild(o);stk.push(o);bb();
 o.close=()=>{clearInterval(o.t);o.remove();const i=stk.indexOf(o);if(i>=0)stk.splice(i,1);bb()};o.querySelector('.kb').onclick=o.close;return o}
/* ---------- переписка (чат, поддержка) ---------- */
function thread(title,get,send,mine,ms,chat){const o=ov(title),c=o.querySelector('.kc');
 c.innerHTML='<div class="kl"></div><div class="kin"><input class="epi" maxlength="800" placeholder="Сообщение" autocomplete="off"><button class="btn" aria-label="Отправить">'+KI('send')+'</button></div>';
 const L=c.querySelector('.kl'),I=c.querySelector('input');
 const load=async()=>{const m=await get();if(!m)return;const st=L.scrollHeight-L.scrollTop-L.clientHeight<90;
  L.innerHTML=m.map(x=>`<div class="km kw ${mine(x)?'ku':''}" data-u="${x.uid||''}" data-id="${esc(x.id||'')}">${x.uid?av(x):''}<div class="kmb">${x.name?`<div class="kn1"><b>${esc(x.name)}</b>${badge(x)}${x.num?`<span class="chip">${esc(x.num)}</span>`:''}${chat&&x.id&&can('ban')?'<span class="kx">удалить</span>':''}</div>`:''}<p>${esc(x.text||x.t)}</p><div class="kt">${tm(x.ts)}</div></div></div>`).join('')||'<div class="kd">Пока пусто. Напишите первым!</div>';
  if(st)L.scrollTop=L.scrollHeight};
 const go=async()=>{const t=I.value.trim();if(!t)return;I.value='';const r=await send(t);if(r&&r.e)K.toast(r.e);load()};
 c.querySelector('.btn').onclick=go;I.onkeydown=e=>{if(e.key==='Enter')go()};
 if(chat)L.onclick=async e=>{const d=e.target.closest('.km');if(!d)return;if(e.target.classList.contains('kx')){await api('a_chatdel',{id:d.dataset.id});return d.remove()}if(d.dataset.u)showProf(d.dataset.u)};
 load();o.t=setInterval(load,ms);return o}
const support=()=>thread('Поддержка',async()=>((await api('supget')).m||[]).map(x=>({...x,name:x.f==='a'?'Поддержка':''})),t=>api('supsend',{text:t}),m=>m.f==='u',4000);
/* ---------- профиль игрока ---------- */
const gifts=(inv,rm)=>{const g=new Map();inv.forEach(x=>{const key=x.k+'|'+(x.x||''),e=g.get(key)||{k:x.k,x:x.x,n:0};e.n++;g.set(key,e)});return[...g.values()].map(v=>`<div class="kgi">${rm?`<button class="kgx" data-rm="${esc(v.k)}">${KI('close')}</button>`:''}${K.G[v.k]&&K.G[v.k].img?`<img src="${esc(K.G[v.k].img)}" alt="">`:''}<span>${v.x?esc(v.x):gname(v.k)}${v.n>1?' ×'+v.n:''}</span></div>`).join('')||'<div class="kd" style="grid-column:1/-1">Подарков пока нет</div>'};
async function showProf(id){const r=await api('profile',{id});if(!r.p)return K.toast(r.e||'Ошибка');const p=r.p,o=ov('Профиль');
 o.querySelector('.kc').innerHTML=`<div class="card kpr">${av(p,'kbig')}<div class="nm"><span class="nt">${esc(p.name)}</span>${p.v?K.VB:''}</div><div class="sub">${p.un?'@'+esc(p.un):'Без username'}</div>${p.title?`<span class="rolec ${rc(p.title)}">${esc(p.title)}</span>`:''}<div class="kchips"><span class="chip">ID ${p.id}</span>${p.num?`<span class="chip">${esc(p.num)}</span>`:''}${p.cun?`<span class="chip kcun">${KI('at')}${esc(p.cun)}</span>`:''}</div><div class="kmuted">В игре с ${dt(r.joined).split(',')[0]}</div></div><div class="ksec">Подарки · ${p.inv.length}</div><div class="kg">${gifts(p.inv)}</div>${can('users')&&p.id!==K.U.id?'<button class="btn sm" id="kmg">Управлять игроком</button>':''}${r.mod&&p.id!==K.U.id?`<button class="btn g sm" id="kbn">${p.banned?'Разбанить':'Забанить'}</button>`:''}`;
 const m=o.querySelector('#kmg'),b=o.querySelector('#kbn');if(m)m.onclick=()=>KX.open.man(p.id);if(b)b.onclick=async()=>{const x=await api('a_ban',{id:p.id,on:!p.banned});K.toast(x.e||'Готово');if(!x.e)o.close()}}
/* ---------- отзывы ---------- */
function reviews(){const o=ov('Отзывы'),c=o.querySelector('.kc');let rate=5;
 c.innerHTML=`<div class="card" style="padding:14px;margin:0"><div class="kr">${[1,2,3,4,5].map(i=>`<button data-r="${i}">${KI('star')}</button>`).join('')}</div><textarea class="epi ta" rows="3" maxlength="600" placeholder="Ваш отзыв о Klepa Up"></textarea><button class="btn sm" id="rs">Отправить отзыв</button></div><div class="kavg"></div><div class="kl2"></div>`;
 const st=()=>c.querySelectorAll('.kr button').forEach(b=>b.classList.toggle('on',+b.dataset.r<=rate));st();c.querySelector('.kr').onclick=e=>{if(e.target.dataset.r){rate=+e.target.dataset.r;st()}};
 const L=c.querySelector('.kl2'),load=async()=>{const r=await api('revget'),l=r.r||[];c.querySelector('.kavg').innerHTML=l.length?`Средняя оценка <b class="kst">${KST} ${(l.reduce((a,x)=>a+x.rate,0)/l.length).toFixed(1)}</b> · отзывов: ${l.length}`:'';
  L.innerHTML=l.map(x=>`<div class="km kw" style="max-width:100%;align-self:stretch">${av(x)}<div class="kmb" style="flex:1"><div class="kn1"><b>${esc(x.name)}</b>${badge(x)}<span class="kst kstars">${KST.repeat(x.rate)}</span>${can('reviews')?`<span class="kx" data-rdel="${x.uid}">удалить</span>`:''}</div><p>${esc(x.text)}</p><div class="kt">${dt(x.ts)}</div></div></div>`).join('')||'<div class="kd">Отзывов пока нет. Будьте первым!</div>'};
 L.onclick=async e=>{const d=e.target.dataset.rdel;if(d){await api('a_revdel',{id:d});load()}};
 c.querySelector('#rs').onclick=async()=>{const t=c.querySelector('textarea'),r=await api('revadd',{rate,text:t.value});if(r.e)return K.toast(r.e);t.value='';K.toast('Спасибо за отзыв!');load()};load()}
/* ---------- управление игроком (админ) ---------- */
const PL={users:'Игроки',stars:'Звёзды',nft:'NFT',promo:'Промокоды',ban:'Баны и чат',roles:'Роли',support:'Поддержка',reviews:'Отзывы',reset:'Обнуление',cast:'Рассылка',channel:'Канал'};
function reply(s){thread('Диалог: '+esc(s.name),async()=>{const r=await api('a_sup');return(r.l||[]).filter(x=>x.uid===s.uid).flatMap(x=>x.m.map(m=>({...m,name:m.f==='u'?s.name:'Администратор'})))},t=>api('a_supreply',{id:s.uid,text:t}),m=>m.f==='a',3000)}
/* ---------- блокировка ---------- */
let banned=false;
let banTimer=0;
const fmtLeft=ms=>{const s=Math.max(0,Math.floor(ms/1e3)),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60);return d?d+' д '+h+' ч':h?h+' ч '+m+' мин':m+' мин '+s%60+' с'};
function setBan(p){const b=!!(p&&p.banned),old=document.querySelector('.kban'),key=b?(p.reason||'')+'|'+(p.until||0):'';
 if(b&&old&&old.dataset.k===key)return;clearInterval(banTimer);if(old)old.remove();banned=b;document.documentElement.classList.toggle('banned',b);if(!b)return;
 const o=document.createElement('div');o.className='kban';o.dataset.k=key;
 o.innerHTML=`<div class="kbaura"><i></i><i></i><div class="kbi">${KI('lock')}</div></div><h2>Аккаунт заблокирован</h2><p class="kbs">Доступ к игре, банку, рынку и чатам закрыт</p><div class="card kbcard"><div class="kbr"><span>Причина</span><b>${p.reason?esc(p.reason):'Нарушение правил приложения'}</b></div><div class="kbr"><span>Дата блокировки</span><b>${p.bat?dt(p.bat):'—'}</b></div><div class="kbr"><span>Срок</span><b class="kbl">${p.until?'':'Навсегда'}</b></div><div class="kbr"><span>Ваш ID</span><b>${K.U.id}</b></div></div><div class="card kbreply" hidden></div><button class="btn" data-a="sup">${KI('help')}Написать в поддержку</button><button class="btn g" data-a="re">Проверить снова</button><p class="kmuted kbn2">Если блокировка выдана по ошибке, опишите ситуацию в поддержке: администрация рассмотрит обращение.</p>`;
 const left=()=>{const el=o.querySelector('.kbl');if(!el||!p.until)return;const ms=p.until-Date.now();if(ms<=0){el.textContent='Снимается…';clearInterval(banTimer);api('me').then(r=>setBan(r.prof));return}el.textContent='Осталось '+fmtLeft(ms)};
 if(p.until){left();banTimer=setInterval(left,1000)}
 o.onclick=async e=>{const a=e.target.closest('button');if(!a)return;if(a.dataset.a==='sup')support();else{const r=await api('me');setBan(r.prof);if(banned)K.toast('Блокировка пока не снята')}};
 document.body.appendChild(o);
 api('supget').then(r=>{const l=(r.m||[]).filter(z=>z.f==='a');if(l.length){const rp=o.querySelector('.kbreply');rp.hidden=false;rp.innerHTML=`<b>${KI('chat')} Ответ поддержки</b><span>${esc(l[l.length-1].t)}</span>`}})}
/* ---------- заявка на официальную галочку ---------- */
function vreq(){const o=ov('Заявка на галочку'),c=o.querySelector('.kc');
 const draw=async()=>{const r=await api('x/vreq_get'),q=r.r;let h=`<div class="card kpr"><div class="kbi sm">${KI('badge')}</div><div class="t" style="font-size:19px">Официальная галочка</div><div class="sub" style="margin-top:6px">Отметка подтверждает, что аккаунт принадлежит известному игроку, блогеру или проекту</div></div>`;
  if(r.verified)h+=`<div class="card kcard"><div class="grow"><b>${KI('check','kok')} У вас уже есть галочка</b></div></div>`;
  else if(q&&q.status==='pending')h+=`<div class="card kcard"><div class="grow"><b>${KI('clock')} Заявка на рассмотрении</b><br>Отправлена ${dt(q.ts)}. Результат придёт сообщением от бота.<br><i>${esc(q.text)}</i></div></div>`;
  else{if(q&&q.status==='rejected')h+=`<div class="card kcard"><div class="grow"><b class="kwarn">Заявка отклонена</b>${q.reason?'<br>Причина: '+esc(q.reason):''}<br>Новую заявку можно подать через 24 часа после отказа.</div></div>`;
   h+=`<div class="ksec" style="margin:0">Почему вам нужна галочка</div><textarea class="epi ta" id="vt" rows="4" maxlength="600" placeholder="Расскажите о себе и о том, чем вы известны"></textarea><input class="epi" id="vl" maxlength="200" placeholder="Ссылки на соцсети или канал (необязательно)"><button class="btn" id="vs">Отправить заявку</button>`}
  c.innerHTML=h;const b=c.querySelector('#vs');if(b)b.onclick=async()=>{const z=await api('x/vreq_send',{text:c.querySelector('#vt').value,links:c.querySelector('#vl').value});if(z.e){K.hp('error');return K.toast(z.e)}K.toast('Заявка отправлена');draw()}};draw()}
function vdec(z){const o=ov('Заявка #'+String(z.uid).slice(-4)),c=o.querySelector('.kc');
 c.innerHTML=`<div class="card kpr">${av(z,'kbig')}<div class="nm"><span class="nt">${esc(z.name)}</span></div><div class="sub">${z.un?'@'+esc(z.un):'ID '+z.uid} · ${dt(z.ts)}</div></div><div class="card kcard"><div class="grow"><b>Текст заявки</b><br>${esc(z.text)}${z.links?'<br><b>Ссылки:</b> '+esc(z.links):''}</div></div>${z.status==='pending'?`<input class="epi" id="vr" maxlength="200" placeholder="Причина отказа (если отклоняете)"><div class="kf2"><button class="btn sm" data-d="1">Одобрить</button><button class="btn g sm" data-d="0">Отклонить</button></div>`:`<div class="kmuted">Статус: ${z.status==='approved'?'одобрена':'отклонена'}${z.by?' · '+esc(z.by):''}${z.reason?'<br>Причина: '+esc(z.reason):''}</div>`}`;
 c.onclick=async e=>{const b=e.target.closest('[data-d]');if(!b)return;const r=await api('x/a_vdecide',{id:z.uid,ok:b.dataset.d==='1',reason:c.querySelector('#vr')?c.querySelector('#vr').value:''});K.toast(r.e||'Готово');if(!r.e)o.close()}}
/* ---------- бонус за приглашения ---------- */
function refProg(){if(!K||!K.S)return;const n=(window.KRB&&KRB.n)||10,amt=(window.KRB&&KRB.amt)||10000,cnt=K.S.rfN||0,p=cnt%n;let el=document.querySelector('.krb');
 if(!el){const rf=document.querySelector('#s3 .ref');if(!rf)return;el=document.createElement('div');el.className='card krb';rf.before(el)}
 el.innerHTML=`<div class="krbh"><div class="ico">${KI('gift')}</div><div class="grow"><div class="t">Бонус за приглашения</div><div class="sub">Каждые ${n} друзей: +${num(amt)} ${KST}</div></div><b>${p}/${n}</b></div><div class="krbar"><i style="width:${p/n*100}%"></i></div>`}
/* ---------- подписка, обнуление, награды ---------- */
function gate(ch){const o=ov('Подписка'),c=o.querySelector('.kc');c.innerHTML=`<div class="card kpr"><div class="t" style="font-size:19px">Подпишитесь на канал</div><div class="sub" style="margin:8px 0 4px">Вас пригласил друг. Чтобы он получил награду, подпишитесь на ${esc(ch)}.</div></div><button class="btn" id="g1">Открыть канал</button><button class="btn g" id="g2" style="margin-top:0">Я подписался, проверить</button>`;
 c.querySelector('#g1').onclick=()=>{const u='https://t.me/'+ch.slice(1);W&&W.openTelegramLink?W.openTelegramLink(u):open(u)};
 c.querySelector('#g2').onclick=async()=>{const r=await api('sync');if(r.need)return K.toast(r.err?'Не удалось проверить подписку, администратор уже уведомлён. Попробуйте позже':'Подписка на канал не найдена');K.toast('Готово');o.close()}}
function wipeLocal(){const S=K.S,rev=S.rev||0;Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,{stars:100,last:0,inv:[],pins:[],promo:false,pending:null,opened:0,fast:false,cnt:1,cs:'std',rev});K.norm();K.save();K.bal();['renderAll','renderCase','renderProfile'].forEach(f=>{try{K[f]()}catch(e){}});last=''}
async function selfReset(){if(!await ask('Обнулить ваш аккаунт? Звёзды, подарки, промокоды и прогресс будут сброшены. Это нельзя отменить.'))return;if(!await ask('Точно обнулить? Восстановить данные будет невозможно.'))return;const r=await api('reset');if(r.e)return K.toast(r.e);wipeLocal();K.hp('success');K.toast('Аккаунт обнулён')}
function applySelf(u){const v=!!u.v,t=u.title||'';if(window.KV!==v||window.KT!==t){window.KV=v;window.KT=t;try{K.applyProf()}catch(e){}}}
async function inbox(){const g=await api('inbox');if(!g||g.e)return;
 if(g.prof){setBan(g.prof);const k=JSON.stringify(g.prof.perms);if(k!==JSON.stringify(perms)){perms=g.prof.perms;menu()}applySelf(g.prof)}
 if(g.reset){wipeLocal();K.toast('Ваш аккаунт обнулён администратором',4000);return}
 let ch=0;if(g.s){K.S.stars=Math.max(0,K.S.stars+g.s);ch=1}
 (g.n||[]).forEach(k=>{if(K.G[k]){K.S.inv.unshift({id:Date.now()+Math.random(),k});ch=1}});
 (g.it||[]).forEach(it=>{if(K.G[it.k]){const o={id:Date.now()+Math.random(),k:it.k};if(it.num)o.num=it.num;if(it.un)o.un=it.un;K.S.inv.unshift(o);ch=1}});
 (g.rm||[]).forEach(k=>{const i=K.S.inv.findIndex(x=>x.k===k);if(i>=0){K.S.inv.splice(i,1);ch=1}});
 refProg();if(ch){try{K.norm()}catch(e){}K.save();K.bal();try{K.renderInv()}catch(e){}K.hp('success');K.toast(g.tx&&g.tx.length?'Перевод: '+g.tx.map(t=>t.name+' +'+K.fmt(t.amt)+' звёзд').join(', '):g.s<0?'Администратор изменил ваш баланс':'Вам выдали награду',3500)}}
window.kupPromo=async v=>{const r=await api('promo',{code:v});if(r.e){K.hp('error');return K.toast(r.e)}K.$('#pi').value='';await inbox();K.toast('Промокод активирован')};
/* ---------- меню в профиле ---------- */
function menu(){const key=JSON.stringify(perms.length);const old=document.querySelector('.kmenu');if(old)old.remove();
 const row=(m,i,t,s)=>`<button class="kmr" data-m="${m}"><div class="ico">${KI(i)}</div><div class="grow"><div class="t">${t}</div><div class="sub">${s}</div></div><span class="kar">›</span></button>`;
 const card=document.createElement('div');card.className='card kmenu';
 card.innerHTML=row('bank','bank','Банк','Переводы по @username, QR-код, история')+row('adv','tree','Новогодний календарь','7 дней подарков в декабре')+row('chats','chat','Чаты','Канал, общий чат, поддержка')+row('rev','star','Отзывы','Читайте и оставляйте отзывы')+row('vreq','badge','Заявка на галочку','Официальная отметка профиля')+row('set','gear','Настройки','Тема, шрифт, звук, вибрация')+(perms.length?row('adm','admin','Админ-панель','Игроки, промокоды, права, рассылка'):'')+'<button class="btn g sm kdanger" data-m="rst">Обнулить мой аккаунт</button>';
 card.onclick=e=>{const b=e.target.closest('[data-m]');if(b)({bank:()=>KX.open.bank(),chats:()=>KX.open.chats(),rev:reviews,vreq,set:()=>window.KUI&&KUI.settings(),adv:()=>KX.open.adv&&KX.open.adv(),adm:()=>KX.open.admin(),rst:selfReset})[b.dataset.m]()};
 const st=document.querySelector('#s3 .stats');st&&st.after(card);if(window.KX&&KX.reBadge)KX.reBadge();refProg()}
window.kupInit=async k=>{K=k;W=window.Telegram&&Telegram.WebApp;if(!(W&&W.initData))return;
 if(W.BackButton)W.BackButton.onClick(()=>{const o=stk[stk.length-1];o&&o.close()});
 const snap=()=>{try{const S=K.S,x=S.phone&&S.inv.find(y=>y.id===S.phone),u2=S.uname&&S.inv.find(y=>y.id===S.uname),b={bal:S.stars,name:K.dispName(),inv:S.inv.map(i=>({k:i.k,n:K.G[i.k].n,nft:!!K.G[i.k].nft,x:i.num||i.un||''})),num:x?K.nmx(x,K.G[x.k]):'',cun:u2?u2.un:''},j=JSON.stringify(b);if(j===last)return Promise.resolve();last=j;return api('snap',b)}catch(e){return Promise.resolve()}};
 const r=await api('me');window.KRB=r.rb;setBan(r.prof);if(r.u){perms=r.perms||[];applySelf(r.u);if(r.need)gate(r.ch);
  const sn=r.snap;if(sn&&sn.at&&!K.S.opened&&!(K.S.inv&&K.S.inv.length)&&K.S.stars<=100&&(sn.bal>100||sn.inv.length)){K.S.stars=sn.bal;K.S.inv=sn.inv.filter(i=>K.G[i.k]).map(i=>({id:Date.now()+Math.random(),k:i.k}));try{K.norm()}catch(e){}K.save();K.bal();try{K.renderInv()}catch(e){}K.toast('Ваши данные восстановлены с сервера',4000)}}
 menu();KX.sync=()=>{last='';return snap()};KX.snap=KX.sync;snap();setInterval(snap,15000);inbox();setInterval(inbox,8000);
 KX.ready.forEach(f=>{try{f(r)}catch(e){console.error(e)}})};
window.KX={inbox,gifts,gname,nfts,thread,reply,vdec,PL,get isOwner(){return perms.includes('*')},get K(){return K},get W(){return W},api,can,esc,av,badge,ask,ov,dt,tm,ago,rc,num,showProf,support,open:{},ready:[],snap(){},reBadge(){}};
})();
