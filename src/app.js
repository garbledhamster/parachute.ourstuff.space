/* Sunroom flower and palette exploration. Appearance choices are independent. */
const order=[3,0,2,1,4,5,6];
const labels=[['Knowledge','& interests'],['People'],['Transferable','skills'],['Working','conditions'],['Pay &','rewards'],['Geography'],['Purpose']];
const categories=order.map(i=>sourceCatalog[i]);
const state={petal:2,view:'edit',chooser:false,entry:categories.map(()=>[]),draft:categories.map(()=>''),undo:null,notice:''};
state.entry[1].push('Patient mentors');
const root=document.querySelector('#app');
const dock=document.querySelector('#switcher');
const live=document.querySelector('#live');
const esc=value=>String(value).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[s]);
const icons={left:'m15 18-6-6 6-6',right:'m9 18 6-6-6-6',down:'m6 9 6 6 6-6',plus:'M12 5v14M5 12h14',close:'m6 6 12 12M18 6 6 18',print:'M6 9V3h12v6M6 17H4a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2M6 14h12v7H6z',leaf:'M20 4c-9 0-15 4-15 10a5 5 0 0 0 5 5c6 0 10-6 10-15ZM4 20l10-10'};
const icon=name=>'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="'+icons[name]+'"/></svg>';
function button(text,action,style='',glyph='',value=null,label=null){
 return '<button type="button" class="control '+style+'" data-action="'+action+'"'+(value===null?'':' data-value="'+value+'"')+(label?' aria-label="'+esc(label)+'"':'')+(action==='choose'||action==='overview'?' aria-expanded="'+(action==='choose'?state.chooser:state.overview)+'"':'')+'>'+(glyph?icon(glyph):'')+esc(text)+'</button>';
}
const filled=()=>state.entry.filter(items=>items.length).length;
const flowerStyles=[
 ['garden','Garden','Broad, rounded petals with a warm seed head.'],
 ['herbarium','Herbarium','Pointed petals and fine botanical lines.'],
 ['papercut','Paper Cut','Two layers of scalloped petals with crisp edges.']
];
const palettes=[
 ['red','Red'],['blue','Blue'],['yellow','Yellow'],['green','Green'],['rose','Rose'],['purple','Purple'],['white','White']
];
const pageUrl=new URL(location.href);
let styleIndex=Math.max(0,flowerStyles.findIndex(([id])=>id===pageUrl.searchParams.get('style')));
let themeIndex=palettes.findIndex(([id])=>id===pageUrl.searchParams.get('theme'));
if(themeIndex<0)themeIndex=2;
const outlines=[
 'M-22 -42 C-45 -64 -67 -112 -60 -143 C-53 -176 -28 -197 -2 -205 C25 -198 53 -177 59 -145 C67 -111 45 -64 22 -42 Q0 -24 -22 -42Z',
 'M-16 -49 C-38 -66 -56 -106 -44 -143 C-36 -170 -15 -189 0 -210 C14 -189 38 -171 45 -142 C53 -108 36 -71 17 -49 Q0 -34 -16 -49Z',
 'M-23 -44 C-46 -62 -57 -90 -57 -122 C-58 -157 -47 -177 -32 -178 C-27 -195 -12 -201 0 -196 C15 -203 31 -194 34 -179 C54 -176 60 -155 58 -124 C55 -94 45 -66 23 -44 Q0 -32 -23 -44Z'
];
function flower(){
 const transform=a=>'translate(260 217) rotate('+a+')';
 const back=styleIndex===2?Array.from({length:7},(_,i)=>'<path class="back-petal" transform="'+transform((i+.5)*360/7)+'" d="M-12 -54 C-47 -86 -52 -138 -37 -158 Q-22 -180 0 -177 Q23 -181 38 -157 C52 -139 47 -91 12 -54Z"/>').join(''):'';
 const petals=labels.map((words,i)=>{
   const angle=i*360/7,rad=angle*Math.PI/180,r=styleIndex===1?137:139;
   const x=260+r*Math.sin(rad),y=217-r*Math.cos(rad),n=state.entry[i].length;
   const title=(i+1)+'. '+categories[i][0]+', '+n+(n===1?' entry':' entries');
   const veins=styleIndex===1?'<path class="vein" transform="'+transform(angle)+'" d="M0 -61 Q-5 -109 0 -190 M0 -101Q-12 -130 -30 -146 M0 -123Q13 -147 24 -159"/>':'';
   const cut=styleIndex===2?'<path class="vein" transform="'+transform(angle)+'" d="M0 -59 Q-10 -109 -5 -174"/>':'';
   return '<g class="petal '+(n?'filled':'')+'" role="button" tabindex="0" aria-label="'+esc(title)+'" aria-pressed="'+(state.petal===i)+'" data-action="petal" data-value="'+i+'"><path class="blade" transform="'+transform(angle)+'" d="'+outlines[styleIndex]+'"/>'+veins+cut+'<text class="petal-label" x="'+x+'" y="'+(y-(words.length>1?10:0))+'">'+words.map((word,j)=>'<tspan x="'+x+'" dy="'+(j?18:0)+'">'+esc(word)+'</tspan>').join('')+(n?'<tspan class="sub" x="'+x+'" dy="16">'+n+(n===1?' entry':' entries')+'</tspan>':'')+'</text><text class="petal-number" x="'+x+'" y="'+(y+7)+'">'+(i+1)+'</text></g>';
 }).join('');
 const seeds=Array.from({length:styleIndex===1?92:62},(_,i)=>{
  const a=i*2.399963,r=39+14*Math.sqrt((i+.5)/(styleIndex===1?92:62));
  return '<ellipse cx="'+(260+r*Math.cos(a)).toFixed(1)+'" cy="'+(217+r*Math.sin(a)).toFixed(1)+'" rx="'+(styleIndex===2?'1.8':'1.05')+'" ry="'+(styleIndex===1?'1.6':'1.1')+'"/>';
 }).join('');
 const stem=styleIndex===1?'<path d="M261 257 Q226 350 254 462" class="stem fine"/><path class="leaf" d="M241 426 Q168 422 139 369 Q205 369 241 426ZM246 443Q305 391 369 409Q332 452 246 443Z"/><path class="leaf-line" d="M241 426Q202 392 154 378M247 442Q309 412 348 413"/>':'<path d="M261 243c-22 67-26 138-8 220" class="stem"/><path d="M242 428c-58-1-90-25-105-60 52-4 92 14 105 60Zm5 14c47-42 88-43 120-35-24 37-68 52-120 35Z" class="leaf"/><path class="leaf-line" d="M238 426c-24-23-56-40-82-46m94 59c29-14 56-22 95-27"/>';
 return '<svg class="flower" viewBox="44 6 432 468" role="group" aria-label="Interactive sunflower"><defs><linearGradient id="petal-color" x2=".2" y2="1"><stop class="petal-light"/><stop offset="1" class="petal-dark"/></linearGradient><linearGradient id="picked-color" x2=".3" y2="1"><stop class="petal-picked-light"/><stop offset="1" class="petal-picked-dark"/></linearGradient></defs>'+stem+back+petals+'<g class="disc" pointer-events="none"><circle cx="260" cy="217" r="65" class="disc-rim"/><circle cx="260" cy="217" r="59" class="disc-fill"/><g class="seeds">'+seeds+'</g><text x="260" y="221" class="count">'+filled()+' / 7</text><text x="260" y="240" class="count-label">petals with entries</text></g></svg>';
}
function navlist(){
 return '<ol class="navlist" aria-label="Petals">'+categories.map(([name],i)=>'<li><button data-action="petal" data-value="'+i+'" aria-pressed="'+(state.petal===i)+'"><span class="num">'+String(i+1).padStart(2,'0')+'</span><span>'+esc(name)+'</span><span class="filled-num">'+(state.entry[i].length||'')+'</span></button></li>').join('')+'</ol>';
}
function chooser(){
 return '<div class="chooser '+(state.chooser?'open':'')+'">'+navlist()+'</div>';
}
// One small pool per petal. Catalog IDs stay stable when ranking or entries change.
const pools=categories.map(()=>({ids:[],seen:new Set(),recent:[],positions:new Map(),turn:0,incoming:null,burst:null}));
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let still=motionPreference.matches;
let world=null;
const normalized=x=>x.trim().replace(/\s+/g,' ').toLowerCase();
const catalog=categories.map((category,c)=>{
 const knownTags=new Map(category[3].map(line=>{const [name,tags]=line.split('|');return [normalized(name),tags.split(' ')]}));
 const rows=[...expandedCatalog[c],...printCatalog[c].map(name=>[name,knownTags.get(normalized(name))||[]])];
 if(c===1)rows.unshift(['Patient mentors',['teach','care']]);
 if(c===2)rows.unshift(['Explain a process',['teach']]);
 const known=new Set();
 return rows.filter(([name])=>{const key=normalized(name);if(known.has(key))return false;known.add(key);return true})
   .map(([name,tags],id)=>({id,name,tags}));
});
const catalogSize=catalog.reduce((n,items)=>n+items.length,0);
function ranked(c){
 const picked=new Set(state.entry[c].map(normalized));
 const themes=new Set(state.entry.flatMap((items,petal)=>items.flatMap(name=>catalog[petal].find(x=>normalized(x.name)===normalized(name))?.tags||[])));
 return catalog[c].filter(x=>!picked.has(normalized(x.name))).map(x=>({...x,score:Math.min(2,x.tags.filter(t=>themes.has(t)).length)}));
}
function nextIdea(c,avoid=[]){
 const p=pools[c], rank=ranked(c);
 const blocked=new Set([...p.ids,...avoid]);
 let candidates=rank.filter(x=>!blocked.has(x.id)&&!p.seen.has(x.id));
 if(!candidates.length){
   p.seen.clear();
   candidates=rank.filter(x=>!blocked.has(x.id)&&!p.recent.includes(x.id));
   if(!candidates.length)candidates=rank.filter(x=>!blocked.has(x.id));
 }
 if(!candidates.length)return null;
 // Some turns prioritize a theme that is missing from the current bubbles.
 const offered=new Set(p.ids.flatMap(id=>catalog[c][id].tags));
 const explore=p.turn%3===1||p.turn%3===2;
 const utility=x=>x.score*(explore?1:4)+x.tags.filter(tag=>!offered.has(tag)).length*(explore?4:1);
 candidates.sort((a,b)=>utility(b)-utility(a)||a.id-b.id);
 const pick=candidates[0];
 p.turn++;
 p.seen.add(pick.id);
 p.recent=[...p.recent.slice(-17),pick.id];
 return pick.id;
}
function replenish(c,avoid=[]){
 const p=pools[c];
 while(p.ids.length<6){
  const next=nextIdea(c,avoid);
  if(next===null)break;
  p.ids.push(next);
 }
}
function bubbleMarkup(c){
 const p=pools[c],rank=ranked(c);
 const allowed=new Map(rank.map(idea=>[idea.id,idea]));
 p.ids=p.ids.filter(id=>allowed.has(id));
 replenish(c);
 return '<section class="part ideas" id="idea-pool" tabindex="-1"><div class="part-head"><h3>Idea pool</h3><span class="small">'+catalog[c].length+' ideas for this petal</span></div><p class="small hint">Tap a bubble to add it. Bigger bubbles share more with your picks.</p><div class="bubble-arena" data-still="'+still+'" role="group" aria-label="Idea bubbles">'+p.ids.map(id=>{
   const x=allowed.get(id);
   return '<button type="button" class="idea-orb '+(x.name.split(/[-\s]+/).some(word=>word.length>=9)?'long-word':'')+'" data-action="pop" data-value="'+x.id+'" data-score="'+x.score+'" aria-label="Add '+esc(x.name)+'"><span>'+esc(x.name)+'</span></button>';
 }).join('')+(p.ids.length?'':'<p class="pool-empty">You’ve added all the ideas in this petal. You can still write your own.</p>')+'</div><div class="row pool-controls">'+button('Give me more','more','','plus')+(still?'':button('Stir bubbles','stir'))+button(still?'Turn motion on':'Keep bubbles still','motion')+'</div><p class="small hint">'+catalogSize+' draft examples across seven petals.</p></section>';
}
function detachWorld(){
 if(!world)return;
 cancelAnimationFrame(world.frame);
 world.resize.disconnect();
 world=null;
}
function mountBubbleWorld(){
 const field=document.querySelector('.bubble-arena');
 if(!field)return;
 const p=pools[state.petal];
 const buttons=[...field.querySelectorAll('.idea-orb')];
 const burst=p.burst;
 p.burst=null;
 if(still||!buttons.length){p.incoming=null;return;}
 const w={field,items:[],width:0,height:0,frame:0,last:0,until:0,hold:0,resize:null};
 world=w;
 const place=orb=>{
  orb.el.style.transform='translate3d('+(orb.x-orb.r)+'px,'+(orb.y-orb.r)+'px,0)';
  p.positions.set(orb.id,{x:orb.x,y:orb.y});
 };
 const constrain=orb=>{
  if(orb.x<orb.r){orb.x=orb.r;orb.vx=Math.abs(orb.vx)*.61}
  if(orb.x>w.width-orb.r){orb.x=w.width-orb.r;orb.vx=-Math.abs(orb.vx)*.61}
  if(orb.y<orb.r){orb.y=orb.r;orb.vy=Math.abs(orb.vy)*.5}
  if(orb.y>w.height-orb.r){
   orb.y=w.height-orb.r;
   orb.vy=orb.vy>23?-orb.vy*.36:0;
   orb.vx*=.81;
  }
 };
 const collide=(a,b)=>{
  const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.01,target=a.r+b.r+3;
  if(d>=target)return;
  const nx=d>.01?dx/d:1,ny=d>.01?dy/d:0,shift=(target-d)*.5;
  a.x-=nx*shift;a.y-=ny*shift;b.x+=nx*shift;b.y+=ny*shift;
  const approach=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
  if(approach<0){
   const impulse=-approach*.68;
   a.vx-=impulse*nx;a.vy-=impulse*ny;
   b.vx+=impulse*nx;b.vy+=impulse*ny;
  }
 };
 const tick=now=>{
  if(world!==w)return;
  const dt=Math.min(.032,(now-w.last)/1000||.016);
  w.last=now;
  if(now>w.hold){
   for(const a of w.items){
    a.vx*=.992;a.vy+=620*dt;
    a.x+=a.vx*dt;a.y+=a.vy*dt;constrain(a);
   }
   for(let pass=0;pass<4;pass++){
    for(let i=0;i<w.items.length;i++)for(let j=i+1;j<w.items.length;j++)collide(w.items[i],w.items[j]);
    for(const a of w.items)constrain(a);
   }
   w.items.forEach(place);
  }
  if(now<w.until){w.frame=requestAnimationFrame(tick)}else{w.frame=0}
 };
 const start=ms=>{
  w.until=performance.now()+ms;
  if(!w.frame){w.last=performance.now();w.frame=requestAnimationFrame(tick)}
 };
 const fit=()=>{
  if(world!==w)return;
  const width=field.clientWidth,height=field.clientHeight;
  if(!width||!height||(width===w.width&&height===w.height))return;
  w.width=width;w.height=height;
  const base=Math.max(74,Math.min(112,Math.floor(width*.253)));
  const incoming=p.incoming;
  w.items=buttons.map((el,i)=>{
   const id=Number(el.dataset.value),score=Number(el.dataset.score),r=(base+score*9)/2;
   const old=p.positions.get(id);
   const x=(i%3+.5)*width/3, y=i<3?height*.26:height*.57;
   const orb={el,id,r,x:old?.x??x,y:old?.y??y,vx:0,vy:0};
   if(id===incoming){orb.x=burst?.x??x;orb.y=r+4;orb.vx=(i%2?36:-36);orb.vy=50;}
   el.style.width=r*2+'px';el.style.height=r*2+'px';
   constrain(orb);place(orb);
   return orb;
  });
  p.incoming=null;
  start(2400);
 };
 w.resize=new ResizeObserver(fit);
 w.resize.observe(field);
 w.stir=()=>{w.items.forEach((a,i)=>{a.vx=(i%2?-1:1)*(36+i*13);a.vy=-140-i*12});start(2500)};
 field.addEventListener('pointerdown',()=>{w.hold=performance.now()+440},{passive:true});
 fit();
 if(burst){
   const ghost=document.createElement('span');
   ghost.className='pop-ring';ghost.setAttribute('aria-hidden','true');
   ghost.style.left=burst.x+'px';ghost.style.top=burst.y+'px';
   ghost.style.width=burst.r*2+'px';ghost.style.height=burst.r*2+'px';
   field.append(ghost);
   ghost.addEventListener('animationend',()=>ghost.remove(),{once:true});
 }
}
function popIdea(id,keyboard=false){
 const c=state.petal,p=pools[c],idea=catalog[c][id];
 if(!idea||!p.ids.includes(id))return;
 const orb=world?.items.find(item=>item.id===id);
 if(orb)p.burst={x:orb.x,y:orb.y,r:orb.r};
 p.ids=p.ids.filter(x=>x!==id);
 p.positions.delete(id);
 // Rank the incoming idea against the newly added phrase before drawing it.
 if(!state.entry[c].some(x=>normalized(x)===normalized(idea.name)))state.entry[c].push(idea.name);
 if(normalized(state.draft[c])===normalized(idea.name))state.draft[c]='';
 state.notice='';
 const next=nextIdea(c,[id]);
 if(next!==null){p.ids.push(next);p.incoming=next}
 live.textContent=idea.name+' added to '+categories[c][0]+'.'+(next!==null?' New idea available.':'');
 render(keyboard?(next!==null?'[data-action=pop][data-value="'+next+'"]':'#phrase'):null);
}
function refreshPool(){
 const c=state.petal,p=pools[c],previous=[...p.ids];
 p.ids=[];
 p.positions.clear();
 replenish(c,previous);
 if(!p.ids.length)replenish(c);
 render('[data-action=pop]');
}
motionPreference.addEventListener('change',event=>{still=event.matches;render()});
function editor(){
 const c=state.petal,optionsMarkup=bubbleMarkup(c);
 const list=state.entry[c].map((x,i)=>button(x,'remove','entry','close',i,'Remove '+x)).join('');
 return '<div class="editor"><div class="editor-lead"><div class="knot">Petal '+(c+1)+' of 7</div><h2 tabindex="-1" id="section-heading">'+esc(categories[c][0])+'</h2><p class="prompt">'+esc(categories[c][2])+'</p></div><div class="write-zone"><div class="part"><label class="label" for="phrase">Your own words</label><form class="entry-form" id="entry-form"><input id="phrase" name="phrase" maxlength="55" aria-describedby="entry-hint" '+(state.notice?'aria-invalid="true"':'')+' value="'+esc(state.draft[c])+'" placeholder="Add a short phrase"><button type="submit" class="control primary">Add</button></form><p id="entry-hint" class="'+(state.notice?'error':'small hint')+'">'+esc(state.notice||'Up to 55 characters. Entries stay in this session.')+'</p></div><section class="part entries"><div class="part-head"><h3>On this petal</h3>'+(filled()?button('Review Flower','review'):'')+'</div><div class="row">'+(list||'<p class="small">No entries yet.</p>')+'</div>'+(state.undo&&state.undo.c===c?'<div class="feedback row">Entry removed. '+button('Undo','undo')+'</div>':'')+'</section></div>'+optionsMarkup+'</div>';
}
function review(){
 return '<section class="review"><div class="row between"><h2 tabindex="-1" id="section-heading">Review Flower</h2>'+button('Back to editing','edit','','left')+'</div><p class="prompt">Your entries so far. You can use a partial Flower.</p>'+state.entry.map((items,i)=>items.length?'<section class="review-section"><h3>'+(i+1)+'. '+esc(categories[i][0])+'</h3><ul>'+items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></section>':'').join('')+'<div class="review-tip"><h3>Something to consider</h3><p>What’s one thing you’d check about a role you’re considering?</p></div><div class="row between"><p class="small">'+(state.draft[state.petal]?'Draft kept in '+esc(categories[state.petal][0])+'.':'')+'</p>'+button('Print Flower','print','','print')+'</div></section>';
}
function mast(){
 return '<header class="mast"><div><h1>The Parachute Flower</h1><p class="intro">Write your own phrase or pop an idea from the pool.</p></div><div class="meta"><span class="small">'+filled()+' of 7 petals have entries</span></div></header>';
}
function render(focus){
 detachWorld();
 document.body.dataset.variant='A';
 document.body.dataset.flowerStyle=flowerStyles[styleIndex][0];
 document.body.dataset.theme=palettes[themeIndex][0];
 root.innerHTML=mast()+'<div class="workspace"><aside class="sun-garden" aria-label="Flower overview">'+flower()+'<p class="flower-caption"><span class="desktop-caption">Choose any petal to explore.</span><span class="phone-caption">Petal '+(state.petal+1)+' · '+esc(categories[state.petal][0])+'</span></p></aside><section class="panel" aria-label="Flower editor"><div class="row chooser-row">'+button(state.chooser?'Close petals':'Choose petal','choose','','down')+(state.view==='edit'?button('See ideas','jump','jump-pool'):'')+'</div>'+chooser()+(state.view==='edit'?editor():review())+'</section></div>';
 dock.innerHTML='<div class="style-row"><label for="flower-style">Flower style</label><select id="flower-style">'+flowerStyles.map(([id,name],i)=>'<option value="'+i+'"'+(i===styleIndex?' selected':'')+'>'+name+'</option>').join('')+'</select><span class="style-description">'+flowerStyles[styleIndex][2]+'</span></div><div class="theme-row" aria-label="Color theme">'+palettes.map(([id,label],i)=>'<button type="button" class="theme-choice" data-palette="'+id+'" data-action="theme" data-value="'+i+'" aria-pressed="'+(i===themeIndex)+'"><span class="swatch" aria-hidden="true"></span>'+label+'</button>').join('')+'</div>';
 mountBubbleWorld();
 if(focus){
   const el=document.querySelector(focus);
   el?.focus({preventScroll:true});
   if(el&&focus==='#section-heading'){
     const garden=document.querySelector('.sun-garden');
     const sticky=getComputedStyle(garden).position==='sticky';
     const r=el.getBoundingClientRect(), top=sticky?Math.max(0,garden.getBoundingClientRect().bottom):0;
     if(r.top<top||r.bottom>innerHeight-150)el.scrollIntoView({block:'start'});
   }
 }
}
function setAppearance(focus){
 const url=new URL(location.href);
 url.searchParams.set('style',flowerStyles[styleIndex][0]);
 url.searchParams.set('theme',palettes[themeIndex][0]);
 try{history.replaceState(null,'',url)}catch{}
 render(focus);
}
document.addEventListener('change',event=>{
 if(event.target.id==='flower-style'){
  styleIndex=Number(event.target.value);
  setAppearance('#flower-style');
 }
});
function add(value){
 const text=value.trim().replace(/\s+/g,' ');
 const c=state.petal;
 if(!text||state.entry[c].some(x=>normalized(x)===normalized(text))){
  state.notice=text?'That phrase is already on this petal.':'Enter a short phrase.';
  render('#phrase');return;
 }
 state.entry[c].push(text);
 if(normalized(state.draft[c])===normalized(text))state.draft[c]='';
 state.notice='';
 live.textContent=text+' added to '+categories[c][0]+'.';
 render('#phrase');
}
function activate(action,value,keyboard=false){
 const c=state.petal;
 switch(action){
 case 'theme':themeIndex=value;setAppearance('#switcher [aria-pressed=true]');return;
 case 'petal':
   state.petal=value;
   state.chooser=false;state.view='edit';state.notice='';
   render('#section-heading');return;
 case 'choose':state.chooser=!state.chooser;render(state.chooser?'.chooser [aria-pressed=true]':'[data-action=choose]');return;
 case 'review':state.view='review';state.chooser=false;render('#section-heading');return;
 case 'edit':state.view='edit';render('#phrase');return;
 case 'more':refreshPool();return;
 case 'jump':{const pool=document.querySelector('#idea-pool');pool?.focus({preventScroll:true});pool?.scrollIntoView({block:'start'});return;}
 case 'stir':world?.stir();return;
 case 'motion':still=!still;render('[data-action=motion]');return;
 case 'pop':popIdea(value,keyboard);return;
 case 'remove':state.undo={c,index:value,text:state.entry[c].splice(value,1)[0]};render('[data-action=undo]');return;
 case 'undo':if(state.undo){const item=state.undo;state.entry[item.c].splice(item.index,0,item.text);state.undo=null;render('[data-action=remove][data-value="'+item.index+'"]')}return;
 case 'print':printSnapshot();window.print();return;
 }
}
document.addEventListener('click',event=>{
 const target=event.target.closest('[data-action]');
 if(target)activate(target.dataset.action,Number(target.dataset.value),event.detail===0);
});
document.addEventListener('submit',event=>{if(event.target.id==='entry-form'){event.preventDefault();add(state.draft[state.petal])}});
document.addEventListener('input',event=>{if(event.target.id==='phrase')state.draft[state.petal]=event.target.value});
document.addEventListener('keydown',event=>{
 const target=event.target.closest('[role=button][data-action=petal]');
 if(target&&(event.key==='Enter'||event.key===' ')){event.preventDefault();activate('petal',Number(target.dataset.value));return;}
});
function printSnapshot(){
 document.querySelector('#print-count').textContent=filled()+' of 7 petals have entries';
 const groups=categories.map(([name],i)=>'<section class="print-petal"><h2>'+(i+1)+'. '+esc(name)+'</h2>'+(state.entry[i].length?'<ul>'+state.entry[i].slice(0,5).map(text=>'<li>'+esc(text)+'</li>').join('')+'</ul>'+(state.entry[i].length>5?'<p>More entries in Review.</p>':''):'<p>No entries yet.</p>')+'</section>');
 document.querySelector('#print-cols').innerHTML='<div>'+groups.slice(0,4).join('')+'</div><div>'+groups.slice(4).join('')+'</div>';
}
window.addEventListener('beforeprint',printSnapshot);
render();
