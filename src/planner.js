export const DAY=86400000;
export const dayKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const modules={grammar:{name:'Gramatyka w praktyce',sub:'Zrozum konstrukcję. Użyj jej w zdaniu.',icon:'Aa',color:'purple',min:5,max:20},listening:{name:'Listen & discover',sub:'Autentyczna rozmowa i Twoje wnioski.',icon:'◉',color:'blue',min:5,max:20},speaking:{name:'Czas na rozmowę',sub:'Jeden temat. Kilka własnych zdań.',icon:'↗',color:'orange',min:5,max:15},writing:{name:'Twój angielski dziennik',sub:'Przenieś myśli na papier.',icon:'✎',color:'rose',min:5,max:15},busuu:{name:'Lekcja Busuu Premium',sub:'Kontynuuj swój kurs.',icon:'b',color:'blue',min:5,max:25},oxford:{name:'Słówka Oxford 3000',sub:'Oryginalne fiszki, pisanie i powtórki.',icon:'▤',color:'mint',min:5,max:20}};
export function plan(minutes,events=[],now=Date.now()){
 const today=dayKey(new Date(now)),done=events.filter(e=>e.day===today&&e.type==='complete');
 const completed=[...new Set(done.map(e=>e.module))].map(id=>({...modules[id],id,minutes:done.filter(e=>e.module===id).reduce((s,e)=>s+e.minutes,0),done:true})).filter(e=>e.name);
 let left=Math.max(0,minutes-completed.reduce((s,e)=>s+e.minutes,0));
 const pool=Object.entries(modules).filter(([id])=>!completed.some(e=>e.id===id)).map(([id,m],index)=>{const last=events.filter(e=>e.module===id&&e.type==='complete').sort((a,b)=>b.at-a.at)[0];const gap=last?Math.min(14,(now-last.at)/DAY):7;const weak=id==='grammar'?events.filter(e=>e.module===id&&e.score<1).length:0;return {...m,id,weight:gap*4+weak*3+(6-index),why:last?'Warto wrócić do tej umiejętności.':'Zacznij budować regularną praktykę.'};}).sort((a,b)=>b.weight-a.weight);
 const count=minutes<=10?1:minutes<=20?2:minutes<=45?3:minutes<=90?5:6;
 if(minutes>115)for(const item of pool)item.max=Math.ceil(item.max*minutes/115);
 const out=[];
 for(const item of pool){if(out.length>=count||left<item.min)break;const n=Math.min(item.max,Math.max(item.min,Math.floor(left/(count-out.length))));out.push({...item,minutes:n});left-=n;}
 while(left>0&&out.some(e=>e.minutes<e.max)){for(const e of out){if(left&&e.minutes<e.max){e.minutes++;left--;}}}
 return [...completed,...out];
}
export function streak(events,now=new Date()) {const days=new Set(events.filter(e=>e.type==='complete').map(e=>e.day));let d=new Date(now),n=0;if(!days.has(dayKey(d)))d.setDate(d.getDate()-1);while(days.has(dayKey(d))){n++;d.setDate(d.getDate()-1);}return n;}
export function mergeEvents(a,b){return [...new Map([...a,...b].map(e=>[e.id,e])).values()].sort((x,y)=>x.at-y.at);}
