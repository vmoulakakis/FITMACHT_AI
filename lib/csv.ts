/** Streaming CSV parser: chunks, BOM, CRLF, escaped double quotes, quoted newlines, record size cap. */
export async function* csvRows(chunks:AsyncIterable<string>,separator=","):AsyncGenerator<string[]>{
 if(separator!==","&&separator!==";")throw new Error("unsupported_separator");
 let field="",row:string[]=[],quoted=false,closing=false,started=false,previousCR=false;
 let chars=0;
 for await(const chunk of chunks)for(const c of chunk){
  if(!started){started=true;if(c==="\uFEFF")continue;}
  if(previousCR){previousCR=false;if(c==="\n")continue;}
  if(quoted){
    if(closing){if(c==='"'){field+='"';closing=false;continue;}quoted=false;closing=false;}
    else if(c==='"'){closing=true;continue;}
    else{field+=c;if(++chars>500000||field.length>128000)throw new Error("csv_record_too_large");continue;}
  }
  if(c==='"'){if(field.length===0){quoted=true;continue;}throw new Error("csv_malformed_quote");}
  if(c===separator){row.push(field);field="";continue;}
  if(c==="\r"||c==="\n"){if(c==="\r")previousCR=true;row.push(field);field="";if(row.some(x=>x.length))yield row;row=[];chars=0;continue;}
  field+=c;if(++chars>500000||field.length>128000)throw new Error("csv_record_too_large");
 }
 if(quoted&&!closing)throw new Error("csv_unclosed_quote");
 if(field||row.length){row.push(field);if(row.some(x=>x.length))yield row;}
}
export function normalizeHeader(row:string[]){return row.map(x=>x.trim().toLowerCase().replace(/\s+/g,"_"));}
