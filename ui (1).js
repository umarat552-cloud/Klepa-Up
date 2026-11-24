/* Klepa Up: иконки, настройки (темы, шрифты, звук), вспомогательные функции для iOS и Android */
(function(){
'use strict';
/* ---------- иконки (SVG, единый стиль) ---------- */
const P={
bank:'<path d="M3 9.5L12 4l9 5.5"/><path d="M5.5 10.5v6.5M9.8 10.5v6.5M14.2 10.5v6.5M18.5 10.5v6.5M3.5 20h17"/>',
chat:'<path d="M20 12.2A7.7 7.7 0 0 1 8.2 18.8L4 20l1.3-3.7A7.7 7.7 0 1 1 20 12.2z"/>',
star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>',
admin:'<path d="M12 3l7 3v5.5c0 4.3-3 7.7-7 9.5-4-1.8-7-5.2-7-9.5V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
send:'<path d="M7 17L17 7M9 7h8v8"/>',recv:'<path d="M17 7L7 17M15 17H7V9"/>',
qr:'<rect x="4" y="4" width="6.5" height="6.5" rx="1.4"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4"/><path d="M13.5 13.5h3v3h-3zM19 13.5v3M13.5 19h3M19 19v1"/>',
scan:'<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M4 12h16"/>',
mega:'<path d="M4 10v4a1 1 0 0 0 1 1h2.5l7 4V5l-7 4H5a1 1 0 0 0-1 1z"/><path d="M18.5 9.5a3.5 3.5 0 0 1 0 5"/>',
help:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.4"/><path d="M6 6l3.6 3.6M18 6l-3.6 3.6M6 18l3.6-3.6M18 18l-3.6-3.6"/>',
reply:'<path d="M9 7L4 12l5 5"/><path d="M4 12h9a6 6 0 0 1 6 6v1"/>',
copy:'<rect x="8" y="8" width="11" height="11" rx="2.2"/><path d="M16 8V6.2A2.2 2.2 0 0 0 13.8 4H6.2A2.2 2.2 0 0 0 4 6.2v7.6A2.2 2.2 0 0 0 6.2 16H8"/>',
trash:'<path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.8 12.2h9.4L17.5 7M10 11v5M14 11v5"/>',
user:'<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.5-3.8 3.4-6 7-6s6.5 2.2 7 6"/>',
check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',clip:'<path d="M20 11.5l-7.6 7.6a4.6 4.6 0 0 1-6.5-6.5l8-8a3 3 0 0 1 4.3 4.3l-8 8a1.4 1.4 0 0 1-2-2l7.4-7.4"/>',
image:'<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.7"/><path d="M4 17l5-4.5 3.5 3L16 12l4 4"/>',
video:'<rect x="3.5" y="6" width="12" height="12" rx="2.5"/><path d="M15.5 10.5l5-2.8v8.6l-5-2.8z"/>',
market:'<path d="M4.5 9.5l1.2-4.5h12.6l1.2 4.5"/><path d="M4.5 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"/><path d="M5.5 12v7.5h13V12M10 19.5v-4h4v4"/>',
tag:'<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-5.6 5.6a1.5 1.5 0 0 1-2.1 0z"/><circle cx="8" cy="8" r="1.3"/>',
at:'<circle cx="12" cy="12" r="3.6"/><path d="M15.6 8.5V13a2.4 2.4 0 0 0 4.8 0v-1a8.4 8.4 0 1 0-3.3 6.7"/>',
phone:'<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 14.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
palette:'<path d="M12 3.5a8.5 8.5 0 1 0 0 17 2 2 0 0 0 1.5-3.3 2 2 0 0 1 1.5-3.2H17a3.5 3.5 0 0 0 3.5-3.5C20.5 6.7 16.7 3.5 12 3.5z"/><circle cx="7.8" cy="11" r="1"/><circle cx="10.5" cy="7.5" r="1"/><circle cx="15" cy="7.8" r="1"/>',
type:'<path d="M5 7V5.5h14V7M12 5.5V19M9 19h6"/>',
volume:'<path d="M4 9.5v5h3.5l5 4v-13l-5 4z"/><path d="M16 9a4.2 4.2 0 0 1 0 6M18.6 6.5a8 8 0 0 1 0 11"/>',
vibe:'<rect x="8" y="4" width="8" height="16" rx="2"/><path d="M4.5 9v6M19.5 9v6M2 11v2M22 11v2"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>',
moon:'<path d="M20 14.2A8 8 0 1 1 9.8 4a6.4 6.4 0 0 0 10.2 10.2z"/>',
plus:'<path d="M12 5v14M5 12h14"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',
swap:'<path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4"/>',next:'<path d="M9 5l7 7-7 7"/>',back:'<path d="M15 5l-7 7 7 7"/>',
badge:'<path d="M12 3l2.3 1.6 2.8-.1 1 2.6 2.3 1.6-.8 2.7.8 2.7-2.3 1.6-1 2.6-2.8-.1L12 21l-2.3-1.6-2.8.1-1-2.6-2.3-1.6.8-2.7-.8-2.7 2.3-1.6 1-2.6 2.8.1z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/>',
ban:'<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>',
lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',gift:'<rect x="3.5" y="9" width="17" height="11.5" rx="2"/><path d="M2.5 9h19V6.8A1.3 1.3 0 0 0 20.2 5.5H3.8A1.3 1.3 0 0 0 2.5 6.8zM12 5.5v15"/>',
list:'<path d="M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01"/>',chart:'<path d="M4 20V9M10 20V4M16 20v-8M21 20H3"/>',
users:'<circle cx="9" cy="8.5" r="3.3"/><path d="M2.8 19.5c.4-3.3 3-5.3 6.2-5.3s5.8 2 6.2 5.3"/><circle cx="17.2" cy="9.4" r="2.5"/><path d="M17.6 14.2c2.2.2 3.7 1.7 4 4.2"/>',
reset:'<path d="M4 12a8 8 0 1 0 2.6-5.9L4 8.5"/><path d="M4 4v4.5h4.5"/>',tree:'<path d="M12 3.2L8 8.4h2.4L6.8 13h2.8l-4.1 5.3h13L14.4 13h2.8l-3.6-4.6H16z"/><path d="M12 18.3V21"/>',snow:'<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M9.5 4.5L12 6.8l2.5-2.3M9.5 19.5L12 17.2l2.5 2.3"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>'};
window.KI=(n,c)=>`<svg class="ki ${c||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||''}</svg>`;
window.KST='<svg class="st" aria-hidden="true"><use href="#i-star"/></svg>';
/* ---------- настройки ---------- */
const PAL=[['gold','Золото','#ffd21f','#ffb300'],['violet','Неон','#b98bff','#7a3cff'],['emerald','Изумруд','#4ff0a6','#12b36a'],['ruby','Рубин','#ff6b7d','#e0243f'],['ocean','Океан','#6cc8ff','#2f7bff'],['rose','Роза','#ff9ad5','#ff4fa8'],['mono','Графит','#e8e8ee','#a9abb8']];
const FNT=[['klepa','Klepa','Onest,-apple-system,"SF Pro Text",system-ui,sans-serif','Unbounded,Onest,system-ui,sans-serif'],['system','Системный','-apple-system,"SF Pro Text",system-ui,"Segoe UI",Roboto,sans-serif','-apple-system,"SF Pro Display",system-ui,"Segoe UI",Roboto,sans-serif'],['round','Скруглённый','ui-rounded,"SF Pro Rounded",Nunito,Quicksand,system-ui,sans-serif','ui-rounded,"SF Pro Rounded",Nunito,system-ui,sans-serif'],['serif','Классика','Georgia,"Times New Roman",serif','Georgia,"Times New Roman",serif'],['mono','Моно','ui-monospace,"SF Mono",Menlo,Consolas,monospace','ui-monospace,"SF Mono",Menlo,Consolas,monospace']];
const DEF={mode:'dark',pal:'gold',font:'klepa',snd:1,vol:70,tick:1,win:1,ui:1,haptic:1,motion:1,ny:1,snow:1,lights:1};
let KP=window.KP={...DEF},env=null;
try{Object.assign(KP,JSON.parse(localStorage.getItem('kup_prefs')||'{}'))}catch(e){}
const persist=()=>{try{localStorage.setItem('kup_prefs',JSON.stringify(KP))}catch(e){}try{dispatchEvent(new Event('kup-prefs'))}catch(e){}if(env&&env.S){env.S.set=Object.assign({},KP);try{env.save()}catch(e){}}};
const root=document.documentElement;
function applyLook(){if(KP.pal&&KP.pal!=='gold')root.setAttribute('data-p',KP.pal);else root.removeAttribute('data-p');
 if(KP.font&&KP.font!=='klepa'){const f=FNT.find(x=>x[0]===KP.font)||FNT[0];root.style.setProperty('--f',f[2]);root.style.setProperty('--fd',f[3])}else{root.style.removeProperty('--f');root.style.removeProperty('--fd')}root.setAttribute('data-m',KP.motion?'':'off')}
function applyMode(save){let th=KP.mode;if(th==='auto'){const tg=window.Telegram&&Telegram.WebApp;th=(tg&&tg.colorScheme)||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark')}
 if(window.kupTheme&&(th==='dark'||th==='light'))kupTheme(th,!!save&&KP.mode!=='auto')}
applyLook();
/* ---------- звук (синтез, без файлов) ---------- */
let ac=null,mg=null;
const ctx=()=>{if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.connect(ac.destination)}catch(e){return null}}if(ac.state==='suspended')ac.resume().catch(()=>{});mg.gain.value=KP.snd?KP.vol/100:0;return ac};
const tone=(f,t,d,ty,v,f2)=>{const a=ctx();if(!a||!KP.snd)return;const o=a.createOscillator(),g=a.createGain(),T=a.currentTime+(t||0);o.type=ty||'sine';o.frequency.setValueAtTime(f,T);if(f2)o.frequency.exponentialRampToValueAtTime(f2,T+d);g.gain.setValueAtTime(.0001,T);g.gain.exponentialRampToValueAtTime(v||.3,T+.008);g.gain.exponentialRampToValueAtTime(.0001,T+d);o.connect(g);g.connect(mg);o.start(T);o.stop(T+d+.03)};
const KS=window.KS={tick(){if(KP.tick)tone(1400+Math.random()*260,0,.035,'square',.07,450)},ui(){if(KP.ui)tone(640,0,.05,'sine',.12,430)},
 coin(){if(KP.ui){tone(988,0,.09,'triangle',.2);tone(1319,.08,.22,'triangle',.2)}},err(){if(KP.ui)tone(170,0,.16,'sawtooth',.12,110)},
 win(v){if(!KP.win)return;const L=v>=1e5?4:v>=1e4?3:v>=1e3?2:v>=200?1:0,sc=[523,659,784,1047,1319,1568];for(let i=0;i<2+L;i++)tone(sc[i],i*.09,.26,'triangle',.2);if(L>=3)for(let i=0;i<5;i++)tone(2000+i*260,.32+i*.06,.2,'sine',.07)},
 whoosh(){const a=ctx();if(!a||!KP.tick||!KP.snd)return;const n=a.sampleRate*.5|0,b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=b;f.type='bandpass';f.frequency.setValueAtTime(400,a.currentTime);f.frequency.exponentialRampToValueAtTime(2400,a.currentTime+.45);g.gain.value=.16;s.connect(f);f.connect(g);g.connect(mg);s.start()},
 hap(t){if(t==='error')KS.err()},
 spin(rolls,w){KS.whoosh();const el=rolls[0].firstElementChild;let last=-1,lh=0;return setInterval(()=>{let x=0;try{x=new DOMMatrixReadOnly(getComputedStyle(el).transform).m41}catch(e){}const i=Math.floor(-x/w);if(i!==last){last=i;KS.tick();const n=Date.now();if(n-lh>70&&KP.haptic){lh=n;try{Telegram.WebApp.HapticFeedback.impactOccurred('light')}catch(e){}}}},16)}};
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('button:not(.kno),.btn,.cc,.tile,.act,.kmr'))KS.ui()},true);
/* ---------- окно-оболочка ---------- */
function ovl(title){const o=document.createElement('div');o.className='kov';o.innerHTML=`<div class="kh"><button class="kb" aria-label="Назад">${KI('back')}</button><b>${title}</b></div><div class="kc"></div>`;document.body.appendChild(o);o.close=()=>o.remove();o.querySelector('.kb').onclick=o.close;return o}
function settings(){const o=ovl('Настройки'),c=o.querySelector('.kc');
 const seg=(id,it)=>`<div class="kseg" data-s="${id}">${it.map(([v,l])=>`<button data-v="${v}" class="${KP[id]===v?'on':''}">${l}</button>`).join('')}</div>`;
 const sw=(k,l,s)=>`<div class="ksw"><div class="grow"><b>${l}</b>${s?`<small>${s}</small>`:''}</div><button class="sw kno${KP[k]?' on':''}" data-k="${k}" aria-label="${l}"></button></div>`;
 const draw=()=>{c.innerHTML=`<div class="card kset"><div class="ksh">${KI('moon')}<b>Тема оформления</b></div>${seg('mode',[['dark','Тёмная'],['light','Светлая'],['auto','Авто']])}</div>
 <div class="card kset"><div class="ksh">${KI('palette')}<b>Цветовая схема</b></div><div class="kpal">${PAL.map(p=>`<button data-p="${p[0]}" class="kno${KP.pal===p[0]?' on':''}"><i style="background:linear-gradient(135deg,${p[2]},${p[3]})"></i><span>${p[1]}</span></button>`).join('')}</div></div>
 <div class="card kset"><div class="ksh">${KI('type')}<b>Шрифт</b></div><div class="kfnt">${FNT.map(f=>`<button data-f="${f[0]}" class="kno${KP.font===f[0]?' on':''}" style="font-family:${f[2]}"><span>${f[1]}</span><em>Klepa Up 1234</em></button>`).join('')}</div></div>
 <div class="card kset"><div class="ksh">${KI('volume')}<b>Звук</b></div>${sw('snd','Звуки','Общий переключатель')}<div class="kvol"><input type="range" min="0" max="100" value="${KP.vol}" aria-label="Громкость"></div>${sw('tick','Прокрутка кейса','Щелчки рулетки')}${sw('win','Выигрыш','Мелодия по ценности подарка')}${sw('ui','Нажатия и уведомления')}<button class="btn g sm kno" data-a="test">Проверить звук</button></div>
 <div class="card kset"><div class="ksh">${KI('tree')}<b>Новый год</b></div>${sw('ny','Новогоднее оформление','Гирлянда, снег, шапка и баннер')}${sw('lights','Гирлянда и украшения')}${sw('snow','Снегопад')}</div>
 <div class="card kset"><div class="ksh">${KI('vibe')}<b>Отклик и анимации</b></div>${sw('haptic','Вибрация','Отклик на действия и прокрутку')}${sw('motion','Анимации','Плавные переходы интерфейса')}</div>
 <button class="btn g sm kno" data-a="reset" style="margin-top:0">Сбросить настройки</button>`};
 draw();
 c.onclick=e=>{const b=e.target.closest('button');if(!b)return;const seg1=b.closest('.kseg');let ch=1;
  if(seg1){KP[seg1.dataset.s]=b.dataset.v;if(seg1.dataset.s==='mode')applyMode(true)}
  else if(b.dataset.p){KP.pal=b.dataset.p;applyLook()}
  else if(b.dataset.f){KP.font=b.dataset.f;applyLook()}
  else if(b.dataset.k){KP[b.dataset.k]=KP[b.dataset.k]?0:1;if(b.dataset.k==='motion')applyLook();if(b.dataset.k==='snd'&&KP.snd)setTimeout(KS.coin,30)}
  else if(b.dataset.a==='test'){KS.whoosh();setTimeout(()=>KS.tick(),150);setTimeout(()=>KS.tick(),260);setTimeout(()=>KS.win(20000),420);ch=0}
  else if(b.dataset.a==='reset'){Object.assign(KP,DEF);applyLook();applyMode(true)}else ch=0;
  if(ch){persist();const t=c.scrollTop;draw();c.scrollTop=t}};
 c.addEventListener('input',e=>{if(e.target.type==='range'){KP.vol=+e.target.value;persist();ctx();KS.tick()}})}
/* ---------- iOS и Android: клавиатура, выбор файлов, фото ---------- */
const vv=window.visualViewport,fit=()=>{const s=root.style,h=vv&&vv.height>200?vv.height:innerHeight;s.setProperty('--kvh',h+'px');s.setProperty('--kvt',(vv&&vv.height>200?vv.offsetTop:0)+'px')};
if(vv){vv.addEventListener('resize',fit);vv.addEventListener('scroll',fit)}addEventListener('resize',fit);fit();
document.addEventListener('focusin',e=>{if(e.target.closest&&e.target.closest('.kov')&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))setTimeout(()=>{try{e.target.scrollIntoView({block:'center',behavior:'smooth'})}catch(x){}},320)});
const pick=accept=>new Promise(res=>{let i=document.getElementById('kfi');if(!i){i=document.createElement('input');i.type='file';i.id='kfi';i.style.cssText='position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0';document.body.appendChild(i)}i.accept=accept||'image/*,video/*';i.value='';let done=0;const fin=f=>{if(!done){done=1;res(f)}};i.onchange=()=>fin(i.files&&i.files[0]||null);addEventListener('focus',()=>setTimeout(()=>fin(i.files&&i.files[0]||null),1200),{once:true});i.click()});
const isVid=f=>/^video\//.test(f.type)||/\.(mp4|mov|m4v|webm|3gp)$/i.test(f.name||'');
const prep=async f=>{if(isVid(f)){if(f.size>30e6)throw Error('Видео должно быть до 30 МБ');return{blob:f,type:f.type||'video/mp4'}}
 if(f.type==='image/gif'&&f.size<5e6)return{blob:f,type:'image/gif'};
 const url=URL.createObjectURL(f);try{const img=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>no(Error('Формат изображения не поддерживается. Выберите JPG или PNG'));i.src=url});
  const s=Math.min(1,1280/Math.max(img.naturalWidth,img.naturalHeight)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.naturalWidth*s));c.height=Math.max(1,Math.round(img.naturalHeight*s));c.getContext('2d').drawImage(img,0,0,c.width,c.height);
  const b=await new Promise(r=>c.toBlob(r,'image/jpeg',.82));if(!b)throw Error('Не удалось обработать фото');return{blob:b,type:'image/jpeg'}}finally{URL.revokeObjectURL(url)}};
window.KUI={settings,ovl,pick,prep,isVid,init(e){env=e;
  if(e.S&&e.S.set&&!localStorage.getItem('kup_prefs')){Object.assign(KP,e.S.set);applyLook()}
  if(!localStorage.getItem('kup_prefs'))KP.mode=root.getAttribute('data-t')||'dark';
  if(KP.mode==='auto')applyMode(false);try{dispatchEvent(new Event('kup-prefs'))}catch(x){}
  const th=document.getElementById('thm');if(th)th.addEventListener('click',()=>{KP.mode=root.getAttribute('data-t')||'dark';persist()});
  try{matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>{if(KP.mode==='auto')applyMode(false)});Telegram.WebApp.onEvent('themeChanged',()=>{if(KP.mode==='auto')applyMode(false)})}catch(x){}}};
const bind=()=>{const b=document.getElementById('set');if(b)b.onclick=settings};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
