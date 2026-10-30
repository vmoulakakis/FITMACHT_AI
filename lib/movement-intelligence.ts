export type Need = "desk"|"motivation"|"confidence"|"pain"|"rehab"|"independence"|"care"|"fitness";
export type Barrier = "time"|"energy"|"body"|"confidence"|"space"|"routine";
export type Safety = "well"|"clinical"|"urgent";
export type Tier = "wellness"|"professional"|"urgent";
const complexNeed = new Set<Need>(["pain","rehab","independence","care"]);
const normalCommerceNeed = new Set<Need>(["desk","motivation","confidence","fitness"]);
/** Conservative informational routing, not a diagnostic or emergency classifier. */
export function journeyTier(need:Need,barrier:Barrier,safety:Safety|null):Tier {
 if(safety==="urgent")return "urgent";
 if(safety==="clinical"||complexNeed.has(need)||barrier==="body")return "professional";
 return "wellness";
}
/** Commerce is deliberately downstream of safety and not a therapy recommendation. */
export function commerceEligible(need:Need,barrier:Barrier,safety:Safety|null):boolean {
 return journeyTier(need,barrier,safety)==="wellness"&&normalCommerceNeed.has(need)&&safety==="well";
}
