import test from "node:test";
import assert from "node:assert/strict";
import {streamCsvObjects} from "../lib/linkwise-csv";
import {normalizeLinkwise,validateFeedUrl} from "../lib/linkwise-feed";

const bytes=(text:string,span=5):ReadableStream<Uint8Array>=>{
 const all=new TextEncoder().encode(text);
 let pos=0;
 return new ReadableStream({
   pull(controller){
     if(pos>=all.length){controller.close();return;}
     controller.enqueue(all.slice(pos,pos+span));pos+=span;
   }
 });
};
async function all(csv:string,span=3){
 const rows:Record<string,string>[]=[];
 for await(const row of streamCsvObjects(bytes(csv,span)))rows.push(row);
 return rows;
}
test("Linkwise CD104 CSV URL is whitelisted and supports json too",()=>{
 const csv="https://affiliate.linkwi.se/feeds/1.2/CD104/programs-all/columns-product_id,model_name,product_name/catinc-3/catex-0/proginc-0/progex-0/feed.csv";
 assert.equal(validateFeedUrl(csv).pathname.endsWith("feed.csv"),true);
 assert.equal(validateFeedUrl(csv.replace("feed.csv","feed.json")).pathname.endsWith("feed.json"),true);
 assert.throws(()=>validateFeedUrl("https://evil.example/feeds/1.2/CD104/feed.csv"));
 assert.throws(()=>validateFeedUrl(csv.replace("CD104","CD105")));
});
test("CSV parses exact feed header with extra_images in its actual reordered position",async()=>{
 const columns=["product_id","model_name","product_name","description","category","brand_name","tracking_url","thumb_url","image_url","extra_images","in_stock","availability","valid_from","valid_to","on_sale","currency","price","full_price","discount","city","times_bought","longitude","latitude","address","size","colour","custom"];
 const first=[
  "152086793","","ΟΛΟΣΩΜΗ ΦΟΡΜΑ MAYORAL 7825 ΜΑΥΡΟ (140 CM)(10 ΕΤΩΝ)",
  "Ολόσωμη βελούδινη φόρμα, με \nπεριγραφή \"quoted\"",
  "Παιδικά ρούχα","Mayoral","https://go.linkwi.se/t","https://img.example/t","https://img.example/i",
  "","","","","","","EUR","38.99","","","","","","","","","",""
 ];
 const second=[...first];second[0]="gym-2";second[2]="HMS rowing machine";second[4]="Αθλήματα > Κωπηλατικά";second[16]="699.90";
 const serialize=(row:string[])=>row.map(x=>/[",\n\r]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x).join(",");
 const csv="\uFEFF"+columns.join(",")+"\r\n"+serialize(first)+"\r\n"+serialize(second)+"\r\n";
 const rows=await all(csv,1);
 assert.equal(rows.length,2);
 assert.equal(rows[0].description,first[3]);
 assert.equal(rows[0].extra_images,"");
 assert.equal(rows[0].product_name,first[2]);
 assert.equal(rows[1].product_id,"gym-2");
 const normalized=normalizeLinkwise(rows[1],"2026-10-29T12:00:00Z");
 assert.ok(normalized);
 assert.equal(normalized.category,"rowing-machine");
 assert.equal(normalized.priceEur,699.9);
});
test("CSV rejects truncated quotes, invalid headers, and oversized fields",async()=>{
 await assert.rejects(()=>all("product_id,product_name,price,category\n1,\"broken",2),/truncated_quote/);
 await assert.rejects(()=>all("product_id,price,category\n1,5,test"),/missing_required_header/);
 await assert.rejects(async()=>{for await(const _ of streamCsvObjects(bytes('product_id,product_name,price,category\n1,"hugefield",5,fitness'),3),5){}},/field_too_large/);
});
test("CSV preserves commas and HTML-safe product names and does not create irrelevant fitness products",async()=>{
 const csv='product_id,product_name,description,category,price,currency,in_stock\n1,"Kids shirt, blue","Cotton, 100%","Sports clothing",18.20,EUR,1\n2,"Kettlebell 12kg","Gym, iron","Sports",49.50,EUR,1';
 const rows=await all(csv,2);
 assert.equal(rows.length,2);
 assert.equal(normalizeLinkwise(rows[0],"2026-10-29T12:00:00Z"),null);
 assert.equal(normalizeLinkwise(rows[1],"2026-10-29T12:00:00Z")?.category,"kettlebells");
});
