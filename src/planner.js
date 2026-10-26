export const DAY=86400000;
export const dayKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const modules={oxford:{name:'Powtórki i słówka',sub:'Najpierw przypomnij, potem dodaj nowe.',icon:'▤',color:'mint',min:2,max:35},busuu:{name:'Twoja lekcja Busuu',sub:'Kontynuuj kurs, który już masz.',icon:'b',color:'blue',min:3,max:45},listening:{name:'BBC Listening Lab',sub:'Usłysz sens. Opowiedz własnymi słowami.',icon:'◉',color:'blue',min:5,max:35},speaking:{name:'Porozmawiaj po angielsku',sub:'Krótka rozmowa z Twoim nauczycielem.',icon:'↗',color:'orange',min:3,max:30},grammar:{name:'Gramatyka w praktyce',sub:'Jedna konstrukcja. Twoje własne zdania.',icon:'Aa',color:'purple',min:5,max:35},writing:{name:'Pisanie i reading',sub:'Napisz o czymś, co jest dla Ciebie ważne.',icon:'✎',color:'rose',min:4,max:30}};
export function plan(minutes,events=[],now=Date.now(),options={}){
 minutes=Math.max(5,Math.min(180,Math.round(Number(minutes)||20)));
 const today=dayKey(new Date(now)),done=events.filter(e=>e.day===today&&e.type==='complete');
 const completed=[...new Set(done.map(e=>e.module))].map(id=>({...modules[id],id,minutes:done.filter(e=>e.module===id).reduce((s,e)=>s+e.minutes,0),done:true})).filter(e=>e.name);
 let left=Math.max(0,minutes-completed.reduce((s,e)=>s+e.minutes,0));
 const excluded=new Set(options.excluded||[]),out=[];
 const available=id=>!excluded.has(id)&&!completed.some(e=>e.id===id)&&!out.some(e=>e.id===id);
 const add=(id,n,why)=>{if(!available(id)||left<=0)return;n=Math.min(left,Math.max(1,Math.round(n)));out.push({...modules[id],id,minutes:n,why});left-=n;};
 if(minutes<=10){const words=available('oxford'),busuu=available('busuu');if(words&&busuu&&left>=5){add('oxford',Math.max(2,Math.round(left*.4)),'Twój priorytet na krótki dzień: aktywne przypomnienie słów.');add('busuu',left,'Powtórka lub fragment lekcji. Nie musisz kończyć rozdziału.');}else if(words)add('oxford',left,'Chwila na utrwalenie słów.');else if(busuu)add('busuu',left,'Słówka masz już zrobione. Wróć do Busuu.');return [...completed,...out];}
 const initial=left;
 add('oxford',Math.min(15,Math.max(3,Math.round(initial*.2))),'Twój stały fundament: najpierw zaległe powtórki, potem nowe słowa.');
 add('busuu',Math.min(30,Math.max(5,Math.round(initial*.3))),'Kontynuuj wykupiony kurs, bez dublowania jego lekcji.');
 const pool=['listening','speaking','grammar','writing'].filter(available).map((id,i)=>{const relevant=events.filter(e=>e.module===id),last=relevant.filter(e=>e.type==='complete').at(-1);const gap=last?Math.min(14,Math.max(0,(now-last.at)/DAY)):7;const weak=id==='grammar'?relevant.slice(-8).filter(e=>e.score<1).length:0;const due=id==='grammar'&&relevant.some(e=>e.reviewAt&&e.reviewAt<=now)?8:0;return {...modules[id],id,priority:gap*3+weak*5+due+(4-i),why:weak?'W ostatnich ćwiczeniach były błędy. Wróć do wyjaśnienia.':last?'Ostatnia praktyka: '+last.day+'. Warto wrócić do tej umiejętności.':'Uzupełnij słówka i kurs o używanie języka w praktyce.'};}).sort((a,b)=>b.priority-a.priority);
 const count=minutes<=25?1:minutes<=45?2:minutes<=90?3:4;
 let added=0;for(const item of pool){if(added>=count||left<item.min)break;const slots=Math.min(count,pool.length)-added;add(item.id,Math.min(item.max,Math.max(item.min,Math.floor(left/slots))),item.why);added++;}
 for(let i=0;left>0&&out.some(e=>e.minutes<e.max);i++){const item=out[i%out.length];if(item.minutes<item.max){item.minutes++;left--;}}
 return [...completed,...out];
}
export function streak(events,now=new Date()) {const days=new Set(events.filter(e=>e.type==='complete').map(e=>e.day));let d=new Date(now),n=0;if(!days.has(dayKey(d)))d.setDate(d.getDate()-1);while(days.has(dayKey(d))){n++;d.setDate(d.getDate()-1);}return n;}
export function mergeEvents(a,b){return [...new Map([...a,...b].map(e=>[e.id,e])).values()].sort((x,y)=>x.at-y.at);}
export function effectiveEvents(events){const cancelled=new Set(events.filter(e=>e.type==='undo').flatMap(e=>e.targets||[]));return events.filter(e=>e.type!=='undo'&&!cancelled.has(e.id));}
export function oxfordStats(snapshot){const p=Object.values(snapshot?.p||{});return {known:p.filter(p=>p.s===2).length,learning:p.filter(p=>p.s===1).length,due:p.filter(p=>p.h||(p.s===2&&p.due&&p.due<=Date.now())).length,answers:snapshot?.tot?.a||0};}
