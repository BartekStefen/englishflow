import test from 'node:test';
import assert from 'node:assert/strict';
import {tenseSentence} from '../src/grammar-notes.js';
import {personTables} from '../src/person-tables.js';
const text=(k,p,m)=>tenseSentence(k,p,m).map(([,w])=>w).join(' ');
test('all-person tables distinguish third-person endings and remove them after does',()=>{
for(const p of ['I','you','he','she','it','we','they']){const third=['he','she','it'].includes(p);assert.equal(tenseSentence('simple',p,'positive').find(([t])=>t==='verb')[1],third?'works':'work');assert.equal(tenseSentence('simple',p,'question')[0][1],third?'Does':'Do');assert.equal(tenseSentence('simple',p,'negative').find(([t])=>t==='verb')[1],'work');}
assert.equal(text('continuous','I','question'),'Am I working right now?');assert.equal(text('perfect','she','question'),'Has she worked here before?');assert.equal(text('pastContinuous','they','positive'),'They were working at eight yesterday.');
const html=personTables('simple',tenseSentence);assert.ok(html.includes('study → studies'));assert.ok(html.includes('Are you ready?'));assert.ok(html.includes('Yes, I do.'));
});
