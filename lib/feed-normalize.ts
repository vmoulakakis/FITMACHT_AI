/** Conservative localized monetary value parsing for source feed staging only.
 * Parsed prices must still be verified at merchant before publication.
 */
export function parseFeedEur(raw:unknown):number|null{
 if(typeof raw==="number")return Number.isFinite(raw)&&raw>0?raw:null;
 if(typeof raw!=="string")return null;
 const s=raw.trim().replace(/[€\s\u00a0]/g,"").replace(/EUR/ig,"");
 if(!/^[0-9.,]+$/.test(s)||!s)return null;
 const comma=s.lastIndexOf(","),dot=s.lastIndexOf(".");
 let normalized=s;
 if(comma>=0&&dot>=0) normalized=comma>dot?s.replace(/\./g,"").replace(",","."):s.replace(/,/g,"");
 else if(comma>=0)normalized=/(,\d{1,2})$/.test(s)?s.replace(",","."):s.replace(/,/g,"");
 else if(dot>=0&&/\.\d{3}$/.test(s)&&s.split(".").length>2)normalized=s.replace(/\./g,"");
 const result=Number(normalized);
 return Number.isFinite(result)&&result>0&&result<=100000?Math.round(result*100)/100:null;
}
export function normalizeAvailability(raw:unknown):"in_stock"|"out_of_stock"|"unknown"{
 const s=String(raw??"").trim().toLowerCase();
 if(["true","1","y","yes","available","in stock","instock","διαθέσιμο","διαθέσιμο άμεσα","σε απόθεμα"].includes(s))return "in_stock";
 if(["false","0","n","no","unavailable","out of stock","εξαντλημένο","μη διαθέσιμο"].includes(s))return "out_of_stock";
 return "unknown";
}
