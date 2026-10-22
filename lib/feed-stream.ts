/** Bounded incremental decoder for top-level JSON arrays of Linkwise offer objects.
 * Handles braces, quotes, escaped quotes and nested arrays/objects without loading full feed.
 */
export class JsonArrayObjectScanner {
 private depth=0;private quote=false;private escaped=false;private buffer="";private overLimit=false;
 private readonly maxObjectBytes=100000;
 parseChunk(chunk:string,visitor:(value:Record<string,unknown>)=>void){
  for(const char of chunk){
   if(this.depth===0){if(char==="{"){this.depth=1;this.buffer="{";this.quote=false;this.escaped=false;this.overLimit=false;}continue;}
   if(!this.overLimit){this.buffer+=char;if(this.buffer.length>this.maxObjectBytes){this.buffer="";this.overLimit=true;}}
   if(this.quote){if(this.escaped)this.escaped=false;else if(char==="\\")this.escaped=true;else if(char==='"')this.quote=false;continue;}
   if(char==='"'){this.quote=true;continue;}
   if(char==="{")this.depth++;
   else if(char==="}")this.depth--;
   if(this.depth===0&&!this.overLimit){try{const value=JSON.parse(this.buffer) as unknown;if(value&&typeof value==="object"&&!Array.isArray(value))visitor(value as Record<string,unknown>);}catch{/* Invalid upstream row: skip, do not promote. */}this.buffer="";}
  }
 }
}
export const gymProduct=(t:string,category:string)=>{
 const s=(t+" "+category).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
 const hasGymContext=/(fitness|γυμναστ|αθλητ|αθλητικ|sport|treadmill|running|τρεξ)/u.test(s);
 const treadmill=/διαδρομ(?:ος|ου|οι|ο)/u.test(s)&&hasGymContext;
 return treadmill||/walking.?pad|treadmill|dumbbells?|ρυθμιζομεν.{0,10}αλτη|αλτηρ|βαρακ|ποδηλατ.{0,30}γυμναστ|exercise.?bike|spin.?bike|resistance.?band|λαστιχ.{0,25}αντιστασ|home gym|multi.?gym|παγκο.{0,18}γυμναστ/u.test(s);
};
