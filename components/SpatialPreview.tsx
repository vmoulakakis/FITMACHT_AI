"use client";
import {useEffect,useRef} from "react";

/** Deliberately schematic room visual, not an actual product or measurement. Opt-in, never blocks advice. */
export default function SpatialPreview(){
  const mount=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const host=mount.current;
    if(!host || typeof window==="undefined" || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    let disposed=false;
    let cleanup:()=>void=()=>{};
    void import("three").then(THREE=>{
      if(disposed || !host) return;
      if(!window.WebGLRenderingContext)return;
      let renderer:InstanceType<typeof THREE.WebGLRenderer>;
      try{renderer=new THREE.WebGLRenderer({antialias:false,alpha:true,powerPreference:"low-power"});}
      catch{return;}
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000,0);
      host.appendChild(renderer.domElement);
      const scene=new THREE.Scene();
      const camera=new THREE.PerspectiveCamera(38,1,.1,50);
      camera.position.set(5.1,4.1,6.4);
      camera.lookAt(0,.55,0);
      const light=new THREE.HemisphereLight(0xffffff,0x90ac7e,2.8);scene.add(light);
      const main=new THREE.DirectionalLight(0xffffff,2.2);main.position.set(3,7,5);scene.add(main);
      const group=new THREE.Group();scene.add(group);
      function block(w:number,h:number,d:number,color:number,x:number,y:number,z:number){
        const geo=new THREE.BoxGeometry(w,h,d);
        const material=new THREE.MeshStandardMaterial({color,roughness:.65,metalness:.08});
        const mesh=new THREE.Mesh(geo,material);mesh.position.set(x,y,z);group.add(mesh);
      }
      block(4,.09,3.2,0xdcebd5,0,-.08,0); // room floor
      block(2.3,.16,.86,0x243d2f,0,.18,0); // schematic exercise mat
      block(1.6,.04,.35,0x9cc977,0,.29,-.13); // accent
      block(.11,1.03,.11,0x365b45,-.83,.72,-.2);
      block(.11,1.03,.11,0x365b45,.83,.72,-.2);
      block(1.85,.08,.15,0x365b45,0,1.2,-.2);
      block(.44,.12,.3,0xc4e88b,0,.35,.05);
      const resize=()=>{
        const width=Math.max(100,host.clientWidth),height=Math.max(100,host.clientHeight);
        renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
      };
      const observer=new ResizeObserver(resize);observer.observe(host);resize();
      let frame=0;
      const tick=()=>{
        frame=window.requestAnimationFrame(tick);
        group.rotation.y=Math.sin(performance.now()*.00035)*.12+.26;
        renderer.render(scene,camera);
      };
      tick();
      cleanup=()=>{
        window.cancelAnimationFrame(frame);observer.disconnect();
        group.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.geometry.dispose();const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>m.dispose());}});
        renderer.dispose();renderer.domElement.remove();
      };
    }).catch(()=>{ /* CSS illustration remains as progressive fallback. */ });
    return()=>{disposed=true;cleanup();};
  },[]);
  return <div ref={mount} className="spatialMount" role="img" aria-label="Ενδεικτική τρισδιάστατη κάτοψη χώρου, όχι πραγματικό προϊόν"/>;
}
