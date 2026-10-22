import test from "node:test";
import assert from "node:assert/strict";
import {advise,eligible,choose,type Answers,type Offer} from "../lib/decision";
const q:Answers={goal:"walking",space:"compact",noise:"critical",activity:"walk",budget:500,fold:true};
test("walking apartment routes to walking pad with noise caveat",()=>{const x=advise(q);assert.equal(x.category,"walking-pad");assert.match(x.caution,/αθόρυβα/);});
test("running routes separately",()=>assert.equal(advise({...q,activity:"run"}).category,"treadmill"));
test("strength routes separately",()=>assert.equal(advise({...q,goal:"strength"}).category,"adjustable-dumbbells"));
const offer:Offer={id:"x1",title:"verified",category:"walking-pad",price:350,currency:"EUR",merchant:"Shop",trackingUrl:"https://affiliate.linkwi.se/test",inStock:true,lastSeen:"2026-10-21T08:00:00.000Z",verifiedCommissionEur:21,commissionEvidence:true,specsVerified:true};
const now=new Date("2026-10-21T12:00:00.000Z").getTime();
test("unverified commission is rejected",()=>assert.equal(eligible({...offer,commissionEvidence:false},500,7,now).reason,"pending_commission"));
test("20 EUR or below is not eligible",()=>assert.equal(eligible({...offer,verifiedCommissionEur:9.99},500,7,now).reason,"commission_not_above_20"));
test("expired stock and budget limits rejected",()=>{assert.equal(eligible({...offer,inStock:false},500,7,now).ok,false);assert.equal(eligible(offer,300,7,now).ok,false);});
test("stale price rejected",()=>assert.equal(eligible({...offer,lastSeen:"2026-10-01T00:00:00Z"},500,7,now).reason,"stale_offer"));
test("zero eligible offers never fabricate results",()=>assert.deepEqual(choose([{...offer,commissionEvidence:false}],q,"walking-pad",now),[]));
test("verified offer eligibility passes",()=>assert.equal(eligible(offer,500,7,now).ok,true));

test("exactly 20 EUR is ineligible, 20.01 EUR is eligible",()=>{assert.equal(eligible({...offer,verifiedCommissionEur:20},500,7,now).ok,false);assert.equal(eligible({...offer,verifiedCommissionEur:20.01},500,7,now).ok,true);});
