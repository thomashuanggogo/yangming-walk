/**
 * Stylized architectural miniatures. Dimensions are gameplay proportions, not surveys.
 * Reference notes and unresolved details: LANDMARK_ARCHITECTURE_REVIEW.md.
 * All textures are generated locally; the game remains usable through file://.
 */
import * as THREE from '../../assets/three.module.js';

export class LandmarkArchitecture {
  constructor() {
    this.boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.roundGeometry = new THREE.IcosahedronGeometry(1, 1);
    this.materialCache = new Map();
    this.textureCache = new Map();
    this.palette = {
      plaster: 0xede6d7, white: 0xf6f2e8, stone: 0x9b9a8a,
      brick: 0x9d5643, wood: 0x735743, dark: 0x35454a,
      roof: 0x4f5556, redRoof: 0x955747, greenRoof: 0x476755,
      glass: 0x668d99, frame: 0xe5dfcd, leaf: 0x608257,
      grass: 0x8da56e, gold: 0xbca065, red: 0xa44638,
      cream: 0xfbf8ee, metal: 0x90a4ae
    };
  }

  texture(kind) {
    if (this.textureCache.has(kind)) return this.textureCache.get(kind);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 128, 128);
    if (kind === 'brick') {
      for (let row = 0; row < 8; row++) {
        for (let col = -1; col < 5; col++) {
          const shade = 225 + ((row * 17 + col * 11 + 50) % 25);
          ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
          ctx.fillRect(col * 32 + (row % 2) * 16 + 1, row * 16 + 1, 30, 14);
        }
      }
    } else {
      ctx.strokeStyle = kind === 'tile' ? '#b4b4b4' : '#d2d2d2';
      ctx.lineWidth = 2;
      for (let y = 0; y < 128; y += 16) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(128, y); ctx.stroke();
      }
      if (kind === 'tile') {
        for (let x = 0; x < 128; x += 8) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 128); ctx.stroke();
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    this.textureCache.set(kind, texture);
    return texture;
  }

  mat(color, texture = '') {
    const value = this.palette[color] ?? color;
    const key = `${value}:${texture}`;
    if (!this.materialCache.has(key)) {
      this.materialCache.set(key, new THREE.MeshLambertMaterial({
        color: value, map: texture ? this.texture(texture) : null
      }));
    }
    return this.materialCache.get(key);
  }

  box(g, w, h, d, x, y, z, color = 'plaster', texture = '') {
    const mesh = new THREE.Mesh(this.boxGeometry, this.mat(color, texture));
    mesh.scale.set(w, h, d); mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true; g.add(mesh); return mesh;
  }

  ball(g, x, y, z, sx, sy, sz, color = 'leaf') {
    const mesh = new THREE.Mesh(this.roundGeometry, this.mat(color));
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz);
    mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh); return mesh;
  }

  cylinder(g, rTop, rBottom, height, x, y, z, color = 'stone') {
    const geom = new THREE.CylinderGeometry(rTop, rBottom, height, 16);
    const mesh = new THREE.Mesh(geom, this.mat(color));
    mesh.position.set(x, y, z);
    mesh.castShadow = true; mesh.receiveShadow = true;
    g.add(mesh);
    return mesh;
  }

  sphere(g, r, x, y, z, color = 'leaf') {
    const geom = new THREE.SphereGeometry(r, 12, 8);
    const mesh = new THREE.Mesh(geom, this.mat(color));
    mesh.position.set(x, y, z);
    mesh.castShadow = true; mesh.receiveShadow = true;
    g.add(mesh);
    return mesh;
  }

  beam(g, a, b, width, color) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
    const mesh = this.box(g, width, start.distanceTo(end), width, 0, 0, 0, color);
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
    return mesh;
  }

  roof(g, w, d, y, rise, color = 'roof', x = 0, z = 0, hip = true) {
    // Four sloping roof planes with a ridge; unlike a pyramid, the ridge has length.
    const inset = hip ? Math.min(w * 0.23, d * 0.35) : 0;
    const a = [-w/2, 0, -d/2], b = [w/2, 0, -d/2];
    const c = [w/2, 0, d/2], e = [-w/2, 0, d/2];
    const l = [-w/2+inset, rise, 0], r = [w/2-inset, rise, 0];
    const positions = [...a,...l,...r, ...a,...r,...b, ...e,...c,...r, ...e,...r,...l,
      ...a,...e,...l, ...b,...r,...c];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const uv = [];
    for (let i = 0; i < positions.length; i += 3) uv.push((positions[i]+w/2)/w*2, (positions[i+2]+d/2)/d);
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, this.mat(color, 'tile'));
    mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true; g.add(mesh);
    this.box(g,w,0.13,d,x,y-0.04,z,color);
    this.box(g,w-2*inset+0.2,0.14,0.2,x,y+rise,z,color);
    return mesh;
  }

  window(g, x, y, z, w = 1.2, h = 1.35, frame = 'frame', side = false) {
    const win = new THREE.Group(); win.position.set(x,y,z);
    if (side) win.rotation.y = Math.PI/2;
    this.box(win,w+0.16,h+0.16,0.12,0,0,0,frame);
    this.box(win,w,h,0.13,0,0,0.035,'glass');
    this.box(win,0.055,h,0.15,0,0,0.07,frame);
    this.box(win,w,0.055,0.15,0,0.08,0.07,frame);
    this.box(win,w+0.23,0.09,0.3,0,-h/2-0.06,0.08,frame);
    g.add(win);
  }

  door(g,x,z,h=2.1,color='wood') {
    this.box(g,1.32,h+0.12,0.17,x,h/2+0.22,z,'frame');
    this.box(g,1.12,h,0.19,x,h/2+0.22,z+0.03,color);
    this.box(g,0.86,h*0.55,0.2,x,h*0.66+0.22,z+0.06,'glass');
    this.box(g,0.06,0.32,0.23,x+0.38,1.1,z+0.1,'gold');
  }

  sign(g, text, x, y, z, width=4.2, bg='#314c45', fg='#fff6e3') {
    const canvas = document.createElement('canvas'); canvas.width=1024; canvas.height=192;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle=bg; ctx.fillRect(0,0,1024,192);
    ctx.strokeStyle=fg; ctx.lineWidth=3; ctx.strokeRect(12,12,1000,168);
    ctx.font='bold 66px "Microsoft JhengHei", sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle=fg;
    ctx.fillText(text,512,99,950);
    const map = new THREE.CanvasTexture(canvas);
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,width*192/1024),new THREE.MeshBasicMaterial({map}));
    mesh.position.set(x,y,z); g.add(mesh);
  }

  tree(g,x,z,size=1,color='leaf') {
    this.box(g,0.25*size,2.3*size,0.25*size,x,1.15*size,z,'wood');
    this.ball(g,x,2.8*size,z,1.2*size,1.5*size,1.1*size,color);
    this.ball(g,x-0.6*size,2.5*size,z+0.2,0.8*size,0.9*size,0.9*size,color);
  }

  bamboo(g,x,z) {
    for(let i=0;i<3;i++) {
      const bx=x+(i-1)*0.35, bz=z+(i%2)*0.35, height=4.4+i*0.4;
      this.box(g,0.09,height,0.09,bx,height/2,bz,0x7a8c52);
      for(let j=1;j<6;j++) this.box(g,0.12,0.055,0.12,bx,j*height/6,bz,0xadb17e);
      for(let k=0;k<3;k++) {
        const leaf=this.ball(g,bx+(k-1)*0.25,height-0.4-k*0.15,bz,0.7,0.14,0.28,'leaf');
        leaf.rotation.z=(k-1)*0.45;
        leaf.rotation.y=k*1.1;
      }
    }
  }

  bench(g,x,z,color='wood') {
    this.box(g,1.8,0.12,0.5,x,0.65,z,color);
    this.box(g,1.8,0.42,0.1,x,0.97,z-0.22,color);
    [-0.65,0.65].forEach(dx=>this.box(g,0.1,0.65,0.4,x+dx,0.325,z,'dark'));
  }

  fence(g,w,z,color='white') {
    for(let x=-w/2;x<=w/2;x+=0.45) {
      if(Math.abs(x)<1.1) continue;
      this.box(g,0.13,0.95,0.13,x,0.65,z,color);
    }
    [-1,1].forEach(s=>[0.4,0.85].forEach(y=>this.box(g,w/2-1.1,0.1,0.12,s*(w/4+0.55),y,z,color)));
  }

  house(g, options={}) {
    const {x=0,z=0,w=8,d=5,h=2.8,wall='plaster',roof='roof',hip=true,chimney=false,siding=false,porch=true}=options;
    const house=new THREE.Group(); house.position.set(x,0,z); g.add(house);
    this.box(house,w+0.2,0.28,d+0.2,0,0.14,0,'stone');
    this.box(house,w,h,d,0,h/2+0.28,0,wall,wall==='brick'?'brick':siding?'siding':'');
    this.roof(house,w+0.85,d+0.85,h+0.3,1.25,roof,0,0,hip);
    [-1,1].forEach(s=>this.window(house,s*w*0.31,1.8,d/2+0.08,1.3,1.25));
    [-1,1].forEach(s=>this.window(house,s*(w/2+0.08),1.8,0,1.35,1.25,'frame',true));
    this.door(house,0,d/2+0.08);
    if(porch) {
      this.box(house,3,0.18,1.3,0,0.18,d/2+0.6,'stone');
      this.roof(house,3.1,1.65,2.6,0.55,roof,0,d/2+0.5);
      [-1.25,1.25].forEach(px=>this.box(house,0.13,2.5,0.13,px,1.35,d/2+1.1,'frame'));
    }
    if(chimney) {
      this.box(house,0.85,4.5,0.9,w*0.32,2.25,-d*0.25,'brick','brick');
      this.box(house,1.05,0.17,1.08,w*0.32,4.55,-d*0.25,'stone');
    }
    return house;
  }

  block(g,{w=9,d=5,floors=2,x=0,z=0,wall='plaster',accent='stone',roof=false}={}) {
    const h=floors*2.4;
    this.box(g,w,h,d,x,h/2+0.2,z,wall);
    this.box(g,w+0.35,0.25,d+0.35,x,h+0.23,z,accent);
    for(let f=0;f<floors;f++) {
      this.box(g,w+0.05,0.14,d+0.05,x,f*2.4+0.3,z,accent);
      for(let col=0;col<4;col++) {
        const wx=x+(col-1.5)*w/4.4;
        if(f===0 && col===2)continue;
        this.window(g,wx,1.6+f*2.4,z+d/2+0.08,w/5.8,1.3,'frame');
      }
      this.window(g,x+w/2+0.08,1.6+f*2.4,z,1.45,1.3,'frame',true);
    }
    this.door(g,x+w/8,z+d/2+0.1);
    this.box(g,2.8,0.16,1.4,x+w/8,2.6,z+d/2+0.5,accent);
    if(roof)this.roof(g,w+0.8,d+0.8,h+0.3,1.4,roof,x,z);
  }

  pool(g,x,z,w,d) {
    this.box(g,w+0.45,0.16,d+0.45,x,0.13,z,'stone');
    this.box(g,w,0.05,d,x,0.24,z,0x7baeb1);
    for(let i=0;i<4;i++)this.box(g,w*0.65,0.015,0.035,x+(i%2)*0.3,0.27,z+(i-1.5)*d/5,0xb8d7d0);
  }

  pavilion(g,x,z,w=4,base=0,color='roof') {
    this.box(g,w+0.2,0.18,w,x,base+0.09,z,'stone');
    [-1,1].forEach(a=>[-1,1].forEach(b=>this.box(g,0.15,2.6,0.15,x+a*(w/2-0.25),base+1.4,z+b*(w/2-0.25),'wood')));
    this.roof(g,w+0.65,w+0.65,base+2.8,1,color,x,z);
  }

  temple(g,small=false) {
    const w=small?5.2:7.8, d=small?4:5.5, h=small?2.6:3.2;
    this.box(g,w+1,0.32,d+1.5,0,0.16,0,'stone');
    this.box(g,w,h,d,0,h/2+0.32,0,small?'stone':0xb88069);
    this.roof(g,w+1.1,d+1.1,h+0.35,1.2,'redRoof');
    this.box(g,w*0.65,0.18,0.22,0,h+1.62,0,'gold');
    [-1,1].forEach(s=>{
      this.beam(g,[s*w*0.3,h+1.6,0],[s*w*0.5,h+2,0],0.17,'gold');
      this.box(g,0.25,h,0.25,s*w*0.35,h/2+0.3,d/2+0.3,'red');
      this.window(g,s*w*0.32,1.7,d/2+0.08,0.85,1.2,'red');
    });
    this.box(g,1.8,2,0.2,0,1.35,d/2+0.1,'dark');
    this.sign(g,small?'下竹林福德宮':'陽明福德宮',0,h-0.05,d/2+0.25,small?2.8:3.5,'#813d30','#efd795');
    this.ball(g,0,0.9,d/2+1.6,0.65,0.5,0.5,'stone');
    [-0.38,0.38].forEach(x=>this.box(g,0.1,0.5,0.1,x,0.35,d/2+1.6,'stone'));
    if(small) {this.bamboo(g,-4,-1);this.bamboo(g,4,-1);}
  }

  greenhouse(g,x,z,w=5,d=4) {
    this.box(g,w,2.1,d,x,1.15,z,0x91afb0);
    this.roof(g,w+0.15,d+0.15,2.25,0.9,0xb0c6c0,x,z,false);
    for(let i=0;i<5;i++) {
      const px=x-w/2+i*w/4;
      this.box(g,0.075,2.3,0.075,px,1.2,z+d/2+0.05,'frame');
      this.beam(g,[px,2.25,z+d/2],[px,3.15,z],0.065,'frame');
    }
    this.box(g,w,0.07,0.08,x,1.35,z+d/2+0.08,'frame');
  }

  lawn(g, w = 16, d = 16, x = 0, z = 0) {
    this.box(g, w, 0.12, d, x, 0.06, z, 'grass');
  }

  build(code,name) {
    const g=new THREE.Group(); g.name=`architecture-${code}`;
    // Shared small planting beds tie the miniatures together without hiding their façades.
    const yard=()=>{this.tree(g,-5.5,-2.5,0.75);this.tree(g,5.4,-2.8,0.8);};
    switch(code) {
      case '01':
        this.block(g,{w:8.2,d:5.5,floors:2,wall:0xd9d5bf,accent:0x4d6275});
        this.sign(g,'山仔后派出所',0,3,2.93,5,'#294564');
        this.box(g,0.07,6.8,0.07,-4.8,3.4,0,'stone');
        this.box(g,0.85,0.55,0.04,-4.4,6.3,0,'red'); break;
      case '02':
        this.block(g,{w:8.6,d:5.3,floors:2,wall:0xd6cbbb,accent:0x60584f});
        this.sign(g,"McDonald's",0,3.1,2.82,7,'#983a30','#fff1cf');
        this.sign(g,'M',-3.3,5.65,2.9,1.2,'#983a30','#ffcf50');
        this.window(g,-2.5,1.45,2.8,2.2,1.8,'dark');break;
      case '03':
        this.block(g,{w:8.5,d:5,floors:2,wall:0xd8d3c7,accent:0x8f938a});
        [0xe47c43,0x2e7654,0xb54536].forEach((c,i)=>this.box(g,8.7,0.13,0.22,0,2.9-i*0.16,2.61,c));
        this.sign(g,'7-ELEVEN',0,3.45,2.7,3.8,'#f7f4e7','#336747');
        this.window(g,-2.3,1.4,2.65,2.1,1.85,'white'); break;
      case '04':
        this.box(g,9,0.12,7,0,0.1,0,'grass'); this.pavilion(g,0,-1,3.3);
        this.bench(g,-3,2);this.bench(g,3,2);yard();
        this.box(g,1.5,0.08,6.8,0,0.19,0,0xc6bba2); break;
      case '05':
        this.block(g,{w:8,d:5,floors:3,wall:0xdacabd,accent:0x937968});
        this.sign(g,'陽明里辦公處',0,3,2.7,5,'#536861');
        this.box(g,4.2,0.12,1.6,0,0.19,3.2,'stone'); break;
      case '06':
        this.block(g,{w:6,d:3,floors:1,z:-2.4,wall:'white',accent:'dark'});
        this.box(g,10.5,0.28,5.8,0,3.6,0.9,'white');
        this.box(g,10.6,0.14,5.9,0,3.72,0.9,0xb34d42);
        [-3.8,3.8].forEach(x=>this.box(g,0.26,3.5,0.26,x,1.75,0.8,'stone'));
        [-2,2].forEach(x=>{this.box(g,1.5,0.15,2.2,x,0.2,1.2,'stone');this.box(g,0.65,1.4,0.5,x,1,1.2,'white');this.box(g,0.45,0.4,0.53,x,1.36,1.2,'dark');});
        this.sign(g,'台灣中油',0,3.59,3.88,3.1,'#f3f0e5','#2b5873'); break;
      case '07':
        this.house(g,{wall:'white',w:8.6,d:5.5,roof:'roof'});
        [-5.2,5.2].forEach(x=>[-1.6,1.2,3].forEach(z=>this.bamboo(g,x,z)));
        this.sign(g,'豆留森林',0,2.72,3.65,2.8,'#5a513f'); break;
      case '08':
        this.house(g,{wall:'white',roof:'white',w:8.5,d:5,chimney:true,siding:true});
        this.window(g,-2.6,1.6,2.62,2.1,1.75,'white');this.bench(g,4,4,'white');yard();
        this.sign(g,'白房子',0,2.72,3.35,2.3,'#eeeade','#686c62');break;
      case '09': {
        // 09 彩虹谷故事館 (F206)：愛富三街美軍 F 區白木屋眷舍、紅磚煙囪、F206門牌與彩虹弧形裝置藝術
        this.lawn(g, 10, 8, 0, 0);

        // 1. 美軍 F 區木造眷舍主屋 (American F-Zone Cottage)
        this.box(g, 8.0, 0.25, 5.2, 0, 0.12, 0.4, 'stone');
        this.box(g, 7.6, 3.0, 4.8, 0, 1.62, 0.4, 0xf5f5f5); // 白木牆主體
        // 經典深灰美式人字雙坡黑瓦斜頂
        this.roof(g, 8.4, 5.6, 3.2, 1.25, 0x37474f, 0, 0.4, true);
        // 屋頂紅磚大煙囪
        this.box(g, 0.8, 2.2, 0.8, -2.4, 3.4, 0.4, 0xa74337);
        this.box(g, 0.95, 0.15, 0.95, -2.4, 4.55, 0.4, 0x263238);

        // 2. 正門與美式木格白窗 (朝向愛富三街)
        this.door(g, 0, 1.85, -2.02, 'wood');
        [-2.2, 2.2].forEach(wx => {
          this.box(g, 1.5, 1.4, 0.1, wx, 1.7, -2.02, 0xffffff); // 白窗框
          this.box(g, 1.3, 1.2, 0.08, wx, 1.7, -2.03, 0x90caf9); // 採光玻璃
          this.box(g, 0.08, 1.2, 0.12, wx, 1.7, -2.04, 0xffffff); // 十字窗櫺
          this.box(g, 1.3, 0.08, 0.12, wx, 1.7, -2.04, 0xffffff);
        });

        // 3. F206 門牌與文史招牌
        this.box(g, 0.8, 0.45, 0.1, 1.0, 2.4, -2.04, 0x3e2723); // F206 門牌
        this.sign(g, 'F206 彩虹谷故事館 (美軍眷舍記憶)', 0, 2.85, -2.06, 4.2, '#37474f', '#fff9c4');

        // 4. 前庭亮點：精緻彩虹弧形裝置藝術 (Miniature Rainbow Arch)
        const rainbowTorus = new THREE.TorusGeometry(1.6, 0.12, 8, 24, Math.PI);
        const rainbowMesh = new THREE.Mesh(rainbowTorus, this.mat(0xff9800)); // 亮彩虹金橙
        rainbowMesh.position.set(-2.4, 0.1, -2.8);
        rainbowMesh.rotation.z = 0;
        g.add(rainbowMesh);
        // 彩虹外圈七彩光譜層次
        const innerArch = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.08, 8, 24, Math.PI), this.mat(0x00bcd4));
        innerArch.position.set(-2.4, 0.1, -2.78);
        g.add(innerArch);

        // 5. 白木矮籬笆與前庭美軍庭園
        this.fence(g, 8.5, -3.2, 'white');
        this.tree(g, 3.6, -2.6, 1.25, 0x2e7d32);
        this.tree(g, -3.8, 2.4, 1.2, 0x1b5e20);
        this.tree(g, 3.8, 2.4, 1.2, 0x1b5e20);
        this.bench(g, 1.8, -2.8, 'wood');
        break;
      }
      case '10':
        this.house(g,{x:-3.1,w:4.8,d:4.8,wall:'brick',chimney:true,porch:false});
        this.house(g,{x:3.1,w:4.8,d:4.8,wall:'white',siding:true,chimney:true,porch:false});
        this.fence(g,12,3.8);break;
      case '11':
        this.block(g,{w:10,d:5,floors:3,wall:0xc6b8a0,accent:0x665b4c,z:-1});
        this.pool(g,0,4,7,2.4);this.sign(g,'CHECK inn',0,5.25,1.72,3.3,'#5c5245');yard();break;
      case '12':
        // Restrained church study; the older available photo does not establish current details.
        this.house(g,{w:6,d:7,h:3.8,wall:'white',roof:'roof',hip:false,porch:false});
        this.box(g,0.16,1.5,0.17,0,5.2,3.65,'dark');this.box(g,0.85,0.15,0.17,0,5.5,3.65,'dark');
        this.sign(g,'陽明山錫安堂',0,3.1,3.67,3.3,'#e8e4d7','#585951');yard();break;
      case '13':
        this.house(g,{x:-2.8,w:5.8,d:6,wall:0x9b8569,siding:true,porch:false});
        this.house(g,{x:3,w:5.8,d:4.8,wall:'plaster',siding:true});
        this.tree(g,-5,4,0.9);break;
      case '14':
        // 中國文化大學：全台規模最宏偉之高山宮殿式大學城校園建築群 (Campus Complex)
        // 包含：正門石牌樓、百花池廣場、大恩館主殿、曉峰圖書館高樓、大典館、大成館、大義館、大忠館、宿舍與庭園

        // === 1. 校園中軸前庭與迎賓百花池廣場 ===
        // 漢白玉主台基與廣場鋪石
        this.box(g, 34, 0.35, 26, 0, 0.17, -3.5, 'stone');
        // 前方石階迎賓步道
        this.box(g, 10, 0.2, 3.5, 0, 0.1, 9.8, 'stone');
        // 百花池噴泉水景 (位於牌樓與大恩館之間)
        this.box(g, 5.8, 0.45, 5.8, 0, 0.35, 5.2, 'white');
        this.box(g, 4.8, 0.3, 4.8, 0, 0.45, 5.2, 0x5a9fa8);
        this.box(g, 1.2, 1.2, 1.2, 0, 0.8, 5.2, 'white');
        this.ball(g, 0, 1.6, 5.2, 0.6, 0.7, 0.6, 'glass');

        // === 2. 文化大學正門中式石牌樓 (Campus Grand Arch) ===
        // 四柱三間琉璃綠瓦石牌樓 (正臨華岡路)
        [-4.2, -1.5, 1.5, 4.2].forEach(px => this.box(g, 0.42, 4.2, 0.42, px, 2.1, 8.5, 'white'));
        this.box(g, 9.5, 0.35, 0.5, 0, 3.8, 8.5, 'white');
        this.roof(g, 4.2, 1.6, 4.2, 0.7, 'greenRoof', 0, 8.5);
        [-3.2, 3.2].forEach(rx => this.roof(g, 2.8, 1.4, 3.7, 0.55, 'greenRoof', rx, 8.5));
        this.sign(g, '中國文化大學', 0, 3.3, 8.78, 3.2, '#504132', '#fbeec8');

        // === 3. 中央巍峨主殿：大恩館 (Main Administration Palace) ===
        // 4 層宏偉宮殿主樓
        this.block(g, { w: 12.5, d: 8.5, floors: 4, wall: 'plaster', accent: 0x857563, z: -0.2 });
        // 正面 6 根朱紅擎天大柱 (支撐挑簷門廊)
        [-5.2, -3.1, -1.0, 1.0, 3.1, 5.2].forEach(px => this.box(g, 0.36, 4.8, 0.36, px, 2.4, 4.4, 'red'));
        // 一層挑簷綠瓦頂
        this.roof(g, 13.8, 2.8, 4.9, 0.85, 'greenRoof', 0, 4.4);
        // 主殿頂層雙層重簷歇山大屋頂
        this.roof(g, 14.8, 10.5, 9.8, 1.4, 'greenRoof', 0, -0.2);
        this.box(g, 8.8, 1.6, 5.8, 0, 10.8, -0.2, 'plaster');
        this.roof(g, 11.2, 8.2, 11.8, 1.9, 'greenRoof', 0, -0.2);
        // 殿頂金色正脊與琉璃吻獸
        this.box(g, 6.8, 0.35, 0.35, 0, 13.8, -0.2, 'gold');
        [-3.4, 3.4].forEach(gx => this.ball(g, gx, 13.9, -0.2, 0.45, 0.45, 0.45, 'gold'));
        // 大恩館中央大校匾
        this.sign(g, '大 恩 館', 0, 5.8, 4.42, 4.5, '#504132', '#fbeec8');

        // === 4. 後方制高點地標：曉峰紀念館 / 華岡圖書館 (Library Tower) ===
        // 5 層現代宏偉圖書館高樓 (高 16 米，頂部飛簷閣樓)
        this.block(g, { w: 10.5, d: 7.5, floors: 5, wall: 0xdedcd3, accent: 0x5e6e72, z: -9.8 });
        // 圖書館頂部宮殿式觀景閣樓與金頂
        this.roof(g, 12.2, 9.2, 12.8, 1.6, 'greenRoof', 0, -9.8);
        this.box(g, 5.2, 1.8, 4.2, 0, 14.0, -9.8, 'plaster');
        this.roof(g, 6.8, 5.8, 15.2, 1.4, 'greenRoof', 0, -9.8);
        this.ball(g, 0, 16.8, -9.8, 0.8, 1.0, 0.8, 'gold');
        this.sign(g, '曉峰紀念館', 0, 7.8, -5.9, 4.0, '#364547', '#f0ede1');

        // === 5. 東翼校舍：大典館 (文學院宮殿) ===
        // 位於左前方 (X = -10.5, Z = 0)
        this.block(g, { w: 6.8, d: 7.5, floors: 3, wall: 'plaster', accent: 0x857563, x: -10.5, z: 0 });
        this.roof(g, 8.2, 8.8, 7.6, 1.4, 'greenRoof', -10.5, 0);
        this.box(g, 4.5, 0.28, 0.28, -10.5, 9.1, 0, 'gold');
        this.sign(g, '大 典 館', -10.5, 4.5, 3.82, 3.0, '#504132', '#fbeec8');

        // === 6. 西翼校舍：大成館 (法學院宮殿) ===
        // 位於右前方 (X = 10.5, Z = 0)
        this.block(g, { w: 6.8, d: 7.5, floors: 3, wall: 'plaster', accent: 0x857563, x: 10.5, z: 0 });
        this.roof(g, 8.2, 8.8, 7.6, 1.4, 'greenRoof', 10.5, 0);
        this.box(g, 4.5, 0.28, 0.28, 10.5, 9.1, 0, 'gold');
        this.sign(g, '大 成 館', 10.5, 4.5, 3.82, 3.0, '#504132', '#fbeec8');

        // === 7. 東後校舍：大忠館 (學生活動中心 / 藝文大樓) ===
        // 位於左後方 (X = -11.5, Z = -9.2)
        this.block(g, { w: 7.5, d: 6.8, floors: 3, wall: 0xdcd8cb, accent: 0x7a6b58, x: -11.5, z: -9.2 });
        this.roof(g, 8.8, 8.0, 7.6, 1.3, 'greenRoof', -11.5, -9.2);
        this.sign(g, '大 忠 館', -11.5, 4.2, -5.72, 3.0, '#504132', '#fbeec8');

        // === 8. 西後校舍：大義館 (理工學院大樓) ===
        // 位於右後方 (X = 11.5, Z = -9.2)
        this.block(g, { w: 7.5, d: 6.8, floors: 4, wall: 0xdcd8cb, accent: 0x617075, x: 11.5, z: -9.2 });
        this.roof(g, 8.8, 8.0, 9.8, 1.4, 'greenRoof', 11.5, -9.2);
        this.sign(g, '大 義 館', 11.5, 5.5, -5.72, 3.0, '#425359', '#fbeec8');

        // === 9. 後山學生宿舍群：大倫館 / 大賢館 (Student Dormitories) ===
        // 位於校園後方兩側 (X = -6.2, 6.2, Z = -15.2)
        [-6.2, 6.2].forEach(dx => {
          this.block(g, { w: 5.5, d: 4.8, floors: 3, wall: 0xdbd7cc, accent: 0x827362, x: dx, z: -15.2 });
          this.box(g, 5.8, 0.25, 5.1, dx, 7.4, -15.2, 'greenRoof');
        });

        // === 10. 古典朱紅風雨連廊與校園青松庭園 ===
        // 連接主殿大恩館與東西翼館的迴廊
        [-6.5, 6.5].forEach(cx => {
          this.box(g, 0.25, 3.2, 0.25, cx, 1.6, 1.5, 'red');
          this.box(g, 0.25, 3.2, 0.25, cx, 1.6, -1.5, 'red');
          this.roof(g, 2.8, 3.6, 3.3, 0.55, 'greenRoof', cx, 0);
        });
        // 校園林蔭與青松蒼柏
        this.tree(g, -15.5, 3.5, 1.2);
        this.tree(g, 15.5, 3.5, 1.2);
        this.tree(g, -15.5, -5.5, 1.1);
        this.tree(g, 15.5, -5.5, 1.1);
        this.tree(g, -4.8, 5.5, 0.95);
        this.tree(g, 4.8, 5.5, 0.95);
        this.tree(g, 0, -15.5, 1.15);
        break;
      case '15':
        this.house(g,{wall:'brick',roof:'white',w:8.6,d:5.3,chimney:true});
        this.fence(g,10,4.4);this.bench(g,-4,3.5);yard();
        this.sign(g,'亞尼克夢想村',0,2.74,3.55,3.4,'#614d3e');break;
      case '16':
        this.house(g,{x:-2.5,z:0.7,w:5.3,d:4.6,wall:'white',chimney:true,siding:true});
        this.house(g,{x:3,z:-1.5,w:5,d:4.8,wall:0xd2b459,siding:true,porch:false});
        this.bench(g,3.4,2.6);this.tree(g,5.5,3.4,0.8,0x9b8051);break;
      case '17':
        this.house(g,{wall:'white',w:8.5,d:5.1,chimney:true,siding:true,porch:false});
        this.window(g,-2.5,1.55,2.67,2.2,1.8,'dark');
        this.sign(g,'STARBUCKS',0,3,2.75,3.4,'#2c6552');
        this.bench(g,3.5,3.8);yard();break;
      case '18': {
        // 18 美軍俱樂部 (BRICK YARD 33 1/3)：近千坪冷戰美軍社交核心、黑膠音樂、紅磚煙囪與無邊際水池露台
        this.lawn(g, 15, 11, 0, 0.5);

        // 1. 美式歷史紅磚主館 (Main Red Brick Hall)
        this.box(g, 13.5, 3.8, 5.8, 0, 1.9, -2.5, 0xa74337); // 經典溫暖美式紅磚牆
        // 標誌性人字雙披黑瓦坡頂
        this.roof(g, 14.5, 7.2, 1.8, 0, 4.7, -2.5, 0x2b2d42);
        // 冷戰美軍雙紅磚煙囪 (Twin Chimneys)
        [-5.2, 5.2].forEach(cx => {
          this.box(g, 0.9, 4.8, 0.9, cx, 3.2, -2.5, 0x8b3226);
          this.box(g, 1.1, 0.25, 1.1, cx, 5.65, -2.5, 0x1f2029); // 煙囪頂蓋
        });
        // 復古黑鋼格採光大落地玻璃窗
        [-3.6, 0, 3.6].forEach(wx => {
          this.box(g, 2.4, 2.2, 0.12, wx, 1.6, 0.42, 0x212529); // 黑鋼框
          this.box(g, 2.1, 1.9, 0.14, wx, 1.6, 0.42, 0xfff3b0); // 暖黃室內酒吧光
        });
        this.sign(g, 'BRICK YARD 33⅓ 美軍俱樂部', 0, 3.6, 0.45, 5.2);

        // 2. 標誌性「巨大黑膠唱片」景觀雕塑 (Giant Vinyl Record Monument)
        this.box(g, 0.35, 1.2, 0.35, -6.8, 0.6, 2.5, 0x424242); // 唱片基座
        // 黑膠大圓盤 (以同心多邊形/層疊薄板呈現)
        this.box(g, 0.12, 3.2, 3.2, -6.8, 2.2, 2.5, 0x1a1a1a); // 黑膠膠體
        this.box(g, 0.14, 1.2, 1.2, -6.8, 2.2, 2.5, 0xd90429); // 紅色唱片中央圓標
        this.box(g, 0.16, 0.25, 0.25, -6.8, 2.2, 2.5, 0xffd700); // 金色唱片軸心孔
        // 金屬唱臂與唱頭
        this.box(g, 0.08, 2.4, 0.08, -6.8, 2.8, 4.0, 0xb0bec5);
        this.box(g, 0.25, 0.08, 0.5, -6.8, 3.9, 3.7, 0x78909c);

        // 3. 標誌性室外無邊際水池露台 (前身為美軍游泳池) 與下沉式圓形沙發座
        // 蔚藍水池池體
        this.box(g, 10.5, 0.4, 5.8, 1.2, 0.2, 3.6, 0x3d5a80); // 池壁
        this.box(g, 9.8, 0.25, 5.1, 1.2, 0.3, 3.6, 0x48cae4);  // 清澈池水
        // 池中原木觀景伸展台 (Sunken Wooden Boardwalk)
        this.box(g, 1.2, 0.35, 5.2, -2.4, 0.35, 3.6, 0xc49a45);
        // 水中休閒圓形下沉發光卡座 (Sunken Lounge)
        this.box(g, 2.8, 0.38, 2.8, 2.2, 0.36, 3.6, 0xf8f9fa); // 白色沙發環
        this.box(g, 1.2, 0.42, 1.2, 2.2, 0.38, 3.6, 0xb5838d); // 中央茶几
        // 池畔露天躺椅與白陽傘
        this.box(g, 1.8, 0.3, 0.7, 5.2, 0.35, 2.0, 0xdedbd2);
        this.box(g, 1.8, 0.3, 0.7, 5.2, 0.35, 4.8, 0xdedbd2);
        this.box(g, 0.08, 2.2, 0.08, 5.2, 1.2, 3.4, 0xffffff);
        this.roof(g, 2.0, 2.0, 0.5, 5.2, 2.3, 3.4, 0xf8f9fa); // 陽傘

        // 4. 美式草坪白色木柵欄與老樟樹庭院
        this.tree(g, -7.5, 4.2, 1.4, 0x2d6a4f);
        this.tree(g, 7.8, 3.8, 1.3, 0x1b4332);
        this.bench(g, -4.5, 5.5, 'wood');
        break;
      }
      case '19':
        // 陽明山美國渡假村：美式高級軍官別墅聚落莊園
        // 包含：A棟主別墅、B棟客用木屋、大片白木柵欄庭院、戶外野餐烤肉火塘與露營木平台
        // 1. A棟主別墅 (Main Villa)
        this.house(g, { x: -3.8, z: -1.2, w: 9.0, d: 5.8, wall: 'white', roof: 'redRoof', chimney: true, siding: true });
        this.window(g, -6.5, 1.6, 1.75, 2.2, 1.75, 'white');
        this.sign(g, '美國渡假村', -3.8, 3.2, 2.3, 3.8, '#a24838', '#fff5eb');

        // 2. B棟客用度假木屋 (Guest Cottage)
        this.house(g, { x: 4.8, z: -2.0, w: 6.2, d: 5.0, wall: 'white', roof: 'redRoof', chimney: true, siding: true, porch: false });

        // 3. 戶外大草坪、白色木柵欄莊園圍籬 (White Picket Fence)
        this.box(g, 17, 0.15, 13, 0.5, 0.08, 0.5, 0x829a68);
        this.fence(g, 16.5, 5.8);

        // 4. 戶外野餐與營火烤肉區 (Picnic & Campfire)
        // 圓形石砌營火塘
        this.ball(g, 3.5, 0.35, 3.2, 0.9, 0.35, 0.9, 'stone');
        this.ball(g, 3.5, 0.45, 3.2, 0.5, 0.25, 0.5, 0xd05538); // 營火暖光
        // 野餐原木長桌椅
        this.box(g, 2.2, 0.12, 0.9, -2.5, 0.65, 3.8, 'wood');
        this.box(g, 2.2, 0.45, 0.3, -2.5, 0.35, 3.0, 'wood');
        this.box(g, 2.2, 0.45, 0.3, -2.5, 0.35, 4.6, 'wood');

        // 5. 庭園老樹
        this.tree(g, -7.5, 4.5, 1.15);
        this.tree(g, 7.2, 4.2, 1.05);
        break;
      case '20':
        this.block(g,{w:10,d:5,floors:3,wall:0xdccbb2,accent:0xb08970});
        this.sign(g,'陽明教養院',0,3.3,2.74,4.5,'#71624d');
        this.box(g,4,0.18,1.3,1.5,0.22,3.3,'stone').rotation.z=-0.055;yard();break;
      case '21': {
        // 21 屋頂上餐廳 (The Top)：全台第一百萬夜景！依山崖梯田而建的峇里島發光渡假村
        this.lawn(g, 18, 16);

        // 1. 四層依懸崖梯田層層下探之柚木觀景大甲板 (4-Tier Cliffside Terraced Decks)
        // Level 1: 頂層迎賓石門與南洋木廊 (最高層)
        this.box(g, 15.5, 0.8, 3.8, 0, 3.2, -4.8, 0x4a3728);
        this.box(g, 1.2, 2.6, 0.4, -4.8, 4.5, -4.8, 0x757575); // 南洋善惡門石雕門柱
        this.box(g, 1.2, 2.6, 0.4, 4.8, 4.5, -4.8, 0x757575);
        this.sign(g, 'THE TOP 屋頂上 · 峇里島景觀夜景', 0, 5.2, -4.6, 4.6);

        // Level 2: 峇里島發光白色帳篷包廂層 (Glowing Cabanas Deck)
        this.box(g, 14.5, 0.7, 3.8, 0, 2.4, -1.6, 0x5c4432);
        [-4.8, 0, 4.8].forEach(px => {
          // 純白圓錐斜頂發光帳篷
          this.roof(g, 3.2, 3.2, 1.6, px, 4.6, -1.6, 0xffffff);
          // 四角支撐柚木原木柱
          this.box(g, 0.12, 1.8, 0.12, px - 1.2, 3.3, -2.8, 0x3e2723);
          this.box(g, 0.12, 1.8, 0.12, px + 1.2, 3.3, -2.8, 0x3e2723);
          this.box(g, 0.12, 1.8, 0.12, px - 1.2, 3.3, -0.4, 0x3e2723);
          this.box(g, 0.12, 1.8, 0.12, px + 1.2, 3.3, -0.4, 0x3e2723);
          // 帳篷內發光暖白沙發卡座
          this.box(g, 2.0, 0.4, 1.8, px, 2.7, -1.6, 0xffeedb);
        });

        // Level 3: 標誌性「無邊際天際鏡面水池平台」 (Infinity Sky Pool Deck)
        this.box(g, 13.5, 0.6, 4.2, 0, 1.5, 1.8, 0x6d4c41);
        // 發光鏡面池水 (Tiffany 藍綠光影)
        this.box(g, 8.8, 0.22, 3.2, 0, 1.85, 1.8, 0x00b4d8);
        // 池中雙人愛心造型水中玻璃發光卡座
        this.box(g, 1.8, 0.35, 1.8, 0, 1.95, 1.8, 0xffffff);
        // 無框透明玻璃觀景安全護欄
        this.box(g, 13.0, 0.85, 0.1, 0, 2.2, 3.8, 'glass');

        // Level 4: 最前緣露天白色環形沙發觀景台 (Lounge Deck)
        this.box(g, 12.0, 0.5, 3.4, 0, 0.6, 5.0, 0x795548);
        [-3.6, 3.6].forEach(sx => {
          this.box(g, 2.8, 0.45, 0.6, sx, 0.85, 4.4, 0xf8f9fa); // 白色沙發靠背
          this.box(g, 2.8, 0.35, 1.2, sx, 0.75, 5.2, 0xf8f9fa); // 沙發坐墊
          this.box(g, 1.0, 0.35, 1.0, sx, 0.78, 5.2, 0xffbe0b); // 發光小茶几
        });

        // 2. 懸崖下方璀璨台北盆地「百萬夜景星光點陣」 (Taipei City Lights Matrix)
        const cityLightColors = [0xffd166, 0x06d6a0, 0x118ab2, 0xffffff, 0xef476f];
        for (let i = 0; i < 18; i++) {
          const lx = -6.5 + (i * 0.75);
          const lz = 6.8 + ((i % 3) * 0.6);
          const lc = cityLightColors[i % cityLightColors.length];
          this.box(g, 0.18, 0.18, 0.18, lx, 0.08, lz, lc); // 閃爍城市微光
        }

        // 3. 南洋旅人蕉與熱帶棕櫚造景
        this.tree(g, -7.5, 4.2, 1.4, 0x2d6a4f);
        this.tree(g, 7.5, 4.2, 1.4, 0x2d6a4f);
        this.tree(g, -6.8, 2.8, 1.1, 0x52b788);
        this.tree(g, 6.8, 2.8, 1.1, 0x52b788);
        break;
      }
      case '22':
        // 臺北市私立華岡藝術學校：台灣首屈一指之演藝明星與藝術家搖籃
        // 包含：演藝展演禮堂主館、舞蹈音樂排練館、黑白相間鋼琴琴鍵步道、戶外星光圓形小劇場與舞台射燈
        // 1. 演藝展演禮堂主館 (Main Theatre & Auditorium)
        this.box(g, 11.5, 0.35, 6.8, -0.5, 0.18, -1.8, 'stone');
        this.block(g, { w: 11.2, d: 6.2, floors: 3, x: -0.5, z: -1.8, wall: 0xdecbb7, accent: 0xa15243 });
        // 正面挑高大面通透玻璃排練廳立面
        this.box(g, 6.2, 3.4, 0.18, -0.5, 2.8, 1.35, 'glass');
        // 主館宮殿式綠琉璃瓦大屋頂與金色正脊
        this.roof(g, 12.5, 7.5, 7.5, 1.4, 'greenRoof', -0.5, -1.8);
        this.box(g, 6.5, 0.28, 0.28, -0.5, 8.95, -1.8, 'gold');
        // 主館大字金漆校匾
        this.sign(g, '華岡藝術學校', -0.5, 5.6, 1.42, 5.2, '#693630', '#fce8c3');

        // 2. 西側舞蹈與音樂排練館 (Dance & Music Studios)
        this.block(g, { w: 5.8, d: 6.2, floors: 2, x: -7.2, z: 0.6, wall: 0xdecbb7, accent: 0xa15243 });
        // 大面舞蹈排練鏡面大窗
        this.box(g, 4.5, 2.0, 0.15, -7.2, 2.5, 3.75, 'glass');
        this.roof(g, 6.8, 7.2, 5.2, 1.1, 'greenRoof', -7.2, 0.6);

        // 3. 標誌性黑白相間「鋼琴琴鍵迎賓步道」 (Piano Key Pathway)
        // 鋪設於中軸線，連接大門至禮堂
        for (let i = 0; i < 9; i++) {
          const pz = 2.4 + i * 0.55;
          // 白色琴鍵地磚
          this.box(g, 2.4, 0.12, 0.48, -0.5, 0.1, pz, 'white');
          // 黑色琴鍵 (半長交錯)
          if ([0, 1, 3, 4, 5, 7, 8].includes(i)) {
            this.box(g, 1.4, 0.18, 0.26, -0.5, 0.14, pz + 0.27, 'dark');
          }
        }

        // 4. 前庭「戶外星光階梯圓形展演小劇場」 (Outdoor Amphitheatre & Stage)
        // 位於右前方 (X = 4.8, Z = 4.2)
        this.box(g, 6.2, 0.25, 5.5, 4.8, 0.15, 4.2, 'stone');
        // 圓弧木質表演舞台
        this.box(g, 4.2, 0.35, 3.8, 4.8, 0.3, 4.2, 'wood');
        // 舞台後方階梯看台
        this.box(g, 5.2, 0.65, 1.2, 4.8, 0.45, 6.2, 'stone');
        // 舞台兩側金屬黑桿聚光射燈 (Spotlights)
        [-1.8, 1.8].forEach(sx => {
          this.box(g, 0.08, 3.2, 0.08, 4.8 + sx, 1.6, 2.5, 'dark');
          this.ball(g, 4.8 + sx, 3.2, 2.5, 0.3, 0.3, 0.3, 'gold'); // 聚光燈泡
        });

        // 5. 藝校校園青松與雕塑庭園
        this.tree(g, -10.5, 2.5, 1.15);
        this.tree(g, 8.5, -2.5, 1.15);
        this.tree(g, -10.5, -3.5, 0.95);
        this.bench(g, 1.8, 5.2, 'wood');
        break;
      case '23':
        // 台北歐洲學校 (TES 陽明校區)：Aedas 國際名師操刀之山坡綠建築國際學校
        // 包含：主階梯式現代校舍、彩色立體遮陽百葉牆面、空中花園平台、戶外多功能草皮球場與迎賓旗桿
        // 1. Aedas 階梯式斜坡主校舍 (Main Stepped Campus)
        this.block(g, { w: 10.5, d: 5.5, floors: 3, x: -2.5, z: -1.5, wall: 'white', accent: 0xc4b99e });
        // 2. 側翼教室館與空中綠化露台 (Wing Hall & Green Roof)
        this.block(g, { w: 5.8, d: 5.2, floors: 2, x: 5.5, z: 0.5, wall: 'white', accent: 0xc4b99e });
        this.box(g, 5.8, 0.25, 5.2, 5.5, 5.2, 0.5, 0x6e9460); // 空中花園

        // 3. 標誌性彩色立體書架遮陽百葉牆 (Rainbow Louvers Screen)
        const louverColors = [0xc8644e, 0xde9b4a, 0x639276, 0x487994, 0xb87d58, 0x936888];
        for (let i = 0; i < 20; i++) {
          const lColor = louverColors[i % louverColors.length];
          this.box(g, 0.14, 7.2, 0.38, -7.5 + i * 0.52, 4.0, 1.4, lColor);
        }

        // 4. 戶外多功能綠色運動球場 (Mini Sports Pitch)
        this.box(g, 11, 0.15, 6.2, 0, 0.12, 5.2, 0x58874d);
        // 白色球場邊線
        this.box(g, 10.5, 0.18, 0.15, 0, 0.14, 2.3, 'white');
        this.box(g, 10.5, 0.18, 0.15, 0, 0.14, 8.1, 'white');
        this.box(g, 0.15, 0.18, 5.8, -5.1, 0.14, 5.2, 'white');
        this.box(g, 0.15, 0.18, 5.8, 5.1, 0.14, 5.2, 'white');

        // 5. 國際校名標誌牆與迎賓旗桿
        this.sign(g, 'TAIPEI EUROPEAN SCHOOL', -2.5, 1.2, 1.62, 5.8, '#ede6d8', '#385047');
        [-1.0, 0, 1.0].forEach((fx, idx) => {
          this.box(g, 0.08, 4.5, 0.08, fx, 2.25, 1.7, 'stone');
          this.box(g, 0.65, 0.42, 0.04, fx + 0.35, 4.1, 1.7, [0x294564, 0xa43d2c, 0x2e6b45][idx]);
        });
        break;
      case '24':
        this.house(g,{w:8,d:5,wall:'plaster',siding:true,porch:false});
        this.sign(g,'草山猛禽中心',0,2.9,2.65,4.2,'#826246');
        this.box(g,1.2,1.6,0.15,-4.5,1.1,3.4,'wood');yard();break;
      case '25':
        this.house(g,{w:8.5,d:5,wall:'white',roof:'roof',porch:false});
        this.window(g,-2.5,1.6,2.65,2,1.8,'dark');
        this.box(g,3.2,0.15,2.7,4.8,2.8,1.2,'dark');
        this.box(g,0.12,2.8,0.12,6.2,1.4,2.4,'dark');
        this.sign(g,'YMS by onefifteen',0,3.12,2.69,3.8,'#e8e1ce','#4f5547');yard();break;
      case '26':
        // 花卉試驗中心：廣達 4 公頃之陽明山四季花卉植物生態公園
        // 包含：雙連棟全景採光玻璃大溫室、茶花館、歐式櫻花花架長廊、繽紛彩虹花圃、噴泉水景與休閒石徑
        // 1. 主採光玻璃大溫室 (Main Glasshouse)
        this.greenhouse(g, -3.8, -1.8, 8.2, 5.2);

        // 2. 副展覽溫室：茶花培育館 (Camellia Pavilion)
        this.greenhouse(g, 4.5, -2.2, 6.2, 4.5);

        // 3. 歐式白色花架長廊 (Pergola)
        [-2.5, 2.5].forEach(gx => {
          this.box(g, 0.18, 2.8, 0.18, gx, 1.4, 2.2, 'white');
          this.box(g, 0.18, 2.8, 0.18, gx, 1.4, 4.8, 'white');
        });
        this.box(g, 5.8, 0.15, 0.25, 0, 2.8, 2.2, 'white');
        this.box(g, 5.8, 0.15, 0.25, 0, 2.8, 4.8, 'white');
        for (let i = 0; i < 7; i++) {
          this.box(g, 0.12, 0.12, 3.2, -2.5 + i * 0.83, 2.9, 3.5, 'wood');
        }

        // 4. 中央石造噴泉水池 (Central Fountain Pool)
        this.box(g, 3.8, 0.35, 3.8, 0, 0.2, 3.5, 'white');
        this.box(g, 3.0, 0.25, 3.0, 0, 0.3, 3.5, 0x4da1a9);
        this.ball(g, 0, 0.8, 3.5, 0.45, 0.6, 0.45, 'glass');

        // 5. 繽紛四季花海花圃 (Flower Beds)
        const flowerColors = [0xde5d83, 0xf4d06f, 0xb85d9b, 0xe07a5f, 0xffffff];
        [-5.8, 5.8].forEach(bx => {
          this.box(g, 3.2, 0.3, 2.6, bx, 0.2, 3.5, 'wood');
          for (let i = 0; i < 6; i++) {
            const fc = flowerColors[(i + (bx > 0 ? 2 : 0)) % flowerColors.length];
            this.ball(g, bx + (i % 3 - 1) * 0.85, 0.65, 2.8 + Math.floor(i / 3) * 1.2, 0.45, 0.4, 0.45, fc);
          }
        });

        // 6. 園區林蔭樹與休憩木椅
        this.tree(g, -7.5, -4.5, 1.15, 0x6e9c60);
        this.tree(g, 7.5, -4.5, 1.15, 0x6e9c60);
        this.tree(g, 0, -5.2, 1.25, 0x5a8c52);
        this.bench(g, -3.2, 5.5, 'white');
        this.bench(g, 3.2, 5.5, 'white');
        this.sign(g, '花卉試驗中心', 0, 2.4, 6.2, 4.2, '#385542', '#fff5df');
        break;
      case '27':this.temple(g);break;
      case '28':
        // 臺北市立格致國民中學：陽明山萬坪森林國中校園
        // 重新規劃：前門臨街（大門穿堂、校名牌匾）、操場跑道與司令台移至校舍後方內側，徹底杜絕突出道路
        // 1. 前棟行政大門穿堂樓 (Admin & Portal Block) - 正面臨街
        this.block(g, { w: 12.5, d: 4.8, floors: 3, x: 0, z: 1.0, wall: 0xdecbb5, accent: 0x93735c });
        // 一樓穿堂大門通道
        this.box(g, 3.8, 2.4, 5.0, 0, 1.2, 1.0, 'stone');
        this.box(g, 5.5, 0.2, 1.5, 0, 0.1, 3.9, 'stone'); // 正門前階
        this.sign(g, '臺北市立格致國民中學', 0, 3.8, 3.48, 5.8, '#5c4b3a', '#fdf3de');

        // 2. 側翼專科教學大樓 (Classroom Wing) - 位於左側向後延伸
        this.block(g, { w: 6.8, d: 7.2, floors: 3, x: -8.2, z: -4.5, wall: 0xdecbb5, accent: 0x93735c });
        this.box(g, 7.2, 0.25, 7.6, -8.2, 7.5, -4.5, 0x486b58); // 綠瓦斜頂

        // 3. 後方森林運動場：PU 彩色田徑跑道與中央草坪 (置於校舍後方，徹底遠離馬路)
        // 磚紅色外環跑道 (Running Track)
        this.box(g, 16.5, 0.15, 9.5, 3.5, 0.1, -7.5, 0xb85b43);
        // 白色跑道標線
        this.box(g, 16.0, 0.18, 0.12, 3.5, 0.12, -2.9, 'white');
        this.box(g, 16.0, 0.18, 0.12, 3.5, 0.12, -12.1, 'white');
        // 中央翠綠色足球草坪 (Infield Grass)
        this.box(g, 12.5, 0.18, 6.2, 3.5, 0.13, -7.5, 0x5a8848);

        // 4. 升旗司令台與國旗桿 (位於操場內側)
        this.box(g, 2.8, 0.55, 1.8, -2.8, 0.35, -7.5, 'stone');
        this.box(g, 0.08, 5.2, 0.08, -2.8, 2.6, -7.5, 'stone');
        this.box(g, 0.8, 0.5, 0.04, -2.4, 4.8, -7.5, 0xc0392b); // 國旗

        // 5. 戶外籃球架 (位於操場東側)
        this.box(g, 0.12, 3.2, 0.12, 10.2, 1.6, -7.5, 'dark');
        this.box(g, 1.4, 0.9, 0.08, 10.2, 2.8, -7.5, 'white');
        this.box(g, 0.6, 0.08, 0.6, 9.8, 2.5, -7.5, 0xd05538); // 籃框

        // 6. 校園綠意林蔭樹
        this.tree(g, -6.5, 3.5, 1.15);
        this.tree(g, 6.5, 3.5, 1.15);
        this.tree(g, -11.5, -3.5, 1.1);
        this.tree(g, 11.5, -3.5, 1.1);
        this.tree(g, 3.5, -13.5, 1.2);
        break;
      case '29':
        // 納美花園 (Navi Garden)：萬坪歐式森林秘境莊園
        // 包含：雙層歐式白色木造主莊園、全景玻璃花房咖啡廳、草坪婚禮白木拱門、八角花園涼亭與景觀水池
        // 1. 雙層歐式白色主莊園 (Main Manor)
        this.house(g, { w: 9.8, d: 5.8, z: -2.2, wall: 'white', roof: 'roof', chimney: true, siding: true, porch: false });
        this.window(g, -2.8, 1.6, 0.8, 2.2, 1.8, 'white');
        this.window(g, 2.8, 1.6, 0.8, 2.2, 1.8, 'white');
        this.sign(g, '納美花園', 0, 3.2, 0.85, 3.6, '#435749', '#f9f5eb');

        // 2. 戶外全景玻璃花房咖啡館 (Glasshouse Cafe)
        this.greenhouse(g, -6.5, 2.8, 5.5, 4.2);

        // 3. 婚禮大草坪與白色花藝迎賓拱門 (Wedding Lawn & Arch)
        this.box(g, 8.5, 0.15, 6.5, 3.5, 0.08, 3.8, 0x769b60);
        // 白色婚禮拱門
        this.box(g, 0.18, 3.2, 0.18, 1.8, 1.6, 6.2, 'white');
        this.box(g, 0.18, 3.2, 0.18, 5.2, 1.6, 6.2, 'white');
        this.box(g, 3.8, 0.18, 0.18, 3.5, 3.2, 6.2, 'white');
        this.ball(g, 3.5, 3.3, 6.2, 0.8, 0.35, 0.35, 0xde708b); // 拱門花藝

        // 4. 白色八角歐式花園涼亭 (White Garden Gazebo)
        this.pavilion(g, 6.5, -2.5, 3.2, 0, 'white');

        // 5. 景觀水池與森林綠蔭
        this.pool(g, 0, 5.2, 4.2, 2.5);
        this.tree(g, -8.5, -3.5, 1.25, 0x5a8c52);
        this.tree(g, 8.8, 2.5, 1.15, 0x5a8c52);
        this.tree(g, -8.5, 5.5, 1.05, 0x6e9c60);
        this.bench(g, 3.5, 1.5, 'white');
        break;
      case '30':this.temple(g,true);break;
      case '31':
        // 臺灣銀行行員訓練所：陽明山金融人才深造培育基地
        // 包含：現代化行政教學大樓、大理石列柱迎賓穿堂、研習圖書側翼、前庭景觀花圃、臺銀深綠金字門額
        // 1. 主研習教學大樓 (Main Academic & Training Hall)
        this.block(g, { w: 12.8, d: 6.2, floors: 3, x: 0, z: -1.0, wall: 'cream', accent: 'stone' });
        // 大樓屋頂女兒牆與電梯機房通風塔
        this.box(g, 13.2, 0.4, 6.6, 0, 7.7, -1.0, 'stone');
        this.box(g, 4.0, 1.2, 3.0, 0, 8.4, -1.0, 'white');

        // 2. 迎賓大理石門柱穿堂 (Grand Marble Portico & Entrance)
        [-3.2, -1.1, 1.1, 3.2].forEach(px => {
          this.box(g, 0.45, 3.6, 0.45, px, 1.8, 2.8, 'stone');
        });
        // 穿堂挑高門額大雨遮與臺銀深綠飾帶
        this.box(g, 7.8, 0.35, 2.2, 0, 3.7, 2.8, 'stone');
        this.box(g, 7.2, 0.2, 1.8, 0, 3.9, 2.8, 0x1e4b38);
        // 正門大理石階梯
        this.box(g, 8.2, 0.25, 1.8, 0, 0.12, 3.2, 'stone');

        // 3. 臺灣銀行專屬標誌與門額
        this.sign(g, '臺灣銀行 行員訓練所', 0, 4.25, 2.92, 5.2, '#1e4b38', '#ffffff');

        // 4. 東側研習圖書翼館 (Library & Seminar Wing)
        this.block(g, { w: 5.6, d: 5.0, floors: 2, x: 7.8, z: -0.5, wall: 'cream', accent: 'stone' });
        this.box(g, 5.8, 0.3, 5.2, 7.8, 5.2, -0.5, 0x58874d);

        // 5. 前庭迎賓林蔭花圃與樹木 (Landscaped Forecourt)
        this.box(g, 4.5, 0.3, 2.2, -4.5, 0.15, 2.2, 'stone');
        this.box(g, 4.1, 0.2, 1.8, -4.5, 0.3, 2.2, 0x4e8045);
        this.tree(g, -5.2, 2.2, 1.1, 0x3d6635);
        this.tree(g, -3.8, 2.2, 0.95, 0x487940);
        this.tree(g, 9.2, 2.8, 1.15, 0x3d6635);
        break;
      case '32':
        // 吉佳咖啡 (山上店)：菁山路自烘咖啡老名店
        // 包含：溫馨木屋、外帶窗台、自烘咖啡排煙金屬管、黑金門額招牌、咖啡豆麻布袋、木長椅
        // 1. 溫暖木質與暖灰磚牆主屋
        this.house(g, { w: 8.8, d: 5.6, wall: 0xd9c2a7, roof: 0x423832, porch: false });
        // 2. 正面咖啡吧台外帶大木窗與暖光窗櫺
        this.window(g, -1.8, 1.6, 2.95, 2.2, 1.6, 'wood');
        this.box(g, 2.6, 0.2, 0.6, -1.8, 0.85, 3.2, 'wood'); // 外帶吧台木板
        this.window(g, 2.4, 1.6, 2.95, 1.6, 1.6, 'dark');
        // 3. 復古黑底金字「吉佳咖啡」招牌與深綠雨遮
        this.box(g, 4.8, 0.2, 1.2, 0, 2.85, 3.3, 0x2d4a3e); // 雨遮
        this.sign(g, '吉佳咖啡 JIJIA COFFEE', 0, 3.3, 2.98, 4.6, '#231f20', '#f4c542');
        // 4. 自家烘豆老店金屬排煙管與小煙囪
        this.box(g, 0.35, 2.8, 0.35, -3.8, 3.8, -1.2, 0x8c8f94);
        this.box(g, 0.55, 0.25, 0.55, -3.8, 5.25, -1.2, 0x5a5d62);
        // 5. 門前咖啡生豆麻布袋與戶外木椅
        this.box(g, 0.65, 0.75, 0.55, -3.2, 0.38, 2.6, 0xbfa37a); // 咖啡麻布袋 1
        this.box(g, 0.6, 0.7, 0.5, -2.5, 0.35, 2.7, 0xa88c65);   // 咖啡麻布袋 2
        this.bench(g, 2.4, 2.6, 'wood');
        this.tree(g, -3.8, 1.8, 0.85, 0x4f7d45);
        this.tree(g, 3.8, 2.0, 0.95, 0x4f7d45);
        break;
      case '33':
        // 真愛桃花源 庭園餐廳：陽明山七千坪歐風浪漫婚紗攝影與景觀庭園
        // 包含：白色哥德式尖頂禮拜堂、彩虹荷蘭風車、鏡面水景倒影池、玫瑰花架拱門、落羽松林木
        // 1. 白色哥德式婚紗主教堂 (White Gothic Chapel)
        this.box(g, 7.2, 4.5, 5.8, -3.5, 2.25, -1.0, 'white');
        this.roof(g, 7.6, 6.2, 2.8, -3.5, 5.9, -1.0, 'white'); // 尖頂斜屋頂
        // 哥德式正門尖塔鐘樓與十字架
        this.box(g, 2.2, 6.5, 2.2, -3.5, 3.25, 1.8, 'white');
        this.roof(g, 2.4, 2.4, 2.4, -3.5, 7.7, 1.8, 'white');
        this.box(g, 0.15, 1.2, 0.15, -3.5, 9.3, 1.8, 0xd4af37); // 金色十字架
        this.box(g, 0.8, 0.15, 0.15, -3.5, 9.6, 1.8, 0xd4af37);
        // 彩繪玫瑰花窗
        this.window(g, -3.5, 4.5, 2.92, 1.2, 1.2, 'glass');

        // 2. 彩虹荷蘭大風車 (Rainbow Dutch Windmill)
        this.box(g, 3.2, 5.2, 3.2, 4.8, 2.6, -1.8, 0xb84a39); // 紅磚風車塔基
        this.roof(g, 3.4, 3.4, 1.8, 4.8, 6.1, -1.8, 0x2b4c6f);
        // 風車四葉葉片
        this.box(g, 4.8, 0.25, 0.08, 4.8, 5.2, -0.15, 'white');
        this.box(g, 0.25, 4.8, 0.08, 4.8, 5.2, -0.15, 'white');
        this.ball(g, 4.8, 5.2, -0.1, 0.35, 0.35, 0.35, 0xd4af37);

        // 3. 歐式倒影鏡面景觀水池 (Reflecting Pond)
        this.box(g, 8.5, 0.35, 4.2, 0, 0.18, 3.2, 'stone');
        this.box(g, 7.9, 0.25, 3.6, 0, 0.25, 3.2, 0x489fb5); // 水藍色水面
        this.ball(g, 0, 0.7, 3.2, 0.45, 0.55, 0.45, 'glass'); // 噴泉

        // 4. 浪漫玫瑰花拱門與迎賓長椅 (Floral Arch & Benches)
        this.box(g, 0.2, 2.6, 0.2, -1.5, 1.3, 4.2, 'white');
        this.box(g, 0.2, 2.6, 0.2, 1.5, 1.3, 4.2, 'white');
        this.box(g, 3.2, 0.2, 0.2, 0, 2.6, 4.2, 0xde5d83); // 玫瑰花藤
        this.bench(g, -3.2, 2.8, 'white');
        this.bench(g, 3.2, 2.8, 'white');

        // 5. 落羽松與莊園大招牌
        this.tree(g, -7.5, 3.2, 1.4, 0xb85d19); // 秋紅落羽松
        this.tree(g, -6.8, 2.6, 1.1, 0x4a7c38);
        this.tree(g, 7.2, 3.0, 1.25, 0xb85d19);
        this.sign(g, '真愛桃花源 庭園餐廳', 0, 3.1, 4.35, 4.6, '#4a2c20', '#fff8e7');
        break;
      case '34':
        // 臺北市教師研習中心：日治草山眾樂園古蹟溫泉會館風貌
        // 包含：日洋折衷主館、黑瓦大斜頂、歇山破風門額玄關、通風採光天窗八角閣、日式石燈籠、黑松庭園
        // 1. 日洋折衷研習大樓主館 (Main Heritage Hall)
        this.box(g, 13.5, 1.2, 7.2, 0, 0.6, -1.0, 'stone'); // 洗石子高基座
        this.block(g, { w: 12.8, d: 6.5, floors: 2, x: 0, z: -1.0, wall: 0xdecbb5, accent: 'wood' });
        // 典雅日式黑瓦歇山大斜頂
        this.roof(g, 14.2, 7.6, 2.6, 0, 5.8, -1.0, 0x2e3532);
        
        // 2. 中央突出的草山浴場採光天窗通風閣樓 (Ventilation Monitor Tower)
        this.box(g, 4.2, 1.5, 3.2, 0, 6.8, -1.0, 'cream');
        this.roof(g, 4.8, 3.8, 1.4, 0, 7.9, -1.0, 0x2e3532);
        this.window(g, 0, 6.8, 0.62, 2.4, 0.9, 'wood');

        // 3. 氣派日式破風大玄關門額 (Grand Porch & Gable Entrance)
        [-2.6, 2.6].forEach(px => {
          this.box(g, 0.35, 3.2, 0.35, px, 1.6, 2.8, 'wood');
        });
        this.roof(g, 6.2, 2.8, 1.6, 0, 3.8, 2.8, 0x2e3532); // 破風大雨遮
        this.box(g, 6.8, 0.25, 1.8, 0, 0.12, 3.2, 'stone'); // 迎賓大理石前階
        this.sign(g, '臺北市教師研習中心', 0, 3.3, 2.92, 5.2, '#2d4739', '#fbf4e2');

        // 4. 連續日式木格窗與木構迴廊
        [-4.5, 4.5].forEach(wx => {
          this.window(g, wx, 2.4, 2.28, 2.8, 1.4, 'wood');
        });

        // 5. 草山日式庭園：日式石燈籠、黑松林與景觀石
        // 石燈籠 (Stone Lantern)
        this.box(g, 0.5, 0.8, 0.5, -4.5, 0.4, 2.8, 'stone');
        this.box(g, 0.7, 0.2, 0.7, -4.5, 0.9, 2.8, 'stone');
        this.ball(g, -4.5, 1.15, 2.8, 0.25, 0.25, 0.25, 'white');
        this.box(g, 0.8, 0.15, 0.8, -4.5, 1.35, 2.8, 'stone');
        // 黑松與林蔭造景
        this.tree(g, -5.8, 2.4, 1.25, 0x2d4e35);
        this.tree(g, 5.8, 2.6, 1.3, 0x2d4e35);
        this.tree(g, 7.2, 2.0, 1.0, 0x3d6642);
        this.bench(g, 4.2, 2.8, 'wood');
        break;
      case '35':
        // 林洋港故居 (前美軍總司令官邸)：愛富二街 1 號最高規格美軍官舍
        // 包含：寬幅美式南方洋房、紅磚高聳煙囪、迎賓大木迴廊(Front Porch)、將官旗桿、百年老樟樹、名邸木牌
        // 1. 將官級寬闊美式南方木屋主體 (General's Southern Ranch Villa)
        this.house(g, { w: 12.0, d: 5.8, wall: 0xede8dc, roof: 0x3d4349, porch: true });
        // 2. 經典大面雙層木格窗與陽光落地窗 (Picture Windows)
        this.window(g, -3.8, 1.6, 3.05, 2.2, 1.6, 'wood');
        this.window(g, 3.8, 1.6, 3.05, 2.2, 1.6, 'wood');
        this.window(g, -1.8, 1.6, 3.05, 1.4, 1.6, 'dark');
        // 3. 高聳粗獷紅磚雙管壁爐煙囪 (Red Brick Double Chimney)
        this.box(g, 1.2, 5.8, 0.9, -5.2, 2.9, -0.2, 0xa34a38);
        this.box(g, 1.4, 0.25, 1.1, -5.2, 5.9, -0.2, 0x8a3c2c);
        this.box(g, 0.3, 0.45, 0.3, -5.5, 6.2, -0.2, 'stone');
        this.box(g, 0.3, 0.45, 0.3, -4.9, 6.2, -0.2, 'stone');
        // 4. 司令官邸大門名牌匾額與將官迎賓旗桿 (Sign & Flagpole)
        this.sign(g, '林洋港故居 (前美軍總司令官邸)', 0, 3.3, 3.32, 5.8, '#3d2b1f', '#fbf5e6');
        // 迎賓升旗桿 (Flagpole)
        this.box(g, 0.15, 6.2, 0.15, 4.8, 3.1, 4.2, 'white');
        this.ball(g, 4.8, 6.25, 4.2, 0.22, 0.22, 0.22, 0xd4af37); // 金色球頂
        this.box(g, 1.0, 0.6, 0.05, 4.3, 5.6, 4.2, 0x1f3c88);     // 將官旗幟
        // 5. 百年老樟樹、低矮綠樹籬與庭院草坪 (Century Trees & Garden)
        this.tree(g, -6.5, 3.5, 1.5, 0x2e5936); // 老樟樹
        this.tree(g, 6.2, 3.2, 1.35, 0x3d6642);
        this.box(g, 12.8, 0.4, 0.4, 0, 0.2, 4.8, 0x3d6635); // 正面矮樹籬
        this.bench(g, 1.8, 3.6, 'wood');
        break;
      case '36':
        // 文化大學學生美食街 (牛肉拌麵 / 感恩麵店)：光華路文大生活圈核心
        // 包含：雙拼台式美食老街屋、牛肉乾拌麵經典大紅招牌與紅遮雨棚、感恩麵店、自取大骨牛肉清湯大白鐵桶、大蒜蒜泥盆、大紅燈籠、戶外木方桌板凳與學生機車
        // 1. 左棟：傳奇「牛肉乾拌麵」老店 (Famous Beef Tossed Noodle Shop)
        this.box(g, 6.0, 0.28, 5.2, -2.6, 0.14, 0, 'stone');
        this.box(g, 5.8, 3.2, 5.0, -2.6, 1.74, 0, 0xf6f1e8); // 溫暖米白色老宅牆面
        this.roof(g, 6.4, 5.6, 3.4, 1.15, 0x4a433d, -2.6, 0, true); // 深灰日洋瓦頂
        // 經典波浪紅雨棚與大紅大字橫牌
        this.box(g, 5.8, 0.2, 1.8, -2.6, 2.8, 3.0, 0xc62828); // 鮮紅遮雨棚
        this.sign(g, '文化大學傳奇 牛肉乾拌麵 (光華路總店)', -2.6, 3.15, 2.55, 5.2, '#c62828', '#fff8e1');
        // 白鐵不鏽鋼煮麵料理台、大湯鍋與大蒜蒜泥盆
        this.box(g, 2.8, 0.85, 1.0, -3.2, 0.55, 2.8, 'metal');
        this.box(g, 0.5, 0.4, 0.5, -4.0, 1.15, 2.8, 'metal');  // 大骨清湯鍋（免費任喝！）
        this.box(g, 0.5, 0.35, 0.5, -3.2, 1.12, 2.8, 'metal'); // 煮麵滾水鍋
        this.box(g, 0.35, 0.22, 0.35, -2.4, 1.05, 2.8, 0xf5f5f5); // 大蒜蒜泥盆
        // 大紅燈籠 (Red Lanterns)
        this.ball(g, -4.6, 2.4, 3.4, 0.22, 0.28, 0.22, 0xd32f2f);
        this.ball(g, -2.6, 2.4, 3.4, 0.22, 0.28, 0.22, 0xd32f2f);
        this.ball(g, -0.6, 2.4, 3.4, 0.22, 0.28, 0.22, 0xd32f2f);

        // 2. 右棟：感恩麵店與學生熱炒食堂 (Gan-En Noodle & Fried Rice House)
        this.box(g, 5.4, 0.25, 4.8, 3.2, 0.12, 0, 'stone');
        this.box(g, 5.2, 2.9, 4.6, 3.2, 1.57, 0, 0xecd9c6); // 暖黃紅磚外牆
        this.box(g, 5.2, 0.8, 0.2, 3.2, 0.52, 2.35, 'brick'); // 底部清水紅磚
        this.roof(g, 5.8, 5.2, 3.1, 1.05, 0x8d5b38, 3.2, 0, true); // 棕色屋頂
        this.sign(g, '感恩麵店 · 學生熱炒便當', 3.2, 2.9, 2.42, 4.6, '#3e2723', '#fff9c4');
        this.door(g, 2.0, 2.35, 2.1, 'wood');
        this.window(g, 4.2, 1.65, 2.35, 1.6, 1.3, 'wood');

        // 3. 騎樓學生用餐區（方桌、圓凳）與機車
        // 用餐木方桌與板凳
        this.box(g, 1.3, 0.72, 0.85, 3.6, 0.42, 3.4, 'wood');
        this.box(g, 0.35, 0.42, 0.35, 2.8, 0.25, 3.4, 0x8d5b38);
        this.box(g, 0.35, 0.42, 0.35, 4.4, 0.25, 3.4, 0x8d5b38);
        // 學生機車 1 (藍色)
        this.box(g, 0.35, 0.65, 1.2, -0.2, 0.42, 4.2, 0x1976d2);
        this.box(g, 0.28, 0.15, 0.6, -0.2, 0.78, 4.0, 'dark');
        this.box(g, 0.3, 0.4, 0.08, -0.2, 0.95, 4.6, 'metal');
        // 學生機車 2 (白色)
        this.box(g, 0.35, 0.65, 1.2, 1.0, 0.42, 4.2, 0xffffff);
        this.box(g, 0.28, 0.15, 0.6, 1.0, 0.78, 4.0, 'dark');
        // 街角暖黃路燈與小樹
        this.box(g, 0.12, 3.6, 0.12, -5.6, 1.8, 3.6, 'dark');
        this.ball(g, -5.6, 3.65, 3.6, 0.24, 0.24, 0.24, 0xfff9c4);
        this.tree(g, 5.8, 2.2, 1.15, 0x3d7042);
        break;
      case '37':
        // 文化大學郵局 (華岡大典館)：華岡路 55 號大典館一樓
        // 包含：大典館古典現代校舍基座與紅柱長廊、中華郵政綠白局舍、經典紅綠雙郵筒、ATM專區、中華郵政綠色郵務機車、校園松樹
        // 1. 大典館一樓校舍主體 (Dadian Hall 1F Podium)
        this.box(g, 10.5, 0.35, 6.0, 0, 0.175, 0, 'stone');
        this.box(g, 10.0, 3.8, 5.6, 0, 2.075, 0, 0xf0eee9); // 大典館淡灰白主牆
        // 文大古典建築特色：紅柱大樑橫帶
        this.box(g, 10.4, 0.3, 5.8, 0, 3.9, 0, 0x9e2a2b);   // 頂層紅樑
        this.box(g, 0.35, 3.8, 0.35, -4.6, 2.0, 2.85, 0x9e2a2b); // 左外側紅柱
        this.box(g, 0.35, 3.8, 0.35, 4.6, 2.0, 2.85, 0x9e2a2b);  // 右外側紅柱
        this.roof(g, 11.2, 6.4, 4.2, 1.25, 0x3d4349, 0, 0, true); // 深灰瓦頂

        // 2. 中華郵政局舍門面 (Chunghwa Post Office Facade)
        // 經典郵政綠招牌帶
        this.box(g, 7.2, 0.65, 0.18, 0, 3.3, 2.85, 0x1b5e20);
        this.sign(g, '中華郵政 文化大學郵局 (臺北125支局)', 0, 3.3, 2.96, 6.8, '#1b5e20', '#ffffff');
        // 郵局營業大廳大門與大面落地玻璃窗
        this.door(g, -1.2, 2.82, 2.2, 'wood');
        this.window(g, 1.6, 1.8, 2.82, 2.2, 1.6, 'frame');
        // 24小時 ATM 提款機專區
        this.box(g, 1.1, 2.2, 0.2, 3.4, 1.25, 2.82, 0x2e7d32);
        this.box(g, 0.7, 0.8, 0.22, 3.4, 1.5, 2.83, 0x90caf9); // ATM 螢幕

        // 3. 經典一紅一綠立體雙郵筒 (Red & Green Mailboxes)
        // 綠色平信郵筒
        this.box(g, 0.42, 0.8, 0.38, -3.2, 0.48, 3.8, 0x2e7d32);
        this.box(g, 0.46, 0.14, 0.42, -3.2, 0.94, 3.8, 0x1b5e20);
        // 紅色限時/航空郵筒
        this.box(g, 0.42, 0.8, 0.38, -2.4, 0.48, 3.8, 0xc62828);
        this.box(g, 0.46, 0.14, 0.42, -2.4, 0.94, 3.8, 0x8e0000);

        // 4. 中華郵政綠色郵務野狼機車 (Postal Motorcycle)
        this.box(g, 0.35, 0.65, 1.2, -4.2, 0.42, 4.3, 0x1b5e20); // 綠色車身
        this.box(g, 0.48, 0.4, 0.45, -4.2, 0.85, 3.8, 0x1b5e20);  // 後座載信大鐵箱
        this.box(g, 0.28, 0.15, 0.5, -4.2, 0.78, 4.2, 'dark');    // 座墊
        this.box(g, 0.3, 0.4, 0.08, -4.2, 0.95, 4.8, 'metal');    // 龍頭

        // 5. 華岡校園松樹、長椅與校舍路燈
        this.tree(g, 5.2, 2.4, 1.3, 0x2e5936); // 校園黑松
        this.tree(g, -5.2, 2.0, 1.1, 0x3d6642);
        this.bench(g, 2.4, 3.8, 'wood');
        this.box(g, 0.12, 3.8, 0.12, 4.5, 1.9, 4.2, 'dark');
        this.ball(g, 4.5, 3.85, 4.2, 0.24, 0.24, 0.24, 0xfff9c4);
        break;
      case '38':
        // 比夢烘焙坊 (The Cafe' By 想 陽明山)：愛富一街 4 號美軍老舍歐風手作烘焙坊
        // 包含：美軍宿舍清水紅磚歐風木屋、大面積陽光採光玻璃屋(Sunroom)、戶外白色大遮陽傘、落羽松庭園、手工麵包大陳列窗與咖啡長椅
        // 1. 美軍宿舍歐風烘焙主木屋 (Main Bakery Cottage)
        this.box(g, 7.8, 0.28, 5.4, -1.8, 0.14, 0, 'stone');
        this.box(g, 7.5, 3.2, 5.0, -1.8, 1.74, 0, 0xfbf7ed); // 象牙白美式雨淋板外牆
        this.box(g, 7.5, 0.85, 0.22, -1.8, 0.55, 2.55, 'brick'); // 底部復古清水紅磚
        this.roof(g, 8.2, 5.8, 3.4, 1.2, 0x423832, -1.8, 0, true); // 深灰棕雙坡美式屋頂
        // 歐風木質招牌帶
        this.box(g, 6.2, 0.65, 0.16, -1.8, 3.05, 2.65, 0x5c4033);
        this.sign(g, '比夢烘焙坊 BIMON BAKERY', -1.8, 3.05, 2.76, 5.6, '#5c4033', '#fff9e6');
        // 烘焙大門與麵包大展示窗
        this.door(g, -3.2, 2.55, 2.2, 'wood');
        this.window(g, -0.6, 1.8, 2.55, 2.2, 1.5, 'wood');
        // 金黃手工生吐司與法式麵包陳列台 (Bread Display)
        this.box(g, 1.8, 0.75, 0.6, -0.6, 0.8, 2.2, 0x8d5b38); // 木質陳列架
        this.box(g, 0.35, 0.25, 0.25, -1.1, 1.3, 2.2, 0xdfa052); // 金黃生吐司 1
        this.box(g, 0.35, 0.25, 0.25, -0.6, 1.3, 2.2, 0xdfa052); // 金黃生吐司 2
        this.box(g, 0.35, 0.25, 0.25, -0.1, 1.3, 2.2, 0xdfa052); // 金黃生吐司 3

        // 2. 側邊延伸陽光玻璃屋 (Glasshouse Dining Sunroom)
        this.box(g, 4.2, 0.25, 4.6, 3.6, 0.12, 0, 'stone');
        this.box(g, 4.0, 2.8, 4.2, 3.6, 1.52, 0, 'glass'); // 陽光透明玻璃帷幕
        // 玻璃屋白色格框
        this.box(g, 0.12, 2.8, 4.2, 1.6, 1.52, 0, 'white');
        this.box(g, 0.12, 2.8, 4.2, 5.6, 1.52, 0, 'white');
        this.box(g, 4.0, 0.12, 4.2, 3.6, 2.92, 0, 'white');
        this.roof(g, 4.6, 4.8, 3.0, 0.9, 0x8a9ba8, 3.6, 0, true); // 淺藍天光斜頂

        // 3. 戶外庭院白色大遮陽傘與咖啡木桌椅
        this.box(g, 0.08, 2.6, 0.08, 1.8, 1.3, 3.8, 'metal'); // 傘柱
        this.roof(g, 2.4, 2.4, 2.6, 0.45, 0xffffff, 1.8, 3.8, true); // 白色大遮陽傘
        this.box(g, 0.8, 0.72, 0.8, 1.8, 0.4, 3.8, 'wood'); // 圓方木桌
        this.box(g, 0.3, 0.42, 0.3, 1.2, 0.25, 3.8, 0x5c4033); // 咖啡椅 1
        this.box(g, 0.3, 0.42, 0.3, 2.4, 0.25, 3.8, 0x5c4033); // 咖啡椅 2

        // 4. 落羽松大庭園、矮樹籬與花圃
        this.tree(g, -5.6, 2.6, 1.45, 0xa36a3e); // 秋冬橙黃色落羽松
        this.tree(g, 5.4, 3.0, 1.3, 0x2e5936);  // 庭園綠樹
        this.box(g, 12.0, 0.4, 0.3, 0, 0.2, 4.6, 0x3d6635); // 庭園矮灌木矮籬
        break;
      case '39': {
        // 39 康迎鼎 陽明山店 (完全還原現場實景：粉紅木山牆眷舍、白煙囪、粉紅立柱書法招牌、前庭半球幾何透明穹頂球屋與小籠包)
        this.lawn(g, 11, 9, 0, 0);

        // 1. 美軍改建美式中式餐廳主屋 (粉紅山牆 + 純白粉牆 + 黑瓦斜頂)
        this.box(g, 8.2, 0.25, 5.4, 0, 0.12, -0.5, 'stone');
        // 下半截純白牆體
        this.box(g, 7.8, 2.2, 5.0, 0, 1.25, -0.5, 0xffffff);
        // 上半截經典「亮粉紅山牆木板」 (Pink Gable Siding)
        this.box(g, 7.8, 1.4, 5.02, 0, 2.7, -0.5, 0xf06292);
        // 黑瓦雙坡屋頂 (Dark Shingle Roof)
        this.roof(g, 8.6, 5.8, 3.4, 1.25, 0x38393d, 0, -0.5, true);
        // 屋脊中央「純白磚造煙囪」 (White Chimney)
        this.box(g, 0.9, 2.2, 0.9, 0, 3.8, -0.5, 0xffffff);
        this.box(g, 1.05, 0.15, 1.05, 0, 4.95, -0.5, 0x212121); // 煙囪黑鐵蓋
        // 正門入口木門與百葉氣窗
        this.door(g, 1.6, 1.95, 2.0, 'wood');
        this.box(g, 1.2, 0.8, 0.1, 1.6, 2.4, 2.02, 0xf5f5f5);

        // 2. 右側入口標誌性「高聳粉紅長方柱大燈箱」 (Pink Column Landmark Sign)
        const signX = 3.6;
        const signZ = 3.2;
        // 粉紅方柱 (高 3.4m, 寬 0.85m)
        this.box(g, 0.85, 3.4, 0.85, signX, 1.7, signZ, 0xe91e63);
        // 白底黑紅書法字招牌板 (Com In Dim 康迎鼎)
        this.box(g, 0.75, 2.8, 0.08, signX, 1.7, signZ + 0.44, 0xffffff);
        this.sign(g, '康迎鼎 Com In Dim', signX, 2.2, signZ + 0.5, 2.4, '#e91e63', '#ffffff');

        // 3. 右側木棧道平台 (Wooden Boardwalk)
        this.box(g, 2.0, 0.1, 4.5, 2.0, 0.05, 1.8, 0xa1887f); // 淺灰木板走道

        // 4. 前庭最吸睛核心地標：半球幾何透明穹頂球屋 (Geodesic Transparent Glass Dome)
        const domeX = -1.6;
        const domeZ = 2.2;
        const domeRadius = 1.65;
        // 圓形水泥矮台基
        this.cylinder(g, domeRadius + 0.1, domeRadius + 0.15, 0.25, domeX, 0.12, domeZ, 'stone');

        // 半球形透明天棚玻璃 (Glass Dome)
        const domeGeom = new THREE.SphereGeometry(domeRadius, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMat = new THREE.MeshStandardMaterial({
          color: 0xe0f7fa,
          transparent: true,
          opacity: 0.42,
          roughness: 0.1,
          metalness: 0.1,
          side: THREE.DoubleSide
        });
        const domeMesh = new THREE.Mesh(domeGeom, domeMat);
        domeMesh.position.set(domeX, 0.25, domeZ);
        g.add(domeMesh);

        // 半球幾何金屬三角網格支架 (Geodesic Wireframe)
        const wireGeom = new THREE.WireframeGeometry(domeGeom);
        const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1.5 });
        const wireMesh = new THREE.LineSegments(wireGeom, wireMat);
        wireMesh.position.set(domeX, 0.25, domeZ);
        g.add(wireMesh);

        // 5. 玻璃球屋內：超萌圓滾白嫩小籠包群 (Cute Steaming Xiao Long Bao inside the Dome)
        // 中央圓形蒸籠盤
        this.cylinder(g, 1.0, 1.05, 0.2, domeX, 0.35, domeZ, 0xd2b48c); // 竹黃蒸籠底
        // 主角大白小籠包 (中央)
        const baoList = [
          [domeX, 0.45, domeZ, 0.38],
          [domeX - 0.45, 0.45, domeZ - 0.25, 0.28],
          [domeX + 0.45, 0.45, domeZ - 0.2, 0.28],
          [domeX - 0.2, 0.45, domeZ + 0.4, 0.26],
          [domeX + 0.3, 0.45, domeZ + 0.35, 0.26]
        ];
        baoList.forEach(([bx, by, bz, br], bIdx) => {
          // 白嫩包子身軀
          this.sphere(g, br, bx, by + br, bz, 0xfffef7);
          // 頂端抓褶尖尖
          this.cylinder(g, br * 0.15, br * 0.4, br * 0.3, bx, by + br * 1.8, bz, 0xffeedd);
          // 只有中央大包子加萌萌笑臉
          if (bIdx === 0) {
            this.sphere(g, 0.05, bx - 0.12, by + br * 1.1, bz + br * 0.85, 0x212121); // 左眼
            this.sphere(g, 0.05, bx + 0.12, by + br * 1.1, bz + br * 0.85, 0x212121); // 右眼
            this.sphere(g, 0.06, bx - 0.2, by + br * 0.85, bz + br * 0.8, 0xff8a80);  // 左腮紅
            this.sphere(g, 0.06, bx + 0.2, by + br * 0.85, bz + br * 0.8, 0xff8a80);  // 右腮紅
            this.box(g, 0.08, 0.04, 0.04, bx, by + br * 0.8, bz + br * 0.95, 0xd32f2f); // 小紅嘴
          }
        });

        // 6. 前庭綠樹與灌木籬笆
        this.tree(g, -4.6, 1.8, 1.2, 0x2e7d32);
        this.tree(g, -4.2, -1.8, 1.3, 0x1b5e20);
        this.tree(g, 4.4, -1.8, 1.2, 0x2e7d32);
        this.box(g, 0.4, 1.2, 4.0, -4.8, 0.6, 1.8, 0x2e7d32); // 綠灌木矮籬
        break;
      }
      case '40':
        // 大衛小小羊 (David & Alpaca)：國泰街 9 號美軍宿舍草泥馬(羊駝)景觀餐廳
        // 包含：美式黃白鄉村木屋、草坪白色木柵欄圍欄、兩隻可愛親人的立體白色羊駝(草泥馬)、牧草食槽與戶外休閒遮陽傘
        // 1. 美軍眷舍鄉村主屋 (Main Country Cottage)
        this.box(g, 7.6, 0.28, 5.2, -1.5, 0.14, 0, 'stone');
        this.box(g, 7.2, 3.0, 4.8, -1.5, 1.64, 0, 0xfbf2d5); // 暖黃色美式木外牆
        this.roof(g, 8.0, 5.6, 3.2, 1.15, 0x48423d, -1.5, 0, true); // 深灰美式雙坡瓦頂
        // 歐風童話招牌
        this.box(g, 6.0, 0.65, 0.16, -1.5, 2.9, 2.55, 0x5d4037);
        this.sign(g, '大衛小小羊 David & Alpaca', -1.5, 2.9, 2.66, 5.4, '#5d4037', '#fff8e7');
        this.door(g, -3.2, 2.45, 2.1, 'wood');
        this.window(g, -0.6, 1.7, 2.45, 2.0, 1.4, 'wood');

        // 2. 草泥馬(羊駝)放牧草坪與白色木柵欄 (Alpaca Paddock)
        this.box(g, 5.6, 0.06, 4.0, 2.5, 0.03, 3.2, 0x5b8743); // 嫩綠色放牧草坪
        // 白色木圍欄
        this.box(g, 5.6, 0.8, 0.08, 2.5, 0.45, 5.2, 'white');
        this.box(g, 0.08, 0.8, 4.0, 5.3, 0.45, 3.2, 'white');

        // 3. 兩隻立體萌系白色羊駝 (Two Fluffy White Alpacas)
        // 羊駝 1 (站立親人)
        this.ball(g, 1.6, 0.85, 3.6, 0.65, 0.45, 0.45, 0xfdfdfb); // 蓬鬆身軀
        this.box(g, 0.22, 0.85, 0.22, 1.85, 1.35, 3.6, 0xfdfdfb); // 長長細脖子
        this.ball(g, 1.85, 1.85, 3.6, 0.26, 0.24, 0.32, 0xfdfdfb); // 呆萌頭部
        this.ball(g, 1.95, 2.02, 3.5, 0.06, 0.14, 0.06, 0xfdfdfb);  // 左尖耳
        this.ball(g, 1.95, 2.02, 3.7, 0.06, 0.14, 0.06, 0xfdfdfb);  // 右尖耳
        this.ball(g, 2.02, 1.82, 3.55, 0.04, 0.04, 0.04, 'dark');   // 圓黑眼珠
        this.ball(g, 2.02, 1.82, 3.65, 0.04, 0.04, 0.04, 'dark');
        // 四條細腿
        this.box(g, 0.1, 0.55, 0.1, 1.35, 0.28, 3.45, 0xf0efe8);
        this.box(g, 0.1, 0.55, 0.1, 1.35, 0.28, 3.75, 0xf0efe8);
        this.box(g, 0.1, 0.55, 0.1, 1.85, 0.28, 3.45, 0xf0efe8);
        this.box(g, 0.1, 0.55, 0.1, 1.85, 0.28, 3.75, 0xf0efe8);

        // 羊駝 2 (低頭吃草料)
        this.ball(g, 3.6, 0.75, 4.0, 0.58, 0.42, 0.42, 0xfbfbf8);
        this.box(g, 0.2, 0.65, 0.2, 3.9, 0.95, 4.0, 0xfbfbf8);
        this.ball(g, 4.1, 0.8, 4.0, 0.24, 0.22, 0.28, 0xfbfbf8); // 低頭吃草
        // 木質牧草食槽與胡蘿蔔
        this.box(g, 0.9, 0.35, 0.5, 4.4, 0.2, 4.0, 0x8d5b38);
        this.box(g, 0.25, 0.15, 0.12, 4.4, 0.4, 4.0, 0xff7043); // 橙色胡蘿蔔

        // 4. 戶外遮陽傘與落羽松綠意
        this.box(g, 0.08, 2.4, 0.08, -3.8, 1.2, 3.8, 'metal');
        this.roof(g, 2.2, 2.2, 2.4, 0.4, 0xfff9c4, -3.8, 3.8, true); // 暖黃遮陽傘
        this.tree(g, -5.6, 2.6, 1.3, 0x2e5936);
        break;
      case '41': {
        // 朱里昂法式廚房 (C.L Program)：國泰街 3 號亮黃歐風美軍老木屋
        this.lawn(g, 10, 8, 0, 0);

        // 1. 鮮黃美式木屋主建築 (Bright Yellow Country Cottage)
        this.box(g, 8.0, 0.28, 5.4, 0, 0.14, 0, 'stone');
        this.box(g, 7.6, 3.2, 5.0, 0, 1.74, 0, 0xfbc02d); // 標誌性明亮暖黃色外牆
        this.roof(g, 8.4, 5.8, 3.4, 1.2, 0x4e342e, 0, 0, true); // 濃郁深棕色美式雙坡瓦頂
        // 藍白條紋法式遮陽棚 (Blue-and-White French Awning)
        this.box(g, 6.0, 0.18, 1.6, 0, 2.8, 2.9, 0x1976d2); // 皇家藍
        this.box(g, 1.2, 0.2, 1.62, -1.8, 2.8, 2.9, 0xffffff); // 白色條紋 1
        this.box(g, 1.2, 0.2, 1.62, 0.6, 2.8, 2.9, 0xffffff);  // 白色條紋 2
        // 招牌
        this.box(g, 6.4, 0.65, 0.16, 0, 3.1, 2.55, 0x3e2723);
        this.sign(g, '朱里昂法式廚房 Julien Kitchen (頂級可麗露)', 0, 3.1, 2.66, 5.8, '#3e2723', '#fff9c4');
        this.door(g, -2.0, 2.55, 2.2, 'wood');
        this.window(g, 1.8, 1.8, 2.55, 2.0, 1.4, 'wood');

        // 2. 招牌「法式可麗露 (Canelé)」展示玻璃櫃 (Canelé Display Counter)
        this.box(g, 1.6, 0.85, 0.65, 1.8, 0.6, 2.2, 'wood');
        this.box(g, 1.5, 0.6, 0.55, 1.8, 1.15, 2.2, 'glass'); // 玻璃罩
        // 3 顆精緻深焦糖色可麗露 (Canelés)
        this.box(g, 0.22, 0.24, 0.22, 1.4, 1.0, 2.2, 0x3e2723);
        this.box(g, 0.22, 0.24, 0.22, 1.8, 1.0, 2.2, 0x3e2723);
        this.box(g, 0.22, 0.24, 0.22, 2.2, 1.0, 2.2, 0x3e2723);

        // 3. 戶外法式咖啡小圓桌椅與花圃 (French Cafe Patio)
        this.box(g, 0.06, 0.72, 0.06, -3.2, 0.36, 3.6, 'metal');
        this.box(g, 0.8, 0.05, 0.8, -3.2, 0.72, 3.6, 'wood'); // 咖啡圓桌
        this.box(g, 0.32, 0.42, 0.32, -3.8, 0.25, 3.6, 0x3e2723);
        this.box(g, 0.32, 0.42, 0.32, -2.6, 0.25, 3.6, 0x3e2723);

        // 4. 繁花綠意庭園
        this.tree(g, -4.5, 2.0, 1.1, 0x2e5936);
        this.tree(g, 4.5, 2.2, 1.2, 0xa36a3e);
        break;
      }
      case '42':
        // 文化大學後山「情人坡」：全台北第一浪漫夜景勝地
        // 包含：挑高木棧觀景平台、雙筒觀景望遠鏡、台北盆地夜景解說銅牌、雙人觀景木椅、情侶約會機車與暖黃街燈
        // 1. 挑高斜坡雙層木棧觀景平台 (Tiered Timber Lookout Deck)
        this.box(g, 10.5, 0.35, 6.4, 0, 0.18, 0, 0x5c4033); // 下層深色防腐木平台
        this.box(g, 8.8, 0.45, 4.8, 0, 0.58, -0.6, 0x795548); // 上層挑高觀景主台
        // 安全木護欄 (Safety Railings)
        this.box(g, 10.5, 0.85, 0.12, 0, 0.78, -3.2, 0x4e342e); // 北側懸崖展望護欄
        this.box(g, 0.12, 0.85, 6.4, -5.2, 0.78, 0, 0x4e342e);
        this.box(g, 0.12, 0.85, 6.4, 5.2, 0.78, 0, 0x4e342e);

        // 2. 標誌銘牌：台北百萬夜景全景導覽解說牌 (Night View Panorama Plaque)
        this.box(g, 0.15, 1.4, 0.15, 0, 0.7, -3.1, 'wood');
        this.sign(g, '文化大學後山「情人坡」· 台北百萬夜景', 0, 1.45, -3.02, 5.2, '#0d1b2a', '#ffea00');

        // 3. 投幣式金屬雙筒觀景望遠鏡 (Binocular Lookout Scope)
        this.box(g, 0.16, 1.1, 0.16, -2.4, 1.1, -2.6, 'metal'); // 支架
        this.box(g, 0.45, 0.18, 0.5, -2.4, 1.7, -2.6, 'metal');  // 雙筒望遠鏡身
        this.box(g, 0.16, 1.1, 0.16, 2.4, 1.1, -2.6, 'metal');
        this.box(g, 0.45, 0.18, 0.5, 2.4, 1.7, -2.6, 'metal');

        // 4. 雙人約會觀景木質長椅 (Scenic Benches)
        this.bench(g, -3.2, -0.8, 'wood');
        this.bench(g, 3.2, -0.8, 'wood');

        // 5. 情侶約會機車群 (Dating Scooters)
        // 紅色機車
        this.box(g, 0.35, 0.65, 1.2, -2.8, 0.42, 2.8, 0xd32f2f);
        this.box(g, 0.28, 0.15, 0.6, -2.8, 0.78, 2.6, 'dark');
        this.box(g, 0.3, 0.4, 0.08, -2.8, 0.95, 3.2, 'metal');
        // 黑色機車
        this.box(g, 0.35, 0.65, 1.2, -1.8, 0.42, 2.8, 0x212121);
        this.box(g, 0.28, 0.15, 0.6, -1.8, 0.78, 2.6, 'dark');
        this.box(g, 0.3, 0.4, 0.08, -1.8, 0.95, 3.2, 'metal');

        // 6. 復古景觀雙球街燈柱與草坡
        this.box(g, 0.14, 4.2, 0.14, 3.8, 2.1, 2.6, 'dark');
        this.ball(g, 3.4, 4.25, 2.6, 0.26, 0.26, 0.26, 0xfff59d); // 暖黃燈球 1
        this.ball(g, 4.2, 4.25, 2.6, 0.26, 0.26, 0.26, 0xfff59d); // 暖黃燈球 2
        this.tree(g, -5.6, 2.4, 1.2, 0x2e5936);
        this.tree(g, 5.6, 2.6, 1.3, 0x2e5936);
        break;
      case '43':
        // 仇人坡 (荀子大道) 與百花池：文化大學最著名的傳奇校園地標
        // 包含：層層遞升的校園連續大青石階梯、白色石雕欄杆、荀子大道石碑、大恩館前百花池圓形花圃與八角中式涼亭
        // 1. 仇人坡連續好漢坡大石階梯 (Tiered Campus Stone Steps)
        for (let i = 0; i < 5; i++) {
          const y = i * 0.35 + 0.175;
          const z = 3.6 - i * 1.1;
          const w = 5.2;
          this.box(g, w, 0.36, 1.2, 0, y, z, 'stone');
          // 階梯兩側白色石雕護欄 (White Balustrades)
          this.box(g, 0.22, 0.65, 1.2, -w / 2 - 0.1, y + 0.35, z, 'white');
          this.box(g, 0.22, 0.65, 1.2, w / 2 + 0.1, y + 0.35, z, 'white');
        }
        // 階梯起點校園石碑 (Campus Milestone)
        this.box(g, 0.45, 1.3, 0.3, 3.2, 0.65, 4.0, 'stone');
        this.sign(g, '荀子大道 · 仇人坡', 3.2, 1.1, 4.16, 2.4, '#5c1d1d', '#ffffff');

        // 2. 階梯頂部：大恩館前「百花池」圓形繽紛花圃 (Hundred Flower Pond)
        this.box(g, 5.8, 0.28, 4.8, 0, 1.9, -2.4, 'stone'); // 百花池石造基座
        this.box(g, 5.2, 0.15, 4.2, 0, 2.05, -2.4, 0x3d7042); // 翠綠花圃草地
        // 四季繽紛花卉 (Colorful Blossoms)
        const chpFlowers = [0xe91e63, 0xffeb3b, 0xff5722, 0x9c27b0, 0x00bcd4];
        for (let fx = -2.0; fx <= 2.0; fx += 1.0) {
          for (let fz = -3.8; fz <= -1.0; fz += 1.4) {
            const c = chpFlowers[Math.abs(Math.round(fx * 3 + fz * 2)) % chpFlowers.length];
            this.ball(g, fx, 2.2, fz, 0.24, 0.18, 0.24, c);
          }
        }

        // 3. 百花池中央古典八角紅柱中式涼亭 (Chinese Classical Pavilion)
        this.box(g, 3.2, 0.3, 3.2, 0, 2.25, -2.4, 'stone');
        // 四根朱紅圓柱
        [-1.2, 1.2].forEach(px => {
          [-1.2, 1.2].forEach(pz => {
            this.box(g, 0.22, 2.4, 0.22, px, 3.45, -2.4 + pz, 0xa92323);
          });
        });
        // 涼亭古典四角飛簷青瓦頂
        this.roof(g, 4.2, 4.2, 4.65, 1.2, 0x2e4033, 0, -2.4, true);
        this.ball(g, 0, 5.3, -2.4, 0.22, 0.35, 0.22, 0xd4af37); // 金色寶頂

        // 4. 校園黑松與復古路燈
        this.tree(g, -4.8, 1.8, 1.35, 0x2e5936);
        this.tree(g, 4.8, 1.8, 1.35, 0x2e5936);
        this.box(g, 0.12, 3.6, 0.12, -3.2, 1.8, 3.8, 'dark');
        this.ball(g, -3.2, 3.65, 3.8, 0.22, 0.22, 0.22, 0xfff9c4);
        break;
      case '44':
        // 草山水管路步道 (愛富段出口)：世界級文化景觀草山水道系統
        // 包含：天母古道親山步道原木牌坊、著名黑色巨大高壓鑄鐵水管、石造排氣閥調整池、清澈湧泉洗手池與翠綠山林
        // 1. 天母古道親山步道原木大牌坊 (Rustic Trailhead Timber Portal)
        this.box(g, 0.35, 3.6, 0.35, -2.4, 1.8, 2.8, 'wood'); // 左原木柱
        this.box(g, 0.35, 3.6, 0.35, 2.4, 1.8, 2.8, 'wood');  // 右原木柱
        this.box(g, 5.4, 0.45, 0.35, 0, 3.5, 2.8, 'wood');    // 原木橫樑
        this.sign(g, '天母古道親山步道 · 水管路愛富段', 0, 3.5, 3.02, 5.0, '#2d4739', '#e8f5e9');
        // 親山步道拓印台與里程石樁
        this.box(g, 0.35, 0.9, 0.35, -1.8, 0.45, 3.4, 'stone');
        this.box(g, 0.25, 1.1, 0.25, 2.8, 0.55, 3.4, 'wood');

        // 2. 標誌性地標：草山水道黑色巨大高壓鑄鐵水管 (Historic Black Giant Water Pipeline)
        // 水管主體 (斜向穿過園區)
        this.box(g, 9.6, 0.72, 0.72, 0, 0.36, -0.6, 0x1f1f1f); // 黑色鑄鐵高壓大管
        // 水管凸緣接頭 (Pipe Flanges)
        [-3.6, -1.2, 1.2, 3.6].forEach(fx => {
          this.box(g, 0.16, 0.9, 0.9, fx, 0.36, -0.6, 0x3d3d3d);
          this.box(g, 0.35, 0.25, 0.85, fx, 0.12, -0.6, 'stone'); // 管線固定石墩
        });
        // 古老石造減壓排氣閥小石室 (Stone Valve Chamber)
        this.box(g, 1.8, 1.4, 1.8, -3.8, 0.7, -2.2, 'stone');
        this.box(g, 2.0, 0.2, 2.0, -3.8, 1.45, -2.2, 'dark'); // 鐵鑄頂蓋

        // 3. 山泉流水洗手石槽與石板步道
        this.box(g, 1.2, 0.65, 0.8, 3.2, 0.32, 1.2, 'stone');
        this.box(g, 1.0, 0.08, 0.6, 3.2, 0.58, 1.2, 0x81d4fa); // 清澈泉水
        // 步道石板 (Slate Pathway)
        for (let sz = 3.6; sz >= -2.0; sz -= 1.1) {
          this.box(g, 1.2, 0.08, 0.8, 0, 0.04, sz, 'stone');
        }

        // 4. 茂密山林大樹與木長椅
        this.tree(g, -5.2, 2.8, 1.5, 0x1b4d2e);
        this.tree(g, 4.8, 3.2, 1.6, 0x2e5936);
        this.bench(g, 2.8, -1.8, 'wood');
        break;

      case '45': {
        // 45 草山行館 (昭和日式檜木官邸、歇山黑瓦坡頂、緣側迴廊與日式松石庭園)
        this.lawn(g, 15, 14);

        // 1. 安山岩疊石基座 (Stone Base)
        this.box(g, 11.2, 0.45, 8.4, 0, 0.22, -0.2, 0x5a554c);

        // 2. 主棟日式木造平房 (Main Wooden Pavilion)
        this.box(g, 7.6, 2.8, 5.4, -0.6, 1.85, -0.4, 0x4a3728); // 深色檜木雨淋板外牆
        // 日式推拉木格窗與玻璃 (Shoji Windows)
        [-2.8, -1.2, 0.4, 2.0].forEach(wx => {
          this.box(g, 1.1, 1.4, 0.1, wx - 0.6, 1.9, 2.32, 0xfdfbf7); // 和紙白窗
          this.box(g, 0.08, 1.45, 0.12, wx - 0.6, 1.9, 2.33, 0x2e1f14); // 窗櫺中柱
          this.box(g, 1.15, 0.08, 0.12, wx - 0.6, 1.9, 2.33, 0x2e1f14); // 窗櫺橫木
        });

        // 3. 側翼雅緻茶室與美齡書房 (Tea Room Wing)
        this.box(g, 3.2, 2.4, 3.8, 3.8, 1.65, 0.2, 0x5c4432);
        this.box(g, 1.4, 1.2, 0.1, 3.8, 1.7, 2.12, 0xfff9e6); // 暖黃茶室紙窗

        // 4. 外挑緣側迴廊 (Engawa Veranda)
        this.box(g, 8.6, 0.18, 1.2, -0.6, 0.52, 2.8, 0xbfa074); // 原木走廊地板
        // 支撐迴廊的日式木角柱
        for (let px = -4.5; px <= 3.3; px += 1.3) {
          this.box(g, 0.14, 2.5, 0.14, px, 1.7, 3.35, 0x3d2b1f);
        }

        // 5. 日式歇山層疊黑瓦坡頂 (Black Tile Roof)
        // 主棟黑瓦大屋頂
        this.roof(g, 9.2, 6.8, 1.6, -0.6, 3.85, -0.4, 0x2b2d42);
        this.box(g, 8.2, 0.22, 0.35, -0.6, 4.65, -0.4, 0x1f2029); // 屋脊大棟
        // 側翼小屋頂
        this.roof(g, 4.2, 4.6, 1.2, 3.8, 3.25, 0.2, 0x2b2d42);

        // 6. 入口日式玄關門廊與行館木匾額
        this.box(g, 2.0, 0.18, 1.6, -0.6, 2.85, 3.8, 0x3d2b1f); // 庇簷
        this.sign(g, '草山行館', -0.6, 2.5, 3.25, 2.0);

        // 7. 日式枯山水松石庭園與石燈籠
        this.box(g, 0.45, 1.1, 0.45, -3.2, 0.55, 4.5, 0x8d99ae); // 石燈籠台座
        this.box(g, 0.6, 0.4, 0.6, -3.2, 1.25, 4.5, 0x2b2d42);  // 石燈籠頂笠
        this.box(g, 0.3, 0.3, 0.3, -3.2, 0.95, 4.5, 0xffbe0b);  // 點亮微光
        // 造景石與日式黑松
        this.box(g, 1.2, 0.7, 0.9, 2.8, 0.35, 4.2, 0x757575);
        this.box(g, 0.8, 0.5, 0.6, 4.0, 0.25, 4.6, 0x616161);
        this.tree(g, -5.0, 3.0, 1.4, 0x1b4332);
        this.tree(g, 5.2, 3.2, 1.5, 0x2d6a4f);
        break;
      }

      case '46': {
        // 46 文化大學大孝館 (陽明山最著名巨型圓柱綜合體育館、穹頂天幕與環狀採光帶)
        this.lawn(g, 16, 16);

        // 1. 花崗岩挑高迎賓基座與廣場 (Plaza Base)
        this.box(g, 13.5, 0.6, 13.5, 0, 0.3, 0, 0xcfd8dc); // 廣場石板基座
        // 前方寬闊迎賓入館大台階
        this.box(g, 6.0, 0.2, 1.6, 0, 0.2, 7.2, 0xb0bec5);
        this.box(g, 5.2, 0.4, 1.0, 0, 0.4, 6.9, 0xb0bec5);

        // 2. 標誌性巨型「圓柱體」主體樓身 (Colossal Cylindrical Stadium Body)
        // 使用 16 面圓環幾何逼近圓柱，直徑 10.5m，樓高 7.5m
        const cSegments = 16;
        const cRadius = 5.2;
        const cHeight = 6.8;
        const cY = 0.6 + cHeight / 2; // 中心高 4.0

        for (let i = 0; i < cSegments; i++) {
          const angle = (i / cSegments) * Math.PI * 2;
          const nextAngle = ((i + 1) / cSegments) * Math.PI * 2;
          const midAngle = (angle + nextAngle) / 2;
          const segWidth = 2 * cRadius * Math.sin(Math.PI / cSegments) + 0.15;

          const cx = Math.cos(midAngle) * cRadius;
          const cz = Math.sin(midAngle) * cRadius;

          // 圓柱體立體外牆 (淡暖白/米灰花崗岩質感)
          const wallMesh = new THREE.Mesh(this.boxGeometry, this.mat(0xecf0f1));
          wallMesh.scale.set(segWidth, cHeight, 0.4);
          wallMesh.position.set(cx, cY, cz);
          wallMesh.rotation.y = -midAngle + Math.PI / 2;
          wallMesh.castShadow = wallMesh.receiveShadow = true;
          g.add(wallMesh);

          // 圓柱中間腰部：環狀大跨距深色條狀採光窗 (Belt Windows)
          const winMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x263238));
          winMesh.scale.set(segWidth * 0.88, 1.4, 0.44);
          winMesh.position.set(cx, cY + 0.3, cz);
          winMesh.rotation.y = -midAngle + Math.PI / 2;
          g.add(winMesh);

          // 頂層環形立體挑簷遮陽柱 (Top Crown Pillars)
          const pilMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x78909c));
          pilMesh.scale.set(0.24, 1.8, 0.5);
          pilMesh.position.set(cx * 1.04, cY + 2.7, cz * 1.04);
          pilMesh.rotation.y = -midAngle + Math.PI / 2;
          g.add(pilMesh);
        }

        // 3. 圓柱頂部巨型飛碟式環形鋼架挑簷與穹頂 (Dome & Canopy)
        // 環狀出挑外簷 (Outer Ring Eaves)
        for (let i = 0; i < cSegments; i++) {
          const angle = (i / cSegments) * Math.PI * 2;
          const nextAngle = ((i + 1) / cSegments) * Math.PI * 2;
          const midAngle = (angle + nextAngle) / 2;
          const segWidth = 2 * (cRadius + 0.6) * Math.sin(Math.PI / cSegments) + 0.2;
          const cx = Math.cos(midAngle) * (cRadius + 0.35);
          const cz = Math.sin(midAngle) * (cRadius + 0.35);

          const eaveMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x455a64));
          eaveMesh.scale.set(segWidth, 0.4, 0.9);
          eaveMesh.position.set(cx, 7.5, cz);
          eaveMesh.rotation.y = -midAngle + Math.PI / 2;
          g.add(eaveMesh);
        }

        // 體育館白色大跨距中央穹頂 (Dome Roof)
        this.box(g, 8.4, 0.9, 8.4, 0, 7.9, 0, 0xdfe6e9);
        this.box(g, 6.2, 0.7, 6.2, 0, 8.5, 0, 0xb2bec3);
        this.box(g, 3.8, 0.5, 3.8, 0, 9.0, 0, 0x90a4ae);
        // 屋頂避雷針頂桿
        this.box(g, 0.16, 1.8, 0.16, 0, 9.9, 0, 0xffffff);

        // 4. 正門挑高玻璃迎賓大廳門廊 (Glass Entrance Portico)
        this.box(g, 4.4, 2.6, 2.2, 0, 1.9, 5.0, 0x37474f); // 門廊框架
        this.box(g, 3.6, 2.0, 0.1, 0, 1.6, 6.12, 0x81d4fa); // 藍光採光玻璃大門
        this.sign(g, '文化大學 大孝館 (體育館)', 0, 3.4, 6.15, 3.8);

        // 5. 體育館周邊設施與戶外籃球架裝置藝術
        this.box(g, 0.14, 2.6, 0.14, -5.2, 1.3, 3.8, 0x2c3e50); // 籃球架支柱
        this.box(g, 1.4, 0.9, 0.08, -5.2, 2.5, 3.8, 0xffffff);  // 籃板
        this.box(g, 0.45, 0.06, 0.45, -5.2, 2.2, 4.05, 0xe17055); // 橘色籃框
        // 校園行道樹與路燈
        this.tree(g, 5.4, 3.4, 1.5, 0x1b5e20);
        this.tree(g, -5.8, 3.0, 1.4, 0x2e7d32);
        this.bench(g, 4.5, 5.2, 'wood');
        break;
      }

      case '47': {
        // 47 草山夜未眠景觀餐廳 (金色旋轉木馬、心形發光空中步道、百年相思樹與璀璨夜景露台)
        this.lawn(g, 18, 16);

        // 1. 雙層依懸崖而建的柚木景觀觀景露台 (Tiered Viewing Decks)
        // 上層木質用餐露台 (Upper Deck)
        this.box(g, 15.5, 0.7, 5.5, 0, 1.85, -2.5, 0x5c4432);
        // 下層懸崖前緣露台 (Lower Deck)
        this.box(g, 14.0, 0.6, 5.2, 0, 1.05, 2.5, 0x4e3629);

        // 2. 標誌性「金色夢幻旋轉木馬」景觀地標 (Golden Carousel)
        // 圓形木地板基座
        this.box(g, 4.6, 0.25, 4.6, -4.5, 2.3, -2.5, 0xd4a373);
        // 旋轉木馬金黃色頂棚 (Golden Octagonal Canopy)
        this.roof(g, 4.8, 4.8, 1.4, -4.5, 4.6, -2.5, 0xffd166);
        this.box(g, 0.2, 0.6, 0.2, -4.5, 5.4, -2.5, 0xffbe0b); // 頂尖金球
        // 八根旋轉金屬支柱與中央旋轉軸
        this.box(g, 0.6, 2.2, 0.6, -4.5, 3.3, -2.5, 0xfaedcd); // 中軸
        [-1.6, 1.6].forEach(px => {
          [-1.6, 1.6].forEach(pz => {
            this.box(g, 0.08, 2.2, 0.08, -4.5 + px, 3.3, -2.5 + pz, 0xffd166);
            // 旋轉木馬小馬 (Pastel Horses)
            this.box(g, 0.6, 0.45, 0.25, -4.5 + px, 2.8, -2.5 + pz, 0xffccd5);
          });
        });

        // 3. 凌空懸挑「浪漫心形發光空中觀景台」 (Heart-shaped Sky Walkway)
        // 向懸崖外凌空伸出的透明發光步道 (4m 長)
        this.box(g, 1.6, 0.15, 4.2, 3.6, 1.25, 5.2, 0x80ed99); // 發光透光棧道
        this.box(g, 0.08, 0.8, 4.2, 2.8, 1.65, 5.2, 'glass');  // 左側透明玻璃護欄
        this.box(g, 0.08, 0.8, 4.2, 4.4, 1.65, 5.2, 'glass');  // 右側透明玻璃護欄
        // 棧道端點「巨大發光紅心雕塑」 (Giant Glowing Heart Monument)
        this.box(g, 1.8, 1.6, 0.18, 3.6, 2.5, 7.3, 0xff4757); // 愛心主體
        this.box(g, 1.2, 1.1, 0.22, 3.6, 2.5, 7.3, 0xff6b81); // 內部粉紅光心

        // 4. 露天情人白色沙發卡座與高空發光吧台 (Romantic Cabana Lounges)
        [-2.5, 0.8].forEach(sx => {
          this.box(g, 2.2, 0.45, 0.6, sx, 1.5, 1.2, 0xf8f9fa); // 白色沙發椅背
          this.box(g, 2.2, 0.35, 1.2, sx, 1.35, 2.0, 0xf8f9fa); // 沙發坐墊
          this.box(g, 0.8, 0.38, 0.8, sx, 1.4, 2.0, 0xffbe0b); // 暖光小茶几
        });
        // 觀景高腳吧台
        this.box(g, 5.2, 0.95, 0.5, 0.5, 2.65, -0.2, 0x2b2d42);
        this.sign(g, '草山夜未眠 · 旋轉木馬與百萬夜景', 0, 3.6, -4.8, 4.6);

        // 5. 象徵性「百年相思老樹」與童話串燈造景 (Centennial Acacia Tree)
        this.tree(g, 6.2, 4.8, 1.6, 0x1b4332);
        // 樹枝上的童話微光燈泡
        [-0.6, 0.6].forEach(tx => {
          this.box(g, 0.15, 0.15, 0.15, 6.2 + tx, 3.8, -1.8, 0xffd166);
        });

        // 6. 懸崖深谷下方之大台北「百萬夜景星光點陣」
        const nightColors = [0xffd166, 0xffffff, 0x06d6a0, 0x118ab2, 0xef476f];
        for (let i = 0; i < 16; i++) {
          const nx = -6.0 + (i * 0.8);
          const nz = 7.0 + ((i % 4) * 0.5);
          this.box(g, 0.16, 0.16, 0.16, nx, 0.08, nz, nightColors[i % nightColors.length]);
        }
        break;
      }

      case '48': {
        // 48 陽明山順天府 (池府王爺廟：閩南紅磚燕尾宮廟、整排大紅燈籠、三足天公爐、國泰民安對聯與金爐)
        this.lawn(g, 15, 14);

        // 1. 廟埕花崗石板基座 (Temple Plaza Base)
        this.box(g, 11.5, 0.35, 9.2, 0, 0.18, 0, 'stone');

        // 2. 正殿傳統紅磚主體 (Main Brick Hall)
        this.box(g, 7.8, 3.2, 5.2, 0, 1.85, -1.2, 0xa74337); // 閩南紅磚
        // 正面木造紅色大廟門與金屬門釘
        this.box(g, 2.2, 2.2, 0.15, 0, 1.45, 1.42, 0x8b0000);
        // 門兩側石窗
        [-2.4, 2.4].forEach(wx => {
          this.box(g, 1.2, 1.4, 0.12, wx, 1.8, 1.42, 0x3d2b1f);
          this.box(g, 0.08, 1.4, 0.14, wx, 1.8, 1.42, 0xffd700); // 金色窗櫺
        });

        // 3. 正殿門額金字牌匾與門柱對聯 (Pillars & Inscriptions)
        this.sign(g, '順天府 (池府王爺)', 0, 3.4, 1.5, 3.5, '#6a040f', '#ffd166');
        // 門柱對聯「國泰民安」「風調雨順」
        this.box(g, 0.35, 2.0, 0.08, -1.5, 1.6, 1.46, 0xd90429); // 紅底木對聯柱
        this.box(g, 0.35, 2.0, 0.08, 1.5, 1.6, 1.46, 0xd90429);

        // 4. 門前橫排懸掛成串「順天府大紅燈籠」 (Red Lantern String)
        // 橫向懸掛橫木
        this.box(g, 6.8, 0.08, 0.08, 0, 2.65, 2.1, 0x4a3728);
        for (let i = 0; i < 7; i++) {
          const lx = -2.7 + i * 0.9;
          this.ball(g, lx, 2.45, 2.1, 0.42, 0.48, 0.42, 0xd90429); // 圓形大紅燈籠
          this.box(g, 0.15, 0.08, 0.15, lx, 2.7, 2.1, 0xffd700);  // 金色燈籠頂冠
          this.box(g, 0.08, 0.18, 0.08, lx, 2.15, 2.1, 0xffd700); // 金色燈籠流蘇
        }

        // 5. 傳統閩南紅瓦雙燕尾屋頂 (Swallowtail Roof)
        this.roof(g, 9.2, 6.4, 1.6, 0, 4.2, -1.2, 0xbc4749);
        // 屋脊正棟與燕尾飛簷 (Swallowtail Ridge)
        this.box(g, 8.4, 0.28, 0.35, 0, 5.05, -1.2, 0x780000);
        this.box(g, 0.35, 0.35, 0.35, -4.2, 5.25, -1.2, 0xffbe0b); // 翹起燕尾角
        this.box(g, 0.35, 0.35, 0.35, 4.2, 5.25, -1.2, 0xffbe0b);
        this.ball(g, 0, 5.35, -1.2, 0.3, 0.3, 0.3, 0xffbe0b); // 中央寶珠

        // 6. 正殿門前香煙裊裊之「大型三足青銅天公香爐」 (Bronze Incense Burner)
        this.box(g, 1.2, 0.35, 0.9, 0, 0.45, 2.8, 'stone'); // 供桌石台
        this.box(g, 0.9, 0.65, 0.9, 0, 0.95, 3.8, 0x2b2d42);  // 青銅三足天公爐身
        this.box(g, 1.1, 0.12, 1.1, 0, 1.3, 3.8, 0x4a4e69);   // 爐口邊緣
        this.box(g, 0.08, 0.3, 0.08, 0, 1.45, 3.8, 0xff4757);  // 點燃之紅心清香

        // 7. 廟埕八角紅磚金亭 (Incense Furnace) 與建業老榕樹
        this.box(g, 1.4, 1.8, 1.4, -3.8, 1.1, 3.2, 0xa74337); // 金亭身
        this.roof(g, 1.8, 1.8, 0.8, -3.8, 2.4, 3.2, 0x780000); // 金亭頂
        this.tree(g, 4.6, 3.6, 1.35, 0x1b4332);
        this.tree(g, -4.8, 3.2, 1.2, 0x2d6a4f);
        break;
      }

      case '49': {
        // 49 文化大學 大義館 (文化大學全校中心！八角形中式宮殿樓體、中央圓形天井中庭、雙層飛簷大屋頂)
        this.lawn(g, 18, 18);

        // 1. 迎賓花崗石板台基 (Palace Terrace Base)
        this.box(g, 15.5, 0.6, 15.5, 0, 0.3, 0, 'stone');
        // 前方寬闊入館大台階
        this.box(g, 6.5, 0.2, 1.8, 0, 0.2, 8.2, 0xb0bec5);
        this.box(g, 5.8, 0.4, 1.2, 0, 0.4, 7.8, 0xb0bec5);

        // 2. 標誌性「正八角形 (Octagonal)」宮殿樓體 (Octagonal Palace Body)
        // 使用 8 面環狀牆面構築正八邊形宮殿，外徑 13.8m，樓高 7.2m
        const octSegments = 8;
        const octRadius = 6.6;
        const octHeight = 6.5;
        const octY = 0.6 + octHeight / 2; // 3.85

        for (let i = 0; i < octSegments; i++) {
          const angle = (i / octSegments) * Math.PI * 2;
          const nextAngle = ((i + 1) / octSegments) * Math.PI * 2;
          const midAngle = (angle + nextAngle) / 2;
          const segWidth = 2 * octRadius * Math.sin(Math.PI / octSegments) + 0.25;

          const cx = Math.cos(midAngle) * octRadius;
          const cz = Math.sin(midAngle) * octRadius;

          // 八角立體外牆 (宮殿淡黃色/石材色)
          const wallMesh = new THREE.Mesh(this.boxGeometry, this.mat(0xfbf8ee));
          wallMesh.scale.set(segWidth, octHeight, 0.6);
          wallMesh.position.set(cx, octY, cz);
          wallMesh.rotation.y = -midAngle + Math.PI / 2;
          wallMesh.castShadow = wallMesh.receiveShadow = true;
          g.add(wallMesh);

          // 朱紅色中式宮廷角柱
          const colMesh = new THREE.Mesh(this.boxGeometry, this.mat(0xa44638));
          colMesh.scale.set(0.45, octHeight + 0.2, 0.7);
          const px = Math.cos(angle) * octRadius;
          const pz = Math.sin(angle) * octRadius;
          colMesh.position.set(px, octY, pz);
          colMesh.rotation.y = -angle + Math.PI / 2;
          g.add(colMesh);

          // 樓層外凸腰簷 (Belt Cornice)
          const beltMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x35454a));
          beltMesh.scale.set(segWidth * 1.05, 0.25, 0.85);
          beltMesh.position.set(cx, 4.2, cz);
          beltMesh.rotation.y = -midAngle + Math.PI / 2;
          g.add(beltMesh);

          // 各樓層長條宮殿採光窗
          [-segWidth * 0.25, segWidth * 0.25].forEach(ox => {
            const winMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x668d99));
            winMesh.scale.set(1.2, 1.5, 0.65);
            // 局部坐標換算
            const wx = cx + Math.cos(midAngle + Math.PI/2) * ox;
            const wz = cz + Math.sin(midAngle + Math.PI/2) * ox;
            winMesh.position.set(wx, 2.6, wz);
            winMesh.rotation.y = -midAngle + Math.PI / 2;
            g.add(winMesh);

            const winMesh2 = winMesh.clone();
            winMesh2.position.set(wx, 5.5, wz);
            g.add(winMesh2);
          });
        }

        // 3. 空拍圖最顯眼特徵：「中央巨型圓形採光天井中庭」 (Central Circular Courtyard / Skylight)
        // 內環中庭 (直徑約 5.5m)
        this.box(g, 5.5, 0.15, 5.5, 0, 0.65, 0, 0x9b9a8a); // 中庭八卦地磚
        this.box(g, 3.5, 0.08, 3.5, 0, 0.72, 0, 0xd9d5bf);
        // 頂部圓形/八角採光天幕穹頂 (Glass Skylight Canopy)
        this.box(g, 5.8, 0.35, 5.8, 0, 7.3, 0, 0x668d99); // 藍白透光天幕
        this.box(g, 4.2, 0.45, 4.2, 0, 7.6, 0, 0xf6f2e8); // 天幕頂框
        this.box(g, 0.25, 1.2, 0.25, 0, 8.4, 0, 0xbca065); // 正中金色寶頂

        // 4. 重簷八角中式宮殿屋頂 (Double-tiered Roof Eaves)
        for (let i = 0; i < octSegments; i++) {
          const angle = (i / octSegments) * Math.PI * 2;
          const nextAngle = ((i + 1) / octSegments) * Math.PI * 2;
          const midAngle = (angle + nextAngle) / 2;
          const segWidth = 2 * (octRadius + 0.8) * Math.sin(Math.PI / octSegments) + 0.4;
          const cx = Math.cos(midAngle) * (octRadius + 0.4);
          const cz = Math.sin(midAngle) * (octRadius + 0.4);

          const roofMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x476755)); // 華岡經典綠琉璃瓦
          roofMesh.scale.set(segWidth, 0.55, 1.4);
          roofMesh.position.set(cx, 7.15, cz);
          roofMesh.rotation.y = -midAngle + Math.PI / 2;
          g.add(roofMesh);
        }

        // 5. 正門朱紅宮殿門廊與金字大校匾 (Entrance Portico)
        this.box(g, 4.8, 2.8, 1.6, 0, 2.0, 6.8, 0xa44638); // 門廊框架
        this.box(g, 3.8, 2.2, 0.12, 0, 1.7, 7.55, 0x735743); // 木大門
        this.sign(g, '中國文化大學 大義館', 0, 3.8, 7.6, 4.5, '#693630', '#fce8c3');

        // 6. 前庭石獅與校園林蔭樹
        this.box(g, 0.6, 0.9, 0.6, -2.8, 0.8, 7.2, 'stone'); // 左石獅
        this.box(g, 0.6, 0.9, 0.6, 2.8, 0.8, 7.2, 'stone');  // 右石獅
        this.tree(g, -6.8, 3.5, 1.35, 0x1b5e20);
        this.tree(g, 6.8, 3.5, 1.35, 0x1b5e20);
        this.bench(g, 5.2, 5.8, 'wood');
        break;
      }
      case '50': {
        // 50 文化大學 大恩館 (行政中心大樓與百花池中式八角涼亭)
        this.lawn(g, 17, 16);

        // 1. 花崗岩地基平台 (Base Terrace)
        this.box(g, 15, 0.6, 11, 0, 0.3, -1.5, 'stone');
        // 行政大樓正面迎賓大石階
        this.box(g, 7, 0.2, 1.6, 0, 0.2, 4.4, 0xb0bec5);
        this.box(g, 6, 0.4, 1.2, 0, 0.4, 4.0, 0xb0bec5);
        this.box(g, 5, 0.6, 0.8, 0, 0.6, 3.6, 0xb0bec5);

        // 2. 12層巍峨高聳行政主樓塔 (12-Story Tower Body)
        // 主樓體 (寬 12m, 深 8m, 高 11.2m)
        const mainH = 11.2;
        const mainY = 0.6 + mainH / 2; // 6.2
        this.box(g, 12, mainH, 8, 0, mainY, -1.8, 'cream');

        // 樓層外立面分層挑簷線腳與格子玻璃窗帶 (Floor Dividers & Strip Windows)
        for (let fl = 1; fl <= 6; fl++) {
          const fy = 1.0 + fl * 1.65;
          // 橫向白玉挑簷線腳
          this.box(g, 12.3, 0.15, 8.3, 0, fy, -1.8, 0xe0e0e0);
          // 正面採光深色條窗
          this.box(g, 9.6, 0.7, 0.1, 0, fy - 0.7, 2.22, 0x1a237e);
          // 背面條窗
          this.box(g, 9.6, 0.7, 0.1, 0, fy - 0.7, -5.82, 0x1a237e);
        }

        // 行政大樓朱紅正門拱廊柱列 (Main Portico Columns)
        for (let c = -4; c <= 4; c += 2) {
          this.cylinder(g, 0.22, 0.22, 2.8, c, 2.0, 2.3, 0xa44638);
        }
        // 行政大廳入口金色玻璃大門與「大恩館」匾額
        this.box(g, 3.6, 2.0, 0.2, 0, 1.6, 2.22, 0xffd54f);
        this.box(g, 2.2, 0.6, 0.25, 0, 3.2, 2.25, 0x800000); // 匾額底色

        // 3. 頂層中式琉璃金瓦大飛簷屋頂 (Golden Glazed Eaves Palace Roof)
        const roofY = 0.6 + mainH; // 11.8
        // 上層閣樓基座
        this.box(g, 10.5, 1.0, 6.5, 0, roofY + 0.5, -1.8, 'cream');
        // 金色琉璃瓦重簷四坡頂 (Imperial Yellow Hip Roof)
        const roofLower = new THREE.Mesh(this.boxGeometry, this.mat(0xd4af37)); // 金黃琉璃
        roofLower.scale.set(13.6, 0.8, 9.6);
        roofLower.position.set(0, roofY + 1.1, -1.8);
        roofLower.castShadow = true;
        g.add(roofLower);

        // 頂層重簷大飛簷
        const roofUpper = new THREE.Mesh(this.boxGeometry, this.mat(0xb8860b)); // 深金棕琉璃瓦
        roofUpper.scale.set(11.8, 1.4, 7.8);
        roofUpper.position.set(0, roofY + 2.0, -1.8);
        roofUpper.castShadow = true;
        g.add(roofUpper);
        // 正脊脊飾
        this.box(g, 10.0, 0.35, 0.4, 0, roofY + 2.8, -1.8, 0x8d6e63);

        // 4. 樓前著名「百花池」花園水景 (Baihua Fountain Pond)
        // 圓形/八角形石砌百花池外圈 (位於 z: 5.5)
        const pondZ = 5.5;
        this.cylinder(g, 3.2, 3.4, 0.4, -2.5, 0.2, pondZ, 'stone');
        // 水面 (湖水碧藍)
        this.cylinder(g, 2.9, 2.9, 0.3, -2.5, 0.25, pondZ, 0x29b6f6);
        // 中央立體噴泉雕塑水柱 (White Fountain Jets)
        this.cylinder(g, 0.4, 0.6, 0.8, -2.5, 0.6, pondZ, 'stone');
        this.cylinder(g, 0.12, 0.12, 1.2, -2.5, 1.2, pondZ, 0xe0f7fa);
        // 飛濺水花圈
        this.cylinder(g, 0.8, 0.4, 0.15, -2.5, 0.9, pondZ, 0xffffff);

        // 5. 百花池畔經典「八角紅木古典涼亭」 (Octagonal Chinese Pavilion)
        const pavX = 2.8;
        const pavZ = 5.5;
        // 涼亭八角石階基座
        this.cylinder(g, 1.8, 2.0, 0.35, pavX, 0.18, pavZ, 'stone');
        // 涼亭8根朱紅木柱
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * Math.PI * 2;
          const colX = pavX + Math.cos(ang) * 1.35;
          const colZ = pavZ + Math.sin(ang) * 1.35;
          this.cylinder(g, 0.08, 0.08, 1.8, colX, 1.1, colZ, 0xa44638);
        }
        // 涼亭深紅木護欄與石桌椅
        this.cylinder(g, 0.5, 0.5, 0.45, pavX, 0.4, pavZ, 'stone');
        // 涼亭八角攢尖綠琉璃瓦寶頂
        const pavRoof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.2, 8), this.mat(0x2e6b4d));
        pavRoof.position.set(pavX, 2.3, pavZ);
        pavRoof.castShadow = true;
        g.add(pavRoof);
        // 寶頂金葫蘆珠
        this.sphere(g, 0.2, pavX, 2.95, pavZ, 0xffd54f);

        // 6. 園藝彩色百花壇 (Floral Beds)
        const flowerCols = [0xe91e63, 0xffeb3b, 0xab47bc, 0xff7043];
        for (let fb = 0; fb < 8; fb++) {
          const fx = -5.5 + (fb % 4) * 0.8;
          const fz = 4.2 + Math.floor(fb / 4) * 1.2;
          this.sphere(g, 0.32, fx, 0.3, fz, flowerCols[fb % flowerCols.length]);
        }
        this.tree(g, -6.5, -1.0, 1.4, 0x2e7d32);
        this.tree(g, 6.5, -1.0, 1.4, 0x2e7d32);
        this.tree(g, 5.8, 4.8, 1.2, 0x1b5e20);
        break;
      }
      case '51': {
        // 51 文化大學 大賢館 (法學院與社科院，典雅中式書院、長廊列柱、綠瓦歇山頂)
        this.lawn(g, 15, 14);

        // 1. 基台與寬階梯
        this.box(g, 13.5, 0.5, 9.5, 0, 0.25, 0, 'stone');
        this.box(g, 5.5, 0.2, 1.6, 0, 0.15, 5.2, 0xb0bec5);
        this.box(g, 4.8, 0.35, 1.0, 0, 0.3, 4.8, 0xb0bec5);

        // 2. 書院主樓體 (象牙白粉牆 + 朱紅線腳，4層高)
        const bldgH = 6.2;
        const bldgY = 0.5 + bldgH / 2; // 3.6
        this.box(g, 12, bldgH, 8, 0, bldgY, 0, 'cream');

        // 正面古典柱廊迴廊 (Colonnade Porch)
        for (let c = -5.0; c <= 5.0; c += 2.0) {
          // 朱紅長柱
          this.cylinder(g, 0.18, 0.18, 3.4, c, 2.0, 4.05, 0xa44638);
        }
        // 二樓迴廊雕花白欄杆
        this.box(g, 11.5, 0.45, 0.1, 0, 3.65, 4.05, 0xf5f5f5);
        // 各樓層窗戶與法學院中式格窗
        for (let row = 0; row < 3; row++) {
          const wy = 1.8 + row * 1.6;
          this.box(g, 9.8, 0.75, 0.1, 0, wy, 3.96, 0x37474f);
          this.box(g, 9.8, 0.75, 0.1, 0, wy, -3.96, 0x37474f);
        }
        // 正門入口法學院金色院徽匾額
        this.box(g, 2.8, 1.8, 0.15, 0, 1.2, 3.96, 0x3e2723);
        this.box(g, 1.6, 0.45, 0.2, 0, 2.3, 4.0, 0x800000);

        // 3. 綠琉璃瓦歇山大坡頂 (Green Glazed Hip Roof)
        const rY = 0.5 + bldgH; // 6.7
        const roofMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x2e6b4d));
        roofMesh.scale.set(13.6, 1.2, 9.6);
        roofMesh.position.set(0, rY + 0.6, 0);
        roofMesh.castShadow = true;
        g.add(roofMesh);

        // 上層飛簷折頂
        const roofTop = new THREE.Mesh(this.boxGeometry, this.mat(0x1b5e20));
        roofTop.scale.set(11.2, 1.0, 7.2);
        roofTop.position.set(0, rY + 1.5, 0);
        roofTop.castShadow = true;
        g.add(roofTop);
        // 屋脊正脊
        this.box(g, 9.5, 0.3, 0.3, 0, rY + 2.1, 0, 0x8d6e63);

        // 4. 前庭「法秤之柱」象徵雕塑與庭園景觀 (Scale of Justice Monument)
        this.cylinder(g, 0.5, 0.6, 0.6, -3.8, 0.3, 5.0, 'stone');
        this.cylinder(g, 0.1, 0.1, 1.2, -3.8, 1.1, 5.0, 0xd4af37); // 金色立柱
        this.box(g, 1.0, 0.08, 0.1, -3.8, 1.7, 5.0, 0xd4af37);  // 橫天平桿
        this.cylinder(g, 0.2, 0.05, 0.15, -4.2, 1.4, 5.0, 0xd4af37); // 左天平盤
        this.cylinder(g, 0.2, 0.05, 0.15, -3.4, 1.4, 5.0, 0xd4af37); // 右天平盤

        // 庭園長椅與松柏
        this.bench(g, 3.8, 4.8, 'wood');
        this.tree(g, -5.8, 2.0, 1.2, 0x2e7d32);
        this.tree(g, 5.8, 2.0, 1.2, 0x2e7d32);
        this.tree(g, 4.5, 5.2, 1.1, 0x1b5e20);
        break;
      }
      case '52': {
        // 52 文化大學 大仁館 (十字風車綠瓦藝術學院、華岡大劇院)
        this.lawn(g, 20, 20);

        // 1. 十字型大理石基台 (Cross-shaped Base Terrace)
        this.box(g, 7.0, 0.6, 17.5, 0, 0.3, 0, 'stone'); // 南北向基座
        this.box(g, 17.5, 0.6, 7.0, 0, 0.3, 0, 'stone'); // 東西向基座
        // 南側大劇院正門寬階梯
        this.box(g, 6.0, 0.2, 1.8, 0, 0.2, 9.2, 0xb0bec5);
        this.box(g, 5.2, 0.4, 1.2, 0, 0.4, 8.8, 0xb0bec5);

        // 2. 十字風車翼樓主體架構 (Cross-shaped Windmill Wings)
        const wingH = 6.8;
        const wingY = 0.6 + wingH / 2; // 4.0
        // 南北軸翼樓 (寬 6.2m, 長 16.5m, 高 6.8m)
        this.box(g, 6.2, wingH, 16.5, 0, wingY, 0, 'cream');
        // 東西軸翼樓 (長 16.5m, 寬 6.2m, 高 6.8m)
        this.box(g, 16.5, wingH, 6.2, 0, wingY, 0, 'cream');

        // 中央交會塔樓升起核心 (Central High Auditorium Core)
        const coreH = 9.0;
        this.box(g, 7.2, coreH, 7.2, 0, 0.6 + coreH / 2, 0, 0xfbf8ee);

        // 3. 正面華岡大劇院正門門面 (Grand Theatre Façade)
        // 氣派中式拱柱
        for (let col = -2.2; col <= 2.2; col += 1.1) {
          this.cylinder(g, 0.18, 0.18, 3.8, col, 2.2, 8.4, 0xa44638);
        }
        // 劇院金色雙扇大門與高聳玻璃採光幕
        this.box(g, 3.2, 2.4, 0.2, 0, 1.6, 8.35, 0xd4af37);
        this.box(g, 4.5, 2.2, 0.1, 0, 4.2, 8.32, 0x1a237e); // 藍色挑高玻璃帷幕
        this.box(g, 3.6, 0.6, 0.25, 0, 5.6, 8.36, 0x800000); // 華岡大劇院金字匾

        // 4. 東西兩翼展演廳玻璃排窗
        this.box(g, 0.1, 1.2, 4.5, 8.32, 3.8, 0, 0x37474f);
        this.box(g, 0.1, 1.2, 4.5, -8.32, 3.8, 0, 0x37474f);

        // 5. 空拍圖震撼標誌：十字風車綠琉璃瓦大屋頂 (Iconic Cross Glazed Roofs)
        const roofBaseY = 0.6 + wingH; // 7.4
        // 南北翼綠琉璃坡頂
        const nsRoof = new THREE.Mesh(this.boxGeometry, this.mat(0x2e6b4d));
        nsRoof.scale.set(7.4, 1.2, 17.5);
        nsRoof.position.set(0, roofBaseY + 0.6, 0);
        nsRoof.castShadow = true;
        g.add(nsRoof);

        // 東西翼綠琉璃坡頂
        const ewRoof = new THREE.Mesh(this.boxGeometry, this.mat(0x2e6b4d));
        ewRoof.scale.set(17.5, 1.2, 7.4);
        ewRoof.position.set(0, roofBaseY + 0.6, 0);
        ewRoof.castShadow = true;
        g.add(ewRoof);

        // 中央核心高聳重簷金頂殿堂
        const centerRoofY = 0.6 + coreH; // 9.6
        const centerRoof = new THREE.Mesh(this.boxGeometry, this.mat(0x1b5e20));
        centerRoof.scale.set(8.4, 1.6, 8.4);
        centerRoof.position.set(0, centerRoofY + 0.8, 0);
        centerRoof.castShadow = true;
        g.add(centerRoof);
        // 中央寶頂尖錐與金珠
        const spRoof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 2.0, 4), this.mat(0x2e6b4d));
        spRoof.position.set(0, centerRoofY + 2.4, 0);
        spRoof.rotation.y = Math.PI / 4;
        spRoof.castShadow = true;
        g.add(spRoof);
        this.sphere(g, 0.35, 0, centerRoofY + 3.5, 0, 0xffd54f);

        // 6. 前庭藝術廣場與音樂芭蕾金屬雕塑 (Art Plaza Sculpture)
        this.box(g, 6.0, 0.1, 4.0, 0, 0.1, 11.5, 0x9e9e9e); // 鋪石廣場
        // 抽象芭蕾音符雕塑 (Bronze Ribbon Sculpture)
        this.cylinder(g, 0.45, 0.5, 0.4, 0, 0.3, 11.5, 'stone');
        const torusGeom = new THREE.TorusGeometry(0.7, 0.08, 8, 24);
        const sculpture = new THREE.Mesh(torusGeom, this.mat(0xd4af37));
        sculpture.position.set(0, 1.3, 11.5);
        sculpture.rotation.x = Math.PI / 3;
        sculpture.rotation.y = Math.PI / 6;
        sculpture.castShadow = true;
        g.add(sculpture);

        // 四角景觀松柏與庭園燈
        this.tree(g, -7.5, 7.5, 1.3, 0x2e7d32);
        this.tree(g, 7.5, 7.5, 1.3, 0x2e7d32);
        this.tree(g, -7.5, -7.5, 1.3, 0x1b5e20);
        this.tree(g, 7.5, -7.5, 1.3, 0x1b5e20);
        this.bench(g, -3.2, 11.2, 'wood');
        this.bench(g, 3.2, 11.2, 'wood');
        break;
      }
      case '53': {
        // 53 歐洲學校足球場 (戶外人工草皮足球場、白色球門、鐵絲圍網、高桿探照燈)
        this.lawn(g, 15.5, 11.5, 0, 0);

        // 1. 鮮綠色人工草皮球場主基底 (Artificial Turf Pitch)
        // 寬 15m, 長 12m
        const pitchMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x388e3c)); // 人工草皮深綠
        pitchMesh.scale.set(15.2, 0.2, 11.2);
        pitchMesh.position.set(0, 0.1, 0);
        pitchMesh.receiveShadow = true;
        g.add(pitchMesh);

        // 2. 白色球場標線 (White Pitch Lines)
        // 外圍邊界線框
        this.box(g, 14.2, 0.05, 0.12, 0, 0.22, -5.1, 'white'); // 北邊線
        this.box(g, 14.2, 0.05, 0.12, 0, 0.22, 5.1, 'white');  // 南邊線
        this.box(g, 0.12, 0.05, 10.3, -7.0, 0.22, 0, 'white'); // 西邊線 (左端線)
        this.box(g, 0.12, 0.05, 10.3, 7.0, 0.22, 0, 'white');  // 東邊線 (右端線)
        // 中線
        this.box(g, 0.12, 0.05, 10.3, 0, 0.22, 0, 'white');
        // 中圈圓環
        const torusCircle = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.06, 4, 24), this.mat('white'));
        torusCircle.rotation.x = Math.PI / 2;
        torusCircle.position.set(0, 0.22, 0);
        g.add(torusCircle);
        // 中圈開球點
        this.cylinder(g, 0.15, 0.15, 0.05, 0, 0.23, 0, 'white');

        // 兩端大禁區與小禁區 (Penalty Areas)
        [-7.0, 7.0].forEach(gx => {
          const sgn = gx < 0 ? 1 : -1;
          // 大禁區 (寬 2.8m, 深 5.2m)
          this.box(g, 2.8, 0.05, 0.1, gx + sgn * 1.4, 0.22, -2.6, 'white');
          this.box(g, 2.8, 0.05, 0.1, gx + sgn * 1.4, 0.22, 2.6, 'white');
          this.box(g, 0.1, 0.05, 5.3, gx + sgn * 2.8, 0.22, 0, 'white');
        });

        // 3. 兩端標準立體白色球門與球網 (Soccer Goals & Nets)
        [-6.9, 6.9].forEach(gx => {
          const sgn = gx < 0 ? 1 : -1;
          const goalW = 3.2;
          const goalH = 1.6;
          const goalD = 1.0;
          // 門柱兩根 (白色立管)
          this.cylinder(g, 0.06, 0.06, goalH, gx, goalH / 2 + 0.2, -goalW / 2, 'white');
          this.cylinder(g, 0.06, 0.06, goalH, gx, goalH / 2 + 0.2, goalW / 2, 'white');
          // 門楣橫樑
          this.box(g, 0.12, 0.1, goalW, gx, goalH + 0.2, 0, 'white');
          // 後拉支撐斜桿
          this.cylinder(g, 0.04, 0.04, goalD, gx - sgn * (goalD / 2), 0.25, -goalW / 2, 'white');
          this.cylinder(g, 0.04, 0.04, goalD, gx - sgn * (goalD / 2), 0.25, goalW / 2, 'white');
          // 白色半透明球網背面
          const netMesh = new THREE.Mesh(this.boxGeometry, this.mat(0xffffff));
          netMesh.scale.set(0.04, goalH * 0.9, goalW * 0.95);
          netMesh.position.set(gx - sgn * goalD, goalH / 2 + 0.2, 0);
          netMesh.material.opacity = 0.5;
          netMesh.material.transparent = true;
          g.add(netMesh);
        });

        // 4. 球場外圍綠色防護圍網 (Wiremesh Fence)
        // 四角與邊緣金屬立柱 (高 2.6m)
        const fencePoles = [
          [-7.4, -5.4], [0, -5.4], [7.4, -5.4],
          [-7.4, 5.4], [0, 5.4], [7.4, 5.4],
          [-7.4, 0], [7.4, 0]
        ];
        fencePoles.forEach(([px, pz]) => {
          this.cylinder(g, 0.05, 0.05, 2.6, px, 1.3, pz, 0x78909c);
        });
        // 頂部與腰部圍網橫桿
        this.box(g, 15.0, 0.06, 0.06, 0, 2.5, -5.4, 0x455a64);
        this.box(g, 15.0, 0.06, 0.06, 0, 2.5, 5.4, 0x455a64);
        this.box(g, 0.06, 0.06, 11.0, -7.4, 2.5, 0, 0x455a64);
        this.box(g, 0.06, 0.06, 11.0, 7.4, 2.5, 0, 0x455a64);

        // 5. 四座高聳球場夜間探照燈柱 (Stadium Floodlight Towers)
        const lightTowers = [
          [-7.2, -5.2], [7.2, -5.2],
          [-7.2, 5.2], [7.2, 5.2]
        ];
        lightTowers.forEach(([tx, tz]) => {
          const sgnX = tx < 0 ? 1 : -1;
          const sgnZ = tz < 0 ? 1 : -1;
          // 金屬高桅燈桿 (高 6.5m)
          this.cylinder(g, 0.08, 0.12, 6.2, tx, 3.2, tz, 0xb0bec5);
          // 頂端 4 聯排探照燈組矩形燈架
          this.box(g, 0.8, 0.45, 0.3, tx, 6.2, tz, 0x37474f);
          // 亮白色發光燈面 (朝向球場中央)
          const lightFace = new THREE.Mesh(this.boxGeometry, this.mat(0xfff9c4)); // 亮黃白光
          lightFace.scale.set(0.7, 0.35, 0.1);
          lightFace.position.set(tx + sgnX * 0.12, 6.2, tz + sgnZ * 0.12);
          g.add(lightFace);
        });

        // 6. 場邊替補席與休息遮陽雨庇 (Team Dugouts & Bench)
        // 南側邊線外設有紅磚底座遮陽棚 (z: 6.2)
        this.box(g, 3.5, 0.2, 1.2, 0, 0.15, 6.4, 0xa74337); // 紅磚台
        this.box(g, 3.6, 0.08, 1.4, 0, 1.8, 6.4, 0x2196f3); // 藍色遮陽棚頂
        this.cylinder(g, 0.04, 0.04, 1.7, -1.6, 0.95, 6.9, 'metal');
        this.cylinder(g, 0.04, 0.04, 1.7, 1.6, 0.95, 6.9, 'metal');
        // 替補球員長椅
        this.bench(g, 0, 6.3, 0x1565c0);

        // 7. 一顆黑白相間足球模型停留在邊線 (Soccer Ball)
        const ballMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), this.mat(0xffffff));
        ballMesh.position.set(1.2, 0.38, 4.8);
        ballMesh.castShadow = true;
        g.add(ballMesh);

        // 場外林蔭松柏
        this.tree(g, -7.8, 6.2, 1.1, 0x2e7d32);
        this.tree(g, 7.8, 6.2, 1.1, 0x2e7d32);
        this.tree(g, -7.8, -6.0, 1.2, 0x1b5e20);
        this.tree(g, 7.8, -6.0, 1.2, 0x1b5e20);
        break;
      }
      case '54': {
        // 54 山仔后文史工作室 (愛富二街北側美式木造眷舍、白雨淋板、紅磚煙囪、歷史解說牌與美軍老郵筒)
        this.lawn(g, 11, 9, 0, 0);

        // 1. 美軍眷舍基座與木階梯 (Stone Base & Wooden Steps)
        this.box(g, 8.4, 0.25, 5.6, 0, 0.12, -0.6, 'stone');
        this.box(g, 2.2, 0.12, 1.2, 0, 0.06, 2.4, 0x8d6e63); // 入口原木踏階

        // 2. 1950年代美式雨淋板木屋主體 (American Siding Cottage)
        this.box(g, 8.0, 3.2, 5.2, 0, 1.72, -0.6, 0xfafafa); // 象牙白雨淋板外牆
        // 水平美式橫條木板陰影凹凸
        for (let l = 1; l <= 5; l++) {
          this.box(g, 8.05, 0.06, 5.25, 0, 0.4 + l * 0.55, -0.6, 0xeeeeee);
        }
        // 深灰美式人字雙坡黑瓦斜頂 (Dark Shingle Gabled Roof)
        this.roof(g, 8.8, 6.0, 3.4, 1.3, 0x37474f, 0, -0.6, true);
        // 屋脊經典美軍紅磚大煙囪 (Red Brick Chimney)
        this.box(g, 0.85, 2.4, 0.85, 2.6, 3.6, -0.6, 0xa74337);
        this.box(g, 1.0, 0.15, 1.0, 2.6, 4.85, -0.6, 0x263238); // 煙囪黑鐵頂蓋

        // 3. 歷史工作室木格大門與採光木窗 (Front Porch & Windows)
        this.door(g, 0, 1.95, 2.02, 'wood');
        // 兩側經典美式十字採光白木窗
        [-2.4, 2.4].forEach(wx => {
          this.box(g, 1.6, 1.5, 0.1, wx, 1.8, 2.02, 0xffffff); // 白窗框
          this.box(g, 1.4, 1.3, 0.08, wx, 1.8, 2.03, 0x90caf9); // 藍色玻璃
          this.box(g, 0.08, 1.3, 0.12, wx, 1.8, 2.04, 0xffffff); // 十字格條
          this.box(g, 1.4, 0.08, 0.12, wx, 1.8, 2.04, 0xffffff);
        });

        // 4. 正門木質題字招牌「山仔后文史工作室」 (Main Signboard)
        this.box(g, 4.2, 0.65, 0.15, 0, 3.05, 2.05, 0x4e342e); // 深胡桃木底板
        this.sign(g, '山仔后文史工作室 (美軍眷舍文化景觀)', 0, 3.05, 2.15, 4.0, '#4e342e', '#fff9c4');

        // 5. 前庭綠地亮點一：斜面「山仔后美軍眷舍歷史文化解說牌」 (Historic Marker Display)
        const markerX = -2.5;
        const markerZ = 2.8;
        // 木造雙支撐立柱
        this.box(g, 0.1, 1.2, 0.1, markerX - 0.6, 0.6, markerZ, 0x5d4037);
        this.box(g, 0.1, 1.2, 0.1, markerX + 0.6, 0.6, markerZ, 0x5d4037);
        // 斜面歷史導覽看板
        const boardMesh = new THREE.Mesh(this.boxGeometry, this.mat(0xffffff));
        boardMesh.scale.set(1.5, 0.9, 0.08);
        boardMesh.position.set(markerX, 1.15, markerZ + 0.1);
        boardMesh.rotation.x = -Math.PI / 6;
        g.add(boardMesh);
        // 看板地圖色塊
        const mapMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x2e7d32));
        mapMesh.scale.set(1.35, 0.75, 0.02);
        mapMesh.position.set(markerX, 1.15, markerZ + 0.14);
        mapMesh.rotation.x = -Math.PI / 6;
        g.add(mapMesh);

        // 6. 前庭亮點二：冷戰復古美軍墨綠色金屬圓柱郵筒 (Retro U.S. Green Mailbox)
        const mailX = 2.6;
        const mailZ = 2.8;
        this.cylinder(g, 0.3, 0.35, 1.1, mailX, 0.55, mailZ, 0x1b5e20); // 墨綠鐵筒
        this.sphere(g, 0.32, mailX, 1.1, mailZ, 0x1b5e20); // 圓弧頂蓋
        this.box(g, 0.25, 0.08, 0.08, mailX, 0.9, mailZ + 0.3, 0xffeb3b); // 黃色投信口

        // 7. 牆角復古黑色腳踏車 (Historic Bicycle)
        const bikeX = 3.6;
        const bikeZ = 1.2;
        // 前後輪
        this.cylinder(g, 0.3, 0.3, 0.05, bikeX, 0.3, bikeZ - 0.5, 'dark');
        this.cylinder(g, 0.3, 0.3, 0.05, bikeX, 0.3, bikeZ + 0.5, 'dark');
        // 車架與龍頭
        this.box(g, 0.05, 0.5, 1.0, bikeX, 0.45, bikeZ, 'dark');
        this.box(g, 0.35, 0.05, 0.05, bikeX, 0.72, bikeZ - 0.45, 'metal');

        // 前庭山仔后老樟樹與石板步道
        this.tree(g, -4.5, 2.0, 1.35, 0x2e7d32);
        this.tree(g, 4.5, -2.0, 1.2, 0x1b5e20);
        this.bench(g, 1.2, 3.2, 'wood');
        break;
      }
      case '55': {
        // 55 文化大學 曉峯紀念館 (一樓全聯福利中心 PXmart 士林華岡店)
        // 包含：宏偉圖書館主樓、深藍全聯招牌、橘色圓形圖示、大落地玻璃自動門、整排銀色金屬手推車隊列
        this.lawn(g, 16, 14, 0, 0);

        // 1. 花崗岩石造基台 (Base Terrace)
        this.box(g, 14.5, 0.4, 10.5, 0, 0.2, 0, 'stone');
        // 前方迎賓石階與無障礙緩坡道
        this.box(g, 6.0, 0.2, 1.4, 3.8, 0.1, 5.6, 0xb0bec5);

        // 2. 曉峯紀念館十層高聳圖書館主體 (Library Tower Body)
        // 主樓體 (寬 13.5m, 高 11.5m, 深 9.5m)
        const bldgH = 11.5;
        this.box(g, 13.5, bldgH, 9.5, 0, 0.4 + bldgH / 2, 0, 0xf5f5f5); // 象牙白花崗岩外牆

        // 2~8 樓圖書館條窗與垂直遮陽格柵 (Strip Windows & Louvers)
        for (let fl = 1; fl <= 5; fl++) {
          const wy = 3.6 + fl * 1.5;
          // 正面圖書館深藍採光條窗
          this.box(g, 11.5, 0.75, 0.12, 0, wy, 4.78, 0x1a237e);
          // 垂直遮陽木色線腳
          for (let lx = -5.0; lx <= 5.0; lx += 2.5) {
            this.box(g, 0.18, 0.9, 0.2, lx, wy, 4.82, 0x78909c);
          }
        }

        // 頂層挑簷與「曉峯紀念館」金字匾額 (Top Cornice & Name Sign)
        const topY = 0.4 + bldgH; // 11.9
        this.box(g, 14.2, 0.8, 10.2, 0, topY + 0.4, 0, 0x37474f); // 深灰頂層挑簷
        this.box(g, 12.5, 0.6, 8.5, 0, topY + 1.1, 0, 0x455a64);
        this.box(g, 5.2, 0.8, 0.2, 0, topY - 0.2, 4.8, 0x800000); // 題字紅底
        this.sign(g, '曉峯紀念館 · 中國文化大學圖書館', 0, topY - 0.2, 4.92, 5.0, '#800000', '#ffd54f');

        // 3. 一樓核心亮點：全聯福利中心 PXmart 士林華岡店 (PXmart Supermarket at 1F)
        // 橫跨正門的經典深藍色全聯大招牌 (Deep Blue PXmart Fascia)
        const fasciaY = 2.6;
        const fasciaZ = 4.82;
        this.box(g, 9.6, 0.95, 0.2, 1.2, fasciaY, fasciaZ, 0x0d47a1); // 全聯深藍底色
        // 白底藍字招牌板 (PXmart)
        this.sign(g, '全聯福利中心 PXmart (士林華岡店)', 1.2, fasciaY, fasciaZ + 0.12, 6.8, '#0d47a1', '#ffffff');

        // 標誌性「圓形橘底白色三葉圖示」 (Iconic Orange PXmart Round Logo)
        const logoX = 4.8;
        const logoZ = fasciaZ + 0.14;
        this.cylinder(g, 0.38, 0.38, 0.08, logoX, fasciaY, logoZ, 0xff6f00); // 橘色圓盤
        this.box(g, 0.25, 0.25, 0.1, logoX, fasciaY, logoZ, 0xffffff); // 白色圖徽

        // 4. 全聯通透落地大玻璃自動門與內部明亮貨架光影 (Storefront Glass & Lighting)
        const storeZ = 4.76;
        // 明亮落地大玻璃帷幕 (透出溫暖黃光)
        this.box(g, 8.8, 2.0, 0.1, 1.2, 1.25, storeZ, 0xfff9c4);
        // 門框黑鋼結構
        this.box(g, 0.12, 2.0, 0.14, -3.2, 1.25, storeZ + 0.02, 0x212121);
        this.box(g, 0.12, 2.0, 0.14, 1.2, 1.25, storeZ + 0.02, 0x212121);
        this.box(g, 0.12, 2.0, 0.14, 5.6, 1.25, storeZ + 0.02, 0x212121);
        // 自動滑門門縫與手把
        this.box(g, 1.8, 1.9, 0.12, 2.4, 1.2, storeZ + 0.04, 0x90caf9); // 藍色玻璃門

        // 5. 門口最吸睛特徵：一整排立體金屬銀色「全聯購物手推車隊列」 (Row of Metal Shopping Carts)
        const cartStartX = 4.2;
        const cartZ = 5.4;
        // 購物手推車停放金屬圍欄
        this.box(g, 0.05, 0.8, 2.2, cartStartX - 0.5, 0.5, cartZ, 'metal');
        this.box(g, 0.05, 0.8, 2.2, cartStartX + 0.5, 0.5, cartZ, 'metal');
        // 4 輛嵌套在一起的銀白金屬手推車
        for (let c = 0; c < 4; c++) {
          const cz = cartZ - 0.7 + c * 0.45;
          // 車身銀色金屬網籃
          this.box(g, 0.65, 0.4, 0.5, cartStartX, 0.55, cz, 'metal');
          // 紅色推車手把
          this.box(g, 0.65, 0.06, 0.06, cartStartX, 0.78, cz + 0.25, 0xd32f2f);
          // 4 個小輪子
          this.sphere(g, 0.05, cartStartX - 0.28, 0.15, cz - 0.18, 'dark');
          this.sphere(g, 0.05, cartStartX + 0.28, 0.15, cz - 0.18, 'dark');
          this.sphere(g, 0.05, cartStartX - 0.28, 0.15, cz + 0.18, 'dark');
          this.sphere(g, 0.05, cartStartX + 0.28, 0.15, cz + 0.18, 'dark');
        }

        // 6. 前庭石板廣場與校園林蔭樹
        this.tree(g, -5.8, 4.2, 1.35, 0x2e7d32);
        this.tree(g, -5.8, -3.8, 1.35, 0x1b5e20);
        this.tree(g, 5.8, -3.8, 1.35, 0x1b5e20);
        this.bench(g, -2.5, 5.2, 'wood');
        break;
      }
      case '56': {
        // 56 阿緹卡義大利 pizza專賣店 (Antica)：美軍眷舍改建正宗義大利柴燒窯烤披薩與義大利麵名店
        // 1. 地坪基座與前庭原木餐飲露台
        this.box(g, 7.2, 0.2, 7.2, 0, 0.1, 0, 'grass');
        this.box(g, 6.2, 0.15, 3.2, 0, 0.22, 1.8, 'wood');

        // 2. 美軍老眷舍主屋 (白木雨淋板平房 + 炭灰紅雙坡頂)
        this.house(g, { x: 0, z: -1.2, w: 5.6, d: 3.8, h: 2.3, wall: 'white', siding: true, roof: 'redRoof', chimney: true });

        // 3. 戶外義式純白遮陽棚 (Awning) 與義大利三色旗飾 (綠白紅)
        this.box(g, 5.0, 0.08, 1.8, 0, 2.35, 1.0, 'white');
        // 棚架支撐金屬細柱
        this.box(g, 0.08, 2.2, 0.08, -2.3, 1.15, 1.8, 'dark');
        this.box(g, 0.08, 2.2, 0.08, 2.3, 1.15, 1.8, 'dark');
        // 遮陽棚前緣義大利國旗色塊飾條 (綠、白、紅)
        this.box(g, 1.6, 0.15, 0.05, -1.65, 2.3, 1.92, 0x009246); // 綠
        this.box(g, 1.6, 0.15, 0.05, 0, 2.3, 1.92, 0xffffff);     // 白
        this.box(g, 1.6, 0.15, 0.05, 1.65, 2.3, 1.92, 0xce2b37);  // 紅

        // 4. 正宗拿坡里紅磚石砌柴燒披薩窯 (Pizza Oven)
        const ovenX = -2.2, ovenZ = 2.0;
        // 紅磚耐火石基座
        this.box(g, 1.4, 0.8, 1.4, ovenX, 0.55, ovenZ, 'brick');
        // 半球型圓拱柴燒窯頂
        this.sphere(g, 0.65, ovenX, 1.25, ovenZ, 'brick');
        // 窯口黑色弧形鑄鐵門
        this.box(g, 0.45, 0.4, 0.15, ovenX, 1.15, ovenZ + 0.6, 'dark');
        // 窯頂鐵煙囪與微散白煙
        this.box(g, 0.15, 0.7, 0.15, ovenX, 1.85, ovenZ, 'metal');
        this.sphere(g, 0.15, ovenX, 2.25, ovenZ, 'white');
        this.sphere(g, 0.12, ovenX + 0.05, 2.45, ovenZ, 'white');
        // 窯旁堆疊的柴燒原木
        this.box(g, 0.6, 0.35, 0.35, ovenX + 0.9, 0.38, ovenZ, 'wood');

        // 5. 戶外遮陽傘與歐風用餐桌椅
        const tableX = 1.6, tableZ = 1.8;
        // 木餐桌
        this.box(g, 1.1, 0.08, 0.9, tableX, 0.75, tableZ, 'wood');
        this.box(g, 0.1, 0.65, 0.1, tableX, 0.42, tableZ, 'dark');
        // 4 張小木椅
        this.box(g, 0.35, 0.45, 0.35, tableX - 0.7, 0.32, tableZ, 'wood');
        this.box(g, 0.35, 0.45, 0.35, tableX + 0.7, 0.32, tableZ, 'wood');
        // 白色圓頂大遮陽傘
        this.box(g, 0.06, 2.1, 0.06, tableX, 1.15, tableZ, 'white');
        this.box(g, 1.8, 0.12, 1.8, tableX, 2.15, tableZ, 'white');

        // 6. 店門口披薩鏟招牌看板
        this.sign(g, '阿緹卡 PIZZA', -0.6, 1.2, 2.7, 2.2, '#2e7d32', '#ffffff');
        this.tree(g, 2.7, -2.5, 1.2, 0x2e7d32);
        this.tree(g, -2.7, -2.5, 1.2, 0x388e3c);
        break;
      }
      case '57': {
        // 57 光在草山 (Light On Old Town)：美軍宿舍改建極具質感的文青老宅咖啡與草山攝影名勝
        // 1. 地坪基座與文青風深色木棧露台
        this.box(g, 7.0, 0.2, 7.0, 0, 0.1, 0, 'grass');
        this.box(g, 5.8, 0.15, 3.0, 0, 0.22, 1.7, 0x3e2723);

        // 2. 老宅本體 (深灰木雨淋板 + 復古黑灰大斜坡頂)
        this.house(g, { x: 0, z: -1.1, w: 5.2, d: 3.6, h: 2.3, wall: 0x454d52, siding: true, roof: 'dark', chimney: true });

        // 3. 正面大面積落地採光景觀玻璃窗 (透出室內溫暖鵝黃光暈)
        this.box(g, 3.4, 1.5, 0.1, 0, 1.25, 0.75, 0xffe082); // 暖黃透光玻璃
        // 黑色窗框格柵
        this.box(g, 0.08, 1.5, 0.12, -1.1, 1.25, 0.76, 'dark');
        this.box(g, 0.08, 1.5, 0.12, 1.1, 1.25, 0.76, 'dark');
        this.box(g, 3.4, 0.08, 0.12, 0, 1.25, 0.76, 'dark');

        // 4. 屋簷下整串復古圓球暖黃鎢絲吊燈 (Festoon String Lights)
        for (let l = -2.0; l <= 2.0; l += 0.65) {
          this.sphere(g, 0.08, l, 2.15, 0.85, 0xfff176); // 暖黃發光燈球
        }

        // 5. 戶外文青攝影打卡木棧座與觀葉植物盆栽 (琴葉榕與龜背芋)
        this.bench(g, -1.5, 1.8, 'wood');
        // 陶土盆栽與綠葉
        this.box(g, 0.45, 0.45, 0.45, 1.8, 0.45, 1.8, 0x8d6e63);
        this.sphere(g, 0.35, 1.8, 0.85, 1.8, 0x2e7d32);
        this.sphere(g, 0.25, 1.9, 1.1, 1.75, 0x388e3c);

        // 6. 店門口黑板手繪菜單立牌
        this.sign(g, '光在草山 CAFE', 0.8, 1.2, 2.5, 2.2, '#212121', '#fff59d');
        this.tree(g, -2.6, -2.4, 1.15, 0x2e7d32);
        this.tree(g, 2.6, -2.4, 1.25, 0x1b5e20);
        break;
      }
      case '58': {
        // 58 陽明山耶穌聖體堂 (天主教主徒會)：華岡天主教神聖殿堂，依實拍圖還原「黃柱八角聖母亭」與聖潔白教堂
        // 1. 地坪基座與前庭花園
        this.box(g, 7.8, 0.2, 8.2, 0, 0.1, 0, 'grass');
        this.box(g, 4.0, 0.15, 5.0, 0, 0.22, -0.5, 'stone');

        // 2. 天主教堂主禮拜堂 (聖潔白牆 + 雙坡紅瓦屋頂)
        this.house(g, { x: 0, z: -1.8, w: 5.2, d: 4.4, h: 3.2, wall: 'white', roof: 'redRoof', porch: true });
        // 教堂正面山牆大圓形彩繪玫瑰窗 (Rose Window)
        this.sphere(g, 0.65, 0, 2.7, 0.42, 0x1565c0);
        this.sphere(g, 0.5, 0, 2.7, 0.44, 0xffb300);

        // 3. 教堂鐘樓塔樓 (Bell Tower) 與神聖金光十字架
        const towerX = 1.8, towerZ = -1.0;
        this.box(g, 1.4, 5.0, 1.4, towerX, 2.5, towerZ, 'white');
        this.box(g, 1.6, 0.6, 1.6, towerX, 5.2, towerZ, 'redRoof');
        // 金色神聖大十字架 (Holy Cross)
        this.box(g, 0.1, 1.2, 0.1, towerX, 6.1, towerZ, 'gold');
        this.box(g, 0.6, 0.1, 0.1, towerX, 6.3, towerZ, 'gold');

        // 4. 【核心還原：實景照片左側之「黃柱八角聖母亭」】
        // 亭子位於前庭右前方 (x: -2.0, z: 2.0)
        const pavX = -1.8, pavZ = 2.0;
        // 八角雙層石階台基
        this.cylinder(g, 1.7, 1.8, 0.2, pavX, 0.25, pavZ, 'stone');
        this.cylinder(g, 1.5, 1.6, 0.2, pavX, 0.45, pavZ, 'stone');

        // 明亮黃色立柱 (8 根環狀排列)
        const pillarR = 1.2;
        for (let i = 0; i < 8; i++) {
          const ang = (i * Math.PI * 2) / 8;
          const px = pavX + Math.cos(ang) * pillarR;
          const pz = pavZ + Math.sin(ang) * pillarR;
          this.cylinder(g, 0.07, 0.07, 2.0, px, 1.55, pz, 0xfbc02d); // 醒目鮮黃色圓柱
        }

        // 金色琉璃八角飛簷亭頂
        this.cylinder(g, 0.2, 1.8, 0.8, pavX, 2.95, pavZ, 0xffd54f);
        this.box(g, 0.06, 0.4, 0.06, pavX, 3.45, pavZ, 'gold'); // 亭頂金十字架

        // 亭周圍紅色安全欄杆 (還原照片紅色護欄)
        for (let i = 0; i < 8; i++) {
          if (i === 4) continue; // 留出朝前入口
          const ang = (i * Math.PI * 2) / 8;
          const px = pavX + Math.cos(ang) * pillarR;
          const pz = pavZ + Math.sin(ang) * pillarR;
          this.box(g, 0.8, 0.5, 0.06, px, 0.8, pz, 0xc62828); // 紅色護欄
        }

        // 亭正中央：潔白優雅「白色聖母立像」(White Mary Statue)
        // 雕花基座
        this.cylinder(g, 0.22, 0.28, 0.6, pavX, 0.85, pavZ, 'white');
        // 聖母潔白身軀、衣褶長袍與合十雙手
        this.box(g, 0.26, 0.85, 0.22, pavX, 1.45, pavZ, 'white');
        this.sphere(g, 0.16, pavX, 1.95, pavZ, 'white'); // 聖母頭部與聖潔頭紗
        this.box(g, 0.12, 0.12, 0.14, pavX, 1.45, pavZ + 0.14, 'white'); // 合十雙手

        // 亭四周盛開之紫紅色景觀灌木花叢 (還原實景茂盛紅葉植物)
        this.sphere(g, 0.4, pavX - 1.5, 0.45, pavZ + 0.8, 0x880e4f); // 深紫紅灌木
        this.sphere(g, 0.45, pavX + 1.4, 0.5, pavZ + 0.9, 0xad1457); // 豔紅灌木
        this.sphere(g, 0.35, pavX - 1.2, 0.4, pavZ - 1.3, 0x880e4f);
        this.sphere(g, 0.35, pavX + 1.3, 0.4, pavZ - 1.2, 0xad1457);

        // 5. 前門標誌立牌與林蔭
        this.sign(g, '陽明山 耶穌聖體堂', 1.5, 1.5, 2.8, 2.6, '#1565c0', '#ffffff');
        this.tree(g, -3.0, -2.8, 1.3, 0x2e7d32);
        this.tree(g, 3.0, -2.8, 1.3, 0x1b5e20);
        break;
      }
      case '59': {
        // 59 草山溫泉湯王池 (陽明山溫泉第一泉)：陽明山天然硫磺溫泉源頭泉池
        // 1. 地坪基座與幽靜山林林石階
        this.box(g, 8.5, 0.2, 8.5, 0, 0.1, 0, 'grass');
        this.cylinder(g, 3.8, 4.0, 0.25, 0, 0.22, 0, 'stone');

        // 2. 天然青石砌八角大溫泉池 (Octagonal Hot Spring Bath)
        const poolR = 2.4;
        this.cylinder(g, poolR + 0.35, poolR + 0.45, 0.75, 0, 0.65, 0, 'stone'); // 池壁外圍
        // 溫泉水面 (湛藍湖綠熱水)
        this.cylinder(g, poolR - 0.05, poolR - 0.05, 0.1, 0, 0.75, 0, 0x4db6ac);
        // 池心硫磺礦物結晶底座與出水口
        this.cylinder(g, 0.45, 0.6, 0.4, 0, 0.95, 0, 0xdce775); // 硫磺黃綠結晶石

        // 3. 升騰裊裊之立體溫泉硫磺白煙霧氣 (Hot Spring Rising Steam)
        this.sphere(g, 0.35, 0, 1.45, 0, 'white');
        this.sphere(g, 0.42, 0.1, 1.95, 0.1, 'white');
        this.sphere(g, 0.5, -0.15, 2.5, -0.1, 'white');
        this.sphere(g, 0.6, 0.2, 3.15, 0.15, 'white');
        this.sphere(g, 0.45, -0.25, 3.75, -0.1, 'white');

        // 4. 日式木造「湯之樋」引泉木槽管 (Wooden Spring Conduit)
        this.box(g, 0.25, 0.18, 3.2, 0, 1.1, -1.8, 'wood');
        this.box(g, 0.12, 1.0, 0.12, 0, 0.55, -2.8, 'wood');
        this.box(g, 0.12, 0.8, 0.12, 0, 0.45, -1.5, 'wood');

        // 5. 日式石燈籠 (Stone Lantern)
        const lanternX = 2.6, lanternZ = 1.8;
        this.cylinder(g, 0.2, 0.25, 0.4, lanternX, 0.45, lanternZ, 'stone');
        this.box(g, 0.35, 0.35, 0.35, lanternX, 0.82, lanternZ, 'stone');
        this.sphere(g, 0.12, lanternX, 0.82, lanternZ, 0xfff9c4); // 暖黃透光燭火
        this.cylinder(g, 0.1, 0.45, 0.25, lanternX, 1.1, lanternZ, 'stone');

        // 6. 池畔安全木格圍欄與歷史紀念標牌
        for (let i = 0; i < 8; i++) {
          if (i === 4) continue; // 留出觀泉階梯入口
          const ang = (i * Math.PI * 2) / 8;
          const fx = Math.cos(ang) * 3.3;
          const fz = Math.sin(ang) * 3.3;
          this.box(g, 0.8, 0.65, 0.08, fx, 0.65, fz, 'wood');
        }
        this.sign(g, '草山溫泉 · 湯王池', 0, 1.25, 3.4, 2.8, '#4a2c20', '#fff8e7');
        this.tree(g, -3.2, -2.6, 1.35, 0x1b5e20);
        this.tree(g, 3.2, -2.6, 1.35, 0x2e7d32);
        break;
      }
      case '60': case '61': case '62': case '63': case '64': case '65': case '66': case '67':
        this.buildNorthern(g, code, name);
        break;
      default: throw new Error(`Unknown landmark architecture: ${code}`);
    }
    // A discreet readable marker remains visible even for parks without a façade.
    if(['04','10','13','16','19','21','26','29'].includes(code)) {
      this.box(g,0.15,1.5,0.15,-3.5,0.75,5,'wood');
      this.sign(g,name.replace(/\s*\(.+?\)/g,''),-3.5,1.45,5.12,3.6);
    }
    if (code === '26' || code === '60') this.enrichLandscape(g, code);
    this.batchStaticMeshes(g);
    return g;
  }

  buildNorthern(g, code, name) {
    const flowers=(cx,cz,r,count=28)=>{
      for(let i=0;i<count;i++) { const a=i*Math.PI*2/count; this.ball(g,cx+Math.cos(a)*r,.35,cz+Math.sin(a)*r,.3,.25,.3,[0xeab3c3,0xf4d96c,0xe7e8dd][i%3]); }
    };
    const pavilion=(x,z)=>{
      this.box(g,4,.2,4,x,.1,z,'stone');
      for(const dx of [-1.5,1.5])for(const dz of [-1.5,1.5])this.box(g,.2,2.8,.2,x+dx,1.6,z+dz,'wood');
      this.roof(g,4.5,4.5,3.1,1.1,'roof',x,z);
    };
    const trees=()=>{for(let i=0;i<8;i++){if(i===2)continue;const a=i*Math.PI/4;this.tree(g,Math.cos(a)*10,Math.sin(a)*8,1.1,i%3===0?0xe9b3c8:'leaf');}};
    if(code==='60') {
      this.box(g,24,.5,16,0,.25,0,'stone');
      this.box(g,21,1.1,13,0,1,-1,'white');
      this.box(g,19,4.6,10,0,3.8,-2,'plaster');
      this.roof(g,22,13,6.2,2.6,'greenRoof',0,-2);
      // Central round hall, columned gallery and broad ceremonial stairs.
      this.cylinder(g,3.6,3.6,3.6,0,4.1,4,'white');
      this.cylinder(g,2.4,4.6,1.2,0,6.5,4,'greenRoof');
      this.cylinder(g,2.4,2.4,1.5,0,7.7,4,'plaster');
      this.cylinder(g,.25,3.3,1.5,0,9.15,4,'greenRoof');
      this.cylinder(g,.12,.22,.65,0,10.2,4,'gold');
      for(let x=-9;x<=9;x+=1.8){this.box(g,.25,3.3,.25,x,3.3,3.35,'red');this.window(g,x,3.8,3.05,.9,1.8);}
      for(const x of [-10,10]) {this.box(g,3,3,7,x,3.1,-1,'white');this.roof(g,4.5,8.5,4.8,1.5,'greenRoof',x,-1);}
      for(let i=0;i<7;i++)this.box(g,10-i*.45,.2,1.0,0,.15+i*.2,10-i*.7,'frame');
      for(const x of [-5.5,5.5]) {this.box(g,.22,.8,4.8,x,1.2,8,'white');for(let i=0;i<8;i++)this.box(g,.22,1.2,.22,x,.9,5.8+i*.6,'white');}
      for(const x of [-8,8]){this.box(g,1.2,.7,1.2,x,.7,7,'stone');this.ball(g,x,1.5,7,.55,.7,.7,'frame');this.ball(g,x,2,7.3,.45,.45,.4,'frame');}
      this.sign(g,'中山樓',0,5.3,7.65,3.6,'#30483f','#e3cb87');
      for(const x of [-13,13])for(const z of [-6,0,6])this.tree(g,x,z,1.6,0x416447);
    } else if(code==='61') {
      this.box(g,8,.18,6,0,.12,0,0xb9b5a0);
      for(let i=-3;i<=3;i++)this.box(g,.14,1,.14,i,.7,-2.6,'wood');
      this.box(g,7,.15,.15,0,1.2,-2.6,'wood');
      for(const x of [-2.5,2.5]){this.box(g,2,.2,.7,x,.7,.8,'wood');this.box(g,.15,.6,.6,x-.7,.3,.8,'dark');this.box(g,.15,.6,.6,x+.7,.3,.8,'dark');}
      this.sign(g,'前山公園 · 陽明湖',0,1.6,2.8,5);
      this.tree(g,-4,-2,1.2,0xe6b0be);this.tree(g,4,-2,1.4);
    } else if(code==='62') {
      this.box(g,16,.12,13,0,.07,0,0x91ae78);
      this.box(g,2.1,.08,12,-2,.18,0,0x71a9ad);
      for(let i=0;i<11;i++){const x=i%2?-3.4:-.6;this.ball(g,x,.38,-5+i,.6,.45,.6,0x898b80);}
      this.box(g,4.2,.18,1.4,-2,.4,1,'wood');
      pavilion(3,-2);flowers(3,3,2.5);this.tree(g,-6,-4,1.3);this.tree(g,6,4,1.1,0xe2b4c4);
      this.sign(g,'前山公園 · 磐流園',0,1.3,6.5,5);
    } else if(code==='63') {
      this.cylinder(g,7,7,.22,0,.14,0,0xc5bca4);
      this.cylinder(g,5.4,5.6,.3,0,.39,0,0x526d45);
      this.cylinder(g,4.6,4.6,.08,0,.6,0,0xede7cd);
      flowers(0,0,5.1,64);flowers(0,0,6.3,72);
      for(let i=0;i<12;i++){const a=i*Math.PI/6;const tick=this.box(g,.16,.1,.55,Math.sin(a)*4,.72,Math.cos(a)*4,'dark');tick.rotation.y=a;}
      const hand=this.box(g,.2,.13,3.6,0,.82,-1.5,'dark');hand.rotation.y=.15;
      const hour=this.box(g,2.6,.14,.23,1.05,.86,0,'dark');hour.rotation.y=-.4;
      this.cylinder(g,.24,.24,.22,0,.91,0,'gold');
      this.sign(g,'陽明公園 · 花鐘',0,1.5,7.5,4.6);trees();
    } else if(code==='64') {
      this.box(g,16,.45,11,0,.25,0,'stone');this.box(g,12,3,8,0,1.9,0,'plaster');
      this.roof(g,15,11,3.6,1.3,'redRoof');this.box(g,10,2.6,6,0,4.9,-.5,'white');
      this.roof(g,14,10,6.3,2,'redRoof',0,-.5);
      for(let x=-5;x<=5;x+=2){this.box(g,.24,2.5,.24,x,5,3.25,'red');this.window(g,x,2.1,4.08,1.3,1.7);}
      this.box(g,13,.2,2,0,3.8,4,'frame');
      for(let i=-6;i<=6;i++)this.box(g,.13,.8,.13,i,4.3,4.8,'white');this.box(g,13,.12,.15,0,4.75,4.8,'white');
      for(let i=0;i<4;i++)this.box(g,6,.15,1.1,0,.12+i*.12,6-i*.7,'stone');
      this.sign(g,'辛亥光復樓',0,5.9,3.45,4.2,'#734637','#eedca4');
    } else if(code==='65') {
      this.box(g,18,.18,14,0,.12,0,'stone');this.box(g,13,5.3,8,0,2.9,-1,0x698a6a);
      this.box(g,5,3,6,7,1.8,0,0x789779);this.roof(g,14.5,9.8,5.7,1.2,'greenRoof',0,-1);
      this.roof(g,6,7,3.4,.8,'greenRoof',7,0);
      for(let y=1.6;y<5;y+=2.3)for(let x=-5;x<=5;x+=2)this.window(g,x,y,3.1,1.1,1.5,'wood');
      this.box(g,5,.2,2,0,3.1,4,'frame');this.door(g,0,4.1,2.3);
      this.sign(g,'陽明書屋',0,3.9,4.12,3.8);this.tree(g,-9,2,1.7);this.tree(g,10,-5,1.5);flowers(-6,5,2);
    } else if(code==='66') {
      this.box(g,18,.18,12,0,.12,0,'stone');this.box(g,14,3.4,7,0,1.9,0,'plaster');
      this.roof(g,16,9,3.8,1.5,'roof');
      this.box(g,4,2.7,2,0,1.65,4,'glass');this.roof(g,6,4,3.2,.7,'roof',0,4);
      for(let x=-5;x<=5;x+=2)this.window(g,x,2,3.58,1.3,1.7);
      this.sign(g,'陽明山國家公園 · 遊客中心',0,3.35,5.4,6);
      for(const x of [-8,8]){this.tree(g,x,3,1.2);flowers(x,3,1.5,16);}
    } else if(code==='67') {
      this.box(g,12,.15,7,0,.1,0,'stone');
      for(const x of [-4,0,4])this.box(g,.55,4.5,.55,x,2.3,0,'red');
      this.box(g,10,.6,.8,0,4.2,0,'plaster');this.roof(g,11,3.5,4.55,1.3,'greenRoof');
      this.sign(g,'陽明公園',0,4.1,.48,3.8,'#436251','#eee6c6');
      flowers(-5,3,1.2,16);flowers(5,3,1.2,16);this.tree(g,-7,-2,1.3);this.tree(g,7,-2,1.3);
    }
  }

  enrichLandscape(g, code) {
    const flower=(x,z,color,height=.65)=>{
      this.box(g,.055,height,.055,x,height/2,z,0x467246);
      for(let i=0;i<5;i++){const a=i*Math.PI*2/5;this.ball(g,x+Math.cos(a)*.17,height,z+Math.sin(a)*.17,.16,.1,.16,color);}
      this.ball(g,x,height+.025,z,.085,.085,.085,0xecc64e);
    };
    if(code==='26') {
      // Compact botanical display: flowers stay within the existing model garden.
      const colors=[0xe36b95,0xf5d16b,0xf1ede1,0xad82c4,0xd44f61];
      for(const side of [-1,1])for(let row=0;row<3;row++) {
        const cx=side*(4.1+row*1.45);
        this.box(g,1.12,.12,3.5,cx,.11,3.7,0x675441);
        for(let j=0;j<8;j++)for(let k=0;k<2;k++)flower(cx+(k-.5)*.46,2.25+j*.41,colors[(row+j%2+(side===1?2:0))%5],.48+(j%3)*.09);
      }
      for(const side of [-1,1])for(let i=0;i<5;i++) {
        const x=side*(2.2+i*1.2),z=-5.5;
        this.ball(g,x,.8,z,.7,.8,.65,0x527344);
        for(let j=0;j<7;j++){const a=j*Math.PI*2/7;flower(x+Math.cos(a)*.48,z+Math.sin(a)*.43,j%2?0xf4ddd9:0xd45076,1.2+(j%2)*.14);}
      }
      for(let i=0;i<18;i++){const x=-2.4+i*.28;this.ball(g,x,2.97,2.2,.25,.16,.22,0x65804d);this.ball(g,x,3.08,2.28,.13,.12,.13,i%2?0xf3d9e1:0xce7aac);}
      this.sign(g,'茶花 · 杜鵑花園',-5.8,1.05,5.65,2.1);
      this.sign(g,'球根花卉展示',5.8,1.05,5.65,2.1);
    } else {
      // Stylized geothermal scenery, not a surveyed spring or a bathing facility.
      const pools=[[-9,10.5,2.2,1.3],[9,10.5,2.2,1.3],[-9,-11,1.7,1.2],[9,-11,1.7,1.2]];
      const steamGeometry=new THREE.IcosahedronGeometry(1,1);
      const steamMaterial=new THREE.MeshBasicMaterial({color:0xf4f6f0,transparent:true,opacity:.14,depthWrite:false});
      pools.forEach(([x,z,w,h],index)=>{
        this.box(g,w*2+.5,.15,h*2+.5,x,.16,z,0x96958a);
        this.box(g,w*2,.08,h*2,x,.28,z,0xb7d5cf);
        for(let j=0;j<12;j++){const a=j*Math.PI/6;this.ball(g,x+Math.cos(a)*(w+.15),.4,z+Math.sin(a)*(h+.15),.35,.3,.3,0x8a8c82);}
        for(let j=0;j<4;j++){
          const cloud=new THREE.Mesh(steamGeometry,steamMaterial);cloud.position.set(x+(j%2-.5)*.7,.65+j*.45,z);cloud.scale.set(.55,.38,.48);cloud.userData.steam={x:cloud.position.x,z,phase:j/4+index*.11};g.add(cloud);
        }
      });
      this.sign(g,'白磺溫泉地景',-9,1.35,12,2.6,'#55746c','#f5f4e7');
    }
  }

  batchStaticMeshes(group) {
    // Hundreds of window frames share geometry/material. Batch them per landmark.
    group.updateMatrixWorld(true);
    const buckets=new Map();
    group.traverse(obj=>{
      if(!obj.isMesh || (obj.geometry!==this.boxGeometry && obj.geometry!==this.roundGeometry))return;
      const key=`${obj.geometry.uuid}:${obj.material.uuid}`;
      if(!buckets.has(key))buckets.set(key,[]);
      buckets.get(key).push(obj);
    });
    const inverse=new THREE.Matrix4().copy(group.matrixWorld).invert();
    for(const meshes of buckets.values()) {
      if(meshes.length<2)continue;
      const batch=new THREE.InstancedMesh(meshes[0].geometry,meshes[0].material,meshes.length);
      meshes.forEach((mesh,i)=>{batch.setMatrixAt(i,new THREE.Matrix4().multiplyMatrices(inverse,mesh.matrixWorld));mesh.parent.remove(mesh);});
      batch.castShadow=batch.receiveShadow=true;
      // Three r128 does not calculate aggregate instance bounds for culling.
      batch.frustumCulled=false;
      group.add(batch);
    }
  }
}
