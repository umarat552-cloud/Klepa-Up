/* Klepa Up: админ-панель и карточка игрока */
(function(){
'use strict';
const X=window.KX,esc=X.esc,num=X.num,dt=X.dt,ago=X.ago,av=X.av,badge=X.badge,can=p=>X.can(p),api=(a,b)=>X.api(a,b),K=()=>X.K;
const PRE=[['Модератор','Игроки, баны, отзывы',['users','ban','reviews']],['Саппорт','Поддержка и заявки на галочку',['users','support','roles']],['Редактор канала','Публикации в канале',['channel']],['Менеджер','Награды, промокоды, поддержка',['users','stars','nft','promo','support','reviews']],['Полный доступ','Все права, кроме рассылки',['users','stars','nft','promo','ban','roles','support','reviews','reset','channel']]];
const DUR=[[1,'1 час'],[24,'1 день'],[168,'7 дней'],[720,'30 дней'],[0,'Навсегда']],RSN=['Спам','Оскорбления','Мошенничество','Нарушение правил','Обман в играх'];
const pill=(t,c)=>`<span class="apill ${c||''}">${t}</span>`;
const left=ms=>{const s=Math.floor(ms/1e3),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60);return d?d+' д '+h+' ч':h?h+' ч '+m+' мин':Math.max(1,m)+' мин'};
const banInfo=x=>x.banned?`<b class="kwarn">${KI('ban')} Заблокирован</b>${x.banReason?' · '+esc(x.banReason):''}${x.banUntil?' · осталось '+left(x.banUntil-Date.now()):' · навсегда'}`:'';
/* ---------- карточка игрока ---------- */
async function man(id){const o=X.ov('Игрок'),c=o.querySelector('.kc');let u,dur=24;
 const sec=(ic,t,b)=>`<div class="card kset"><div class="ksh">${KI(ic)}<b>${t}</b></div>${b}</div>`;
 const render=async()=>{const [r,tx]=await Promise.all([api('a_user',{id}),can('users')?api('x/a_utx',{id}):{l:[]}]);if(!r.u){K().toast(r.e||'Ошибка');return o.close()}u=r.u;
  const top=c.scrollTop,locked=!X.isOwner&&(u.owner||u.role==='admin'||u.id===K().U.id);
  let h=`<div class="card kpr">${av(u,'kbig')}<div class="nm"><span class="nt">${esc(u.name)}</span>${u.v?K().VB:''}</div><div class="sub">${u.un?'@'+esc(u.un):'Без username'}${u.name!==u.tgname?' · в Telegram: '+esc(u.tgname):''}</div>${u.title?`<span class="rolec ${X.rc(u.title)}">${esc(u.title)}</span>`:''}<div class="kchips">${pill('ID '+u.id)}${u.owner?pill('Владелец','y'):u.role==='admin'?pill('Администратор','y'):''}${u.banned?pill('Бан','r'):''}${u.num?pill(esc(u.num)):''}${u.cun?pill('@'+esc(u.cun)):''}</div></div>
  <div class="atiles3"><div><b>${num(u.bal)}</b><span>звёзд</span></div><div><b>${u.inv.length}</b><span>подарков</span></div><div><b>${u.refs}</b><span>приглашено</span></div></div>
  <div class="kmuted ameta">Был: ${ago(u.seen)} · регистрация ${dt(u.joined)}${u.by?' · пригласил ID '+u.by:''}</div>${u.banned?`<div class="card kcard abanc"><div class="grow">${banInfo(u)}</div></div>`:''}`;
  h+=sec('gift','Подарки игрока',`<div class="kg">${X.gifts(u.inv,can('nft')&&!locked)}</div>`);
  if(locked){h+=`<div class="card kcard"><div class="grow"><b>${KI('lock')} Защищённый аккаунт</b><br>${u.owner?'Это владелец приложения: изменять его аккаунт нельзя.':u.id===K().U.id?'Свой аккаунт изменять нельзя.':'Это администратор: изменять его может только владелец.'}</div></div>`;c.innerHTML=h;c.scrollTop=top;return}
  if(can('stars'))h+=sec('star','Звёзды',`<input class="epi" id="ks" type="number" inputmode="numeric" placeholder="Сколько звёзд"><div class="kf2"><button class="btn sm" data-a="plus">Выдать</button><button class="btn g sm" data-a="minus">Списать</button></div>`);
  if(can('nft'))h+=sec('gift','Выдать подарок',`<div class="kf2"><select class="epi" id="kn">${X.nfts()}</select><input class="epi" id="kq" type="number" inputmode="numeric" value="1" min="1" max="20"></div><button class="btn sm" data-a="gnft">Выдать подарок</button>`);
  if(can('support'))h+=sec('chat','Сообщение игроку',`<textarea class="epi ta" id="km" rows="2" placeholder="Текст придёт от имени бота"></textarea><button class="btn g sm" data-a="msg">Отправить</button>`);
  if(can('roles'))h+=sec('badge','Статус и права',`<button class="btn g sm" data-a="vf">${u.v?'Снять официальную галочку':'Выдать официальную галочку'}</button><input class="epi" id="kt" maxlength="30" value="${esc(u.title)}" placeholder="Должность (например, Модератор)"><label class="klab"><input type="checkbox" id="kad" ${u.role==='admin'?'checked':''}> Администратор</label><div class="apre">${PRE.map((p,i)=>`<button data-pre="${i}"><b>${p[0]}</b><small>${p[1]}</small></button>`).join('')}</div><div class="kpm">${Object.keys(X.PL).map(p=>`<label><input type="checkbox" data-p="${p}" ${u.perms.includes(p)?'checked':''}> ${X.PL[p]}</label>`).join('')}</div><button class="btn sm" data-a="role">Сохранить должность и права</button>`);
  if(can('ban'))h+=u.banned?sec('ban','Блокировка',`<div class="kmuted">${banInfo(u)}</div><button class="btn sm" data-a="unban">Снять блокировку</button>`):sec('ban','Блокировка',`<input class="epi" id="kbr" maxlength="200" placeholder="Причина (увидит игрок)"><div class="achips">${RSN.map(x=>`<button data-rs="${x}">${x}</button>`).join('')}</div><div class="kseg adur">${DUR.map(d=>`<button data-h="${d[0]}" class="${d[0]===dur?'on':''}">${d[1]}</button>`).join('')}</div><button class="btn kred" data-a="ban">${KI('ban')}Заблокировать</button>`);
  if(tx.l&&tx.l.length)h+=sec('swap','Последние переводы',tx.l.slice(0,6).map(t=>`<div class="atx"><span>${t.from===u.id?'→ '+esc(t.tn):'← '+esc(t.fn)}</span><b class="${t.from===u.id?'':'pos'}">${t.from===u.id?'−':'+'}${num(t.amt)}</b><small>${dt(t.ts)}</small></div>`).join(''));
  if(can('reset'))h+=sec('reset','Опасная зона',`<button class="btn kred" data-a="reset">${KI('reset')}Обнулить аккаунт игрока</button>`);
  c.innerHTML=h;c.scrollTop=top};
 c.onclick=async e=>{const t=e.target,v=s=>c.querySelector(s);let r;
  const rs=t.closest('[data-rs]');if(rs){v('#kbr').value=rs.dataset.rs;return}
  const hh=t.closest('[data-h]');if(hh){dur=+hh.dataset.h;c.querySelectorAll('.adur button').forEach(x=>x.classList.toggle('on',x===hh));return}
  const pr=t.closest('[data-pre]');if(pr){const p=PRE[+pr.dataset.pre];c.querySelectorAll('[data-p]').forEach(x=>x.checked=p[2].includes(x.dataset.p));v('#kad').checked=true;if(!v('#kt').value)v('#kt').value=p[0];return}
  const rm=t.closest('[data-rm]'),b=t.closest('[data-a]');
  if(rm){const k=rm.dataset.rm;if(!await X.ask('Забрать подарок «'+X.gname(k)+'» у игрока?'))return;r=await api('a_take',{id,nft:k})}
  else if(b){const a=b.dataset.a;
   if(a==='plus'||a==='minus'){const n=Math.abs(+v('#ks').value|0);if(!n)return K().toast('Введите количество звёзд');r=await api('a_give',{id,stars:a==='plus'?n:-n})}
   else if(a==='gnft')r=await api('a_give',{id,nft:v('#kn').value,qty:v('#kq').value});
   else if(a==='msg'){r=await api('a_msg',{id,text:v('#km').value});if(!r.e)v('#km').value=''}
   else if(a==='vf')r=await api('a_role',{id,v:!u.v});
   else if(a==='role')r=await api('a_role',{id,title:v('#kt').value,role:v('#kad').checked?'admin':'user',perms:[...c.querySelectorAll('[data-p]:checked')].map(x=>x.dataset.p)});
   else if(a==='ban'){if(!await X.ask('Заблокировать «'+u.name+'»'+(dur?' на '+DUR.find(d=>d[0]===dur)[1]:' навсегда')+'?'))return;r=await api('a_ban',{id,on:true,hours:dur,reason:v('#kbr')?v('#kbr').value:''})}
   else if(a==='unban')r=await api('a_ban',{id,on:false});
   else if(a==='reset'){if(!await X.ask('Обнулить аккаунт «'+u.name+'»? Звёзды, подарки и промокоды будут сброшены. Это нельзя отменить.'))return;r=await api('a_reset',{id})}}
  else return;
  K().toast(r.e||'Готово');if(!r.e)render()};
 render()}
/* ---------- панель ---------- */
function admin(){const o=X.ov('Админ-панель'),c=o.querySelector('.kc');
 let tab='st',q='',uf='all',us='seen',lim=50,data=[],cnt={},tt=0;
 const T=[['st','Обзор','chart',1],['u','Игроки','users',can('users')],['b','Баны','ban',can('ban')],['v','Заявки','badge',can('roles')],['s','Поддержка','help',can('support')],['m','Рынок','market',can('ban')],['p','Промо','tag',can('promo')],['t','Переводы','swap',can('users')],['r','Отзывы','star',can('reviews')],['c','Рассылка','mega',can('cast')],['l','Журнал','list',can('roles')]].filter(t=>t[3]);
 const bg=t=>({s:cnt.wait,v:cnt.vp,b:cnt.banned}[t]||0);
 const tabsH=()=>`<div class="atabs">${T.map(t=>`<button data-t="${t[0]}" class="${tab===t[0]?'on':''}">${KI(t[2])}<span>${t[1]}</span>${bg(t[0])?`<i class="abg">${bg(t[0])}</i>`:''}</button>`).join('')}</div>`;
 c.innerHTML=tabsH()+'<div class="afil"></div><div class="kl2 alist"></div>';
 const F=c.querySelector('.afil'),L=c.querySelector('.alist');
 const upBadges=()=>{const s=c.querySelector('.atabs'),x=s.scrollLeft;s.outerHTML=tabsH();c.querySelector('.atabs').scrollLeft=x};
 const chips=(k,items,cur)=>`<div class="achips" data-k="${k}">${items.map(i=>`<button data-v="${i[0]}" class="${cur===i[0]?'on':''}">${i[1]}</button>`).join('')}</div>`;
 const setF=()=>{F.innerHTML=tab==='u'?`<div class="ksrch">${KI('search')}<input class="epi" id="aq" placeholder="Имя, @юзернейм или ID" value="${esc(q)}" autocomplete="off" autocapitalize="off"></div>`+chips('f',[['all','Все'],['online','Онлайн'],['banned','В бане'],['admins','Админы'],['verified','С галочкой'],['nft','С NFT']],uf)+chips('s',[['seen','Активные'],['new','Новые'],['bal','По балансу'],['refs','По друзьям']],us):'';
  const a=F.querySelector('#aq');if(a)a.oninput=()=>{q=a.value;lim=50;clearTimeout(tt);tt=setTimeout(draw,300)}};
 const tile=(ic,n,l,cl)=>`<div class="atile ${cl||''}"><i>${KI(ic)}</i><b>${num(n)}</b><span>${l}</span></div>`;
 const st=(ok,l,s)=>`<div class="ast"><i class="${ok?'ok':'bad'}"></i><div class="grow"><b>${l}</b><small>${s}</small></div></div>`;
 const Q=()=>X.api('a_stats').then(r=>{if(!r.e){cnt=r;upBadges()}return r});
 async function draw(){const t=tab,ae=document.activeElement;if(L.contains(ae)&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName))return;
  if(t==='st'){const [r,dg]=await Promise.all([Q(),api('a_diag')]);if(t!==tab)return;if(r.e)return L.textContent=r.e;
   L.innerHTML=`<div class="card kset astc">${st(!!dg.bot,'Бот',dg.bot?'@'+esc(dg.bot):'Не удалось связаться с Telegram: проверьте BOT_TOKEN в Render')}${st(dg.admin,'Подписка на канал',dg.admin?'Бот администратор канала «'+esc(dg.chat)+'»':esc(dg.chatErr||dg.memErr||'Добавьте бота администратором канала'))}${st(dg.ai,'ИИ-помощник',dg.ai?'Работает':esc(dg.aiErr||'Ошибка ответа'))}${st(dg.main,'Главное приложение',dg.main?'Настроено в BotFather':'Не найдено: BotFather → Configure Mini App')}</div>
   <div class="atiles">${tile('users',r.users,'игроков')}${tile('clock',r.online,'онлайн сейчас','g')}${tile('plus',r.day,'новых за 24 ч')}${tile('star',r.stars,'звёзд у игроков')}${tile('gift',r.gifts,'подарков, из них NFT '+num(r.nfts))}${tile('users',r.refs,'приглашений')}${tile('ban',r.banned,'в бане',r.banned?'r':'')}${tile('help',r.wait,'ждут ответа',r.wait?'y':'')}${tile('badge',r.vp,'заявок на галочку',r.vp?'y':'')}${tile('market',r.mk,'лотов на рынке')}${tile('star',r.reviews,'отзывов')}${tile('admin',r.admins,'админов')}</div>
   <div class="ksec">Быстрые действия</div><div class="aq">${[['u','Игроки','users'],['v','Заявки','badge'],['s','Поддержка','help'],['c','Рассылка','mega']].filter(x=>T.some(t=>t[0]===x[0])).map(x=>`<button data-go="${x[0]}">${KI(x[2])}${x[1]}</button>`).join('')}</div><div class="kmuted" style="text-align:center">Обновляется каждые 5 секунд. Баланс и подарки берутся из приложений игроков.</div>`}
  else if(t==='u'){const r=await api('a_users',{q,f:uf==='all'?'':uf,s:us,lim});if(t!==tab)return;if(!r.l)return L.textContent=r.e||'';data=r.l;
   L.innerHTML=`<div class="kmuted">Всего ${num(r.n)} · онлайн ${r.on}${q||uf!=='all'?' · найдено '+num(r.found):''}</div>`+r.l.map(x=>`<div class="card kcard arow" data-man="${x.id}">${av(x)}<div class="grow"><div class="kn1"><b>${esc(x.name)}</b>${badge(x)}${x.banned?`<span class="kx kbanc">${KI('ban')}бан</span>`:''}${x.owner?pill('владелец','y'):x.role==='admin'?pill('админ','y'):''}</div>${x.un?'@'+esc(x.un)+' · ':''}ID ${x.id}<br>${KST} ${num(x.bal)} · ${KI('gift','ks')} ${x.inv.length} · ${KI('users','ks')} ${x.refs} · ${ago(x.seen)}</div></div>`).join('')+(r.found>r.l.length?`<button class="btn g sm" data-more="1">Показать ещё · ${num(r.found-r.l.length)}</button>`:'')||'<div class="kd">Никого не найдено</div>'}
  else if(t==='b'){const r=await api('a_bans');if(t!==tab)return;L.innerHTML=(r.l||[]).map(x=>`<div class="card kcard arow" data-man="${x.id}">${av(x)}<div class="grow"><div class="kn1"><b>${esc(x.name)}</b>${badge(x)}</div>${x.banReason?esc(x.banReason):'Причина не указана'}<br><small class="kmuted">${x.banUntil?'осталось '+left(x.banUntil-Date.now()):'навсегда'} · с ${dt(x.banAt)}</small></div><button class="btn g sm abtn" data-unban="${x.id}">Разбанить</button></div>`).join('')||'<div class="kd">Заблокированных игроков нет</div>'}
  else if(t==='v'){const r=await api('x/a_vreqs');if(t!==tab)return;data=r.l||[];L.innerHTML=data.map((z,i)=>`<div class="card kcard arow" data-vr="${i}">${av(z)}<div class="grow"><div class="kn1"><b>${esc(z.name)}</b>${z.un?'@'+esc(z.un):''}${pill(z.status==='pending'?'ждёт решения':z.status==='approved'?'одобрена':'отклонена',z.status==='pending'?'y':z.status==='approved'?'g':'r')}</div>${esc(z.text.slice(0,90))}</div></div>`).join('')||'<div class="kd">Заявок нет</div>'}
  else if(t==='s'){const r=await api('a_sup');if(t!==tab)return;if(!r.l)return L.textContent=r.e||'';data=r.l.sort((a,b2)=>((b2.m.at(-1)||{}).f==='u')-((a.m.at(-1)||{}).f==='u'));
   L.innerHTML=data.map((x,i)=>{const m=x.m[x.m.length-1],w=m&&m.f==='u';return`<div class="card kcard arow" data-sup="${i}"><div class="grow"><div class="kn1"><b>${esc(x.name)}</b>${x.un?'@'+esc(x.un):''}${w?pill('ждёт ответа','y'):pill('отвечено','g')}</div>${esc((m?m.t:'').slice(0,90))}<br><small class="kmuted">${m?dt(m.ts):''}</small></div></div>`}).join('')||'<div class="kd">Обращений нет</div>'}
  else if(t==='m'){const r=await api('x/mk_list',{s:'new'});if(t!==tab)return;const k=K();L.innerHTML=(r.l||[]).map(m=>{const g=k.G[m.item.k]||{n:m.item.k};return`<div class="card mkc"><div class="mki">${k.G[m.item.k]?k.ima(k.G[m.item.k]):''}</div><div class="mkb"><b>${esc(m.item.un?'@'+m.item.un:m.item.num||g.n)}</b><small>${esc(g.n)}</small><div class="mks">${KI('user')}<span>${esc(m.sname)}${m.sun?' @'+esc(m.sun):''}</span></div></div><div class="mkp"><b>${num(m.price)}</b><button class="btn sm g" data-mkc="${m.id}">Снять</button></div></div>`}).join('')||'<div class="kd">На рынке нет лотов</div>'}
  else if(t==='p'){const r=await api('a_promos');if(t!==tab)return;if(!r.l)return L.textContent=r.e||'';
   if(!L.querySelector('#pc'))L.innerHTML=`<div class="card kset"><div class="kf"><input class="epi" id="pc" placeholder="Код промокода" autocapitalize="off"><input class="epi" id="ps" type="number" inputmode="numeric" placeholder="Звёзд (можно 0)"><select class="epi" id="pn"><option value="">Без NFT-подарка</option>${X.nfts()}</select><input class="epi" id="pm" type="number" inputmode="numeric" placeholder="Лимит активаций (пусто = без лимита)"><button class="btn sm" id="pa">Создать промокод</button></div></div><div id="pl" class="kl2"></div>`;
   L.querySelector('#pl').innerHTML=r.l.map(p=>`<div class="card kcard"><div class="grow"><b>${esc(p.code)}</b><br>${p.s?KST+' '+num(p.s):''} ${p.n.map(k=>KI('gift','ks')+' '+X.gname(k)).join(' ')} · использован ${p.used}/${p.max||'∞'}</div><button class="btn g sm abtn" data-pdel="${esc(p.code)}">Удалить</button></div>`).join('')||'<div class="kd">Промокодов пока нет</div>'}
  else if(t==='t'){const r=await api('x/a_tx');if(t!==tab)return;L.innerHTML=(r.l||[]).map(z=>`<div class="card kcard"><div class="grow"><b>${esc(z.fn)}</b>${z.fu?' @'+esc(z.fu):''} → <b>${esc(z.tn)}</b>${z.tu?' @'+esc(z.tu):''}<br>${KST} ${num(z.amt)} · ${dt(z.ts)}${z.note?' · '+esc(z.note):''}</div></div>`).join('')||'<div class="kd">Переводов пока нет</div>'}
  else if(t==='r'){const r=await api('revget');if(t!==tab)return;L.innerHTML=(r.r||[]).map(x=>`<div class="card kcard">${av(x)}<div class="grow"><div class="kn1"><b>${esc(x.name)}</b>${badge(x)}<span class="kst kstars">${KST.repeat(x.rate)}</span></div>${esc(x.text)}</div><button class="btn g sm abtn" data-rdel="${x.uid}">${KI('trash')}</button></div>`).join('')||'<div class="kd">Отзывов нет</div>'}
  else if(t==='c'){if(!L.querySelector('#ct'))L.innerHTML='<div class="card kset"><div class="kf"><div class="kmuted">Сообщение получат все, кто запускал бота. Отправка идёт в фоне.</div><textarea class="epi ta" id="ct" rows="5" maxlength="1500" placeholder="Текст рассылки"></textarea><button class="btn sm" id="cs">Отправить всем</button></div></div>'}
  else if(t==='l'){const r=await api('a_log');if(t!==tab)return;L.innerHTML=(r.l||[]).map(z=>`<div class="card kcard"><div class="grow"><b>${esc(z.name)}</b> · ${dt(z.ts)}<br><small class="kmuted">${esc(z.t)}</small></div></div>`).join('')||'<div class="kd">Журнал пуст</div>'}}
 const go=t=>{tab=t;lim=50;c.querySelectorAll('.atabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));setF();L.innerHTML='';draw()};
 c.onclick=async e=>{const g=s=>e.target.closest(s);let b;
  if(b=g('.atabs [data-t]'))return go(b.dataset.t);if(b=g('[data-go]'))return go(b.dataset.go);
  if(b=g('.afil .achips button')){const k=b.parentNode.dataset.k;if(k==='f')uf=b.dataset.v;else us=b.dataset.v;lim=50;setF();return draw()}
  if(b=g('[data-more]')){lim+=50;return draw()}
  if(b=g('[data-unban]')){const r=await api('a_ban',{id:b.dataset.unban,on:false});K().toast(r.e||'Блокировка снята');return draw()}
  if(b=g('[data-mkc]')){if(!await X.ask('Снять лот с рынка? Предмет вернётся продавцу.'))return;const r=await api('x/mk_cancel',{id:b.dataset.mkc});K().toast(r.e||'Лот снят');return draw()}
  if(b=g('[data-pdel]')){if(await X.ask('Удалить промокод?')){await api('a_promodel',{code:b.dataset.pdel});draw()}return}
  if(b=g('[data-rdel]')){await api('a_revdel',{id:b.dataset.rdel});return draw()}
  if(g('#pa')){const v=s=>L.querySelector(s).value,x=await api('a_promoadd',{code:v('#pc'),stars:v('#ps'),nft:v('#pn'),max:v('#pm')});K().toast(x.e||'Промокод создан');if(!x.e)['#pc','#ps','#pm'].forEach(s=>L.querySelector(s).value='');return draw()}
  if(g('#cs')){const t=L.querySelector('#ct').value.trim();if(!t)return;if(!await X.ask('Отправить сообщение всем игрокам?'))return;const x=await api('a_cast',{text:t});K().toast(x.e||'Рассылка запущена: '+x.n+' чел.');if(!x.e)L.querySelector('#ct').value='';return}
  if(b=g('[data-vr]')){const z=data[+b.dataset.vr];if(z)X.vdec(z);return}
  if(b=g('[data-man]'))return man(b.dataset.man);
  if(b=g('[data-sup]')){const s=data[+b.dataset.sup];if(s)X.reply(s)}};
 Q();setF();draw();o.t=setInterval(()=>{draw();if(tab!=='st')Q()},5000)}
X.open.admin=admin;X.open.man=man;
})();
