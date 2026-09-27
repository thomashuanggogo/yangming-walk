const scene=new THREE.Scene();scene.background=new THREE.Color('#e9e9dd');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
document.querySelector('#viewport').appendChild(renderer.domElement);
const camera=new THREE.PerspectiveCamera(38,1,0.1,200);
scene.add(new THREE.HemisphereLight(0xfffcf1,0x6b765d,0.65));
const sun=new THREE.DirectionalLight(0xfff2d6,0.45);sun.position.set(-10,20,12);sun.castShadow=true;
sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-15,right:15,top:15,bottom:-15});sun.shadow.bias=-0.001;scene.add(sun);
const floor=new THREE.Mesh(new THREE.CylinderGeometry(10.5,10.5,0.35,64),new THREE.MeshLambertMaterial({color:0xc5cbb2}));floor.position.y=-0.2;floor.receiveShadow=true;scene.add(floor);
const architecture=new LandmarkArchitecture();let model,yaw=0.55,pitch=0.7,distance=24,drag=null;
const selection=document.querySelector('#landmarks');
LANDMARKS.forEach(item=>{const option=document.createElement('option');option.value=item.code;option.textContent=`${item.code} · ${item.name}`;selection.appendChild(option);});
const notes={
 '07':'白牆、深色寄棟屋頂、木窗與竹林入口。',
 '08':'白色平房、低斜屋頂、煙囪與大面採光窗。',
 '09':'F206 老屋：紅磚、煙囪與低矮庭院圍籬。',
 '10':'美軍宿舍的平房尺度、雨淋板、磚牆與煙囪。',
 '14':'中式屋頂結合多層校舍與連續窗列。',
 '15':'依品牌介紹調整為紅磚、白屋頂與大煙囪。',
 '16':'白色與黃色兩棟老屋，保留庭院用餐的氛圍。',
 '17':'白色木屋、煙囪、落地窗與綠色招牌。',
 '18':'低矮紅磚建築圍繞淺水景庭院。',
 '23':'現代校舍、分棟量體與垂直遮陽構件。',
 '24':'以低矮展示館與入口標示取代想像中的高塔。',
 '25':'老宿舍的低斜屋頂、落地窗與簡潔延伸雨遮。'
};
function show(code){
 if(model){scene.remove(model);const cached=new Set([...architecture.materialCache.values()]);model.traverse(obj=>{if(!obj.isMesh)return;if(obj.geometry!==architecture.boxGeometry && obj.geometry!==architecture.roundGeometry)obj.geometry.dispose();if(!cached.has(obj.material)){obj.material.map?.dispose();obj.material.dispose();}});}
 const item=LANDMARKS.find(l=>l.code===code);model=architecture.build(code,item.name);scene.add(model);
 selection.value=code;document.querySelector('h1').textContent=item.name;
 document.querySelector('#number').textContent=`建築 ${code} / 30`;
 document.querySelector('#description').textContent=notes[code]||'依地標用途與現有資料調整比例、屋頂、門窗及入口；細部外觀仍可依現場照片修正。';
 yaw=0.55;distance=code==='14'||code==='23'?28:24;pitch=0.7;draw();
}
function draw(){const rect=document.querySelector('#viewport').getBoundingClientRect();renderer.setSize(rect.width,rect.height);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();camera.position.set(Math.sin(yaw)*Math.cos(pitch)*distance,Math.sin(pitch)*distance+1,Math.cos(yaw)*Math.cos(pitch)*distance);camera.lookAt(0,2,0);renderer.render(scene,camera);}
selection.addEventListener('change',()=>show(selection.value));
document.querySelector('#previous').onclick=()=>show(LANDMARKS[(LANDMARKS.findIndex(l=>l.code===selection.value)+29)%30].code);
document.querySelector('#next').onclick=()=>show(LANDMARKS[(LANDMARKS.findIndex(l=>l.code===selection.value)+1)%30].code);
document.querySelector('#reset').onclick=()=>{yaw=0.55;pitch=0.7;distance=24;draw();};
renderer.domElement.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};renderer.domElement.setPointerCapture(e.pointerId);});
renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;yaw-=(e.clientX-drag.x)*0.008;pitch=Math.max(0.12,Math.min(1.35,pitch+(e.clientY-drag.y)*0.005));drag={x:e.clientX,y:e.clientY};draw();});
renderer.domElement.addEventListener('pointerup',()=>drag=null);renderer.domElement.addEventListener('pointercancel',()=>drag=null);
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();distance=Math.max(14,Math.min(40,distance+e.deltaY*0.015));draw();},{passive:false});
window.addEventListener('resize',draw);window.landmarkPreview={show,draw,scene,renderer,camera,architecture};show('07');
