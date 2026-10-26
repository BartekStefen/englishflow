import {dayKey,mergeEvents} from './planner.js';
let db;
export const state={events:[],prefs:{minutes:20,theme:'light',level:'A2',name:'Bartek',goal:120},drafts:{},favorites:[],cloud:{}};
export async function init(){db=await new Promise((resolve,reject)=>{const r=indexedDB.open('englishflow-independent-v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('state');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});const saved=await new Promise((resolve,reject)=>{const r=db.transaction('state').objectStore('state').get('main');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});if(saved)Object.assign(state,saved);}
export async function save(){await new Promise((resolve,reject)=>{const tx=db.transaction('state','readwrite');tx.objectStore('state').put(structuredClone(state),'main');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
export async function complete(module,minutes,detail={}){const e={id:crypto.randomUUID(),at:Date.now(),day:dayKey(),type:'complete',module,minutes,...detail};state.events=mergeEvents(state.events,[e]);await save();return e;}
export function validateImport(x){if(!x||x.version!==1||!Array.isArray(x.events)||x.events.length>100000)throw Error('Nieprawidłowy format kopii.');for(const e of x.events){if(!e||typeof e.id!=='string'||!['grammar','listening','speaking','writing','busuu','oxford'].includes(e.module)||!Number.isFinite(e.at)||!Number.isFinite(e.minutes)||e.minutes<0||e.minutes>600||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(e.day))throw Error('Nieprawidłowe dane sesji.');}return x;}
export function backup(){return {version:1,created:new Date().toISOString(),...state,cloud:{}};}
export async function importBackup(x){validateImport(x);state.events=mergeEvents(state.events,x.events);await save();}
