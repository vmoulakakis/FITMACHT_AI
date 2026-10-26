import test from "node:test";
import assert from "node:assert/strict";
import {approvedTrackingHosts,validatedTrackingUrl} from "../lib/tracking";

const hosts=approvedTrackingHosts(" affiliate.linkwi.se,LINKWI.SE ");
test("exact approved HTTPS affiliate URL passes",()=>{
  assert.equal(validatedTrackingUrl("https://affiliate.linkwi.se/click?id=123",hosts)?.hostname,"affiliate.linkwi.se");
});
test("missing host configuration fails closed",()=>{
  assert.equal(validatedTrackingUrl("https://affiliate.linkwi.se/click",approvedTrackingHosts(undefined)),null);
});
test("unapproved domains and lookalikes are rejected",()=>{
  for(const url of ["https://affiliate.linkwi.se.evil.com/click","https://evil.com/","https://sub.affiliate.linkwi.se/"])
    assert.equal(validatedTrackingUrl(url,hosts),null);
});
test("HTTP, ports, credentials and malformed links are rejected",()=>{
  for(const url of ["http://affiliate.linkwi.se/","https://user:pass@affiliate.linkwi.se/","https://affiliate.linkwi.se:8443/click","not-a-link"])
    assert.equal(validatedTrackingUrl(url,hosts),null);
});
