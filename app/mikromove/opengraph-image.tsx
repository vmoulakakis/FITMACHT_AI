import {ImageResponse} from "next/og";
export const size={width:1200,height:630};
export const contentType="image/png";
export const alt="MIKRO MOVE — Λίγος χώρος, πολλή ζωή. Έξυπνος οδηγός λύσεων για μικρούς χώρους.";
export default function Image(){
 return new ImageResponse(
  <div style={{width:"100%",height:"100%",background:"#f9f9f1",display:"flex",position:"relative",overflow:"hidden",fontFamily:"sans-serif"}}>
   <div style={{width:705,padding:"73px 50px 45px 70px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
    <div style={{display:"flex",alignItems:"center",fontSize:28,fontWeight:900,letterSpacing:-1.5,color:"#1d2a1d"}}>
     <div style={{width:45,height:45,borderRadius:40,background:"#d5f279",marginRight:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>✳</div>
     MIKRO<span style={{color:"#8fbb47",margin:"0 2px"}}>/</span>MOVE
    </div>
    <div style={{display:"flex",flexDirection:"column",fontSize:92,lineHeight:.97,fontWeight:900,letterSpacing:-5.5,color:"#1b261c"}}>
     <span>ΛΙΓΟΣ</span><span>ΧΩΡΟΣ<span style={{color:"#9dc461"}}>.</span></span><span style={{color:"#98b960"}}>ΠΟΛΛΗ</span><span>ΖΩΗ<span style={{color:"#9dc461"}}>.</span></span>
    </div>
    <div style={{display:"flex",fontSize:20,fontWeight:700,color:"#627360"}}>10 καθημερινά προβλήματα · 100 ιδέες λύσεων</div>
   </div>
   <div style={{position:"absolute",right:0,top:0,width:495,height:630,background:"#bddc8c",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{position:"absolute",width:580,height:580,borderRadius:580,border:"1px solid #71914a80"}}/>
    <div style={{position:"absolute",width:360,height:360,borderRadius:360,border:"1px solid #71914a90"}}/>
    <div style={{width:225,height:380,borderRadius:130,background:"linear-gradient(120deg, #263a26, #718c65 30%, #101e16)",border:"9px solid #243b27",transform:"rotate(-23deg)",boxShadow:"24px 30px 0 #72944f80",display:"flex",alignItems:"center",justifyContent:"center"}}>
     <div style={{width:160,height:316,borderRadius:125,border:"4px solid #8ab58655",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{height:8,width:90,background:"#d6f575",borderRadius:6,marginTop:175}}/>
     </div>
    </div>
    <span style={{position:"absolute",bottom:28,right:29,fontSize:13,fontWeight:900,letterSpacing:2,color:"#355037"}}>INTELLIGENT LIVING LAB · GR</span>
   </div>
  </div>,
  {...size}
 );
}
