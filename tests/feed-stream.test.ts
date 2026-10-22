import test from "node:test";import assert from "node:assert/strict";import {JsonArrayObjectScanner,gymProduct} from "../lib/feed-stream";
test("stream parser respects nested objects, quoted braces and broken chunk boundaries",()=>{
 const data='[{"product_id":"x","product_name":"Walking pad {new}","custom":{"a":"a\\\\\\"{test}"}},{"product_id":"y","product_name":"Dumbbells","variations":[{"colour":"red"}]}]';
 const values:Record<string,unknown>[]=[];const p=new JsonArrayObjectScanner();
 for(let i=0;i<data.length;i+=7)p.parseChunk(data.slice(i,i+7),x=>values.push(x));
 assert.equal(values.length,2);assert.equal(values[1].product_name,"Dumbbells");
});
test("fitness taxonomy avoids arbitrary fashion sports keyword",()=>{
 assert.equal(gymProduct("Walking Pad 2in1","Fitness"),true);
 assert.equal(gymProduct("Διάδρομος για σπίτι","Γυμναστική"),true);
 assert.equal(gymProduct("Running shoes","Women's Fashion"),false);
 assert.equal(gymProduct("Padel racket","sports"),false);
});

test("Greek route service is never misclassified as fitness treadmill",()=>{
 assert.equal(gymProduct("ΥΠΗΡΕΣΙΑ ΕΓΚΑΤΑΣΤΑΣΗΣ ΘΕΡΜΟΣΙΦΩΝΑ ΔΙΑΔΡΟΜΗ","Υπηρεσίες"),false);
 assert.equal(gymProduct("Ηλεκτρικός Διάδρομος Γυμναστικής","Αθλητικά"),true);
});
