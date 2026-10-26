import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const lessons=JSON.parse(fs.readFileSync(new URL('../src/grammar.json',import.meta.url)));
const materials=JSON.parse(fs.readFileSync(new URL('../src/materials.json',import.meta.url)));
test('preserves all twelve weeks, original resources and newly supplied HTML links',()=>{const original=materials.filter(m=>m.source!=='legacy-html');assert.equal(materials.length,102);assert.equal(original.length,79);for(let week=1;week<=12;week++)assert.equal(original.filter(m=>m.week===week).length,5);assert.equal(original.filter(m=>m.week===0).length,19);assert.equal(new Set(materials.map(m=>m.id)).size,materials.length);for(const m of materials)assert.equal(new URL(m.uri).protocol,'https:');});
test('every lesson has valid answer keys, examples and communication practice',()=>{assert.equal(lessons.length,27);assert.equal(new Set(lessons.map(g=>g.id)).size,27);for(const g of lessons){assert.ok(g.use.length&&g.form.length&&g.ex.length>=2&&g.prompt&&g.mist);for(const [q,opts,answer,why]of g.q){assert.ok(q.includes('___'));assert.ok(Number.isInteger(answer)&&answer>=0&&answer<opts.length);assert.ok(why.length>5);}}});
