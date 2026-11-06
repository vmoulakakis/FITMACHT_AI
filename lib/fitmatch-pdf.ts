"use client";
import type {PlanInput,ProductOption,Program} from "@/lib/fitmatch-360";
type PdfResult={filename:string;pdfBase64:string;download:()=>void};
const W=1240,H=1754;
function textColor(ctx:CanvasRenderingContext2D,v:string){ctx.fillStyle=v;}
function write(ctx:CanvasRenderingContext2D,text:string,x:number,y:number,max:number,size=29,line=45,color="#284955",bold=false):number{
 ctx.font=(bold?"800 ":"500 ")+size+"px Arial, sans-serif";ctx.fillStyle=color;
 const words=text.split(/\s+/),lines:string[]=[];let buff="";
 for(const word of words){const t=buff?buff+" "+word:word;if(ctx.measureText(t).width>max&&buff){lines.push(buff);buff=word;}else buff=t;}
 if(buff)lines.push(buff);
 for(const item of lines){ctx.fillText(item,x,y);y+=line;}
 return y;
}
function frame(kicker:string,title:string,subtitle:string,page:number):{canvas:HTMLCanvasElement;ctx:CanvasRenderingContext2D}{
 const canvas=document.createElement("canvas");canvas.width=W;canvas.height=H;
 const ctx=canvas.getContext("2d");if(!ctx)throw new Error("canvas_unavailable");
 ctx.fillStyle="#F9FAF7";ctx.fillRect(0,0,W,H);
 ctx.fillStyle="#173745";ctx.fillRect(0,0,W,31);
 ctx.fillStyle="#173745";ctx.font="800 39px Arial";ctx.fillText("fitmatch ✳",90,119);
 ctx.fillStyle="#EC785F";ctx.font="800 19px Arial";ctx.fillText("PERSONAL MOVEMENT ATELIER",90,170);
 ctx.strokeStyle="#DDE8E4";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(90,197);ctx.lineTo(1150,197);ctx.stroke();
 ctx.fillStyle="#EC785F";ctx.font="800 21px Arial";ctx.fillText(kicker,90,260);
 let y=write(ctx,title,90,345,1020,65,81,"#173745",true);
 write(ctx,subtitle,90,y+11,1030,27,41,"#627F85",false);
 ctx.strokeStyle="#DFEAE4";ctx.beginPath();ctx.moveTo(90,1660);ctx.lineTo(1150,1660);ctx.stroke();
 ctx.fillStyle="#778F91";ctx.font="500 19px Arial";ctx.fillText("FITMATCH NEXT · Γενική ενημέρωση, όχι ιατρική συνταγή",90,1703);
 ctx.textAlign="right";ctx.fillText(String(page).padStart(2,"0"),1147,1703);ctx.textAlign="left";
 return {canvas,ctx};
}
function panel(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,tint:string){
 ctx.fillStyle=tint;ctx.beginPath();ctx.roundRect(x,y,w,h,30);ctx.fill();
}
function bullets(ctx:CanvasRenderingContext2D,items:string[],x:number,y:number,width:number,space:number):number{
 for(const item of items){
  ctx.fillStyle="#EC785F";ctx.beginPath();ctx.arc(x+13,y-8,8,0,Math.PI*2);ctx.fill();
  const next=write(ctx,item,x+48,y,width-70,28,43,"#294B56");
  y=Math.max(y+space,next+22);
 }
 return y;
}
async function renderPhoto(ctx:CanvasRenderingContext2D,url:string,x:number,y:number,w:number,h:number):Promise<boolean>{
 try{
  const img=new Image();img.crossOrigin="anonymous";img.referrerPolicy="no-referrer";img.src=url;
  await new Promise<void>((resolve,reject)=>{img.onload=()=>resolve();img.onerror=()=>reject(Error("image_unavailable"));});
  const ratio=Math.min(w/img.width,h/img.height);
  ctx.drawImage(img,x+(w-img.width*ratio)/2,y+(h-img.height*ratio)/2,img.width*ratio,img.height*ratio);
  return true;
 }catch{return false;}
}
export async function createFitmatchPdf(input:PlanInput,program:Program,offers:ProductOption[],selection:string|null):Promise<PdfResult>{
 const [{jsPDF},qrMod]=await Promise.all([import("jspdf"),import("qrcode")]);
 const qr=qrMod.default;
 const pdf=new jsPDF({orientation:"portrait",unit:"mm",format:"a4",compress:true});
 const picked=offers.find(x=>x.id===selection);
 const pages:{canvas:HTMLCanvasElement;links:{url:string;x:number;y:number;w:number;h:number}[]}[]=[];
 {
  const {canvas,ctx}=frame("ΤΟ ΠΡΟΣΩΠΙΚΟ ΣΟΥ 360° ΠΡΟΓΡΑΜΜΑ","Η κίνηση ξεκινά από εσένα.","Μικρά βήματα · Στα μέτρα σου · Χωρίς περιττή πίεση",1);
  panel(ctx,90,525,1060,780,"#E9F2F2");
  ctx.fillStyle="#DAE8E2";ctx.beginPath();ctx.arc(925,905,305,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#173745";ctx.beginPath();ctx.arc(934,900,198,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#EC785F";ctx.fillRect(922,744,25,344);ctx.beginPath();ctx.arc(933,717,71,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#173745";ctx.font="800 34px Arial";ctx.fillText("ΤΟ ΔΙΚΟ ΣΟΥ ΠΡΟΓΡΑΜΜΑ",135,625);
  let z=write(ctx,program.goal,135,722,585,48,65,"#173745",true);
  z=write(ctx,input.minutes+" λεπτά ως καθημερινή αφετηρία",135,z+65,570,29,44,"#355C66");
  write(ctx,"Περιλαμβάνει: κίνηση · γενικές αρχές διατροφής · υποστήριξη · επαληθευμένο εξοπλισμό μόνο όπου υπάρχει.",135,z+50,590,25,42,"#526F76");
  ctx.fillStyle="#F5E3DC";ctx.beginPath();ctx.roundRect(90,1375,1060,165,24);ctx.fill();
  write(ctx,"ΠΡΟΕΤΟΙΜΑΣΙΑ",130,1434,1000,19,30,"#A45E4F",true);
  write(ctx,"Η ενημέρωση δεν αντικαθιστά τον γιατρό, τον φυσικοθεραπευτή, τον γυμναστή ή τον διαιτολόγο.",130,1488,960,25,36,"#37565D");
  pages.push({canvas,links:[]});
 }
 {
  const {canvas,ctx}=frame("01 / ΚΙΝΗΣΗ","Η δική σου αφετηρία","Εκπαιδευτικές κατευθύνσεις, όχι εξατομικευμένη θεραπευτική άσκηση.",2);
  panel(ctx,90,530,1060,950,"#EAF3EE");
  bullets(ctx,program.movement,127,608,975,145);
  panel(ctx,90,1510,1060,105,"#F8EDE8");
  write(ctx,"Ασκήσεις με συγκεκριμένο όργανο απαιτούν έλεγχο κατάλληλου επαγγελματία.",118,1567,1000,23,34,"#7C605D");
  pages.push({canvas,links:[]});
 }
 {
  const {canvas,ctx}=frame("02 / ΔΙΑΤΡΟΦΗ & ΣΥΝΗΘΕΙΑ","Επιλογές που σε στηρίζουν","Γενικές αρχές ισορροπημένης διατροφής, όχι θερμιδική ή θεραπευτική δίαιτα.",3);
  panel(ctx,90,525,1060,470,"#F8EEE8");
  bullets(ctx,program.food,127,606,975,120);
  panel(ctx,90,1020,1060,570,"#E9F2F2");
  ctx.fillStyle="#173745";ctx.font="800 36px Arial";ctx.fillText("Ο ρυθμός της εβδομάδας",130,1100);
  bullets(ctx,program.weekly.length?program.weekly:["Συζήτησε την κατάλληλη συχνότητα και το περιεχόμενο με επαγγελματία."],130,1160,970,74);
  pages.push({canvas,links:[]});
 }
 const list=picked?[picked,...offers.filter(x=>x.id!==picked.id)]:offers;
 const chunks:ProductOption[][]=[];
 for(let i=0;i<list.length;i+=3)chunks.push(list.slice(i,i+3));
 if(!chunks.length)chunks.push([]);
 for(let j=0;j<chunks.length;j++){
  const pageNumber=4+j;
  const {canvas,ctx}=frame("03 / ΕΞΟΠΛΙΣΜΟΣ ΚΑΙ ΣΥΝΔΕΣΜΟΙ","Προϊόντα μόνο με πραγματική τεκμηρίωση","Οι διαθέσιμοι σύνδεσμοι οδηγούν σε τρίτους εμπόρους · μπορεί να λαμβάνουμε προμήθεια.",pageNumber);
  const links:{url:string;x:number;y:number;w:number;h:number}[]=[];
  const current=chunks[j];
  if(!current.length){
   panel(ctx,90,540,1060,800,"#EDF3EE");
   ctx.font="800 41px Arial";ctx.fillStyle="#173745";ctx.fillText("Χωρίς επιβεβαιωμένα προϊόντα",145,670);
   write(ctx,"Ο εξοπλισμός είναι προαιρετικός. Δεν δημιουργούμε ψεύτικες αγορές ή QR codes χωρίς πραγματικό επαληθευμένο tracking URL.",145,745,940,29,47,"#567379");
   write(ctx,program.tier==="wellness"?"Μπορείς να ακολουθήσεις τις γενικές προτάσεις καθημερινότητας χωρίς αγορά.":"Η επιλογή βοηθημάτων απαιτεί αξιολόγηση από κατάλληλο επαγγελματία.",145,930,900,30,46,"#264855");
  }else{
   for(let k=0;k<current.length;k++){
    const p=current[k],y=530+k*345;
    panel(ctx,90,y,1060,315,k%2===0?"#EDF4F0":"#F4EFED");
    ctx.fillStyle="#FFFFFF";ctx.beginPath();ctx.roundRect(116,y+32,300,250,20);ctx.fill();
    const loaded=p.imageUrl?((await renderPhoto(ctx,"/api/360/photo?id="+encodeURIComponent(p.id),140,y+55,252,203)) || (await renderPhoto(ctx,p.imageUrl,140,y+55,252,203))):false;
    if(!loaded){ctx.fillStyle="#8CA5A0";ctx.font="800 18px Arial";ctx.fillText("ΦΩΤΟ ΠΡΟΪΟΝΤΟΣ",148,y+160);}
    ctx.fillStyle="#173745";ctx.font="800 26px Arial";
    const end=write(ctx,p.title,450,y+78,420,26,36,"#173745",true);
    ctx.fillStyle="#6B8587";ctx.font="500 21px Arial";ctx.fillText(p.merchant.slice(0,44),450,Math.min(end+12,y+200));
    ctx.fillStyle="#EC785F";ctx.font="800 27px Arial";ctx.fillText(new Intl.NumberFormat("el-GR",{style:"currency",currency:"EUR"}).format(p.price),450,y+255);
    try{const q=await qr.toDataURL(p.trackingUrl,{margin:1,width:220,errorCorrectionLevel:"M"});const img=new Image();img.src=q;await img.decode();ctx.drawImage(img,910,y+51,183,183);}catch{}
    write(ctx,"SCAN / ΑΝΟΙΓΜΑ",918,y+255,200,16,24,"#537478",true);
    // PDF annotation. The exact verified tracking URL is behind both the original image and QR area.
    links.push({url:p.trackingUrl,x:116,y:y+32,w:300,h:250},{url:p.trackingUrl,x:910,y:y+51,w:183,h:183});
   }
  }
  pages.push({canvas,links});
 }
 {
  const num=pages.length+1;
  const {canvas,ctx}=frame("04 / ΣΗΜΑΝΤΙΚΕΣ ΠΛΗΡΟΦΟΡΙΕΣ","Οι άνθρωποι πριν από τις αγορές","Πηγές, όρια και σημαντικές διευκρινίσεις.",num);
  panel(ctx,90,520,1060,640,"#E9F2F2");
  write(ctx,program.expertReview,135,600,975,32,55,"#173745",true);
  write(ctx,"Οι απαντήσεις δόθηκαν από τον χρήστη. Το παρόν δεν είναι προσωπικό θεραπευτικό ή διατροφικό πλάνο συνταγογραφημένο από ειδικό.",135,860,940,28,45,"#587277");
  ctx.fillStyle="#EC785F";ctx.font="800 22px Arial";ctx.fillText("ΕΝΔΕΙΚΤΙΚΕΣ ΤΕΚΜΗΡΙΩΜΕΝΕΣ ΠΗΓΕΣ",100,1240);
  for(let k=0;k<program.sources.length;k++)write(ctx,program.sources[k].label,108,1305+k*77,1000,25,39,"#426B73");
  pages.push({canvas,links:[]});
 }
 pages.forEach(({canvas,links},i)=>{
  if(i)pdf.addPage();
  pdf.addImage(canvas.toDataURL("image/jpeg",.82),"JPEG",0,0,210,297,undefined,"FAST");
  for(const a of links){try{const url=new URL(a.url);if(url.protocol==="https:")pdf.link(a.x/W*210,a.y/H*297,a.w/W*210,a.h/H*297,{url:a.url});}catch{}}
 });
 pdf.setProperties({title:"FitMatch NEXT · Personal 360 programme",subject:"Movement, general nutrition guidance and verified products",creator:"FitMatch NEXT"});
 const filename="FitMatch-360-Program.pdf";
 const base64=pdf.output("datauristring").split(",")[1]||"";
 return {filename,pdfBase64:base64,download:()=>pdf.save(filename)};
}
