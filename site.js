const A=(window.ASSETS||"");
/* ============ CONFIG: fill with real Joiful Events details ============ */
const CONFIG = {
  contact: { email: "", phone: "", bookingUrl: "",
    instagram: { handle: "@_joifulevents_", url: "https://www.instagram.com/_joifulevents_/" },
    tiktok:    { handle: "@joiful.events",  url: "https://www.tiktok.com/@joiful.events" } },
  photos: [              // Joiful Events portfolio, in the order they appear around the scene
    { src: A+"photos/smoke.jpg",        label: "The big reveal",                         cat: "Gender reveal" },
    { src: A+"photos/candles.jpg",      label: "Candlelit tablescape",                   cat: "Dinner party" },
    { src: A+"photos/pooh-arch.jpg",    label: "“Oh Baby” balloon arch",                  cat: "Baby shower" },
    { src: A+"photos/balloon-cake.jpg", label: "He or she? Cake and balloon garland",    cat: "Gender reveal" },
    { src: A+"photos/dinner.jpg",       label: "Dessert ladder and candlelit long table", cat: "Dinner party" },
    { src: A+"photos/cart.jpg",         label: "Welcome cart and balloon garland",       cat: "Baby shower" },
    { src: A+"photos/honey.jpg",        label: "Honey jar guest favors",                 cat: "Baby shower" },
    { src: A+"photos/desserts.jpg",     label: "Dessert table",                          cat: "Gender reveal" },
    { src: A+"photos/teddy.jpg",        label: "Teddy bear cocktail tables",             cat: "Gender reveal" },
    { src: A+"photos/cakesicles.jpg",   label: "Pink and blue cakesicles",               cat: "Gender reveal" },
    { src: A+"photos/quiche.jpg",       label: "Mini quiche and berry board",            cat: "Details" }
  ],
  services: [            // from Joiful Events' own Planning Services copy
    { name: "Event Consultations",     text: "Talk through your ideas and where your celebration could go.", img: A+"photos/teddy.jpg" },
    { name: "Coordination",            text: "Vendors and timelines managed so the day runs seamlessly.",    img: A+"photos/desserts.jpg" },
    { name: "Partial Planning",        text: "Hands-on support for the parts you want help with.",           img: A+"photos/honey.jpg" },
    { name: "Full-Service Planning",   text: "We manage every detail from start to finish.",                 img: A+"photos/dinner.jpg" },
    { name: "Event Design & Styling",  text: "Bringing your vision to life, down to the smallest detail.",   img: A+"photos/candles.jpg" }
  ]
};

/* ============ helpers ============ */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const clamp = (v,a=0,b=1) => Math.min(b,Math.max(a,v));
const ease = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const seg = (t,a,b) => ease(clamp((t-a)/(b-a)));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = innerWidth < 760;
let rnd = (()=>{let s=7;return()=>(s=(s*16807)%2147483647)/2147483647})();

/* ============ gallery items (placeholders until real photos arrive) ============ */
const TONES = [["#EFE4D2","#D8BFA0"],["#F3E6E0","#D9B3A6"],["#EDE7DA","#B9AE92"],["#F4EDE3","#CFB58C"],["#EEE2D6","#C7A99A"],["#F1EADF","#A99A80"]];
function placeholder(i, w=600, h=760){
  const c=document.createElement('canvas'); c.width=w; c.height=h; const g=c.getContext('2d');
  const [a,b]=TONES[i%TONES.length];
  const gr=g.createLinearGradient(0,0,w*0.6,h); gr.addColorStop(0,a); gr.addColorStop(1,b); g.fillStyle=gr; g.fillRect(0,0,w,h);
  for(let k=0;k<26;k++){ const x=((i*97+k*61)%100)/100*w, y=((i*53+k*37)%100)/100*h*0.7, r=8+((k*13+i*7)%40);
    const rg=g.createRadialGradient(x,y,0,x,y,r); rg.addColorStop(0,'rgba(255,248,232,.55)'); rg.addColorStop(1,'rgba(255,248,232,0)'); g.fillStyle=rg; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); }
  g.strokeStyle='rgba(120,95,60,.35)'; g.lineWidth=2; const aw=w*.42, ah=h*.5, ax=w/2, ay=h*.78;
  g.beginPath(); g.moveTo(ax-aw/2,ay); g.lineTo(ax-aw/2,ay-ah+aw/2); g.arc(ax,ay-ah+aw/2,aw/2,Math.PI,0); g.lineTo(ax+aw/2,ay); g.stroke();
  g.strokeStyle='rgba(120,95,60,.4)'; g.lineWidth=1.2; g.strokeRect(18,18,w-36,h-36);
  g.fillStyle='rgba(60,45,30,.72)'; g.textAlign='center';
  g.font='500 18px Jost, sans-serif'; g.fillText(('PORTFOLIO · '+String(i+1).padStart(2,'0')).split('').join(String.fromCharCode(8202)), w/2, h*.9);
  g.font='italic 34px "Bodoni Moda", Georgia, serif'; g.fillText('Joiful Events photo', w/2, h*.84);
  return c;
}
let ITEMS = []; // {src, canvas|img, label}
function buildPlaceholders(){ ITEMS = Array.from({length:12},(_,i)=>{ const c=placeholder(i); return {src:c.toDataURL('image/jpeg',.82), el:c, label:'Portfolio photo '+String(i+1).padStart(2,'0')+' · awaiting real image'}; }); }

/* ============ HTML: services, thumbs, gallery ============ */
function renderLists(){
  const sv=$('#services'); sv.innerHTML='';
  CONFIG.services.forEach((s,i)=>{ const b=document.createElement('button'); b.className='svc'; b.type='button';
    let at=ITEMS.findIndex(it=>it.src===s.img); if(at<0) at=(i*3+1)%ITEMS.length;
    const im=document.createElement('img'); im.alt=''; im.src=ITEMS[at].src;
    const d=document.createElement('div'); d.innerHTML='<h3></h3><p></p>'; d.querySelector('h3').textContent=s.name; d.querySelector('p').textContent=s.text;
    b.append(im,d); b.onclick=()=>openLightbox(at,null); sv.append(b); });
  const th=$('#thumbs'); th.innerHTML='';
  ITEMS.slice(0,4).forEach((it,i)=>{ const b=document.createElement('button'); b.type='button'; b.setAttribute('aria-label','Open '+it.label);
    const im=document.createElement('img'); im.src=it.src; im.alt=it.label; b.append(im); b.onclick=()=>openLightbox(i,null); th.append(b); });
  const cats=[...new Set(ITEMS.map(it=>it.cat).filter(Boolean))];
  const fc=$('#filters'); fc.innerHTML=''; fc.hidden=cats.length<2;
  ['All',...cats].forEach(c=>{ const b=document.createElement('button'); b.type='button'; b.className='chip'; b.textContent=c; b.dataset.cat=c; b.onclick=()=>renderGrid(c); fc.append(b); });
  const fe=$('#featured'); fe.innerHTML=''; cats.filter(c=>c!=='Details').forEach(c=>{ const n=ITEMS.filter(it=>it.cat===c).length; const b=document.createElement('button'); b.type='button'; b.className='chip';
    b.innerHTML='<span></span> <small></small>'; b.querySelector('span').textContent=c; b.querySelector('small').textContent=n+' photos'; b.onclick=()=>{ renderGrid(c); openOv('#gallery'); }; fe.append(b); });
  renderGrid('All');
}
let VIEW=[];
function renderGrid(cat){
  VIEW=ITEMS.map((_,i)=>i).filter(i=>cat==='All'||ITEMS[i].cat===cat);
  $$('#filters .chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.cat===cat));
  const gr=$('#grid'); gr.innerHTML='';
  VIEW.forEach(i=>{ const it=ITEMS[i]; const b=document.createElement('button'); b.type='button'; b.setAttribute('aria-label','Open '+it.label);
    const im=document.createElement('img'); im.loading='lazy'; im.src=it.src; im.alt=it.label;
    const cap=document.createElement('span'); cap.className='cap'; cap.textContent=(it.cat?it.cat+' · ':'')+it.label;
    const el=it.el; if(el&&el.width>el.height*1.2) b.classList.add('wide'); else if(gr.children.length===0) b.classList.add('tall');
    b.append(im,cap); b.onclick=()=>openLightbox(i,VIEW); gr.append(b); });
}

/* ============ overlays ============ */
let lastFocus=null;
function openOv(id){ lastFocus=document.activeElement; $$('.overlay').forEach(o=>o.hidden=true); const o=$(id); o.hidden=false; document.body.style.overflow='hidden'; (o.querySelector('[data-close]')||o).focus(); }
function closeOv(){ $$('.overlay').forEach(o=>o.hidden=true); document.body.style.overflow=''; lastFocus&&lastFocus.focus&&lastFocus.focus(); }
$$('[data-close]').forEach(b=>b.onclick=closeOv);
$$('[data-open-gallery]').forEach(b=>b.onclick=()=>{ $('#links').classList.remove('open'); renderGrid('All'); openOv('#gallery'); });
$$('[data-inquire]').forEach(b=>b.onclick=()=>{ $('#links').classList.remove('open'); openOv('#inquiry'); });
let lbI=0, LBV=[];
function openLightbox(i,view){ if(view!==undefined) LBV=(view&&view.includes(i))?view.slice():ITEMS.map((_,k)=>k); lbI=i; const it=ITEMS[i]; const pos=LBV.indexOf(i);
  $('#lbImg').src=it.src; $('#lbImg').alt=it.label; $('#lbCap').textContent=(it.cat?it.cat+' · ':'')+it.label; $('#lbCount').textContent=(pos+1)+' / '+LBV.length; if($('#lightbox').hidden) openOv('#lightbox'); }
function stepLB(d){ const pos=LBV.indexOf(lbI); openLightbox(LBV[(pos+d+LBV.length)%LBV.length]); }
$('#lbPrev').onclick=()=>stepLB(-1); $('#lbNext').onclick=()=>stepLB(1);
addEventListener('keydown',e=>{ if(e.key==='Escape') closeOv(); if(!$('#lightbox').hidden){ if(e.key==='ArrowLeft') stepLB(-1); if(e.key==='ArrowRight') stepLB(1);} });
$('#menuBtn').onclick=()=>{ const l=$('#links'); l.classList.toggle('open'); $('#menuBtn').setAttribute('aria-expanded', l.classList.contains('open')); };
$$('#links a').forEach(a=>a.addEventListener('click',()=>$('#links').classList.remove('open')));

/* inquiry */
$('#inqForm').addEventListener('submit',e=>{ e.preventDefault();
  const v=id=>document.getElementById(id).value.trim(); const btn=e.target.querySelector('button[type=submit]');
  const name=v('f-name'), email=v('f-email');
  if(!name){ btn.textContent='Add your name to continue'; $('#f-name').focus(); return; }
  if(!/^\S+@\S+\.\S+$/.test(email)){ btn.textContent='Add a valid email to continue'; $('#f-email').focus(); return; }
  btn.textContent='Prepare my inquiry';
  const L=['Event inquiry for Joiful Events','','Name: '+name,'Email: '+email];
  if(v('f-phone')) L.push('Phone: '+v('f-phone')); L.push('Event: '+v('f-type'));
  if(v('f-date')) L.push('Date: '+v('f-date')); if(v('f-guests')) L.push('Guests: '+v('f-guests'));
  if(v('f-vision')) L.push('','Vision: '+v('f-vision'));
  $('#inqText').textContent=L.join('\n');
  const c=CONFIG.contact; $('#inqNote').textContent = c.email ? `Send it to ${c.email}${c.phone?' or call '+c.phone:''}.` : `Your inquiry is ready. Copy it and send it to Joiful Events on Instagram at ${c.instagram.handle} or TikTok at ${c.tiktok.handle}.`;
  e.target.hidden=true; $('#inqDone').hidden=false; });
$('#editInq').onclick=()=>{ $('#inqForm').hidden=false; $('#inqDone').hidden=true; };
$('#copyInq').onclick=()=>{ const t=$('#inqText').textContent; const b=$('#copyInq');
  const sel=()=>{ const r=document.createRange(); r.selectNodeContents($('#inqText')); const s=getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent='Selected, press copy'; };
  try{ navigator.clipboard.writeText(t).then(()=>b.textContent='Copied',sel); }catch(e){ sel(); } };
(function contactLine(){ const c=CONFIG.contact, el=$('#contactLine'); el.innerHTML='';
  const row=document.createElement('div'); row.className='socials';
  [['Instagram',c.instagram],['TikTok',c.tiktok]].forEach(([n,v])=>{ if(!v) return; const a=document.createElement('a'); a.href=v.url; a.target='_blank'; a.rel='noopener'; a.innerHTML='<small></small><span></span>'; a.querySelector('small').textContent=n; a.querySelector('span').textContent=v.handle; row.append(a); });
  [c.email,c.phone].filter(Boolean).forEach(t=>{ const sp=document.createElement('span'); sp.className='plain'; sp.textContent=t; row.append(sp); });
  el.append(row); })();

/* reveal on enter (content is visible without JS) */
const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('play'); io.unobserve(e.target);} }),{threshold:.2});
$$('.reveal').forEach(el=>{ if(el.getBoundingClientRect().top>innerHeight) io.observe(el); });

/* ============ 3D world ============ */
let renderer, scene, camera, W={};
function initGL(){
  const canvas=$('#stage');
  try{ renderer=new THREE.WebGLRenderer({canvas,antialias:!mobile,powerPreference:'high-performance'}); }catch(e){ return false; }
  if(!renderer.getContext()) return false;
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile?1.5:2));
  renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
  scene=new THREE.Scene(); scene.fog=new THREE.Fog(0xF5EFE5, 14, mobile?70:95);
  camera=new THREE.PerspectiveCamera(mobile?62:50, innerWidth/innerHeight, .1, 400);
  resize(); addEventListener('resize',resize);
  build(); return true;
}
function resize(){ if(!renderer) return; renderer.setSize(innerWidth,innerHeight,false); camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); computeAnchors(); }

const C = { ivory:0xF5EFE5, linen:0xFBF8F2, stone:0xE9DFCF, taupe:0x7E6C5A, gold:0xC09A5E, ink:0x2A231E };
const mat = {
  floor:new THREE.MeshStandardMaterial({color:0xEDE3D4,roughness:.9}),
  wall:new THREE.MeshStandardMaterial({color:0xF2EADC,roughness:.95}),
  stone:new THREE.MeshStandardMaterial({color:0xE6DAC6,roughness:.85}),
  linen:new THREE.MeshStandardMaterial({color:C.linen,roughness:.8}),
  gold:new THREE.MeshStandardMaterial({color:C.gold,roughness:.35,metalness:.6}),
  wax:new THREE.MeshStandardMaterial({color:0xFFF7EA,roughness:.6,emissive:0x3a2a10,emissiveIntensity:.15}),
  plate:new THREE.MeshStandardMaterial({color:0xFFFFFF,roughness:.4}),
  glass:new THREE.MeshStandardMaterial({color:0xFFFFFF,roughness:.1,transparent:true,opacity:.35}),
  frame:new THREE.MeshStandardMaterial({color:0xB8975F,roughness:.4,metalness:.5}),
};
function canvasTex(c){ const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; return t; }
function glowTex(){ const c=document.createElement('canvas'); c.width=c.height=128; const g=c.getContext('2d'); const r=g.createRadialGradient(64,64,0,64,64,64);
  r.addColorStop(0,'rgba(255,236,190,1)'); r.addColorStop(.25,'rgba(255,200,120,.55)'); r.addColorStop(1,'rgba(255,190,110,0)'); g.fillStyle=r; g.fillRect(0,0,128,128); return new THREE.CanvasTexture(c); }
function shadowTex(){ const c=document.createElement('canvas'); c.width=c.height=128; const g=c.getContext('2d'); const r=g.createRadialGradient(64,64,0,64,64,64);
  r.addColorStop(0,'rgba(80,60,40,.35)'); r.addColorStop(1,'rgba(80,60,40,0)'); g.fillStyle=r; g.fillRect(0,0,128,128); return new THREE.CanvasTexture(c); }
let GLOW, SHADOW;

function merge(list){ // [geometry, matrix]
  const pos=[], nor=[];
  list.forEach(([g,m])=>{ g=g.index?g.toNonIndexed():g; g.applyMatrix4(m); pos.push(...g.attributes.position.array); nor.push(...g.attributes.normal.array); });
  const out=new THREE.BufferGeometry(); out.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); out.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3)); return out;
}
const M=(x,y,z,ry=0)=>new THREE.Matrix4().makeRotationY(ry).setPosition(x,y,z);
const chairGeo = ()=>merge([
  [new THREE.BoxGeometry(.42,.04,.42),M(0,.45,0)],
  [new THREE.BoxGeometry(.03,.95,.03),M(-.19,.475,-.19)],[new THREE.BoxGeometry(.03,.95,.03),M(.19,.475,-.19)],
  [new THREE.BoxGeometry(.03,.45,.03),M(-.19,.225,.19)],[new THREE.BoxGeometry(.03,.45,.03),M(.19,.225,.19)],
  [new THREE.BoxGeometry(.4,.025,.025),M(0,.62,-.19)],[new THREE.BoxGeometry(.4,.025,.025),M(0,.78,-.19)],[new THREE.BoxGeometry(.4,.03,.03),M(0,.93,-.19)],
]);

function shadow(x,z,s,parent=scene){ const m=new THREE.Mesh(new THREE.PlaneGeometry(s,s),new THREE.MeshBasicMaterial({map:SHADOW,transparent:true,depthWrite:false})); m.rotation.x=-Math.PI/2; m.position.set(x,.005,z); parent.add(m); return m; }

const FLAMES=[];
function candle(x,y,z,h=.3,parent=scene,group='hero'){
  const c=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,h,12),mat.wax); c.position.set(x,y+h/2,z); parent.add(c);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:0xffd9a0,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));
  s.position.set(x,y+h+.05,z); s.scale.setScalar(.5); parent.add(s); FLAMES.push({s,group,phase:rnd()*6}); return c;
}
const FLORA_COLORS=[0xF6EFE6,0xF1D9CF,0xE6BFB2,0xFFFFFF,0xEAD2B8,0xD9A99A];
function floral(cx,cy,cz,rx,rz,count,parent=scene){
  const geo=new THREE.IcosahedronGeometry(1,1);
  const im=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({roughness:.85}),count);
  const base=[]; const m=new THREE.Matrix4(), q=new THREE.Quaternion(), col=new THREE.Color();
  for(let i=0;i<count;i++){
    const a=rnd()*Math.PI*2, r=Math.sqrt(rnd());
    const leaf=rnd()<.28;
    const x=cx+Math.cos(a)*r*rx, z=cz+Math.sin(a)*r*rz, y=cy+(1-r*r)*.32*(rx>rz?Math.min(1,rz*2):1)+rnd()*.05;
    const s=leaf? .05+rnd()*.03 : .07+rnd()*.07;
    const sc=leaf? new THREE.Vector3(s*.6,s*.5,s*1.8) : new THREE.Vector3(s,s*.85,s);
    q.setFromEuler(new THREE.Euler(rnd()*3,rnd()*3,rnd()*3));
    base.push({p:new THREE.Vector3(x,y,z),q:q.clone(),s:sc});
    m.compose(base[i].p,base[i].q,sc); im.setMatrixAt(i,m);
    col.setHex(leaf? (rnd()<.5?0x7D8A68:0x95A07E) : FLORA_COLORS[(rnd()*FLORA_COLORS.length)|0]); im.setColorAt(i,col);
  }
  im.userData.base=base; parent.add(im); return im;
}
function scaleFloral(im,k){ const m=new THREE.Matrix4(), s=new THREE.Vector3(); im.userData.base.forEach((b,i)=>{ s.copy(b.s).multiplyScalar(Math.max(k,.0001)); m.compose(b.p,b.q,s); im.setMatrixAt(i,m); }); im.instanceMatrix.needsUpdate=true; }

function archShape(w,h,ow,oh){ const s=new THREE.Shape(); s.moveTo(-w/2,0); s.lineTo(w/2,0); s.lineTo(w/2,h); s.lineTo(-w/2,h); s.lineTo(-w/2,0);
  const p=new THREE.Path(); p.moveTo(-ow/2,.02); p.lineTo(-ow/2,oh-ow/2); p.absarc(0,oh-ow/2,ow/2,Math.PI,0,true); p.lineTo(ow/2,.02); p.lineTo(-ow/2,.02); s.holes.push(p); return s; }
function arch(w,h,ow,oh,depth,material,x,z){ const g=new THREE.ExtrudeGeometry(archShape(w,h,ow,oh),{depth,bevelEnabled:false,curveSegments:32}); const m=new THREE.Mesh(g,material); m.position.set(x,0,z-depth/2); scene.add(m); return m; }

/* giant architectural word: stacked layers give depth like carved stone */
function word(text,{x=0,y=3,z,width=24,front='#B08F5E',side='#8E7553',layers=10,depth=.9}){
  const c=document.createElement('canvas'); const fs=320; const g=c.getContext('2d'); g.font=`400 ${fs}px "Bodoni Moda", Georgia, serif`;
  const sp=fs*.06; let tw=0; for(const ch of text) tw+=g.measureText(ch).width+sp; tw-=sp;
  c.width=Math.ceil(tw+40); c.height=Math.ceil(fs*1.25);
  const draw=(color)=>{ g.clearRect(0,0,c.width,c.height); g.font=`400 ${fs}px "Bodoni Moda", Georgia, serif`; g.fillStyle=color; g.textBaseline='alphabetic'; let px=20; for(const ch of text){ g.fillText(ch,px,fs*.98); px+=g.measureText(ch).width+sp; } };
  const h=width*c.height/c.width, grp=new THREE.Group(); grp.position.set(x,y,z);
  for(let i=0;i<layers;i++){ const last=i===layers-1; draw(last?front:side); const cc=document.createElement('canvas'); cc.width=c.width; cc.height=c.height; cc.getContext('2d').drawImage(c,0,0);
    const tex=canvasTex(cc); const m=new THREE.Mesh(new THREE.PlaneGeometry(width,h),new THREE.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.35,side:THREE.DoubleSide}));
    if(!last) m.material.color.setScalar(.75+.25*i/layers);
    m.position.z=-depth+depth*i/(layers-1); grp.add(m); }
  scene.add(grp); return grp;
}

/* brand logo as a flat plaque in the scene */
function logoPlane(src,w,x,y,z,noFog){ const im=new Image(); im.crossOrigin='anonymous';
  im.onload=()=>{ const t=new THREE.Texture(im); t.encoding=THREE.sRGBEncoding; t.anisotropy=8; t.needsUpdate=true;
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,w*im.height/im.width),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,fog:!noFog}));
    m.position.set(x,y,z); m.renderOrder=2; scene.add(m); };
  im.src=src; }

/* photo frames */
const PICS=[]; let TEX=[];
function frame(w,h,x,y,z,idx,{look=null,ry=0,parent=scene}={}){
  const g=new THREE.Group(); g.position.set(x,y,z);
  const back=new THREE.Mesh(new THREE.BoxGeometry(w+.14,h+.14,.06),mat.frame); back.position.z=-.035; g.add(back);
  const mat2=new THREE.MeshBasicMaterial({map:TEX[idx%TEX.length]});
  const pic=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat2); pic.userData={idx,w,h}; g.add(pic); PICS.push(pic);
  if(look) g.lookAt(look); else g.rotation.y=ry;
  parent.add(g); return g;
}
function fitTex(pic){ const t=pic.material.map; const img=t.image; if(!img) return; const ia=img.width/img.height, fa=pic.userData.w/pic.userData.h;
  t.repeat.set(1,1); t.offset.set(0,0); if(ia>fa){ t.repeat.x=fa/ia; t.offset.x=(1-t.repeat.x)/2; } else { t.repeat.y=ia/fa; t.offset.y=(1-t.repeat.y)/2; } }
function refreshPics(){ PICS.forEach(p=>{ p.material.map=TEX[p.userData.idx%TEX.length]; fitTex(p); p.material.needsUpdate=true; }); }

function build(){
  GLOW=glowTex(); SHADOW=shadowTex();
  TEX=ITEMS.map(it=>{ const t=it.el.tagName==='CANVAS'?canvasTex(it.el):new THREE.Texture(it.el); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; t.needsUpdate=true; return t; });
  W.hemi=new THREE.HemisphereLight(0xFFF6E8,0xC9B49A,.95); scene.add(W.hemi);
  W.sun=new THREE.DirectionalLight(0xFFE9CC,.75); W.sun.position.set(6,14,10); scene.add(W.sun);
  W.warm=new THREE.PointLight(0xFFB870,0,18,2); scene.add(W.warm);

  const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,520),mat.floor); floor.rotation.x=-Math.PI/2; floor.position.z=-190; scene.add(floor);

  /* --- Scene 1: grand entrance --- */
  const side1=new THREE.Mesh(new THREE.PlaneGeometry(30,10),mat.wall); side1.position.set(-10,5,2); side1.rotation.y=Math.PI/2; scene.add(side1);
  const side2=side1.clone(); side2.position.x=10; side2.rotation.y=-Math.PI/2; scene.add(side2);
  arch(20,10,4.6,6.2,.5,mat.wall,0,-12);
  arch(5.2,6.6,4.6,6.2,.12,mat.gold,0,-11.7);
  // banquet table
  const T=new THREE.Group(); scene.add(T);
  const cloth=new THREE.Mesh(new THREE.BoxGeometry(6.4,.74,1.5),mat.linen); cloth.position.y=.37; T.add(cloth);
  const runner=new THREE.Mesh(new THREE.BoxGeometry(6.5,.012,.42),new THREE.MeshStandardMaterial({color:0xE9D3C0,roughness:.9})); runner.position.y=.746; T.add(runner);
  shadow(0,0,8,T).scale.set(1,.35,1);
  W.heroFlora=[]; for(let i=-2;i<=2;i++){ W.heroFlora.push(floral(i*1.25,.75,0,.42,.2,mobile?60:110,T)); }
  W.heroFlora.push(floral(0,.75,0,.6,.3,mobile?80:160,T));
  for(let i=-2.5;i<=2.5;i+=1.25){ candle(i,.75,.12,.22+((i*7)%3+3)%3*.08,T,'hero'); candle(i+.3,.75,-.14,.32,T,'hero'); }
  const chairs1=new THREE.InstancedMesh(chairGeo(),mat.gold,10); let ci=0;
  for(let i=0;i<5;i++){ const x=-2.4+i*1.2;
    for(const sz of [1,-1]){ chairs1.setMatrixAt(ci++,M(x,0,sz*1.05,sz>0?Math.PI:0));
      const p=new THREE.Mesh(new THREE.CylinderGeometry(.16,.12,.015,28),mat.plate); p.position.set(x,.755,sz*.48); T.add(p);
      const r=new THREE.Mesh(new THREE.TorusGeometry(.155,.006,6,40),mat.gold); r.rotation.x=Math.PI/2; r.position.set(x,.765,sz*.48); T.add(r);
      const gl=new THREE.Mesh(new THREE.CylinderGeometry(.035,.02,.16,12),mat.glass); gl.position.set(x+.2,.83,sz*.32); T.add(gl); } }
  T.add(chairs1);
  // the first real work you see: framed on the entrance walls
  [[-9.86,-1.5,0],[-9.86,6.5,4],[9.86,-1.5,1],[9.86,6.5,2]].forEach(([x,z,idx])=>frame(2.3,2.9,x,2.7,z,idx,{ry:x<0?Math.PI/2:-Math.PI/2}));
  // floor florals flanking the arch
  floral(-3.2,0,-11,.8,.5,mobile?90:180); floral(3.2,0,-11,.8,.5,mobile?90:180);
  floral(-2.9,1.2,-11.3,.5,.35,60); floral(2.9,1.2,-11.3,.5,.35,60);
  // brand plaque above the arch
  logoPlane(A+'photos/logo.png',2.7,0,8.3,-11.5,false);

  /* --- Scene 2: IMAGINE --- */
  word('IMAGINE',{y:3.4,z:-60,width:mobile?20:28});
  const nImag=mobile?12:20;
  for(let i=0;i<nImag;i++){ const side=i%2?1:-1; const z=-20-i*(80/nImag); const x=side*(2.6+rnd()*6); const y=1.2+rnd()*4; const port=rnd()<.6;
    frame(port?1.6:2.2,port?2.1:1.5,x,y,z,i,{ry:-side*(.25+rnd()*.35)}); }
  // palette swatches and gold rings
  W.swatches=[]; const sw=[0xF4EDE3,0xE7D8BE,0xE6C7BB,0xC09A5E,0x9AA383,0x7E6C5A];
  for(let i=0;i<(mobile?10:18);i++){ const m=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.04,40),new THREE.MeshStandardMaterial({color:sw[i%sw.length],roughness:.6}));
    m.position.set((rnd()-.5)*14,1+rnd()*5,-24-rnd()*70); m.rotation.set(Math.PI/2,0,rnd()); scene.add(m); W.swatches.push(m); }
  for(let i=0;i<6;i++){ const r=new THREE.Mesh(new THREE.TorusGeometry(1.2+rnd()*1.5,.02,8,80),mat.gold); r.position.set((rnd()-.5)*12,2+rnd()*3,-30-i*12); r.rotation.set(rnd(),rnd(),0); scene.add(r); W.swatches.push(r); }

  /* --- Scene 3: DESIGN + transformation room --- */
  word('DESIGN',{y:3.4,z:-108,width:mobile?18:24});
  arch(26,11,6,8,.6,mat.wall,0,-116);
  const room=new THREE.Mesh(new THREE.PlaneGeometry(30,10),mat.wall); room.position.set(0,5,-166); scene.add(room);
  const rs1=new THREE.Mesh(new THREE.PlaneGeometry(50,10),mat.wall); rs1.position.set(-13,5,-141); rs1.rotation.y=Math.PI/2; scene.add(rs1);
  const rs2=rs1.clone(); rs2.position.x=13; rs2.rotation.y=-Math.PI/2; scene.add(rs2);
  W.tables=[]; const tPos=[]; for(let r=0;r<2;r++) for(let c=0;c<3;c++) tPos.push([(c-1)*4.2,-134-r*5.5]);
  W.roomChairs=new THREE.InstancedMesh(chairGeo(),mat.gold,tPos.length*8); W.roomChairs.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(W.roomChairs);
  W.roomFlora=[];
  tPos.forEach(([x,z],ti)=>{ const g=new THREE.Group(); g.position.set(x,0,z); scene.add(g);
    const base=new THREE.Mesh(new THREE.CylinderGeometry(.08,.3,.74,16),mat.stone); base.position.y=.37; g.add(base);
    const top=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.04,40),mat.stone); top.position.y=.76; g.add(top);
    const cl=new THREE.Mesh(new THREE.CylinderGeometry(.94,1.12,.76,48,1,true),mat.linen); cl.position.y=.38; g.add(cl);
    const ct=new THREE.Mesh(new THREE.CylinderGeometry(.945,.945,.02,48),mat.linen); ct.position.y=.775; g.add(ct);
    const sh=shadow(0,0,3.2,g);
    const fl=floral(0,.78,0,.32,.32,mobile?40:70,g); W.roomFlora.push(fl); scaleFloral(fl,0);
    const cs=[]; for(let k=0;k<3;k++){ const a=k*2.1+.4; cs.push(candle(Math.cos(a)*.5,.78,Math.sin(a)*.5,.2+k*.07,g,'room')); }
    W.tables.push({g,cl,ct,top,cs,sh,x,z}); });
  W.uplights=[]; for(const x of [-12.4,12.4]) for(let k=0;k<4;k++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:0xffc890,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));
    s.position.set(x,2.5,-124-k*12); s.scale.set(3,7,1); scene.add(s); W.uplights.push(s); }

  /* --- Scene 4: CELEBRATE tunnel --- */
  word('CELEBRATE',{y:3.5,z:-172,width:mobile?20:30,front:'#B07F5E',side:'#8A6248'});
  const nT=mobile?16:28;
  for(let i=0;i<nT;i++){ const a=i*.95, z=-184-i*(56/nT), y=2.5+Math.sin(a)*2.4, x=Math.cos(a)*(mobile?3.6:5.2);
    frame(1.5,1.9,x,y,z,i+3,{look:new THREE.Vector3(0,2.5,z+1.5)}); }
  const np=mobile?220:520, pg=new THREE.BufferGeometry(), pa=new Float32Array(np*3);
  for(let i=0;i<np;i++){ pa[i*3]=(rnd()-.5)*18; pa[i*3+1]=rnd()*8; pa[i*3+2]=-176-rnd()*70; }
  pg.setAttribute('position',new THREE.BufferAttribute(pa,3));
  W.bokeh=new THREE.Points(pg,new THREE.PointsMaterial({map:GLOW,size:.35,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,color:0xffd7a0,opacity:.8})); scene.add(W.bokeh);

  /* --- Scene 5: difference colonnade --- */
  for(let k=0;k<4;k++){ arch(10,8.5,6,6.6,.7,mat.stone,0,-256-k*9); floral(-3.2,0,-256-k*9+.6,.6,.4,mobile?40:80); floral(3.2,0,-256-k*9+.6,.6,.4,mobile?40:80); }

  { const im=new Image(); im.crossOrigin='anonymous'; im.onload=()=>{ const t=new THREE.Texture(im); t.encoding=THREE.sRGBEncoding; t.needsUpdate=true;
      const g=new THREE.Group(); const back=new THREE.Mesh(new THREE.BoxGeometry(2.36,2.9,.08),mat.frame); back.position.z=-.045; g.add(back);
      g.add(new THREE.Mesh(new THREE.PlaneGeometry(2.2,2.75),new THREE.MeshBasicMaterial({map:t}))); g.position.set(-2.2,2.4,-268.2); g.rotation.y=.18; scene.add(g); };
    im.src=document.getElementById('storyImg').src; }
  /* --- Scene 6: journey portals --- */
  ['01','02','03'].forEach((n,i)=>{ const z=-302-i*14; arch(7,7,4.4,5.6,.25,mat.gold,0,z); word(n,{x:0,y:6.2,z:z+.2,width:1.6,front:'#2A231E',side:'#7E6C5A',layers:3,depth:.05}); });

  /* --- Scene 7: grand reveal banquet --- */
  const F=new THREE.Group(); scene.add(F);
  const len=22, fz=-372;
  const fc=new THREE.Mesh(new THREE.BoxGeometry(1.7,.74,len),mat.linen); fc.position.set(0,.37,fz); F.add(fc);
  shadow(0,fz,len+2,F).scale.set(.18,1,1);
  const n2=Math.floor(len/1.1); const ch2=new THREE.InstancedMesh(chairGeo(),mat.gold,n2*2); let c2=0;
  for(let i=0;i<n2;i++){ const z=fz-len/2+.55+i*1.1; ch2.setMatrixAt(c2++,M(-1.15,0,z,Math.PI/2)); ch2.setMatrixAt(c2++,M(1.15,0,z,-Math.PI/2));
    for(const sx of [-.55,.55]){ const p=new THREE.Mesh(new THREE.CylinderGeometry(.16,.12,.015,24),mat.plate); p.position.set(sx,.755,z); F.add(p); } }
  F.add(ch2);
  W.finalFlora=[]; for(let i=0;i<9;i++) W.finalFlora.push(floral(0,.75,fz-len/2+1.2+i*2.45,.32,.9,mobile?50:90,F));
  for(let i=0;i<16;i++){ candle((i%2?.18:-.18),.75,fz-len/2+.8+i*1.35,.28+(i%3)*.1,F,'final'); }
  // floral arch at the head of the table
  const archN=mobile?260:520; for(let i=0;i<14;i++){ const a=Math.PI*(i/13); floral(Math.cos(a)*3.4,Math.sin(a)*4.2+.2,fz-len/2-2,.55,.35,Math.floor(archN/14)); }
  W.converge=[]; const nc=mobile?8:14;
  for(let i=0;i<nc;i++){ const a=Math.PI*(i/(nc-1)); const end=new THREE.Vector3(Math.cos(a)*8.5,1.6+Math.sin(a)*6.5,fz-len/2-5);
    const start=new THREE.Vector3((rnd()-.5)*40,8+rnd()*10,fz+10-rnd()*30);
    const f=frame(1.5,1.9,start.x,start.y,start.z,i+5); W.converge.push({f,start,end}); }
  W.finalLights=[new THREE.PointLight(0xFFB06A,0,14,2),new THREE.PointLight(0xFFB06A,0,14,2)];
  W.finalLights[0].position.set(0,1.6,fz+4); W.finalLights[1].position.set(0,1.6,fz-6); W.finalLights.forEach(l=>scene.add(l));

  refreshPics();
}

/* ============ camera path tied to sections ============ */
const KEYS=[
  ['home',0,[0,1.75,12.5],[0,1.0,0],0xF5EFE5],
  ['home',.95,[0,2.15,1.8],[0,2.0,-12],0xF5EFE5],
  ['imagine',0,[0,2.4,-16],[0,2.6,-40],0xF3EDE7],
  ['imagine',.55,[1.4,2.7,-44],[0,3.2,-60],0xF3EDE7],
  ['imagine',1,[0,3.0,-68],[0,2.6,-100],0xF2EBE3],
  ['design',.3,[-.6,2.7,-99],[0,3.2,-108],0xF0E8DB],
  ['design',1,[0,3.2,-113],[0,1.2,-138],0xF0E8DB],
  ['transform',.05,[0,6.5,-118],[0,.5,-139],0xEFE6D7],
  ['transform',.55,[9.5,4.6,-128],[0,.6,-139],0xEDE1CF],
  ['transform',.95,[-5,2.8,-148],[0,1.2,-160],0xEAD9C2],
  ['celebrate',0,[0,2.6,-161],[0,3.2,-172],0xEBD7BF],
  ['celebrate',.35,[0,2.4,-180],[0,2.4,-205],0xE9D2B6],
  ['celebrate',1,[0,2.4,-238],[0,2.3,-262],0xEAD6BE],
  ['difference',.2,[0,2.5,-249],[0,2.6,-280],0xF1E8DC],
  ['difference',1,[-.8,2.3,-283],[0,2.2,-300],0xF0E6D8],
  ['journey',.15,[0,2.2,-292],[0,2.4,-304],0xEFE4D4],
  ['journey',1,[0,2.0,-336],[0,1.6,-358],0xD9C6AE],
  ['contact',0,[0,1.8,-352],[0,1.1,-372],0x5A4639],
  ['contact',.65,[0,7,-345],[0,1.3,-380],0x2B221D],
  ['contact',1,[0,7.6,-343],[0,1.3,-381],0x2B221D],
];
let anchors=[], posCurve, lookCurve, docH=1;
function computeAnchors(){
  docH=document.documentElement.scrollHeight;
  anchors=KEYS.map(([id,f])=>{ const s=document.getElementById(id); return s.offsetTop+f*s.offsetHeight; });
  for(let i=1;i<anchors.length;i++) if(anchors[i]<=anchors[i-1]) anchors[i]=anchors[i-1]+1;
}
function initCurves(){
  posCurve=new THREE.CatmullRomCurve3(KEYS.map(k=>new THREE.Vector3(...k[2])),false,'centripetal');
  lookCurve=new THREE.CatmullRomCurve3(KEYS.map(k=>new THREE.Vector3(...k[3])),false,'centripetal');
}
function scrollDoc(){ const max=Math.max(1,docH-innerHeight); return scrollY/max*docH; }
function keyU(s){ if(s<=anchors[0]) return 0; for(let i=0;i<anchors.length-1;i++){ if(s<anchors[i+1]){ const t=(s-anchors[i])/(anchors[i+1]-anchors[i]); return (i+ (reduced?t:t*t*(3-2*t)))/(KEYS.length-1); } } return 1; }
function local(id){ const s=document.getElementById(id); const r=s.getBoundingClientRect(); return clamp(-r.top/Math.max(1,s.offsetHeight-innerHeight)); }

const camPos=new THREE.Vector3(), camLook=new THREE.Vector3(), tgtPos=new THREE.Vector3(), tgtLook=new THREE.Vector3();
const bg=new THREE.Color(), c1=new THREE.Color(), c2=new THREE.Color();
let first=true, lastT=-1, pointer={x:0,y:0};
addEventListener('pointermove',e=>{ pointer.x=e.clientX/innerWidth-.5; pointer.y=e.clientY/innerHeight-.5; },{passive:true});

function tick(time){
  requestAnimationFrame(tick);
  const t=time/1000, s=scrollDoc(), u=keyU(s);
  posCurve.getPoint(u,tgtPos); lookCurve.getPoint(u,tgtLook);
  if(!reduced && !mobile){ tgtPos.x+=pointer.x*.35; tgtPos.y-=pointer.y*.2; }
  const k=first||reduced?1:.075; camPos.lerp(tgtPos,k); camLook.lerp(tgtLook,k); first=false;
  camera.position.copy(camPos); camera.lookAt(camLook);

  // atmosphere
  const fi=u*(KEYS.length-1), i0=Math.floor(fi), i1=Math.min(KEYS.length-1,i0+1);
  c1.setHex(KEYS[i0][4]); c2.setHex(KEYS[i1][4]); bg.copy(c1).lerp(c2,fi-i0);
  scene.fog.color.copy(bg); renderer.setClearColor(bg);
  const dusk=1-clamp((bg.r+bg.g+bg.b)/3*1.6-.6); document.body.classList.toggle('dusk', dusk>.5);
  W.hemi.intensity=.95-dusk*.6; W.sun.intensity=.75-dusk*.65;

  // hero: candles light as you approach the centerpiece
  const hl=local('home'); const heroLit=.35+seg(hl,0,.5)*.65;
  // transformation sequence
  const tr=local('transform'); if(Math.abs(tr-lastT)>.0005){ lastT=tr; transform(tr); }
  // finale
  const fl=local('contact'); const fin=seg(fl,0,.7);
  W.converge.forEach(({f,start,end},i)=>{ const kk=seg(fin,i*.02,.7+i*.02); f.position.lerpVectors(start,end,kk); f.lookAt(0,3,end.z+12); });
  W.finalLights.forEach(l=>l.intensity=dusk*4.2);

  FLAMES.forEach(fl=>{ const base= fl.group==='hero'?heroLit : fl.group==='room'?W.roomLit : clamp(.25+dusk);
    const flick= reduced?1: .85+Math.sin(t*9+fl.phase)*.08+Math.sin(t*23+fl.phase*2)*.05; fl.s.material.opacity=base*flick; fl.s.scale.setScalar(.45+.1*flick); });
  if(!reduced){ W.swatches.forEach((m,i)=>{ m.rotation.z+=.002*(i%2?1:-1); m.position.y+=Math.sin(t*.6+i)*.0015; });
    W.bokeh.rotation.y=Math.sin(t*.05)*.05; W.bokeh.position.y=Math.sin(t*.3)*.15; }
  renderer.render(scene,camera);
}

W.roomLit=0;
function transform(p){
  const tablesK=seg(p,.02,.2), chairsK=seg(p,.18,.38), linenK=seg(p,.34,.52), floraK=seg(p,.48,.66), candleK=seg(p,.62,.78), glowK=seg(p,.74,.92);
  const m=new THREE.Matrix4(); let ci=0;
  W.tables.forEach((tb,ti)=>{
    const sc=Math.max(.0001,tablesK); tb.g.scale.set(1,sc,1); tb.g.position.y=0; tb.sh.material.opacity=tablesK;
    tb.cl.scale.y=Math.max(.0001,linenK); tb.cl.position.y=.76-.38*linenK; tb.ct.visible=linenK>.02; tb.top.visible=linenK<.98;
    scaleFloral(W.roomFlora[ti],floraK);
    tb.cs.forEach(c=>c.scale.set(1,Math.max(.0001,floraK>0?seg(p,.56,.66):0),1));
    for(let k=0;k<8;k++){ const a=k/8*Math.PI*2+ti*.2, r=1.4+(1-chairsK)*5, x=tb.x+Math.cos(a)*r, z=tb.z+Math.sin(a)*r;
      const yaw=Math.atan2(tb.x-x,tb.z-z); m.makeRotationY(yaw).setPosition(x,(1-chairsK)*-1.2,z); W.roomChairs.setMatrixAt(ci++,m); }
  });
  W.roomChairs.instanceMatrix.needsUpdate=true;
  W.roomLit=candleK; W.uplights.forEach(s=>s.material.opacity=glowK*.55);
  W.warm.position.set(0,3,-138); W.warm.intensity=glowK*3.5;
  $$('#meter .meter-row').forEach((r,i)=>r.classList.toggle('on',[tablesK,chairsK,linenK,floraK,candleK,glowK][i]>.5));
}

/* clicking frames in the scene opens the lightbox */
const ray=new THREE.Raycaster(), ndc=new THREE.Vector2(); let downAt=null;
function pick(e){ ndc.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1); ray.setFromCamera(ndc,camera); const h=ray.intersectObjects(PICS,false)[0]; return h&&h.distance<26?h.object:null; }
function wirePicking(){
  const st=$('#stage');
  // the canvas sits under the content, so listen on the document and ignore UI hits
  addEventListener('pointerdown',e=>downAt=[e.clientX,e.clientY],{passive:true});
  addEventListener('click',e=>{ if(e.target.closest('button,a,input,select,textarea,.card,.overlay,.nav')) return; if(downAt&&Math.hypot(e.clientX-downAt[0],e.clientY-downAt[1])>8) return;
    const o=pick(e); if(o) openLightbox(o.userData.idx%ITEMS.length,null); });
  if(!mobile) addEventListener('pointermove',e=>{ if(e.target.closest('.card,.nav,.overlay,button,a')){ document.body.style.cursor=''; return; } document.body.style.cursor=pick(e)?'pointer':''; },{passive:true});
}

/* real photos: preview the experience with Joiful Events' own images */
$('#addBtn').onclick=()=>$('#fileIn').click();
$('#fileIn').onchange=async e=>{ const files=[...e.target.files].filter(f=>f.type.startsWith('image/')); if(!files.length) return;
  const loaded=await Promise.all(files.map(f=>new Promise(res=>{ const url=URL.createObjectURL(f); const im=new Image(); im.onload=()=>res({src:url,el:im,label:f.name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ')}); im.onerror=()=>res(null); im.src=url; })));
  setItems(loaded.filter(Boolean)); $('#addBtn').textContent=loaded.length+' photos'; };
function setItems(list){ if(!list.length) return; ITEMS=list.concat(ITEMS.filter(it=>it.cat)); renderLists(); if(renderer){ TEX=ITEMS.map(it=>{ const t=new THREE.Texture(it.el); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; t.needsUpdate=true; return t; }); refreshPics(); } }

/* ============ boot ============ */
(async function boot(){
  try{ await Promise.race([Promise.all([document.fonts.load('400 100px "Bodoni Moda"'),document.fonts.load('italic 40px "Bodoni Moda"'),document.fonts.load('500 18px Jost')]), new Promise(r=>setTimeout(r,2500))]); }catch(e){}
  buildPlaceholders(); renderLists();
  if(CONFIG.photos.length){ const ims=await Promise.all(CONFIG.photos.map(ph=>new Promise(r=>{ const im=new Image(); im.crossOrigin='anonymous'; im.decoding='async'; im.onload=()=>r({src:ph.src,el:im,label:ph.label,cat:ph.cat}); im.onerror=()=>r(null); im.src=ph.src; })));
    const ok=ims.filter(Boolean); if(ok.length){ ITEMS=ok; renderLists(); } }
  const ok=typeof THREE!=='undefined' && initGL();
  if(!ok){ document.body.classList.add('no-webgl'); return; }
  initCurves(); computeAnchors(); wirePicking();
  addEventListener('load',computeAnchors);
  requestAnimationFrame(tick);
  // keep the floating button out of the way where the page already shows the same buttons
  const fcta=$('.float-cta'), seen=new Set();
  const fo=new IntersectionObserver(es=>{ es.forEach(e=>e.isIntersecting?seen.add(e.target.id):seen.delete(e.target.id)); fcta.classList.toggle('away',seen.size>0); },{threshold:.35});
  ['home','about','contact'].forEach(id=>fo.observe(document.getElementById(id)));
  // chapter rail
  const rail=$$('.rail span');
  const ro=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ const ch=e.target.dataset.ch; rail.forEach(r=>r.classList.toggle('on',r.dataset.ch===ch)); } }),{rootMargin:'-45% 0px -45% 0px'});
  $$('.sec').forEach(s=>ro.observe(s));
})();
