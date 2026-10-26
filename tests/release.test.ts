import test from "node:test";
import assert from "node:assert/strict";
import {canonicalOrigin,publicLaunchEnabled} from "../lib/release";

test("staging remains closed to indexing by default",()=>{
  assert.equal(publicLaunchEnabled({}),false);
  assert.equal(publicLaunchEnabled({FITMATCH_PUBLIC_ORIGIN:"https://fitmatch.example"}),false);
});
test("launch needs explicit approval flag and canonical secure URL",()=>{
  assert.equal(publicLaunchEnabled({FITMATCH_PUBLIC_LAUNCH:"true"}),false);
  assert.equal(publicLaunchEnabled({FITMATCH_PUBLIC_LAUNCH:"true",FITMATCH_PUBLIC_ORIGIN:"https://fitmatch.example"}),true);
});
test("reject unsafe public origins",()=>{
  for(const url of ["http://fitmatch.example","https://fitmatch.example/path","https://fitmatch.example?x=1","https://user:pass@fitmatch.example","https://localhost","https://fitmatch.example:444"])
    assert.equal(canonicalOrigin({FITMATCH_PUBLIC_ORIGIN:url}),null);
});
