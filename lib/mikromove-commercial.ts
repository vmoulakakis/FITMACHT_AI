/**
 * Commercial screening, NOT merchant authorization.
 * Historical 8% rate recorded 2026-09-17 for Mybrand.shoes in SocialMarket AI;
 * approval, category exclusions, commission basis and program id unverified.
 * Model uses 24% VAT exclusion + 15% safety reserve as scenario assumptions.
 * It is not a claim of actual payout nor tax advice.
 */
export const rateScenario={merchant:"Mybrand.shoes",archivedPercent:8,assumedVatPercent:24,reservePercent:15,targetNetEur:10,importedAt:"2026-09-17"} as const;
export function commissionScenario(grossPriceEur:number,rate=rateScenario.archivedPercent){
 if(!Number.isFinite(grossPriceEur)||grossPriceEur<=0||!Number.isFinite(rate)||rate<=0)return null;
 const indicative=grossPriceEur/(1+rateScenario.assumedVatPercent/100)*(rate/100)*(1-rateScenario.reservePercent/100);
 return Math.floor(indicative*100)/100;
}
export const historicalMybrandAllowlist=[
 "SFIT-P-HH30010","17-01-023","17-53-400","17-01-008","17-53-302",
 "17-66-132","17-01-009","SFIT-P-HH30001","17-66-131","C1660V2"
] as const;
export type ScreenedCandidate={
 id:string;title:string;priceEur:number;imageUrl:string|null;source:"historical_feed"|"merchant_public_page";
 sourceDate:string;category:string;merchant:string;review:"program_pending";sourcePage:string;
 };
/** Publicly observed product rows, never connected to approved affiliate tracking. */
export const extraMerchantResearch:ScreenedCandidate[]=[
 {id:"hms-17-22-302",title:"HMS ZM1502 magnetic rowing machine",priceEur:286.07,category:"rowing-machine"},
 {id:"hms-17-02-001",title:"HMS PREMIUM M1844i electromagnetic bicycle",priceEur:843.73,category:"exercise-bike"},
 {id:"hms-17-13-001",title:"HMS Premium H1833i electromagnetic elliptical cross trainer",priceEur:1068.79,category:"elliptical"},
 {id:"hms-17-12-015",title:"HMS Premium H1742 magnetic elliptical cross trainer",priceEur:1406.40,category:"elliptical"},
 {id:"hms-17-08-001",title:"HMS R1817 horizontal exercise bike",priceEur:1068.78,category:"exercise-bike"},
 {id:"hms-17-60-010",title:"HMS BLACK GO700 Olympic bar",priceEur:284.94,category:"strength-equipment"}
].map(v=>({...v,imageUrl:null,source:"merchant_public_page" as const,sourceDate:"2026-10-29",merchant:"Mybrand.shoes",review:"program_pending" as const,sourcePage:"https://mybrand.shoes/el/446_hms"}));
export function screenCandidate(item:ScreenedCandidate){
 const indicative=commissionScenario(item.priceEur);
 return {...item,indicativeEur:indicative,passesIndicativeFloor:indicative!==null&&indicative>=10,approved:false as const,purchasable:false as const};
}
