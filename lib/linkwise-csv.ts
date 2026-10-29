/**
 * Bounded streaming RFC4180-style CSV decoder for Linkwise CD104.
 * Handles embedded commas, escaped double-quotes, newlines inside descriptions,
 * UTF-8 chunk splits and UTF-8 BOM, without reading the whole feed into memory.
 * Source header names, never positional indexes, determine field mapping.
 */
export async function* streamCsvObjects(
 stream:ReadableStream<Uint8Array>,
 maxFieldChars=300_000,
 maxColumns=64
):AsyncGenerator<Record<string,string>>{
 const reader=stream.getReader();
 const decoder=new TextDecoder("utf-8",{fatal:true});
 let field="",row:string[]=[],headers:string[]|null=null;
 let state:"start"|"plain"|"quoted"|"afterquote"="start";
 let rows=0,complete=false;
 const finishField=()=>{
   row.push(field);field="";state="start";
   if(row.length>maxColumns)throw new Error("linkwise_csv_too_many_columns");
 };
 const finalize=():Record<string,string>|null=>{
   if(row.length===0&&field===""&&state==="start")return null;
   finishField();
   const values=row;row=[];
   if(!headers){
     headers=values.map((x,i)=>i===0?x.replace(/^\uFEFF/,"").trim():x.trim());
     if(headers.length<3||new Set(headers).size!==headers.length||
       !["product_id","product_name","price","category"].every(k=>headers!.includes(k)))throw new Error("linkwise_csv_missing_required_header");
     return null;
   }
   if(values.length!==headers.length)throw new Error("linkwise_csv_bad_column_count");
   const item:Record<string,string>={};
   for(let i=0;i<headers.length;i++)item[headers[i]]=values[i];
   rows++;
   return item;
 };
 const process=(s:string):Record<string,string>[]=>{
   const emitted:Record<string,string>[]=[];
   for(const c of s){
     if(state==="quoted"){
       if(c==='"'){state="afterquote";}
       else field+=c;
     }else if(state==="afterquote"){
       if(c==='"'){field+='"';state="quoted";}
       else if(c===","){finishField();}
       else if(c==="\n"){const item=finalize();if(item)emitted.push(item);}
       else if(c==="\r"||c===" "||c==="\t"){}
       else throw new Error("linkwise_csv_invalid_quoted_field");
     }else if(state==="plain"){
       if(c===","){finishField();}
       else if(c==="\n"){const item=finalize();if(item)emitted.push(item);}
       else if(c!=="\r"){field+=c;}
     }else {
       if(c==='"' ){state="quoted";}
       else if(c===","){finishField();}
       else if(c==="\n"){const item=finalize();if(item)emitted.push(item);}
       else if(c!=="\r"){field+=c;state="plain";}
     }
     if(field.length>maxFieldChars)throw new Error("linkwise_csv_field_too_large");
   }
   return emitted;
 };
 try{
   while(true){
     const part=await reader.read();
     if(part.done){complete=true;break;}
     const lines=process(decoder.decode(part.value,{stream:true}));
     for(const item of lines)yield item;
   }
   for(const item of process(decoder.decode()))yield item;
   if(state==="quoted")throw new Error("linkwise_csv_truncated_quote");
   const item=finalize();
   if(item)yield item;
   if(!headers||rows===0)throw new Error("linkwise_csv_no_rows");
 }finally{
   if(!complete)try{await reader.cancel();}catch{}
   reader.releaseLock();
 }
}
