import test from "node:test";import assert from "node:assert/strict";import {csvRows,normalizeHeader} from "../lib/csv";
async function collect(parts:string[],sep=","){const result:string[][]=[];async function* stream(){for(const p of parts)yield p;}for await(const row of csvRows(stream(),sep))result.push(row);return result;}
test("BOM + chunk boundary + comma quotes",async()=>assert.deepEqual(await collect(["\uFEFFid,na","me\r\n1,\"Two, ","fields\"\r\n2,B\n"]),[["id","name"],["1","Two, fields"],["2","B"]]));
test("escaped quotes + newline",async()=>assert.deepEqual(await collect(['id,description\n1,"I said ""go','""\nagain"\n']),[["id","description"],["1",'I said "go"\nagain']]));
test("semicolon delimiter",async()=>assert.deepEqual(await collect(["id;price\nx;12,30\n"],";"),[["id","price"],["x","12,30"]]));
test("unclosed quote",async()=>await assert.rejects(collect(['x,"oops']),/unclosed_quote/));
test("header normalization",()=>assert.deepEqual(normalizeHeader([" Product ID ","price eur"]),["product_id","price_eur"]));
