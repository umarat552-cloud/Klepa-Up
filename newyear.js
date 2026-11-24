/* Klepa Up: новогоднее оформление и календарь на 7 дней */
(function(){
'use strict';
const root=document.documentElement,COL=['#ff3b4e','#ffd21f','#3ddc84','#4aa3ff'];
const P=()=>window.KP||{ny:1,snow:1,lights:1,motion:1};
let garland=null,cv=null,cx=null,fl=[],raf=0,lt=0,adv=null,bann=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* ---------- гирлянда ---------- */
function buildGarland(){if(!garland){garland=document.createElement('div');garland.className='nyg';document.body.appendChild(garland)}
 const w=innerWidth,seg=Math.max(120,w/3.2),y=x=>3+15*Math.sin(Math.PI*(((x%seg)+seg)%seg)/seg);let d='';for(let x=-8;x<=w+8;x+=4)d+=(d?' L':'M')+x+','+y(x).toFixed(1);
 let h='<svg viewBox="0 0 '+w+' 40" preserveAspectRatio="none"><path d="'+d+'" fill="none" stroke="rgba(150,150,150,.75)" stroke-width="1.6"/></svg>',i=0;
 for(let x=16;x<w;x+=30,i++)h+='<i class="b" style="left:'+x+'px;top:'+(y(x)+3).toFixed(1)+'px;--c:'+COL[i%4]+';--d:'+((i*.37)%1.8).toFixed(2)+'s"></i>';
 [[.53,'#ff3b4e',9]].forEach(([p,c,hh],k)=>{h+='<div class="bl" style="left:'+(w*p).toFixed(0)+'px;--c:'+c+';--h:'+hh+'px;--d:'+(k*.7)+'s"></div>'});
 garland.innerHTML=h}
/* ---------- снегопад ---------- */
function sizeCv(){if(!cv)return;cv.width=innerWidth;cv.height=innerHeight;const n=Math.max(22,Math.min(54,Math.round(innerWidth*innerHeight/17000)));fl=Array.from({length:n},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:1.2+Math.random()*2.8,v:.35+Math.random()*1.1,p:Math.random()*6.28}))}
function draw(t){const light=root.getAttribute('data-t')==='light';cx.clearRect(0,0,cv.width,cv.height);cx.fillStyle=light?'rgba(120,160,235,.85)':'rgba(255,255,255,.88)';
 for(const f of fl){f.y+=f.v;f.x+=Math.sin(t/1400+f.p)*.35;if(f.y>cv.height+5){f.y=-5;f.x=Math.random()*cv.width}cx.globalAlpha=Math.min(1,.45+f.r/4);cx.beginPath();cx.arc(f.x,f.y,f.r,0,6.283);cx.fill()}cx.globalAlpha=1}
function snowOn(){if(!cv){cv=document.createElement('canvas');cv.className='nys';document.body.appendChild(cv);cx=cv.getContext('2d');sizeCv();addEventListener('resize',sizeCv)}
 if(raf)return;const loop=t=>{raf=requestAnimationFrame(loop);if(document.hidden||t-lt<32)return;lt=t;draw(t)};raf=requestAnimationFrame(loop)}
function snowOff(){cancelAnimationFrame(raf);raf=0;if(cx)cx.clearRect(0,0,cv.width,cv.height)}
/* ---------- баннер, шапки ---------- */
const daysLeft=()=>{const n=new Date();if(n.getMonth()===0&&n.getDate()<=10)return -1;return Math.ceil((new Date(n.getFullYear()+1,0,1)-n)/864e5)};
const plural=(n,a)=>a[n%10===1&&n%100!==11?0:n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?1:2];
function banner(){const on=!!P().ny,s0=document.getElementById('s0');if(!s0)return;bann=s0.querySelector('.nybn');
 if(!on){if(bann)bann.remove();return}
 if(!bann){bann=document.createElement('button');bann.className='nybn';bann.onclick=()=>{window.KX&&KX.open.adv?KX.open.adv():window.KENV&&KENV.toast('Календарь работает внутри Telegram')};s0.prepend(bann)}
 const dl=daysLeft(),done=adv?adv.days.filter(d=>d.st==='done').length:0;
 bann.innerHTML='<span class="nyi">'+KI('tree')+'</span><span class="grow"><b>'+(dl<0?'С Новым годом!':'Новогоднее настроение')+'</b><small>'+(dl<0?'Пусть сбываются желания':'До Нового года '+dl+' '+plural(dl,['день','дня','дней']))+(adv?' · календарь '+done+'/7':' · календарь подарков')+'</small></span><svg class="nyk" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>'}
function hats(){const av=document.getElementById('av');if(av&&av.parentNode&&!av.parentNode.querySelector('.nyhat')){const h=document.createElement('i');h.className='nyhat';av.parentNode.appendChild(h)}}
function apply(){const p=P(),on=!!p.ny,m=p.motion!==0;root.toggleAttribute('data-ny',on);root.toggleAttribute('data-ly',on&&!!p.lights);root.toggleAttribute('data-sn',on&&!!p.snow&&m);
 if(on&&p.lights)buildGarland();if(on&&p.snow&&m)snowOn();else snowOff();hats();banner()}
/* ---------- календарь ---------- */
const X=()=>window.KX,K=()=>window.KENV||{};
const fmtD=t=>new Date(t+3*36e5).toLocaleDateString('ru-RU',{day:'numeric',month:'short',timeZone:'UTC'}).replace('.','');
function door(d){const big=d.d===7,k=K();let inner;
 if(d.st==='done'){const pz=d.prize||{};inner=(pz.k&&k.G&&k.G[pz.k]?k.ima(k.G[pz.k]):'')+(pz.s?'<span>'+KST+'</span><small>'+k.fmt(pz.s)+'</small>':'<small>'+esc(k.G&&pz.k&&k.G[pz.k]?k.G[pz.k].n:'Подарок')+'</small>')}
 else if(d.st==='open')inner='<b>'+d.d+'</b><small>Открыть</small>';
 else if(d.st==='gone')inner=KI('lock')+'<small>Закрыто</small>';
 else inner=KI('lock')+'<b>'+d.d+'</b><small>'+fmtD(d.at)+'</small>';
 if(big&&d.st!=='done')inner=(d.st==='open'?'':KI('lock'))+'<b>'+d.d+'</b><small>'+(d.st==='open'?'Главный приз':'Главный приз · '+fmtD(d.at))+'</small>';
 return '<button class="dr '+d.st+(big?' big':'')+'" data-d="'+d.d+'">'+inner+'</button>'}
function reveal(pz){const k=K(),el=document.createElement('div');el.className='nyr';
 const kn=pz.k&&k.G&&k.G[pz.k],val=Math.max(pz.s||0,kn?kn.v:0);
 let cf='';for(let i=0;i<26;i++)cf+='<i style="left:'+Math.random()*100+'%;--c:'+COL[i%4]+';--d:'+(Math.random()*.8).toFixed(2)+'s"></i>';
 el.innerHTML='<div class="rc"><div class="cf">'+cf+'</div><h3>Поздравляем!</h3><p>Ваш подарок из новогоднего календаря</p><div class="pz">'+(kn?k.ima(kn):KST)+'</div>'+(kn?'<div class="pn">'+esc(kn.n)+'</div>':'')+(pz.s?'<div class="pn">+'+k.fmt(pz.s)+' звёзд</div>':'')+'<button class="btn">Отлично</button></div>';
 el.onclick=e=>{if(e.target===el||e.target.closest('.btn'))el.remove()};document.body.appendChild(el);window.KS&&KS.win(val)}
async function openCal(){const x=X();if(!(x&&x.W&&x.W.initData))return K().toast&&K().toast('Календарь работает внутри Telegram');
 const o=x.ov('Новогодний календарь'),c=o.querySelector('.kc');
 const draw=async()=>{const r=await x.api('x/adv_get');if(r.e){c.innerHTML='<div class="kd">'+esc(r.e)+'</div>';return}adv=r;banner();
  c.innerHTML='<div class="nyc"><div class="nyh"><div class="nyt">'+KI('tree')+'</div><h2>7 дней подарков</h2><p>С 1 по 7 декабря каждый день открывается новая дверца с призом. Забрать подарки можно до '+fmtD(r.until)+'.</p></div><div class="nyd">'+r.days.map(door).join('')+'</div></div>'};
 c.onclick=async e=>{const b=e.target.closest('.dr');if(!b)return;const d=+b.dataset.d,s=adv&&adv.days.find(z=>z.d===d);if(!s)return;
  if(s.st==='lock'){K().toast('Эта дверь откроется '+fmtD(s.at));K().hp&&K().hp('error');return}if(s.st==='gone')return K().toast('Календарь закрыт');if(s.st==='done')return;
  const r=await x.api('x/adv_claim',{d});if(r.e){K().toast(r.e);K().hp&&K().hp('error');return draw()}
  K().hp&&K().hp('success');await x.inbox();reveal(r.prize);draw()};
 draw()}
/* ---------- запуск ---------- */
window.addEventListener('kup-prefs',apply);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&P().ny&&P().snow&&P().motion!==0&&cv)snowOn()});
const boot=()=>{apply();setInterval(banner,6e4)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
if(window.KX){KX.open.adv=openCal;KX.ready.push(async()=>{apply();const r=await KX.api('x/adv_get');if(!r.e){adv=r;banner()}})}
window.addEventListener('load',()=>setTimeout(apply,600));
})();
