export type Rule={programId:string;categoryCode:string;approved:boolean;marketingAllowed:boolean;evidenceUrl:string;verifiedAt:string;effectiveUntil?:string;payoutKind:"percent"|"flat";minPercent?:number|null;flatEur?:number|null;capEur?:number|null;base:"gross"|"net_ex_vat";vatPercent?:number|null;excludedProductIds?:string[]};
export type Subject={programId:string;categoryCode:string;productId:string;priceEur:number;now?:number};
export type Assessment={status:"ELIGIBLE"|"INELIGIBLE"|"UNVERIFIED";minPayoutEur:number|null;reason:string};
const unknown=(reason:string):Assessment=>({status:"UNVERIFIED",minPayoutEur:null,reason});
export function assessPayout(r:Rule|null|undefined,o:Subject):Assessment{
 if(!r)return unknown("missing_terms");
 if(!r.approved||!r.marketingAllowed)return {status:"INELIGIBLE",minPayoutEur:null,reason:"merchant_or_channel_blocked"};
 if(r.programId!==o.programId||r.categoryCode!==o.categoryCode)return unknown("category_rule_mismatch");
 const now=o.now??Date.now();
 if(!r.evidenceUrl.startsWith("https://")||!Number.isFinite(Date.parse(r.verifiedAt))||Date.parse(r.verifiedAt)>now||r.effectiveUntil&&(!Number.isFinite(Date.parse(r.effectiveUntil))||Date.parse(r.effectiveUntil)<now))return unknown("terms_not_verified");
 if(r.excludedProductIds?.includes(o.productId))return {status:"INELIGIBLE",minPayoutEur:null,reason:"excluded_product"};
 if(!Number.isFinite(o.priceEur)||o.priceEur<=0)return unknown("price_invalid");
 let amount=o.priceEur;
 if(r.base==="net_ex_vat"){if(typeof r.vatPercent!=="number"||!Number.isFinite(r.vatPercent)||r.vatPercent<0||r.vatPercent>40)return unknown("vat_basis_unknown");amount/=1+r.vatPercent/100;}
 else if(r.base!=="gross")return unknown("basis_unknown");
 let payout:number;
 if(r.payoutKind==="percent"){if(typeof r.minPercent!=="number"||!Number.isFinite(r.minPercent)||r.minPercent<=0||r.minPercent>100)return unknown("rate_unverified");payout=amount*r.minPercent/100;}
 else if(r.payoutKind==="flat"){if(typeof r.flatEur!=="number"||!Number.isFinite(r.flatEur)||r.flatEur<=0)return unknown("flat_unverified");payout=r.flatEur;}
 else return unknown("payout_kind_unknown");
 if(r.capEur!==undefined&&r.capEur!==null){if(!Number.isFinite(r.capEur)||r.capEur<0)return unknown("invalid_cap");payout=Math.min(payout,r.capEur);}
 payout=Math.floor((payout+Number.EPSILON)*100)/100;
 return {status:payout>=10?"ELIGIBLE":"INELIGIBLE",minPayoutEur:payout,reason:payout>=10?"verified_minimum":"commission_under_10"};
}
