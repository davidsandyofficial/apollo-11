(()=>{
const c=document.getElementById('sky'),x=c.getContext('2d');let W,H,D,stars=[];
function size(){D=Math.min(window.devicePixelRatio||1,2);W=c.width=innerWidth*D;H=c.height=innerHeight*D;
  stars=Array.from({length:Math.round(W*H/(5200*D))},()=>({x:Math.random()*W,y:Math.random()*H*3,r:Math.random()*1.3*D+.2,z:Math.random()*.8+.2,t:Math.random()*6}))}
size();addEventListener('resize',size);
let p=0,sp=0;const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,cl=v=>Math.max(0,Math.min(1,v));
function moon(cx,cy,r){const g=x.createRadialGradient(cx-r*.35,cy-r*.35,r*.1,cx,cy,r);g.addColorStop(0,'#f4f1e8');g.addColorStop(.6,'#b9b5aa');g.addColorStop(1,'#4a4842');
  x.save();x.shadowColor='#fff8e055';x.shadowBlur=r*.5;x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.restore();
  x.save();x.beginPath();x.arc(cx,cy,r,0,7);x.clip();x.fillStyle='#00000026';
  [[-.3,-.2,.22],[.25,.1,.16],[-.05,.35,.12],[.35,-.35,.1],[-.45,.25,.09],[.1,-.5,.08]].forEach(([a,b,s])=>{x.beginPath();x.arc(cx+a*r,cy+b*r,s*r,0,7);x.fill()});
  const sh=x.createLinearGradient(cx-r,0,cx+r,0);sh.addColorStop(0,'#0000');sh.addColorStop(.7,'#0000');sh.addColorStop(1,'#000a');x.fillStyle=sh;x.fillRect(cx-r,cy-r,2*r,2*r);x.restore()}
function earth(cx,cy,r){const g=x.createRadialGradient(cx-r*.3,cy-r*.3,r*.1,cx,cy,r);g.addColorStop(0,'#9fd0ff');g.addColorStop(.5,'#2b6fd6');g.addColorStop(1,'#061a3a');
  x.save();x.shadowColor='#6aa8ff99';x.shadowBlur=r*.6;x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.restore()}
function draw(now){sp+=(p-sp)*.08;x.clearRect(0,0,W,H);
  const bg=x.createLinearGradient(0,0,0,H);const warm=cl(1-sp*6);bg.addColorStop(0,'#05060a');bg.addColorStop(1,`rgba(${40+60*warm|0},${18+20*warm|0},${10},1)`);x.fillStyle=bg;x.fillRect(0,0,W,H);
  for(const s of stars){let y=(s.y-sp*H*2.2*s.z)%(H*3);if(y<0)y+=H*3;if(y>H)continue;const a=.5+.5*Math.sin(now/900+s.t);x.globalAlpha=.35+.65*a*s.z;x.fillStyle='#fff';x.fillRect(s.x,y,s.r,s.r)}x.globalAlpha=1;
  const m=Math.min(W,H);
  // Earth recedes during coast
  const e=cl((sp-.12)/.25);if(sp>.08&&sp<.5){earth(W*.8,H*(.3+e*.45),m*(.24-.2*e));}
  // Moon approaches, then fills horizon for landing
  const a=ease(cl((sp-.2)/.4));if(sp>.18&&sp<.86){const r=m*(.05+a*1.1),cy=H*(.3+a*.95);moon(W*.5,cy,r)}
  // Earthrise for splashdown/finale
  const f=ease(cl((sp-.82)/.15));if(f>0){x.globalAlpha=f;earth(W*.5,H*(1.2-f*.32),m*.24);x.globalAlpha=1}
  requestAnimationFrame(draw)}
requestAnimationFrame(draw);
// scroll state
const secs=[...document.querySelectorAll('section')],dots=document.getElementById('railDots'),fill=document.getElementById('railFill');
secs.forEach((s,i)=>{const li=document.createElement('li');li.style.top=(i/(secs.length-1)*100)+'%';dots.appendChild(li)});
const lis=[...dots.children],alt=document.getElementById('alt'),clock=document.getElementById('clock'),desc=document.getElementById('s-descent'),rocket=document.getElementById('rocket'),launch=document.getElementById('s-launch');
const MET=195*3600+18*60+35; // 8d 3h 18m 35s
const pad=n=>String(n).padStart(2,'0');
function onScroll(){const max=document.documentElement.scrollHeight-innerHeight;p=max>0?scrollY/max:0;fill.style.height=(p*100)+'%';
  const t=Math.round(MET*ease(cl((p-.06)/.9)));clock.textContent=`T+ ${String(Math.floor(t/3600)).padStart(3,'0')}:${pad(Math.floor(t/60)%60)}:${pad(t%60)}`;
  const r=desc.getBoundingClientRect(),k=cl((innerHeight-r.top)/(r.height+innerHeight*.4));alt.textContent=Math.round(50000*Math.pow(1-k,2.2)).toLocaleString('en-US');
  const lr=launch.getBoundingClientRect(),lk=cl(-lr.top/lr.height);rocket.style.transform=`translateY(${-lk*lk*90}vh)`;
  secs.forEach((s,i)=>{const b=s.getBoundingClientRect();lis[i].classList.toggle('on',b.top<innerHeight*.6)})}
addEventListener('scroll',onScroll,{passive:true});onScroll();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('[data-count]').forEach(n=>{if(n.dataset.done)return;n.dataset.done=1;const to=+n.dataset.count,t0=performance.now();(function tick(t){const q=cl((t-t0)/1400);n.textContent=Math.round(to*ease(q));if(q<1)requestAnimationFrame(tick)})(t0)})}}),{threshold:.25});
secs.forEach(s=>io.observe(s));
})();
