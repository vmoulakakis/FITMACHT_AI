import test from "node:test";import assert from "node:assert/strict";
import {parseFeedEur,normalizeAvailability} from "../lib/feed-normalize";
test("prices parse EU and UK feeds conservatively",()=>{
 assert.equal(parseFeedEur("149,90 €"),149.9);
 assert.equal(parseFeedEur("1.299,90"),1299.9);
 assert.equal(parseFeedEur("1,299.90"),1299.9);
 assert.equal(parseFeedEur("€249.00"),249);
 assert.equal(parseFeedEur(199.8),199.8);
 assert.equal(parseFeedEur("free"),null);
 assert.equal(parseFeedEur("-10"),null);
});
test("stock codes from actual Linkwise feed are differentiated",()=>{
 assert.equal(normalizeAvailability("y"),"in_stock");
 assert.equal(normalizeAvailability("in stock"),"in_stock");
 assert.equal(normalizeAvailability("παράδοση σε 24 ώρες"),"unknown");
 assert.equal(normalizeAvailability("n"),"out_of_stock");
 assert.equal(normalizeAvailability(null),"unknown");
});
