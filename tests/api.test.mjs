import test from 'node:test';
import assert from 'node:assert/strict';
import {POST} from '../app/api/diagnose/route.ts';
const req=q=>new Request('http://localhost/api/diagnose',{method:'POST',body:JSON.stringify({question:q})});
test('API主链路及模型失败：不联网的可复现集成测试',async()=>{
 const key=process.env.OPENAI_API_KEY,model=process.env.OPENAI_MODEL,realFetch=globalThis.fetch;
 try{
  delete process.env.OPENAI_API_KEY;delete process.env.OPENAI_MODEL;
  let r=await POST(req('现金流变化'));let b=await r.json();assert.equal(r.status,200);assert.equal(b.mode,'verified-snapshot');assert.match(b.modelStatus,/未配置/);
  assert.equal((await POST(req('a'.repeat(601)))).status,400);
  assert.equal((await POST(new Request('http://localhost/api/diagnose',{method:'POST',body:'{' }))).status,400);
  assert.equal((await POST(new Request('http://localhost/api/diagnose',{method:'POST',headers:{'content-length':'6000'},body:'{}'}))).status,413);
  process.env.OPENAI_API_KEY='fixture-only';process.env.OPENAI_MODEL='fixture-model';
  globalThis.fetch=async()=>{throw Error('upstream offline')};b=await(await POST(req('现金流变化'))).json();assert.equal(b.mode,'fallback');assert.match(b.modelStatus,/失败/);
  globalThis.fetch=async()=>Response.json({output:[{content:[{type:'output_text',text:'{"claimIds":["E99"]}'}]}]});b=await(await POST(req('现金流变化'))).json();assert.equal(b.mode,'fallback');
  globalThis.fetch=async()=>Response.json({output:[{content:[{type:'output_text',text:'{"claimIds":["E03","E02"]}'}]}]});b=await(await POST(req('现金流变化'))).json();assert.equal(b.mode,'live-llm');assert.deepEqual(b.claims,['E03','E02']);
  globalThis.fetch=async()=>{throw Error('should not call model')};b=await(await POST(req('能买入吗？'))).json();assert.equal(b.mode,'boundary');
 }finally{globalThis.fetch=realFetch;if(key===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=key;if(model===undefined)delete process.env.OPENAI_MODEL;else process.env.OPENAI_MODEL=model;}
});
