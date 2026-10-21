import test from "node:test";
import assert from "node:assert/strict";
import {visibleScreens} from "../lib/flow";
test("strength requires four relevant screens",()=>assert.deepEqual(visibleScreens("strength"),[0,1,4,5]));
test("running/cardio route includes usage and noise",()=>assert.deepEqual(visibleScreens("cardio"),[0,1,2,3,4,5]));
test("all routes have valid four-to-seven length",()=>{for(const g of ["walking","cardio","strength","mixed"] as const){assert.ok(visibleScreens(g).length>=4&&visibleScreens(g).length<=7);}});
