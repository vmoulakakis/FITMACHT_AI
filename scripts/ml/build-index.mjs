// Optional OFFLINE Hugging Face embedding indexer.
// Does not execute in Vercel or make product/commission decisions.
import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {pipeline} from "@huggingface/transformers";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const records=JSON.parse(await fs.readFile(path.join(root,"data/knowledge_policy.json"),"utf8"));
if(!Array.isArray(records)||records.some(x=>!x.id||!x.text||!x.source_url||x.source_type!=="editorial_policy"))throw new Error("invalid_policy_corpus");
const modelId="intfloat/multilingual-e5-small";
const embedder=await pipeline("feature-extraction",modelId,{device:"cpu",dtype:"q8"});
const vectors=[];
try{
 for(const record of records){
  const result=await embedder("passage: "+record.text,{pooling:"mean",normalize:true});
  const embedding=Array.from(result.data);
  if(!embedding.length||!embedding.every(Number.isFinite))throw new Error("invalid_embedding");
  vectors.push({...record,embedding});
  process.stdout.write(record.id+" indexed\n");
 }
}finally{await embedder.dispose();}
const output={model:modelId,mode:"offline_evidence_only",generatedAt:new Date().toISOString(),vectors};
await fs.writeFile(path.join(root,"data/evidence_index.generated.json"),JSON.stringify(output),{mode:0o600});
console.log("Evidence index created locally. Benchmarks and approval are required before live RAG.");
